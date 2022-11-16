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
    BUY = "BUY",
    SELL = "SELL",
}

// Simplified order for users
export interface UserOrder {
    /**
     * TokenID of the Conditional token asset being traded
     */
    tokenID: string;

    /**
     * Price used to create the order
     */
    price: number;

    /**
     * Size in terms of the ConditionalToken
     */
    size: number;

    /**
     * Side of the order
     */
    side: Side;

    /**
     * Fee rate, in basis points, charged to the order maker, charged on proceeds
     */
    feeRateBps?: number;

    /**
     * Nonce used for onchain cancellations
     */
    nonce?: number;

    /**
     * Timestamp after which the order is expired.
     */
    expiration?: number;

    /**
     * Address of the order taker. The zero address is used to indicate a public order
     */
    taker?: string;
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
    transactionsHashes: string[];
    status: string;
}

// get order/{orderID} response
export interface Order {
    orderID: string;
    owner: string;
    timestamp: string;
    price: string;
    size: string;
    available_size: string;
    side: string;
    status: string;
    asset_id: string;
}

export interface OpenOrder {
    id: string;
    owner: string;
    market: string;
    asset_id: string;
    side: string;
    original_size: string;
    size_matched: string;
    price: string;
    associate_trades: Trade[];
    outcome: string;
    outcome_index: number;
}

export type OpenOrdersResponse = OpenOrder[];

export interface FilterParams {
    owner?: string;
    max?: number;
    market?: string;
    side?: Side;
    startTs?: number;
    endTs?: number;
    minValue?: string;
    fidelity?: number;
}

export interface TradeParams {
    id?: string;
    owner?: string;
    taker?: string;
    maker?: string;
    market?: string;
    asset_id?: string;
    limit?: number;
    before?: string;
    after?: string;
}

export interface OpenOrderParams {
    id?: string;
    owner: string;
    market?: string;
    asset_id?: string;
}

export interface Trade {
    id: string;

    taker_order: string;

    market: string;
    asset_id: string;
    side: number | string;
    size: string;
    status: string;
    price: string;
    match_time: string;
    last_update: string;
    outcome: string;
    outcome_index: number;
    bucket_index: number;
    owner: string;
    maker_orders: string[];
    maker_orders_sizes_prices: string[][];
}

export type OptionalParams = { [query: string]: string };

export enum Chain {
    POLYGON = 137,
    MUMBAI = 80001,
}

export interface MarketPrice {
    t: string; // timestamp
    l: string; // liquidity
    p: string; // price
    v: string; // volume
    ps: string; // positions
}
