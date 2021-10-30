export { LimitOrderAndSignature } from "@polymarket/order-utils";

export interface ApiKeyCreds {
    key: string;
    secret: string;
    passphrase: string;
}

export interface L2HeaderArgs {
    method: string;
    requestPath: string;
    body?: string;
}

// EIP712 sig verification
export interface L1PolyHeader {
    POLY_ADDRESS: string;
    POLY_SIGNATURE: string;
    POLY_TIMESTAMP: string;
}

// API key verification
export interface L2PolyHeader {
    POLY_ADDRESS: string;
    POLY_SIGNATURE: string;
    POLY_TIMESTAMP: string;
    POLY_API_KEY: string;
    POLY_PASSPHRASE: string;
}

export enum Side {
    Buy,
    Sell,
}

export interface Asset {
    address: string;
    condition: string;
}

export interface UserOrder {
    asset: Asset;
    price: number;
    size: number;
    side: Side;
}

export interface OrderCreationArgs {
    chainID: number;
    exchange: string;
    maker: string;
    makerAsset: string;
    makerAmount: string;
    makerAssetID?: number;
    takerAsset: string;
    takerAmount: string;
    takerAssetID?: number;
}
