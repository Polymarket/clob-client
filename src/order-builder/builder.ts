import { Wallet } from "@ethersproject/wallet";
import { JsonRpcSigner } from "@ethersproject/providers";
import { LimitOrderAndSignature, MarketOrderAndSignature, SignatureType } from "@polymarket/order-utils";
import { createLimitOrder, createMarketOrder } from "./helpers";
import { UserLimitOrder, UserMarketOrder } from "../types";

export class OrderBuilder {
    readonly signer: Wallet | JsonRpcSigner;

    // Signature type used sign Limit and Market orders, defaults to EOA type
    readonly signatureType: SignatureType;

    // Address which holds funds to be used.
    // Used for Polymarket proxy wallets and other smart contract wallets
    // If not provided, funderAddress is the signer address
    readonly funderAddress?: string;

    constructor(signer: Wallet | JsonRpcSigner, signatureType?: SignatureType, funderAddress?: string) {
        this.signer = signer;
        this.signatureType = signatureType === undefined ? SignatureType.EOA : signatureType;
        this.funderAddress = funderAddress;
    }

    /**
     * Generate and sign a limit order
     */
    public async buildLimitOrder(userOrder: UserLimitOrder): Promise<LimitOrderAndSignature> {
        return createLimitOrder(this.signer, this.signatureType, this.funderAddress, userOrder);
    }

    /**
     *
     */
    public async buildMarketOrder(userOrder: UserMarketOrder): Promise<MarketOrderAndSignature> {
        return createMarketOrder(this.signer, this.signatureType, this.funderAddress, userOrder);
    }
}
