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
    POLY_NONCE: string;
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

// Simplified order for users
export interface UserOrder {
    // TokenID of the Conditional token asset being traded
    tokenID: string;

    // Price used to create the order
    price: number;

    // Size in terms of the ConditionalToken
    size: number;

    // Side of the order
    side: Side;

    // Fee rate, in basis points, charged to the order maker, charged on proceeds
    feeRateBps: string;

    // Nonce used for onchain cancellations
    nonce: number;

    // Timestamp after which the order is expired.
    expiration?: number;
}

export interface OrderPayload {
    orderID: string;
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
    tokenID: string;
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
    // TODO: re-define
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

export type OptionalParams = { [query: string]: string };
