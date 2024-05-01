import { Wallet } from "@ethersproject/wallet";
import { JsonRpcSigner } from "@ethersproject/providers";
import { SignatureType, SignedOrder } from "@polymarket/order-utils";
import {
    ApiKeyCreds,
    ApiKeysResponse,
    Chain,
    CreateOrderOptions,
    MarketPrice,
    OpenOrderParams,
    OpenOrdersResponse,
    OrderMarketCancelParams,
    OrderBookSummary,
    OrderPayload,
    OrderType,
    Side,
    Trade,
    Notification,
    TradeParams,
    UserMarketOrder,
    UserOrder,
    BalanceAllowanceParams,
    BalanceAllowanceResponse,
    ApiKeyRaw,
    OrderScoringParams,
    OrderScoring,
    OpenOrder,
    TickSizes,
    TickSize,
    OrdersScoringParams,
    PriceHistoryFilterParams,
    PaginationPayload,
    MarketTradeEvent,
    DropNotificationParams,
    BookParams,
    UserEarning,
    RewardsPercentages,
    MarketReward,
    UserRewardsEarning,
    TotalUserEarning,
} from "./types";
import { createL1Headers, createL2Headers } from "./headers";
import {
    del,
    DELETE,
    GET,
    get,
    parseDropNotificationParams,
    parseOrdersScoringParams,
    POST,
    post,
    RequestOptions,
} from "./http-helpers";
import { L1_AUTH_UNAVAILABLE_ERROR, L2_AUTH_NOT_AVAILABLE } from "./errors";
import {
    generateOrderBookSummaryHash,
    isTickSizeSmaller,
    orderToJson,
    priceValid,
} from "./utilities";
import {
    CANCEL_ALL,
    CANCEL_ORDER,
    CREATE_API_KEY,
    GET_API_KEYS,
    GET_ORDER,
    POST_ORDER,
    TIME,
    GET_TRADES,
    GET_ORDER_BOOK,
    DELETE_API_KEY,
    GET_MIDPOINT,
    GET_PRICE,
    GET_OPEN_ORDERS,
    DERIVE_API_KEY,
    GET_LAST_TRADE_PRICE,
    GET_LARGE_ORDERS,
    GET_MARKETS,
    GET_MARKET,
    GET_PRICES_HISTORY,
    GET_NOTIFICATIONS,
    DROP_NOTIFICATIONS,
    CANCEL_ORDERS,
    CANCEL_MARKET_ORDERS,
    GET_BALANCE_ALLOWANCE,
    IS_ORDER_SCORING,
    GET_TICK_SIZE,
    ARE_ORDERS_SCORING,
    GET_SIMPLIFIED_MARKETS,
    GET_SAMPLING_SIMPLIFIED_MARKETS,
    GET_SAMPLING_MARKETS,
    GET_MARKET_TRADES_EVENTS,
    GET_ORDER_BOOKS,
    GET_MIDPOINTS,
    GET_PRICES,
    GET_LAST_TRADES_PRICES,
    GET_EARNINGS_FOR_USER_FOR_DAY,
    GET_LIQUIDITY_REWARD_PERCENTAGES,
    GET_REWARDS_MARKETS_CURRENT,
    GET_REWARDS_MARKETS,
    GET_REWARDS_EARNINGS_PERCENTAGES,
    GET_TOTAL_EARNINGS_FOR_USER_FOR_DAY,
} from "./endpoints";
import { OrderBuilder } from "./order-builder/builder";
import { END_CURSOR, INITIAL_CURSOR } from "./constants";

export class ClobClient {
    readonly host: string;

    readonly chainId: Chain;

    // Used to perform Level 1 authentication and sign orders
    readonly signer?: Wallet | JsonRpcSigner;

    // Used to perform Level 2 authentication
    readonly creds?: ApiKeyCreds;

    readonly orderBuilder: OrderBuilder;

    readonly tickSizes: TickSizes;

    readonly geoBlockToken?: string;

