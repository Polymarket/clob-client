import { SignatureType } from "@polymarket/order-utils";

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

export enum OrderType {
    GTC = "GTC",
    FOK = "FOK",
}

export interface NewOrder {
    readonly order: {
        readonly salt: number;
        readonly maker: string;
        readonly signer: string;
        readonly taker: string;
        readonly tokenId: string;
        readonly makerAmount: string;
        readonly takerAmount: string;
        readonly expiration: string;
        readonly nonce: string;
        readonly feeRateBps: string;
        readonly side: Side; // string
        readonly signatureType: SignatureType;
        readonly signature: string;
    };
    readonly owner: string;
    readonly orderType: OrderType;
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

// Simplified market order for users
export interface UserMarketOrder {
    /**
     * TokenID of the Conditional token asset being traded
     */
    tokenID: string;

    /**
     * Price used to create the order
     * If it is not present the market price will be used.
     */
    price?: number;

    /**
     * Amount in terms of Collateral
     */
    amount: number;

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
    created_at: number;
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
    owner?: string;
    market?: string;
    asset_id?: string;
}

export interface MakerOrder {
    order_id: string;
    owner: string;
    maker_address: string;
    matched_amount: string;
    price: string;
    asset_id: string;
    outcome: string;
    outcome_index: string;
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
    maker_address: string;
    maker_orders: MakerOrder[];
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

export interface TradeNotificationParams {
    index: number;
}

export interface TradeNotification {
    id: number;
    owner: string;
    order_id: string;
    market: string;
    asset_id: string;
    side: string;
    price: string;
    original_size: string;
    matched_size: string;
    remaining_size: string;
    outcome: string;
    outcome_index: number;
    action: string;
    timestamp: number;
}

export interface OrderMarketCancelParams {
    market?: string;
    asset_id?: string;
}

export interface OrderBookSummary {
    market: string;
    asset_id: string;
    bids: OrderSummary[];
    asks: OrderSummary[];
    hash: string;
}

export interface OrderSummary {
    price: string;
    size: string;
}
