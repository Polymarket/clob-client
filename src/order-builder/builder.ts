import { Wallet } from "@ethersproject/wallet";
import { JsonRpcSigner } from "@ethersproject/providers";
import { SignedOrder, SignatureType } from "@polymarket/order-utils";
import { createMarketBuyOrder, createOrder } from "./helpers";
import { Chain, CreateOrderOptions, UserMarketOrder, UserOrder } from "../types";

export class OrderBuilder {
    readonly signer: Wallet | JsonRpcSigner;

    readonly chainId: Chain;

    // Signature type used sign orders, defaults to EOA type
    readonly signatureType: SignatureType;

    // Address which holds funds to be used.
    // Used for Polymarket proxy wallets and other smart contract wallets
    // If not provided, funderAddress is the signer address
    readonly funderAddress?: string;

    constructor(
        signer: Wallet | JsonRpcSigner,
        chainId: Chain,
        signatureType?: SignatureType,
        funderAddress?: string,
    ) {
        this.signer = signer;
        this.chainId = chainId;
        this.signatureType = signatureType === undefined ? SignatureType.EOA : signatureType;
        this.funderAddress = funderAddress;
    }

    /**
     * Generate and sign an order
     */
    public async buildOrder(
        userOrder: UserOrder,
        options: CreateOrderOptions,
    ): Promise<SignedOrder> {
        return createOrder(
            this.signer,
            this.chainId,
            this.signatureType,
            this.funderAddress,
            userOrder,
            options,
        );
    }

    /**
     * Generate and sign a market order
     */
    public async buildMarketOrder(
        userMarketOrder: UserMarketOrder,
        options: CreateOrderOptions,
    ): Promise<SignedOrder> {
        return createMarketBuyOrder(
            this.signer,
            this.chainId,
            this.signatureType,
            this.funderAddress,
            userMarketOrder,
            options,
        );
    }
}