    constructor(
        host: string,
        chainId: Chain,
        signer?: Wallet | JsonRpcSigner,
        creds?: ApiKeyCreds,
        signatureType?: SignatureType,
        funderAddress?: string,
        geoBlockToken?: string,
    ) {
        this.host = host.endsWith("/") ? host.slice(0, -1) : host;
        this.chainId = chainId;

        if (signer !== undefined) {
            this.signer = signer;
        }
        if (creds !== undefined) {
            this.creds = creds;
        }
        this.orderBuilder = new OrderBuilder(
            signer as Wallet | JsonRpcSigner,
            chainId,
            signatureType,
            funderAddress,
        );
        this.tickSizes = {};
        this.geoBlockToken = geoBlockToken;
    }

    // Public endpoints
    public async getOk(): Promise<any> {
        return this.get(`${this.host}/`);
    }

    public async getServerTime(): Promise<any> {
        return this.get(`${this.host}${TIME}`);
    }

    public async getSamplingSimplifiedMarkets(
        next_cursor = INITIAL_CURSOR,
    ): Promise<PaginationPayload> {
        return this.get(`${this.host}${GET_SAMPLING_SIMPLIFIED_MARKETS}`, {
            params: { next_cursor },
        });
    }

    public async getSamplingMarkets(next_cursor = INITIAL_CURSOR): Promise<PaginationPayload> {
        return this.get(`${this.host}${GET_SAMPLING_MARKETS}`, {
            params: { next_cursor },
        });
    }

    public async getSimplifiedMarkets(next_cursor = INITIAL_CURSOR): Promise<PaginationPayload> {
        return this.get(`${this.host}${GET_SIMPLIFIED_MARKETS}`, {
            params: { next_cursor },
        });
    }

    public async getMarkets(next_cursor = INITIAL_CURSOR): Promise<PaginationPayload> {
        return this.get(`${this.host}${GET_MARKETS}`, {
            params: { next_cursor },
        });
    }

    public async getMarket(conditionID: string): Promise<any> {
        return this.get(`${this.host}${GET_MARKET}${conditionID}`);
    }

    public async getOrderBook(tokenID: string): Promise<OrderBookSummary> {
        return this.get(`${this.host}${GET_ORDER_BOOK}`, {
            params: { token_id: tokenID },
        });
    }

    public async getOrderBooks(params: BookParams[]): Promise<OrderBookSummary[]> {
        return this.post(`${this.host}${GET_ORDER_BOOKS}`, {
            data: params,
        });
    }

    public async getTickSize(tokenID: string): Promise<TickSize> {
        if (tokenID in this.tickSizes) {
            return this.tickSizes[tokenID];
        }

        const result = await this.get(`${this.host}${GET_TICK_SIZE}`, {
            params: { token_id: tokenID },
        });
        this.tickSizes[tokenID] = result.minimum_tick_size.toString() as TickSize;

        return this.tickSizes[tokenID];
    }

    /**
     * Calculates the hash for the given orderbook
     * @param orderbook
     * @returns
     */
    public getOrderBookHash(orderbook: OrderBookSummary): string {
        return generateOrderBookSummaryHash(orderbook);
    }

    public async getMidpoint(tokenID: string): Promise<any> {
        return this.get(`${this.host}${GET_MIDPOINT}`, {
            params: { token_id: tokenID },
        });
    }

    public async getMidpoints(params: BookParams[]): Promise<any> {
        return this.post(`${this.host}${GET_MIDPOINTS}`, {
            data: params,
        });
    }

    public async getPrice(tokenID: string, side: string): Promise<any> {
        return this.get(`${this.host}${GET_PRICE}`, {
            params: { token_id: tokenID, side: side },
        });
    }

    public async getPrices(params: BookParams[]): Promise<any> {
        return this.post(`${this.host}${GET_PRICES}`, {
            data: params,
        });
    }

    public async getLastTradePrice(tokenID: string): Promise<any> {
        return this.get(`${this.host}${GET_LAST_TRADE_PRICE}`, {
            params: { token_id: tokenID },
        });
    }

    public async getLastTradesPrices(params: BookParams[]): Promise<any> {
        return this.post(`${this.host}${GET_LAST_TRADES_PRICES}`, {
            data: params,
        });
    }

    public async getLargeOrders(minValue = ""): Promise<any> {
        return this.get(`${this.host}${GET_LARGE_ORDERS}`, {
            params: { min_value: minValue },
        });
    }

    public async getPricesHistory(params: PriceHistoryFilterParams): Promise<MarketPrice[]> {
        return this.get(`${this.host}${GET_PRICES_HISTORY}`, {
            params,
        });
    }

