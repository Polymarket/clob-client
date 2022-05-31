import { Wallet } from "@ethersproject/wallet";
import { JsonRpcSigner } from "@ethersproject/providers";
import { SignatureType } from "@polymarket/order-utils";
import {
    LimitOrderAndSignature,
    MarketOrderAndSignature,
    ApiKeyCreds,
    OrderPayload,
    UserLimitOrder,
    UserMarketOrder,
    OpenOrdersResponse,
    Order,
    ApiKeysResponse,
    FilterParams,
    TradeHistory,
    OrderHistory,
} from "./types";
import { createL1Headers, createL2Headers } from "./headers";
import { del, DELETE, GET, get, POST, post } from "./http_helpers";
import { L1_AUTH_UNAVAILABLE_ERROR, L2_AUTH_NOT_AVAILABLE } from "./errors";
import { marketOrderToJson, limitOrderToJson, addQueryParamsToUrl } from "./utilities";
import {
    CANCEL_ALL,
    CANCEL,
    CREATE_API_KEY,
    GET_API_KEYS,
    GET_ORDER,
    POST_ORDER,
    TIME,
    TRADE_HISTORY,
    GET_ORDER_BOOK,
    DELETE_API_KEY,
    MIDPOINT,
    PRICE,
    OPEN_ORDERS,
    ORDER_HISTORY,
    DERIVE_API_KEY,
    GET_LAST_TRADE_PRICE,
} from "./endpoints";
import { OrderBuilder } from "./order-builder/builder";

export class ClobClient {
    readonly host: string;

    // Used to perform Level 1 authentication and sign orders
    readonly signer?: Wallet | JsonRpcSigner;

    // Used to perform Level 2 authentication
    readonly creds?: ApiKeyCreds;

    readonly orderBuilder: OrderBuilder;

    constructor(
        host: string,
        signer?: Wallet | JsonRpcSigner,
        creds?: ApiKeyCreds,
        signatureType?: SignatureType,
        funderAddress?: string,
    ) {
        this.host = host;
        if (signer !== undefined) {
            if (signer.provider == null || !signer.provider._isProvider) {
                throw new Error("signer not connected to a provider!");
            }
            this.signer = signer;
        }
        if (creds !== undefined) {
            this.creds = creds;
        }
        this.orderBuilder = new OrderBuilder(signer as Wallet | JsonRpcSigner, signatureType, funderAddress);
    }

    // Public endpoints
    public async getOk(): Promise<any> {
        return get(`${this.host}/`);
    }

    public async getServerTime(): Promise<any> {
        return get(`${this.host}${TIME}`);
    }

    public async getOrderBook(tokenID: string): Promise<any> {
        return get(`${this.host}${GET_ORDER_BOOK}?market=${tokenID}`);
    }

    public async getMidpoint(tokenID: string): Promise<any> {
        return get(`${this.host}${MIDPOINT}?market=${tokenID}`);
    }

    public async getPrice(tokenID: string, side: string): Promise<any> {
        return get(`${this.host}${PRICE}?market=${tokenID}&side=${side}`);
    }

    public async getLastTradePrice(tokenID: string, side: string): Promise<any> {
        return get(`${this.host}${GET_LAST_TRADE_PRICE}?market=${tokenID}&side=${side}`);
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
        const headers = await createL1Headers(this.signer as Wallet | JsonRpcSigner, nonce);
        const resp = await post(endpoint, headers);
        return resp;
    }

    /**
     * Derives an existing API key for a user
     * @param nonce
     * @returns ApiKeyCreds
     */
    public async deriveApiKey(nonce?: number): Promise<ApiKeyCreds> {
        this.canL1Auth();

        const endpoint = `${this.host}${DERIVE_API_KEY}`;
        const headers = await createL1Headers(this.signer as Wallet | JsonRpcSigner, nonce);
        const resp = await get(endpoint, headers);
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

    public async getOrderHistory(params?: FilterParams): Promise<OrderHistory> {
        this.canL2Auth();
        const endpoint = ORDER_HISTORY;
        const l2HeaderArgs = {
            method: GET,
            requestPath: endpoint,
        };

        const headers = await createL2Headers(
            this.signer as Wallet | JsonRpcSigner,
            this.creds as ApiKeyCreds,
            l2HeaderArgs,
        );

        const url = addQueryParamsToUrl(`${this.host}${endpoint}`, params);
        return get(url, headers);
    }

    public async getTradeHistory(params?: FilterParams): Promise<TradeHistory> {
        this.canL2Auth();

        const endpoint = TRADE_HISTORY;
        const headerArgs = {
            method: GET,
            requestPath: endpoint,
        };

        const headers = await createL2Headers(
            this.signer as Wallet | JsonRpcSigner,
            this.creds as ApiKeyCreds,
            headerArgs,
        );

        const url = addQueryParamsToUrl(`${this.host}${endpoint}`, params);
        return get(url, headers);
    }

    public async createLimitOrder(userOrder: UserLimitOrder): Promise<LimitOrderAndSignature> {
        this.canL1Auth();

        const orderAndSig = await this.orderBuilder.buildLimitOrder(userOrder);
        return orderAndSig;
    }

    public async createMarketOrder(userOrder: UserMarketOrder): Promise<MarketOrderAndSignature> {
        this.canL1Auth();

        const orderAndSig = await this.orderBuilder.buildMarketOrder(userOrder);
        return orderAndSig;
    }

    public async getOpenOrders(params?: FilterParams): Promise<OpenOrdersResponse> {
        this.canL2Auth();
        const endpoint = OPEN_ORDERS;
        const l2HeaderArgs = {
            method: GET,
            requestPath: endpoint,
        };

        const headers = await createL2Headers(
            this.signer as Wallet | JsonRpcSigner,
            this.creds as ApiKeyCreds,
            l2HeaderArgs,
        );

        const url = addQueryParamsToUrl(`${this.host}${endpoint}`, params);
        return get(url, headers);
    }

    public async postOrder(order: LimitOrderAndSignature | MarketOrderAndSignature): Promise<any> {
        this.canL2Auth();
        const endpoint = POST_ORDER;
        const orderPayload =
            order.orderType === "limit"
                ? limitOrderToJson(order as LimitOrderAndSignature)
                : marketOrderToJson(order as MarketOrderAndSignature);
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
        return post(`${this.host}${endpoint}`, headers, orderPayload);
    }

    public async cancelOrder(payload: OrderPayload): Promise<any> {
        this.canL2Auth();
        const endpoint = CANCEL;
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
