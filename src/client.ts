import { Wallet } from "@ethersproject/wallet";
import { JsonRpcSigner } from "@ethersproject/providers";
import { LimitOrderAndSignature, MarketOrderAndSignature } from "@polymarket/order-utils";
import { ApiKeyCreds, OrderPayload, UserLimitOrder, UserMarketOrder } from "./types";
import { createL1Headers, createL2Headers } from "./headers";
import { CREDS_CREATION_WARNING } from "./constants";
import { get, post } from "./http_helpers";
import { L1_AUTH_UNAVAILABLE_ERROR, L2_AUTH_NOT_AVAILABLE } from "./errors";
import { createLimitOrder, createMarketOrder, marketOrderToJson, orderToJson } from "./orders";
import { approveCollateral, approveConditionalToken } from "./approve";

export class ClobClient {
    readonly host: string;

    // Used to perform Level 1 authentication
    readonly signer?: Wallet | JsonRpcSigner;

    // Used to perform Level 2 authentication
    readonly creds?: ApiKeyCreds;

    constructor(host: string, signer?: Wallet | JsonRpcSigner, creds?: ApiKeyCreds) {
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
    }

    // Public endpoints
    public async getOk(): Promise<any> {
        const resp = await get(`${this.host}/`);
        return resp.data;
    }

    public async getServerTime(): Promise<any> {
        const resp = await get(`${this.host}/time`);
        return resp.data;
    }

    /**
     * Approve the signer on the necessary contracts
     * Note api keys are not needed
     */
    public async approve(): Promise<any> {
        this.canL1Auth();

        await approveCollateral(this.signer as Wallet | JsonRpcSigner);
    }

    // L1 Authed
    public async createApiKey(): Promise<any> {
        this.canL1Auth();

        const endpoint = `${this.host}/create-api-key`;
        const headers = await createL1Headers(this.signer as Wallet | JsonRpcSigner);
        const resp = await post(endpoint, headers);
        console.log(CREDS_CREATION_WARNING);
        return resp.data;
    }

    public async getApiKeys(): Promise<any> {
        this.canL2Auth();

        const endpoint = `/get-api-keys`;
        const headerArgs = {
            method: "GET",
            requestPath: endpoint,
        };

        const headers = await createL2Headers(
            this.signer as Wallet | JsonRpcSigner,
            this.creds as ApiKeyCreds,
            headerArgs,
        );

        const resp = await get(`${this.host}${endpoint}`, headers);
        return resp.data;
    }

    public async getTradeHistory(): Promise<any> {
        this.canL2Auth();

        const endpoint = `/trade-history`;
        const headerArgs = {
            method: "GET",
            requestPath: endpoint,
        };

        const headers = await createL2Headers(
            this.signer as Wallet | JsonRpcSigner,
            this.creds as ApiKeyCreds,
            headerArgs,
        );

        const resp = await get(`${this.host}${endpoint}`, headers);
        return resp.data;
    }

    public async createLimitOrder(userOrder: UserLimitOrder): Promise<LimitOrderAndSignature> {
        this.canL1Auth();
        await approveConditionalToken(this.signer as Wallet | JsonRpcSigner, userOrder.asset.address);

        const orderAndSig = await createLimitOrder(this.signer as Wallet | JsonRpcSigner, userOrder);
        return orderAndSig;
    }

    public async createMarketOrder(userOrder: UserMarketOrder): Promise<MarketOrderAndSignature> {
        this.canL1Auth();
        await approveConditionalToken(this.signer as Wallet | JsonRpcSigner, userOrder.asset.address);

        const orderAndSig = await createMarketOrder(this.signer as Wallet | JsonRpcSigner, userOrder);
        return orderAndSig;
    }

    public async getOpenOrders(): Promise<any> {
        this.canL2Auth();
        const endpoint = "/open-orders";
        const l2HeaderArgs = {
            method: "GET",
            requestPath: endpoint,
        };

        const headers = await createL2Headers(
            this.signer as Wallet | JsonRpcSigner,
            this.creds as ApiKeyCreds,
            l2HeaderArgs,
        );

        const resp = await get(`${this.host}${endpoint}`, headers);
        return resp.data;
    }

    // TODO: we're currently exposing 2 endpoints: postLimit/postMarket
    // move to a single endpoint /order endpoint and route to different
    // flows on the tracker based on orderType
    public async postLimitOrder(order: LimitOrderAndSignature): Promise<any> {
        this.canL2Auth();
        const endpoint = `/order`;
        const orderPayload = orderToJson(order);
        const l2HeaderArgs = {
            method: "POST",
            requestPath: endpoint,
            body: JSON.stringify(orderPayload),
        };

        const headers = await createL2Headers(
            this.signer as Wallet | JsonRpcSigner,
            this.creds as ApiKeyCreds,
            l2HeaderArgs,
        );
        // TODO: add an api response type to types
        const resp = await post(`${this.host}${endpoint}`, headers, orderPayload);
        return resp.data;
    }

    public async postMarketOrder(order: MarketOrderAndSignature): Promise<any> {
        this.canL2Auth();
        const endpoint = `/market-order`;
        const orderPayload = marketOrderToJson(order);
        const l2HeaderArgs = {
            method: "POST",
            requestPath: endpoint,
            body: JSON.stringify(orderPayload),
        };

        const headers = await createL2Headers(
            this.signer as Wallet | JsonRpcSigner,
            this.creds as ApiKeyCreds,
            l2HeaderArgs,
        );
        // TODO: add an api response type to types
        const resp = await post(`${this.host}${endpoint}`, headers, orderPayload);
        return resp.data;
    }

    public async cancelOrder(payload: OrderPayload): Promise<any> {
        this.canL2Auth();
        const endpoint = `/cancel-order`;
        const l2HeaderArgs = {
            method: "POST",
            requestPath: endpoint,
            body: JSON.stringify(payload),
        };

        const headers = await createL2Headers(
            this.signer as Wallet | JsonRpcSigner,
            this.creds as ApiKeyCreds,
            l2HeaderArgs,
        );

        // TODO: add an api response type to types
        const resp = await post(`${this.host}${endpoint}`, headers, payload);
        return resp.data;
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
