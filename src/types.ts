import { SignatureType, SignedOrder } from "@polymarket/order-utils";
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


// Builder API key verification
export interface L2WithBuilderHeader extends L2PolyHeader {
    POLY_BUILDER_API_KEY: string;
    POLY_BUILDER_TIMESTAMP: string;
    POLY_BUILDER_PASSPHRASE: string;
    POLY_BUILDER_SIGNATURE: string;
}

export enum Side {
    BUY = "BUY",
    SELL = "SELL",
}

export enum OrderType {
    GTC = "GTC",
    FOK = "FOK",
    GTD = "GTD",
    FAK = "FAK",
}

export interface PostOrdersArgs {
    order: SignedOrder;
    orderType: OrderType;
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
    readonly deferExec: boolean;
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
     * BUY orders: $$$ Amount to buy
     * SELL orders: Shares to sell
     */
    amount: number;

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
     * Address of the order taker. The zero address is used to indicate a public order
     */
    taker?: string;

    /**
     * Specifies the type of order execution:
     * - FOK (Fill or Kill): The order must be filled entirely or not at all.
     * - FAK (Fill and Kill): The order can be partially filled, and any unfilled portion is canceled.
     */
    orderType?: OrderType.FOK | OrderType.FAK;
}

export interface OrderPayload {
    orderID: string;
}

export interface ApiKeysResponse {
    apiKeys: ApiKeyCreds[];
}

export interface BanStatus {
    closed_only: boolean;
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
    maker_address: string;
    market: string;
    asset_id: string;
    side: string;
    original_size: string;
    size_matched: string;
    price: string;
    associate_trades: string[];
    outcome: string;
    created_at: number;
    expiration: string;
    order_type: string;
}

export type OpenOrdersResponse = OpenOrder[];

export interface TradeParams {
    id?: string;
    maker_address?: string;
    market?: string;
    asset_id?: string;
    before?: string;
    after?: string;
}

export interface OpenOrderParams {
    id?: string;
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
    side: Side;
}

export interface Trade {
    id: string;

    taker_order_id: string;

    market: string;
    asset_id: string;
    side: Side;
    size: string;
    fee_rate_bps: string;
    price: string;
    status: string;
    match_time: string;
    last_update: string;
    outcome: string;
    bucket_index: number;
    owner: string;
    maker_address: string;
    maker_orders: MakerOrder[];
    transaction_hash: string;
    trader_side: "TAKER" | "MAKER";
}

export enum Chain {
    POLYGON = 137,
    AMOY = 80002,
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
    timestamp: string;
    bids: OrderSummary[];
    asks: OrderSummary[];
    min_order_size: string;
    tick_size: string;
    neg_risk: boolean;
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

export interface NegRisk {
    [tokenId: string]: boolean;
}

export interface FeeRates {
    [tokenId: string]: number;
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
    condition_id: string;
    asset_address: string;
    maker_address: string;
    earnings: number;
    asset_rate: number;
}

export interface TotalUserEarning {
    date: string;
    asset_address: string;
    maker_address: string;
    earnings: number;
    asset_rate: number;
}

export interface RewardsPercentages {
    [market: string]: number;
}

export interface Token {
    token_id: string;
    outcome: string;
    price: number;
}

export interface RewardsConfig {
    asset_address: string;
    start_date: string;
    end_date: string;
    rate_per_day: number;
    total_rewards: number;
}

export interface MarketReward {
    condition_id: string;
    question: string;
    market_slug: string;
    event_slug: string;
    image: string;
    rewards_max_spread: number;
    rewards_min_size: number;
    tokens: Token[];
    rewards_config: RewardsConfig[];
}

export interface Earning {
    asset_address: string;
    earnings: number;
    asset_rate: number;
}

export interface BuilderApiKey {
    key: string;
    secret: string;
    passphrase: string;
}

export interface BuilderApiKeyResponse {
    key: string;
    createdAt?: string;
    revokedAt?: string;
}

export interface UserRewardsEarning {
    condition_id: string;
    question: string;
    market_slug: string;
    event_slug: string;
    image: string;
    rewards_max_spread: number;
    rewards_min_size: number;
    market_competitiveness: number;
    tokens: Token[];
    rewards_config: RewardsConfig[];
    maker_address: string;
    earning_percentage: number;
    earnings: Earning[];
}

export interface BuilderTrade {
    id: string;
    tradeType: string;
    takerOrderHash: string;
    builder: string;
    market: string;
    assetId: string;
    side: string;
    size: string;
    sizeUsdc: string;
    price: string;
    status: string;
    outcome: string;
    outcomeIndex: number;
    owner: string;
    maker: string;
    transactionHash: string;
    matchTime: string;
    bucketIndex: number;
    fee: string;
    feeUsdc: string;
    err_msg?: string | null;
    createdAt: string | null;
    updatedAt: string | null;
}