    // L1 Authed

    /**
     * Creates a new API key for a user
     * @param nonce
     * @returns ApiKeyCreds
     */
    public async createApiKey(nonce?: number): Promise<ApiKeyCreds> {
        this.canL1Auth();

        const endpoint = `${this.host}${CREATE_API_KEY}`;
        const headers = await createL1Headers(
            this.signer as Wallet | JsonRpcSigner,
            this.chainId,
            nonce,
        );

        return await this.post(endpoint, { headers }).then((apiKeyRaw: ApiKeyRaw) => {
            const apiKey: ApiKeyCreds = {
                key: apiKeyRaw.apiKey,
                secret: apiKeyRaw.secret,
                passphrase: apiKeyRaw.passphrase,
            };
            return apiKey;
        });
    }

    /**
     * Derives an existing API key for a user
     * @param nonce
     * @returns ApiKeyCreds
     */
    public async deriveApiKey(nonce?: number): Promise<ApiKeyCreds> {
        this.canL1Auth();

        const endpoint = `${this.host}${DERIVE_API_KEY}`;
        const headers = await createL1Headers(
            this.signer as Wallet | JsonRpcSigner,
            this.chainId,
            nonce,
        );

        return await this.get(endpoint, { headers }).then((apiKeyRaw: ApiKeyRaw) => {
            const apiKey: ApiKeyCreds = {
                key: apiKeyRaw.apiKey,
                secret: apiKeyRaw.secret,
                passphrase: apiKeyRaw.passphrase,
            };
            return apiKey;
        });
    }

    public async createOrDeriveApiKey(nonce?: number): Promise<ApiKeyCreds> {
        return this.createApiKey(nonce).then(response => {
            if (!response.key) {
                return this.deriveApiKey(nonce);
            }
            return response;
        });
    }

    public async getApiKeys(): Promise<ApiKeysResponse> {
        this.canL2Auth();

        const endpoint = GET_API_KEYS;
        const headerArgs = {
            method: GET,
            requestPath: endpoint,
        };

        const headers = await createL2Headers(
            this.signer as Wallet | JsonRpcSigner,
            this.creds as ApiKeyCreds,
            headerArgs,
        );

        return this.get(`${this.host}${endpoint}`, { headers });
    }

    public async deleteApiKey(): Promise<any> {
        this.canL2Auth();

        const endpoint = DELETE_API_KEY;
        const headerArgs = {
            method: DELETE,
            requestPath: endpoint,
        };

        const headers = await createL2Headers(
            this.signer as Wallet | JsonRpcSigner,
            this.creds as ApiKeyCreds,
            headerArgs,
        );

        return this.del(`${this.host}${endpoint}`, { headers });
    }

    public async getOrder(orderID: string): Promise<OpenOrder> {
        this.canL2Auth();

        const endpoint = `${GET_ORDER}${orderID}`;
        const headerArgs = {
            method: GET,
            requestPath: endpoint,
        };

        const headers = await createL2Headers(
            this.signer as Wallet | JsonRpcSigner,
            this.creds as ApiKeyCreds,
            headerArgs,
        );

        return this.get(`${this.host}${endpoint}`, { headers });
    }

    public async getTrades(params?: TradeParams): Promise<Trade[]> {
        this.canL2Auth();

        const endpoint = GET_TRADES;
        const headerArgs = {
            method: GET,
            requestPath: endpoint,
        };

        const headers = await createL2Headers(
            this.signer as Wallet | JsonRpcSigner,
            this.creds as ApiKeyCreds,
            headerArgs,
        );

        return this.get(`${this.host}${endpoint}`, { headers, params });
    }

    public async getNotifications(): Promise<Notification[]> {
        this.canL2Auth();

        const endpoint = GET_NOTIFICATIONS;
        const headerArgs = {
            method: GET,
            requestPath: endpoint,
        };

        const headers = await createL2Headers(
            this.signer as Wallet | JsonRpcSigner,
            this.creds as ApiKeyCreds,
            headerArgs,
        );

        return this.get(`${this.host}${endpoint}`, {
            headers,
            params: { signature_type: this.orderBuilder.signatureType },
        });
    }

