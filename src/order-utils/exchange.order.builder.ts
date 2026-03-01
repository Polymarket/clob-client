import type { JsonRpcSigner } from "@ethersproject/providers";
import type { Wallet } from "@ethersproject/wallet";
import { _TypedDataEncoder } from "@ethersproject/hash";
import {
    EIP712_DOMAIN,
    ORDER_STRUCTURE,
    PROTOCOL_NAME,
    PROTOCOL_VERSION,
} from "./exchange.order.const.ts";
import type { EIP712Object, EIP712TypedData, EIP712Types } from "./model/eip712.model.ts";
import type {
    Order,
    OrderData,
    OrderHash,
    OrderSignature,
    SignedOrder,
} from "./model/order.model.ts";
import { SignatureType } from "./model/signature-types.model.ts";
import { generateOrderSalt } from "./utils.ts";

type ExchangeOrderSigner = Wallet | JsonRpcSigner | WalletClientLike;

interface WalletClientLike {
    account?: {
        address: string;
    };
    requestAddresses?: () => Promise<string[] | readonly string[]>;
    signTypedData(args: unknown): Promise<string>;
}

interface ExchangeTypedDataSigner {
    getAddress(): Promise<string>;
    signTypedData(
        domain: EIP712Object,
        types: EIP712Types,
        value: EIP712Object,
        primaryType?: string,
    ): Promise<string>;
}

interface EthersTypedDataSigner {
    getAddress(): Promise<string>;
    _signTypedData(domain: EIP712Object, types: EIP712Types, value: EIP712Object): Promise<string>;
}

const isEthersTypedDataSigner = (signer: unknown): signer is EthersTypedDataSigner =>
    typeof (signer as EthersTypedDataSigner)._signTypedData === "function";

const isWalletClientLike = (signer: unknown): signer is WalletClientLike => {
    if (typeof signer !== "object" || signer === null) {
        return false;
    }
    return typeof (signer as WalletClientLike).signTypedData === "function";
};

const getWalletClientAddress = async (walletClient: WalletClientLike): Promise<string> => {
    const accountAddress = walletClient.account?.address;
    if (typeof accountAddress === "string" && accountAddress.length > 0) {
        return accountAddress;
    }

    if (typeof walletClient.requestAddresses === "function") {
        const [address] = await walletClient.requestAddresses();
        if (typeof address === "string" && address.length > 0) {
            return address;
        }
    }

    throw new Error("wallet client is missing account address");
};

export class ExchangeOrderBuilder {
    private readonly normalizedSigner: ExchangeTypedDataSigner;

    constructor(
        private readonly contractAddress: string,
        private readonly chainId: number,
        private readonly signer: ExchangeOrderSigner,
        private readonly generateSalt = generateOrderSalt,
    ) {
        this.normalizedSigner = this.normalizeSigner(this.signer);
    }

    /**
     * Build an order object including the signature.
     */
    async buildSignedOrder(orderData: OrderData): Promise<SignedOrder> {
        const order = await this.buildOrder(orderData);
        const orderTypedData = this.buildOrderTypedData(order);
        const orderSignature = await this.buildOrderSignature(orderTypedData);

        return {
            ...order,
            signature: orderSignature,
        } as SignedOrder;
    }

    /**
     * Creates an Order object from order data.
     */
    async buildOrder({
        maker,
        taker,
        tokenId,
        makerAmount,
        takerAmount,
        side,
        feeRateBps,
        nonce,
        signer,
        expiration,
        signatureType,
    }: OrderData): Promise<Order> {
        if (typeof signer === "undefined" || !signer) {
            signer = maker;
        }

        const signerAddress = await this.normalizedSigner.getAddress();
        if (signer !== signerAddress) {
            throw new Error("signer does not match");
        }

        if (typeof expiration === "undefined" || !expiration) {
            expiration = "0";
        }

        if (typeof signatureType === "undefined" || !signatureType) {
            // Default to EOA 712 sig type
            signatureType = SignatureType.EOA;
        }

        return {
            salt: this.generateSalt(),
            maker,
            signer,
            taker,
            tokenId,
            makerAmount,
            takerAmount,
            expiration,
            nonce,
            feeRateBps,
            side,
            signatureType,
        };
    }

    /**
     * Parses an Order object to EIP712 typed data.
     */
    buildOrderTypedData(order: Order): EIP712TypedData {
        return {
            primaryType: "Order",
            types: {
                EIP712Domain: EIP712_DOMAIN,
                Order: ORDER_STRUCTURE,
            },
            domain: {
                name: PROTOCOL_NAME,
                version: PROTOCOL_VERSION,
                chainId: this.chainId,
                verifyingContract: this.contractAddress,
            },
            message: {
                salt: order.salt,
                maker: order.maker,
                signer: order.signer,
                taker: order.taker,
                tokenId: order.tokenId,
                makerAmount: order.makerAmount,
                takerAmount: order.takerAmount,
                expiration: order.expiration,
                nonce: order.nonce,
                feeRateBps: order.feeRateBps,
                side: order.side,
                signatureType: order.signatureType,
            },
        };
    }

    /**
     * Generates order signature from EIP712 typed data.
     */
    buildOrderSignature(typedData: EIP712TypedData): Promise<OrderSignature> {
        const orderTypes = { ...typedData.types };
        delete orderTypes.EIP712Domain;

        return this.normalizedSigner.signTypedData(
            typedData.domain,
            orderTypes,
            typedData.message,
            typedData.primaryType,
        );
    }

    /**
     * Generates the hash of the order from EIP712 typed data.
     */
    buildOrderHash(orderTypedData: EIP712TypedData): OrderHash {
        const orderTypes = { ...orderTypedData.types };
        delete orderTypes.EIP712Domain;

        return _TypedDataEncoder.hash(
            orderTypedData.domain as Parameters<typeof _TypedDataEncoder.hash>[0],
            orderTypes as Parameters<typeof _TypedDataEncoder.hash>[1],
            orderTypedData.message as Parameters<typeof _TypedDataEncoder.hash>[2],
        );
    }

    private normalizeSigner(signer: ExchangeOrderSigner): ExchangeTypedDataSigner {
        if (isEthersTypedDataSigner(signer)) {
            return {
                getAddress: async () => signer.getAddress(),
                signTypedData: async (domain, types, value) =>
                    signer._signTypedData(domain, types, value),
            };
        }

        if (isWalletClientLike(signer)) {
            return {
                getAddress: async () => getWalletClientAddress(signer),
                signTypedData: async (domain, types, value, primaryType) => {
                    const account = signer.account?.address
                        ? signer.account
                        : await getWalletClientAddress(signer);
                    return signer.signTypedData({
                        account,
                        domain,
                        types,
                        primaryType,
                        message: value,
                    });
                },
            };
        }

        throw new Error("unsupported signer type");
    }
}
