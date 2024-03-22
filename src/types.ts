import { SignatureType } from "@polymarket/order-utils";
import { AxiosRequestHeaders } from "axios";

export interface ApiKeyCreds {
    key: string;
    secret: string;
    passphrase: string;
}

export interface ApiKeyRaw {
    apiKey: string;
    secret: string;
    passphrase: string;
}

export interface L2HeaderArgs {
    method: string;
    requestPath: string;
    body?: string;
}

// EIP712 sig verification
export interface L1PolyHeader extends AxiosRequestHeaders {
    POLY_ADDRESS: string;
    POLY_SIGNATURE: string;
    POLY_TIMESTAMP: string;
    POLY_NONCE: string;
}

// API key verification
export interface L2PolyHeader extends AxiosRequestHeaders {
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
    GTD = "GTD",
}

export interface NewOrder<T extends OrderType> {
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
    readonly orderType: T;
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
    takingAmount: string;
    makingAmount: string;
}

export interface OpenOrder {
    id: string;
    status: string;
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
    expiration: string;
    type: string;
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
    fee_rate_bps: string;
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
    fee_rate_bps: string;
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
    transaction_hash: string;
}

export enum Chain {
    POLYGON = 137,
    MUMBAI = 80001,
}

export interface MarketPrice {
    t: number; // timestamp
    p: number; // price
}

export interface PriceHistoryFilterParams {
    market?: string;
    startTs?: number;
    endTs?: number;
    fidelity?: number;
    interval?: PriceHistoryInterval;
}

export enum PriceHistoryInterval {
    MAX = "max",
    ONE_WEEK = "1w",
    ONE_DAY = "1d",
    SIX_HOURS = "6h",
    ONE_HOUR = "1h",
}

export interface DropNotificationParams {
    ids: string[];
}

export interface Notification {
    type: number;
    owner: string;

    payload: any;
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

export enum AssetType {
    COLLATERAL = "COLLATERAL",
    CONDITIONAL = "CONDITIONAL",
}

export interface BalanceAllowanceParams {
    asset_type: AssetType;
    token_id?: string;
}

export interface BalanceAllowanceResponse {
    balance: string;
    allowance: string;
}

export interface OrderScoringParams {
    order_id: string;
}

export interface OrderScoring {
    scoring: boolean;
}

export interface OrdersScoringParams {
    orderIds: string[];
}

export type OrdersScoring = { [orderId in string]: boolean };

export type CreateOrderOptions = {
    tickSize: TickSize;
    negRisk?: boolean;
};

export type TickSize = "0.1" | "0.01" | "0.001" | "0.0001";

export interface RoundConfig {
    readonly price: number;
    readonly size: number;
    readonly amount: number;
}

export interface TickSizes {
    [tokenId: string]: TickSize;
}

export interface PaginationPayload {
    readonly limit: number;
    readonly count: number;
    readonly next_cursor: string;
    readonly data: any[];
}

export interface MarketTradeEvent {
    event_type: string;
    market: {
        condition_id: string;
        asset_id: string;
        question: string;
        icon: string;
        slug: string;
    };
    user: {
        address: string;
        username: string;
        profile_picture: string;
        optimized_profile_picture: string;
        pseudonym: string;
    };
    side: Side;
    size: string;
    fee_rate_bps: string;
    price: string;
    outcome: string;
    outcome_index: number;
    transaction_hash: string;
    timestamp: string;
}

export interface BookParams {
    token_id: string;
    side: Side;
}

export interface UserEarning {
    date: string;
    market: string;
    asset_address: string;
    maker_address: string;
    earnings: number;
}

export interface RewardsPercentages {
    [market: string]: number;
}

export interface CurrentReward {
    market: string;
    asset_address: string;
    start_date: string;
    end_date: string;
    current_rewards_per_day: number;
    total_reward_amount: number;
    remaining_reward_amount: number;
}

export interface MarketReward {
    market: string;
    asset_address: string;
    start_date: string;
    end_date: string;
    rate_per_day: number;
    total_rewards: number;
    total_days: number;
}