    public async dropNotifications(params?: DropNotificationParams): Promise<void> {
        this.canL2Auth();

        const endpoint = DROP_NOTIFICATIONS;
        const l2HeaderArgs = {
            method: DELETE,
            requestPath: endpoint,
        };

        const headers = await createL2Headers(
            this.signer as Wallet | JsonRpcSigner,
            this.creds as ApiKeyCreds,
            l2HeaderArgs,
        );

        return this.del(`${this.host}${endpoint}`, {
            headers,
            params: parseDropNotificationParams(params),
        });
    }

    public async getBalanceAllowance(
        params?: BalanceAllowanceParams,
    ): Promise<BalanceAllowanceResponse> {
        this.canL2Auth();

        const endpoint = GET_BALANCE_ALLOWANCE;
        const headerArgs = {
            method: GET,
            requestPath: endpoint,
        };

        const headers = await createL2Headers(
            this.signer as Wallet | JsonRpcSigner,
            this.creds as ApiKeyCreds,
            headerArgs,
        );

        const _params = {
            ...params,
            signature_type: this.orderBuilder.signatureType,
        };

        return this.get(`${this.host}${endpoint}`, { headers, params: _params });
    }

    public async createOrder(
        userOrder: UserOrder,
        options?: Partial<CreateOrderOptions>,
    ): Promise<SignedOrder> {
        this.canL1Auth();

        const { tokenID } = userOrder;

        const tickSize = await this._resolveTickSize(tokenID, options?.tickSize);
        const negRisk = options?.negRisk ?? false;

        if (!priceValid(userOrder.price, tickSize)) {
            throw new Error(
                `invalid price (${userOrder.price}), min: ${parseFloat(tickSize)} - max: ${
                    1 - parseFloat(tickSize)
                }`,
            );
        }

        return this.orderBuilder.buildOrder(userOrder, {
            tickSize,
            negRisk,
        });
    }

    public async createMarketBuyOrder(
        userMarketOrder: UserMarketOrder,
        options?: CreateOrderOptions,
    ): Promise<SignedOrder> {
        this.canL1Auth();

        const { tokenID } = userMarketOrder;

        const tickSize = await this._resolveTickSize(tokenID, options?.tickSize);
        const negRisk = options?.negRisk ?? false;

        if (!userMarketOrder.price) {
            const marketPrice = await this.getPrice(tokenID, Side.BUY);
            userMarketOrder.price = parseFloat(marketPrice);
        }

        if (!priceValid(userMarketOrder.price, tickSize)) {
            throw new Error(
                `invalid price (${userMarketOrder.price}), min: ${parseFloat(tickSize)} - max: ${
                    1 - parseFloat(tickSize)
                }`,
            );
        }

        return this.orderBuilder.buildMarketOrder(userMarketOrder, {
            tickSize,
            negRisk,
        });
    }

    public async getOpenOrders(params?: OpenOrderParams): Promise<OpenOrdersResponse> {
        this.canL2Auth();
        const endpoint = GET_OPEN_ORDERS;
        const l2HeaderArgs = {
            method: GET,
            requestPath: endpoint,
        };

        const headers = await createL2Headers(
            this.signer as Wallet | JsonRpcSigner,
            this.creds as ApiKeyCreds,
            l2HeaderArgs,
        );

        return this.get(`${this.host}${endpoint}`, { headers, params });
    }

    public async postOrder<T extends OrderType = OrderType.GTC>(
        order: SignedOrder,
        orderType: T = OrderType.GTC as T,
    ): Promise<any> {
        this.canL2Auth();
        const endpoint = POST_ORDER;
        const orderPayload = orderToJson(order, this.creds?.key || "", orderType);

        const l2HeaderArgs = {
            method: POST,
            requestPath: endpoint,
            body: JSON.stringify(orderPayload),
        };

        const headers = await createL2Headers(
            this.signer as Wallet | JsonRpcSigner,
            this.creds as ApiKeyCreds,
            l2HeaderArgs,
        );

        return this.post(`${this.host}${endpoint}`, { headers, data: orderPayload });
    }

    public async cancelOrder(payload: OrderPayload): Promise<any> {
        this.canL2Auth();
        const endpoint = CANCEL_ORDER;
        const l2HeaderArgs = {
            method: DELETE,
            requestPath: endpoint,
            body: JSON.stringify(payload),
        };

        const headers = await createL2Headers(
            this.signer as Wallet | JsonRpcSigner,
            this.creds as ApiKeyCreds,
            l2HeaderArgs,
        );
        return this.del(`${this.host}${endpoint}`, { headers, data: payload });
    }

