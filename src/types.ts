export * from "@polymarket/order-utils";

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
    BUY = "buy",
    SELL = "sell",
}

export interface Asset {
    address: string;
    condition: string;
}

// Simplified Limit order for users
export interface UserLimitOrder {
    // Conditional token Asset being traded
    asset: Asset;
    // Price used to create the limit order
    price: number;
    // Size in terms of the ConditionalToken
    size: number;
    // Side of the Limit order
    side: Side;
}

// Simplified Market order for users
export interface UserMarketOrder {
    // ConditionalToken Asset being traded
    asset: Asset;
    // Size in terms of Collateral, if market buy. e.g USDC size if market buy
    // OR in terms of the quote currency, if market sell. e.g YES token if market sell
    size: number;
    // Side of the Market order
    side: Side;
}

export interface OrderPayload {
    orderID: string;
}

export interface OrderCreationArgs {
    chainID: number;
    exchange: string;
    signer: string;
    maker: string;
    makerAsset: string;
    makerAmount: string;
    makerAssetID?: number;
    takerAsset: string;
    takerAmount: string;
    takerAssetID?: number;
    signatureType: number;
}

export interface MarketOrderCreationArgs {
    chainID: number;
    exchange: string;
    signer: string;
    maker: string;
    makerAsset: string;
    makerAmount: string;
    makerAssetID?: number;
    takerAsset: string;
    takerAssetID?: number;
    signatureType: number;
}
