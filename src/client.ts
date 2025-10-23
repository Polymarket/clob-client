import { Wallet } from "@ethersproject/wallet";
import { JsonRpcSigner } from "@ethersproject/providers";
import { SignatureType, SignedOrder } from "@polymarket/order-utils";
import { BuilderConfig, BuilderHeaderPayload } from "@polymarket/builder-signing-sdk";
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
    OrdersScoring,
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
    NegRisk,
    BanStatus,
    NewOrder,
    PostOrdersArgs,
    FeeRates,
    L2WithBuilderHeader,
    L2PolyHeader,
    L2HeaderArgs,
    BuilderTrade,
    BuilderApiKey,
    BuilderApiKeyResponse,
} from "./types";
import { createL1Headers, createL2Headers, injectBuilderHeaders } from "./headers";
import {
    del,
    DELETE,
    GET,
    get,
    parseDropNotificationParams,
    POST,
    post,
    RequestOptions,
} from "./http-helpers";
import { BUILDER_AUTH_FAILED, BUILDER_AUTH_NOT_AVAILABLE, L1_AUTH_UNAVAILABLE_ERROR, L2_AUTH_NOT_AVAILABLE } from "./errors";
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
    CLOSED_ONLY,
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
    GET_NEG_RISK,
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
    GET_SPREAD,
    GET_SPREADS,
    UPDATE_BALANCE_ALLOWANCE,
    POST_ORDERS,
    GET_FEE_RATE,
    GET_BUILDER_TRADES,
    CREATE_BUILDER_API_KEY,
    GET_BUILDER_API_KEYS,
    REVOKE_BUILDER_API_KEY,
} from "./endpoints";
import { OrderBuilder } from "./order-builder/builder";
import { END_CURSOR, INITIAL_CURSOR } from "./constants";
import { calculateBuyMarketPrice, calculateSellMarketPrice } from "./order-builder/helpers";

export class ClobClient {
    readonly host: string;

    readonly chainId: Chain;

    // Used to perform Level 1 authentication and sign orders
    readonly signer?: Wallet | JsonRpcSigner;

    // Used to perform Level 2 authentication
    readonly creds?: ApiKeyCreds;

    readonly orderBuilder: OrderBuilder;

    readonly tickSizes: TickSizes;

    readonly negRisk: NegRisk;

    readonly feeRates: FeeRates;

    readonly geoBlockToken?: string;

    readonly useServerTime?: boolean;

    readonly builderConfig?: BuilderConfig;

