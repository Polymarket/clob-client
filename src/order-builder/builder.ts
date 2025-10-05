import { Wallet } from "@ethersproject/wallet";
import { JsonRpcSigner } from "@ethersproject/providers";
import { SignedOrder, SignatureType } from "@polymarket/order-utils";
import { createMarketOrder, createOrder } from "./helpers";
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

    /**
     * Optional function to dynamically resolve the signer.
     * If provided, this function will be called to obtain a fresh signer instance
     * (e.g., for smart contract wallets or when the signer may change).
     * Should return a Wallet or JsonRpcSigner, or a Promise resolving to one.
     * If not provided, the static `signer` property is used.
     */
    private getSigner?: () => Promise<Wallet | JsonRpcSigner> | (Wallet | JsonRpcSigner);

    constructor(
        signer: Wallet | JsonRpcSigner,
        chainId: Chain,
        signatureType?: SignatureType,
        funderAddress?: string,
        getSigner?: () => Promise<Wallet | JsonRpcSigner> | (Wallet | JsonRpcSigner)
    ) {
        this.signer = signer;
        this.chainId = chainId;
        this.signatureType = signatureType === undefined ? SignatureType.EOA : signatureType;
        this.funderAddress = funderAddress;
        this.getSigner = getSigner;
    }

    /**
     * Generate and sign a order
     */
    public async buildOrder(
        userOrder: UserOrder,
        options: CreateOrderOptions,
    ): Promise<SignedOrder> {
        const signer = await this.resolveSigner();
        return createOrder(
            signer,
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
        const signer = await this.resolveSigner();
        return createMarketOrder(
            signer,
            this.chainId,
            this.signatureType,
            this.funderAddress,
            userMarketOrder,
            options,
        );
    }

    /** Unified getter: use fresh signer if available */
    private async resolveSigner(): Promise<Wallet | JsonRpcSigner> {
        if (this.getSigner) {
            const s = await this.getSigner();
            if (!s) throw new Error("getSigner() function returned undefined or null");
            return s;
        }
        return this.signer;
    }
}
