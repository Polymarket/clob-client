import { ethers } from "ethers";
import {
    EIP712_DOMAIN,
    ORDER_STRUCTURE,
    PROTOCOL_NAME,
    PROTOCOL_VERSION,
} from "./exchange.order.const.ts";
import type { EIP712TypedData } from "./model/eip712.model.ts";
import type {
    Order,
    OrderData,
    OrderHash,
    OrderSignature,
    SignedOrder,
} from "./model/order.model.ts";
import { SignatureType } from "./model/signature-types.model.ts";
import { generateOrderSalt } from "./utils.ts";
import { getSignerAddress, signTypedDataWithSigner } from "../signer.ts";
import type { ClobSigner } from "../signer.ts";

export class ExchangeOrderBuilder {
    constructor(
        private readonly contractAddress: string,
        private readonly chainId: number,
        private readonly signer: ClobSigner,
        private readonly generateSalt = generateOrderSalt,
    ) {}

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

        const signerAddress = await getSignerAddress(this.signer);
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
    async buildOrderSignature(typedData: EIP712TypedData): Promise<OrderSignature> {
        const orderTypes = { ...typedData.types };
        delete orderTypes.EIP712Domain;

        return signTypedDataWithSigner({
            signer: this.signer,
            domain: typedData.domain,
            types: orderTypes,
            value: typedData.message,
            primaryType: typedData.primaryType,
        });
    }

    /**
     * Generates the hash of the order from EIP712 typed data.
     */
    buildOrderHash(orderTypedData: EIP712TypedData): OrderHash {
        const orderTypes = { ...orderTypedData.types };
        delete orderTypes.EIP712Domain;

        return ethers.utils._TypedDataEncoder.hash(
            orderTypedData.domain as Parameters<typeof ethers.utils._TypedDataEncoder.hash>[0],
            orderTypes as Parameters<typeof ethers.utils._TypedDataEncoder.hash>[1],
            orderTypedData.message as Parameters<typeof ethers.utils._TypedDataEncoder.hash>[2],
        );
    }

}
