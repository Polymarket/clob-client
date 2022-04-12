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

// Simplified Limit order for users
export interface UserLimitOrder {
    // TokenID of the Conditional token asset being traded
    tokenID: string;
    // Price used to create the limit order
    price: number;
    // Size in terms of the ConditionalToken
    size: number;
    // Side of the Limit order
    side: Side;
}

// Simplified Market order for users
export interface UserMarketOrder {
    // TokenID of the Conditional token asset being traded
    tokenID: string;
    // Size
    // If market buy, this is in terms of the Collateral( i.e USDC)
    // If market sell, this is in terms of the Conditional token( i.e YES/NO token)
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
    executor: string;
    signer: string;
    maker: string;
    makerAsset: string;
    makerAmount: string;
    makerAssetID?: string;
    takerAsset: string;
    takerAmount: string;
    takerAssetID?: string;
    signatureType: number;
}

export interface MarketOrderCreationArgs {
    chainID: number;
    exchange: string;
    signer: string;
    maker: string;
    makerAsset: string;
    makerAmount: string;
    makerAssetID?: string;
    takerAsset: string;
    takerAssetID?: string;
    signatureType: number;
}

export interface ApiKeysResponse {
    apiKeys: ApiKeyCreds[];
}

export interface OrderResponse {
    success: boolean;
    errorMsg: string;
    orderID: string;
    transactionHash: string;
    status: string;
}

export interface Order {
    orderID: string;
    owner: string;
    timestamp: string;
    price: string;
    size: string;
    side: string;
}

export interface OpenOrdersResponse {
    orders: Order[];
}

export interface FilterParams {
    market?: string;
    max?: number;
    startTs?: number;
    endTs?: number;
}

export interface Trade {
    tradeID: string;
    market: string;
    timestamp: string;
    marketOrderID: string;
    limitOrderIDs: string[];
    filledAmount: string;
    side: string;
    owner: string;
    avgPrice: string;
}

export interface TradeHistory {
    history: Trade[];
}

export interface OrderHistory {
    history: Order[];
}