    // eslint-disable-next-line max-params
    constructor(
        host: string,
        chainId: Chain,
        signer?: Wallet | JsonRpcSigner,
        creds?: ApiKeyCreds,
        signatureType?: SignatureType,
        funderAddress?: string,
        geoBlockToken?: string,
        useServerTime?: boolean,
        builderConfig?: BuilderConfig,
        getSigner?: () => Promise<Wallet | JsonRpcSigner> | (Wallet | JsonRpcSigner)
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
            getSigner,
        );
        this.tickSizes = {};
        this.negRisk = {};
        this.feeRates = {};
        this.geoBlockToken = geoBlockToken;
        this.useServerTime = useServerTime;
        if (builderConfig !== undefined) {
            this.builderConfig = builderConfig;
        }
    }

    // Public endpoints
    public async getOk(): Promise<any> {
        return this.get(`${this.host}/`);
    }

    public async getServerTime(): Promise<number> {
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

    public async getNegRisk(tokenID: string): Promise<boolean> {
        if (tokenID in this.negRisk) {
            return this.negRisk[tokenID];
        }

        const result = await this.get(`${this.host}${GET_NEG_RISK}`, {
            params: { token_id: tokenID },
        });
        this.negRisk[tokenID] = result.neg_risk as boolean;

        return this.negRisk[tokenID];
    }

    public async getFeeRateBps(tokenID: string): Promise<number> {
        if (tokenID in this.feeRates) {
            return this.feeRates[tokenID];
        }

        const result = await this.get(`${this.host}${GET_FEE_RATE}`, {
            params: { token_id: tokenID },
        });
        this.feeRates[tokenID] = result.base_fee as number;

        return this.feeRates[tokenID];
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

    public async getSpread(tokenID: string): Promise<any> {
        return this.get(`${this.host}${GET_SPREAD}`, {
            params: { token_id: tokenID },
        });
    }

    public async getSpreads(params: BookParams[]): Promise<any> {
        return this.post(`${this.host}${GET_SPREADS}`, {
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
            this.useServerTime ? await this.getServerTime() : undefined,
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
            this.useServerTime ? await this.getServerTime() : undefined,
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
            this.useServerTime ? await this.getServerTime() : undefined,
        );

        return this.get(`${this.host}${endpoint}`, { headers });
    }

    public async getClosedOnlyMode(): Promise<BanStatus> {
        this.canL2Auth();

        const endpoint = CLOSED_ONLY;
        const headerArgs = {
            method: GET,
            requestPath: endpoint,
        };

        const headers = await createL2Headers(
            this.signer as Wallet | JsonRpcSigner,
            this.creds as ApiKeyCreds,
            headerArgs,
            this.useServerTime ? await this.getServerTime() : undefined,
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
            this.useServerTime ? await this.getServerTime() : undefined,
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
            this.useServerTime ? await this.getServerTime() : undefined,
        );

        return this.get(`${this.host}${endpoint}`, { headers });
    }

    public async getTrades(
        params?: TradeParams,
        only_first_page = false,
        next_cursor?: string,
    ): Promise<Trade[]> {
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
            this.useServerTime ? await this.getServerTime() : undefined,
        );

        let results: Trade[] = [];
        next_cursor = next_cursor || INITIAL_CURSOR;
        while (next_cursor != END_CURSOR && (next_cursor === INITIAL_CURSOR || !only_first_page)) {
            const _params: any = {
                ...params,
                next_cursor,
            };
            const response = await this.get(`${this.host}${endpoint}`, {
                headers,
                params: _params,
            });
            next_cursor = response.next_cursor;
            results = [...results, ...response.data];
        }
        return results;
    }

    public async getTradesPaginated(
        params?: TradeParams,
        next_cursor?: string,
    ): Promise<{ trades: Trade[]; next_cursor: string; limit: number; count: number }> {
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
            this.useServerTime ? await this.getServerTime() : undefined,
        );

        next_cursor = next_cursor || INITIAL_CURSOR;

        const _params: any = { ...params, next_cursor };

        const {
            data,
            ...rest
        }: {
            data: Trade[];
            next_cursor: string;
            limit: number;
            count: number;
        } = await this.get(`${this.host}${endpoint}`, {
            headers,
            params: _params,
        });

        return { trades: Array.isArray(data) ? [...data] : [], ...rest };
    }

    public async getBuilderTrades(
        params?: TradeParams,
        next_cursor?: string,
    ): Promise<{ trades: BuilderTrade[]; next_cursor: string; limit: number; count: number }> {
        this.mustBuilderAuth();

        const endpoint = GET_BUILDER_TRADES;
        const headerArgs = {
            method: GET,
            requestPath: endpoint,
        };

        const headers = await this._getBuilderHeaders(
            headerArgs.method,
            headerArgs.requestPath,
        );

        if (headers == undefined) {
            throw BUILDER_AUTH_FAILED;
        }

        next_cursor = next_cursor || INITIAL_CURSOR;

        const _params: any = { ...params, next_cursor };

        const {
            data,
            ...rest
        }: {
            data: BuilderTrade[];
            next_cursor: string;
            limit: number;
            count: number;
        } = await this.get(`${this.host}${endpoint}`, {
            headers,
            params: _params,
        });

        return { trades: Array.isArray(data) ? [...data] : [], ...rest };
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
            this.useServerTime ? await this.getServerTime() : undefined,
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
            this.useServerTime ? await this.getServerTime() : undefined,
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
            this.useServerTime ? await this.getServerTime() : undefined,
        );

        const _params = {
            ...params,
            signature_type: this.orderBuilder.signatureType,
        };

        return this.get(`${this.host}${endpoint}`, { headers, params: _params });
    }

    public async updateBalanceAllowance(params?: BalanceAllowanceParams): Promise<void> {
        this.canL2Auth();

        const endpoint = UPDATE_BALANCE_ALLOWANCE;
        const headerArgs = {
            method: GET,
            requestPath: endpoint,
        };

        const headers = await createL2Headers(
            this.signer as Wallet | JsonRpcSigner,
            this.creds as ApiKeyCreds,
            headerArgs,
            this.useServerTime ? await this.getServerTime() : undefined,
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

        const feeRateBps = await this._resolveFeeRateBps(tokenID, userOrder.feeRateBps);
        userOrder.feeRateBps = feeRateBps;

        if (!priceValid(userOrder.price, tickSize)) {
            throw new Error(
                `invalid price (${userOrder.price}), min: ${parseFloat(tickSize)} - max: ${
                    1 - parseFloat(tickSize)
                }`,
            );
        }

        const negRisk = options?.negRisk ?? (await this.getNegRisk(tokenID));

        return this.orderBuilder.buildOrder(userOrder, {
            tickSize,
            negRisk,
        });
    }

    public async createMarketOrder(
        userMarketOrder: UserMarketOrder,
        options?: Partial<CreateOrderOptions>,
    ): Promise<SignedOrder> {
        this.canL1Auth();

        const { tokenID } = userMarketOrder;

        const tickSize = await this._resolveTickSize(tokenID, options?.tickSize);

        const feeRateBps = await this._resolveFeeRateBps(tokenID, userMarketOrder.feeRateBps);
        userMarketOrder.feeRateBps = feeRateBps;

        if (!userMarketOrder.price) {
            userMarketOrder.price = await this.calculateMarketPrice(
                tokenID,
                userMarketOrder.side,
                userMarketOrder.amount,
                userMarketOrder.orderType,
            );
        }

        if (!priceValid(userMarketOrder.price, tickSize)) {
            throw new Error(
                `invalid price (${userMarketOrder.price}), min: ${parseFloat(tickSize)} - max: ${
                    1 - parseFloat(tickSize)
                }`,
            );
        }

        const negRisk = options?.negRisk ?? (await this.getNegRisk(tokenID));

        return this.orderBuilder.buildMarketOrder(userMarketOrder, {
            tickSize,
            negRisk,
        });
    }

    public async createAndPostOrder<T extends OrderType.GTC | OrderType.GTD = OrderType.GTC>(
        userOrder: UserOrder,
        options?: Partial<CreateOrderOptions>,
        orderType: T = OrderType.GTC as T,
        deferExec = false,
    ): Promise<any> {
        const order = await this.createOrder(userOrder, options);
        return this.postOrder(order, orderType, deferExec);
    }

    public async createAndPostMarketOrder<T extends OrderType.FOK | OrderType.FAK = OrderType.FOK>(
        userMarketOrder: UserMarketOrder,
        options?: Partial<CreateOrderOptions>,
        orderType: T = OrderType.FOK as T,
        deferExec = false,
    ): Promise<any> {
        const order = await this.createMarketOrder(userMarketOrder, options);
        return this.postOrder(order, orderType, deferExec);
    }

    public async getOpenOrders(
        params?: OpenOrderParams,
        only_first_page = false,
        next_cursor?: string,
    ): Promise<OpenOrdersResponse> {
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
            this.useServerTime ? await this.getServerTime() : undefined,
        );

        let results: OpenOrder[] = [];
        next_cursor = next_cursor || INITIAL_CURSOR;
        while (next_cursor != END_CURSOR && (next_cursor === INITIAL_CURSOR || !only_first_page)) {
            const _params: any = {
                ...params,
                next_cursor,
            };
            const response = await this.get(`${this.host}${endpoint}`, {
                headers,
                params: _params,
            });
            next_cursor = response.next_cursor;
            results = [...results, ...response.data];
        }
        return results;
    }

    public async postOrder<T extends OrderType = OrderType.GTC>(
        order: SignedOrder,
        orderType: T = OrderType.GTC as T,
        deferExec = false,
    ): Promise<any> {
        this.canL2Auth();
        const endpoint = POST_ORDER;
        const orderPayload = orderToJson(order, this.creds?.key || "", orderType, deferExec);

        const l2HeaderArgs = {
            method: POST,
            requestPath: endpoint,
            body: JSON.stringify(orderPayload),
        };

        const headers = await createL2Headers(
            this.signer as Wallet | JsonRpcSigner,
            this.creds as ApiKeyCreds,
            l2HeaderArgs,
            this.useServerTime ? await this.getServerTime() : undefined,
        );

        // builders flow
        if (this.canBuilderAuth()) {
            const builderHeaders = await this._generateBuilderHeaders(headers, l2HeaderArgs);
            if (builderHeaders !== undefined) {
                return this.post(`${this.host}${endpoint}`, { headers: builderHeaders, data: orderPayload });    
            }
        }

        return this.post(`${this.host}${endpoint}`, { headers, data: orderPayload });
    }

    public async postOrders(args: PostOrdersArgs[], deferExec = false): Promise<any> {
        this.canL2Auth();
        const endpoint = POST_ORDERS;
        const ordersPayload: NewOrder<any>[] = [];
        for (const { order, orderType } of args) {
            const orderPayload = orderToJson(order, this.creds?.key || "", orderType, deferExec);
            ordersPayload.push(orderPayload);
        }

        const l2HeaderArgs = {
            method: POST,
            requestPath: endpoint,
            body: JSON.stringify(ordersPayload),
        };

        const headers = await createL2Headers(
            this.signer as Wallet | JsonRpcSigner,
            this.creds as ApiKeyCreds,
            l2HeaderArgs,
            this.useServerTime ? await this.getServerTime() : undefined,
        );

        // builders flow
        if (this.canBuilderAuth()) {
            const builderHeaders = await this._generateBuilderHeaders(headers, l2HeaderArgs);
            if (builderHeaders !== undefined) {
                return this.post(`${this.host}${endpoint}`, { headers: builderHeaders, data: ordersPayload });    
            }
        }

        return this.post(`${this.host}${endpoint}`, { headers, data: ordersPayload });
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
            this.useServerTime ? await this.getServerTime() : undefined,
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
            this.useServerTime ? await this.getServerTime() : undefined,
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
            this.useServerTime ? await this.getServerTime() : undefined,
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
            this.useServerTime ? await this.getServerTime() : undefined,
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
            this.useServerTime ? await this.getServerTime() : undefined,
        );

        return this.get(`${this.host}${endpoint}`, { headers, params });
    }

    public async areOrdersScoring(params?: OrdersScoringParams): Promise<OrdersScoring> {
        this.canL2Auth();

        const endpoint = ARE_ORDERS_SCORING;
        const payload = JSON.stringify(params?.orderIds);
        const headerArgs = {
            method: POST,
            requestPath: endpoint,
            body: payload,
        };

        const headers = await createL2Headers(
            this.signer as Wallet | JsonRpcSigner,
            this.creds as ApiKeyCreds,
            headerArgs,
            this.useServerTime ? await this.getServerTime() : undefined,
        );

        return this.post(`${this.host}${endpoint}`, {
            headers,
            data: payload,
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
            this.useServerTime ? await this.getServerTime() : undefined,
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
            this.useServerTime ? await this.getServerTime() : undefined,
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
        no_competition = false,
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
            this.useServerTime ? await this.getServerTime() : undefined,
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
                no_competition,
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
            this.useServerTime ? await this.getServerTime() : undefined,
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

    public async calculateMarketPrice(
        tokenID: string,
        side: Side,
        amount: number,
        orderType: OrderType = OrderType.FOK,
    ): Promise<number> {
        const book = await this.getOrderBook(tokenID);
        if (!book) {
            throw new Error("no orderbook");
        }
        if (side === Side.BUY) {
            if (!book.asks) {
                throw new Error("no match");
            }
            return calculateBuyMarketPrice(book.asks, amount, orderType);
        } else {
            if (!book.bids) {
                throw new Error("no match");
            }
            return calculateSellMarketPrice(book.bids, amount, orderType);
        }
    }

    public async createBuilderApiKey(): Promise<BuilderApiKey> {
        this.canL2Auth();
        
        const endpoint = CREATE_BUILDER_API_KEY;
        const headerArgs = {
            method: POST,
            requestPath: endpoint,
        };

        const headers = await createL2Headers(
            this.signer as Wallet | JsonRpcSigner,
            this.creds as ApiKeyCreds,
            headerArgs,
            this.useServerTime ? await this.getServerTime() : undefined,
        );

        return this.post(`${this.host}${endpoint}`, { headers });
    }

    public async getBuilderApiKeys(): Promise<BuilderApiKeyResponse[]> {
        this.canL2Auth();
        
        const endpoint = GET_BUILDER_API_KEYS;
        const headerArgs = {
            method: GET,
            requestPath: endpoint,
        };

        const headers = await createL2Headers(
            this.signer as Wallet | JsonRpcSigner,
            this.creds as ApiKeyCreds,
            headerArgs,
            this.useServerTime ? await this.getServerTime() : undefined,
        );

        return this.get(`${this.host}${endpoint}`, { headers });
    }

    public async revokeBuilderApiKey(): Promise<any> {
        this.mustBuilderAuth();
        
        const endpoint = REVOKE_BUILDER_API_KEY;
        const headerArgs = {
            method: DELETE,
            requestPath: endpoint,
        };

        const headers = await this._getBuilderHeaders(
            headerArgs.method,
            headerArgs.requestPath,
        );
        if (headers == undefined) {
            throw BUILDER_AUTH_FAILED;
        }

        return this.del(`${this.host}${endpoint}`, { headers });
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

    private mustBuilderAuth(): void {
        if (!this.canBuilderAuth()) {
            throw BUILDER_AUTH_NOT_AVAILABLE;
        }
    }

    private canBuilderAuth(): boolean {
        return (this.builderConfig != undefined && this.builderConfig.isValid())
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

    private async _resolveFeeRateBps(tokenID: string, userFeeRateBps?: number): Promise<number> {
        const marketFeeRateBps = await this.getFeeRateBps(tokenID);
        if (marketFeeRateBps > 0 && userFeeRateBps != undefined && userFeeRateBps != marketFeeRateBps){
            throw new Error(
                `invalid user provided fee rate: ${userFeeRateBps}, fee rate for the market must be ${marketFeeRateBps}`,
            );
        }
        return marketFeeRateBps;
    }

    private async _generateBuilderHeaders(
        headers: L2PolyHeader,
        headerArgs: L2HeaderArgs,
    ): Promise<L2WithBuilderHeader | undefined> {

        if (this.builderConfig !== undefined) {
            const builderHeaders = await this._getBuilderHeaders(
                headerArgs.method,
                headerArgs.requestPath,
                headerArgs.body,
            );
            if (builderHeaders == undefined) {
                return undefined;
            }
            return injectBuilderHeaders(headers, builderHeaders);
        }

        return undefined;
    }

    private async _getBuilderHeaders(
        method: string,
        path: string,
        body?: string
    ): Promise<BuilderHeaderPayload | undefined> {
        return (this.builderConfig as BuilderConfig).generateBuilderHeaders(
            method,
            path,
            body,
        );
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
