import { Wallet } from "@ethersproject/wallet";
import { JsonRpcSigner } from "@ethersproject/providers";
import { SignedOrder, SignatureType } from "@polymarket/order-utils";
import { createOrder } from "./helpers";
import { UserOrder } from "../types";

export class OrderBuilder {
    readonly signer: Wallet | JsonRpcSigner;

    // Signature type used sign orders, defaults to EOA type
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
     * Generate and sign a order
     */
    public async buildOrder(userOrder: UserOrder): Promise<SignedOrder> {
        return createOrder(this.signer, this.signatureType, this.funderAddress, userOrder);
    }
}