    public async cancelOrders(ordersHashes: string[]): Promise<any> {
        this.canL2Auth();
        const endpoint = CANCEL_ORDERS;
        const l2HeaderArgs = {
            method: DELETE,
            requestPath: endpoint,
            body: JSON.stringify(ordersHashes),
        };

        const headers = await createL2Headers(
            this.signer as Wallet | JsonRpcSigner,
            this.creds as ApiKeyCreds,
            l2HeaderArgs,
        );
        return this.del(`${this.host}${endpoint}`, { headers, data: ordersHashes });
    }

    public async cancelAll(): Promise<any> {
        this.canL2Auth();
        const endpoint = CANCEL_ALL;
        const l2HeaderArgs = {
            method: DELETE,
            requestPath: endpoint,
        };

        const headers = await createL2Headers(
            this.signer as Wallet | JsonRpcSigner,
            this.creds as ApiKeyCreds,
            l2HeaderArgs,
        );
        return this.del(`${this.host}${endpoint}`, { headers });
    }

    public async cancelMarketOrders(payload: OrderMarketCancelParams): Promise<any> {
        this.canL2Auth();
        const endpoint = CANCEL_MARKET_ORDERS;
        const l2HeaderArgs = {
            method: DELETE,
            requestPath: endpoint,
            body: JSON.stringify(payload),
        };

        const headers = await createL2Headers(
            this.signer as Wallet | JsonRpcSigner,
            this.creds as ApiKeyCreds,
            l2HeaderArgs,
        );
        return this.del(`${this.host}${endpoint}`, { headers, data: payload });
    }

    public async isOrderScoring(params?: OrderScoringParams): Promise<OrderScoring> {
        this.canL2Auth();

        const endpoint = IS_ORDER_SCORING;
        const headerArgs = {
            method: GET,
            requestPath: endpoint,
        };

        const headers = await createL2Headers(
            this.signer as Wallet | JsonRpcSigner,
            this.creds as ApiKeyCreds,
            headerArgs,
        );

        return this.get(`${this.host}${endpoint}`, { headers, params });
    }

    public async areOrdersScoring(params?: OrdersScoringParams): Promise<OrderScoring> {
        this.canL2Auth();

        const endpoint = ARE_ORDERS_SCORING;
        const headerArgs = {
            method: GET,
            requestPath: endpoint,
        };

        const headers = await createL2Headers(
            this.signer as Wallet | JsonRpcSigner,
            this.creds as ApiKeyCreds,
            headerArgs,
        );

        return this.get(`${this.host}${endpoint}`, {
            headers,
            params: parseOrdersScoringParams(params),
        });
    }

    // Rewards
    public async getEarningsForUserForDay(date: string): Promise<UserEarning[]> {
        this.canL2Auth();

        const endpoint = GET_EARNINGS_FOR_USER_FOR_DAY;
        const headerArgs = {
            method: GET,
            requestPath: endpoint,
        };

        const headers = await createL2Headers(
            this.signer as Wallet | JsonRpcSigner,
            this.creds as ApiKeyCreds,
            headerArgs,
        );

        let results: UserEarning[] = [];
        let next_cursor = INITIAL_CURSOR;
        while (next_cursor != END_CURSOR) {
            const params = {
                date,
                signature_type: this.orderBuilder.signatureType,
                next_cursor,
            };

            const response = await this.get(`${this.host}${endpoint}`, {
                headers,
                params,
            });
            next_cursor = response.next_cursor;
            results = [...results, ...response.data];
        }
        return results;
    }

    public async getTotalEarningsForUserForDay(date: string): Promise<TotalUserEarning[]> {
        this.canL2Auth();

        const endpoint = GET_TOTAL_EARNINGS_FOR_USER_FOR_DAY;
        const headerArgs = {
            method: GET,
            requestPath: endpoint,
        };

        const headers = await createL2Headers(
            this.signer as Wallet | JsonRpcSigner,
            this.creds as ApiKeyCreds,
            headerArgs,
        );

        const params = {
            date,
            signature_type: this.orderBuilder.signatureType,
        };

        return await this.get(`${this.host}${endpoint}`, {
            headers,
            params,
        });
    }

