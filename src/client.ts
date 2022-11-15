import { Wallet } from "@ethersproject/wallet";
import { JsonRpcSigner } from "@ethersproject/providers";
import { SignatureType, SignedOrder } from "@polymarket/order-utils";
import {
    ApiKeyCreds,
    ApiKeysResponse,
    Chain,
    FilterParams,
    MarketPrice,
    OpenOrderParams,
    OpenOrdersResponse,
    OptionalParams,
    Order,
    OrderPayload,
    Trade,
    TradeParams,
    UserOrder,
} from "./types";
import { createL1Headers, createL2Headers } from "./headers";
import {
    addFilterParamsToUrl,
    addOpenOrderParamsToUrl,
    addTradeParamsToUrl,
    del,
    DELETE,
    GET,
    get,
    POST,
    post,
} from "./http-helpers";
import { L1_AUTH_UNAVAILABLE_ERROR, L2_AUTH_NOT_AVAILABLE } from "./errors";
import { orderToJson } from "./utilities";
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
} from "./endpoints";
import { OrderBuilder } from "./order-builder/builder";

export class ClobClient {
    readonly host: string;

    readonly chainId: Chain;

    // Used to perform Level 1 authentication and sign orders
    readonly signer?: Wallet | JsonRpcSigner;

    // Used to perform Level 2 authentication
    readonly creds?: ApiKeyCreds;

    readonly orderBuilder: OrderBuilder;

    constructor(
        host: string,
        chainId: Chain,
        signer?: Wallet | JsonRpcSigner,
        creds?: ApiKeyCreds,
        signatureType?: SignatureType,
        funderAddress?: string,
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
    }

    // Public endpoints
    public async getOk(): Promise<any> {
        return get(`${this.host}/`);
    }

    public async getServerTime(): Promise<any> {
        return get(`${this.host}${TIME}`);
    }

    public async getMarkets(): Promise<any[]> {
        return get(`${this.host}${GET_MARKETS}`);
    }

    public async getMarket(conditionID: string): Promise<any> {
        return get(`${this.host}${GET_MARKET}${conditionID}`);
    }

    public async getOrderBook(tokenID: string): Promise<any> {
        return get(`${this.host}${GET_ORDER_BOOK}?token_id=${tokenID}`);
    }

    public async getMidpoint(tokenID: string): Promise<any> {
        return get(`${this.host}${GET_MIDPOINT}?token_id=${tokenID}`);
    }

    public async getPrice(tokenID: string, side: string): Promise<any> {
        return get(`${this.host}${GET_PRICE}?token_id=${tokenID}&side=${side}`);
    }

    public async getLastTradePrice(tokenID: string): Promise<any> {
        return get(`${this.host}${GET_LAST_TRADE_PRICE}?token_id=${tokenID}`);
    }

    public async getLargeOrders(minValue = ""): Promise<any> {
        return get(`${this.host}${GET_LARGE_ORDERS}?min_value=${minValue}`);
    }

    public async getPricesHistory(params: FilterParams): Promise<MarketPrice[]> {
        const url = addFilterParamsToUrl(`${this.host}${GET_PRICES_HISTORY}`, params);
        return get(url);
    }

    // L1 Authed

    /**
     * Creates a new API key for a user
     * @param nonce
     * @param optionalParams - query parameters
     * @returns ApiKeyCreds
     */
    public async createApiKey(
        nonce?: number,
        optionalParams?: OptionalParams,
    ): Promise<ApiKeyCreds> {
        this.canL1Auth();

        const endpoint = `${this.host}${CREATE_API_KEY}`;
        const headers = await createL1Headers(
            this.signer as Wallet | JsonRpcSigner,
            this.chainId,
            nonce,
        );

        const resp = await post(endpoint, headers, undefined, optionalParams);
        return resp;
    }

    /**
     * Derives an existing API key for a user
     * @param nonce
     * @param optionalParams - query parameters
     * @returns ApiKeyCreds
     */
    public async deriveApiKey(
        nonce?: number,
        optionalParams?: OptionalParams,
    ): Promise<ApiKeyCreds> {
        this.canL1Auth();

        const endpoint = `${this.host}${DERIVE_API_KEY}`;
        const headers = await createL1Headers(
            this.signer as Wallet | JsonRpcSigner,
            this.chainId,
            nonce,
        );

        const resp = await get(endpoint, headers, undefined, optionalParams);
        return resp;
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

        return get(`${this.host}${endpoint}`, headers);
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

        return del(`${this.host}${endpoint}`, headers);
    }

    public async getOrder(orderID: string): Promise<Order> {
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

        return get(`${this.host}${endpoint}`, headers);
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

        const url = addTradeParamsToUrl(`${this.host}${endpoint}`, params);
        return get(url, headers);
    }

    public async createOrder(userOrder: UserOrder): Promise<SignedOrder> {
        this.canL1Auth();

        return this.orderBuilder.buildOrder(userOrder);
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

        const url = addOpenOrderParamsToUrl(`${this.host}${endpoint}`, params);
        return get(url, headers);
    }

    public async postOrder(order: SignedOrder, optionalParams?: OptionalParams): Promise<any> {
        this.canL2Auth();
        const endpoint = POST_ORDER;
        const orderPayload = orderToJson(order);

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

        return post(`${this.host}${endpoint}`, headers, orderPayload, optionalParams);
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
        return del(`${this.host}${endpoint}`, headers, payload);
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
        return del(`${this.host}${endpoint}`, headers);
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
}