    public async getUserEarningsAndMarketsConfig(
        date: string,
        order_by = "",
        position = "",
    ): Promise<UserRewardsEarning[]> {
        this.canL2Auth();

        const endpoint = GET_REWARDS_EARNINGS_PERCENTAGES;
        const headerArgs = {
            method: GET,
            requestPath: endpoint,
        };

        const headers = await createL2Headers(
            this.signer as Wallet | JsonRpcSigner,
            this.creds as ApiKeyCreds,
            headerArgs,
        );

        let results: UserRewardsEarning[] = [];
        let next_cursor = INITIAL_CURSOR;
        while (next_cursor != END_CURSOR) {
            const params = {
                date,
                signature_type: this.orderBuilder.signatureType,
                next_cursor,
                order_by,
                position,
            };

            const response = await this.get(`${this.host}${endpoint}`, {
                headers,
                params,
            });
            next_cursor = response.next_cursor;
            results = [...results, ...response.data];
        }
        return results;
    }

    public async getRewardPercentages(): Promise<RewardsPercentages> {
        this.canL2Auth();

        const endpoint = GET_LIQUIDITY_REWARD_PERCENTAGES;
        const headerArgs = {
            method: GET,
            requestPath: endpoint,
        };

        const headers = await createL2Headers(
            this.signer as Wallet | JsonRpcSigner,
            this.creds as ApiKeyCreds,
            headerArgs,
        );

        const _params = {
            signature_type: this.orderBuilder.signatureType,
        };

        return this.get(`${this.host}${endpoint}`, { headers, params: _params });
    }

    public async getCurrentRewards(): Promise<MarketReward[]> {
        let results: MarketReward[] = [];
        let next_cursor = INITIAL_CURSOR;
        while (next_cursor != END_CURSOR) {
            const response = await this.get(`${this.host}${GET_REWARDS_MARKETS_CURRENT}`, {
                params: { next_cursor },
            });
            next_cursor = response.next_cursor;
            results = [...results, ...response.data];
        }
        return results;
    }

    public async getRawRewardsForMarket(conditionId: string): Promise<MarketReward[]> {
        let results: MarketReward[] = [];
        let next_cursor = INITIAL_CURSOR;
        while (next_cursor != END_CURSOR) {
            const response = await this.get(`${this.host}${GET_REWARDS_MARKETS}${conditionId}`, {
                params: { next_cursor },
            });
            next_cursor = response.next_cursor;
            results = [...results, ...response.data];
        }
        return results;
    }

    public async getMarketTradesEvents(conditionID: string): Promise<MarketTradeEvent[]> {
        return this.get(`${this.host}${GET_MARKET_TRADES_EVENTS}${conditionID}`);
    }

    private canL1Auth(): void {
        if (this.signer === undefined) {
            throw L1_AUTH_UNAVAILABLE_ERROR;
        }
    }

    private canL2Auth(): void {
        if (this.signer === undefined) {
            throw L1_AUTH_UNAVAILABLE_ERROR;
        }

        if (this.creds === undefined) {
            throw L2_AUTH_NOT_AVAILABLE;
        }
    }

    private async _resolveTickSize(tokenID: string, tickSize?: TickSize): Promise<TickSize> {
        const minTickSize = await this.getTickSize(tokenID);
        if (tickSize) {
            if (isTickSizeSmaller(tickSize, minTickSize)) {
                throw new Error(
                    `invalid tick size (${tickSize}), minimum for the market is ${minTickSize}`,
                );
            }
        } else {
            tickSize = minTickSize;
        }
        return tickSize;
    }

    // http methods
    private async get(endpoint: string, options?: RequestOptions) {
        return get(endpoint, {
            ...options,
            params: { ...options?.params, geo_block_token: this.geoBlockToken },
        });
    }

    private async post(endpoint: string, options?: RequestOptions) {
        return post(endpoint, {
            ...options,
            params: { ...options?.params, geo_block_token: this.geoBlockToken },
        });
    }

    private async del(endpoint: string, options?: RequestOptions) {
        return del(endpoint, {
            ...options,
            params: { ...options?.params, geo_block_token: this.geoBlockToken },
        });
    }
}
