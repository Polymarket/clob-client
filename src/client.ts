import { Wallet } from "@ethersproject/wallet";
import { JsonRpcSigner } from "@ethersproject/providers";
import { LimitOrderAndSignature } from "@polymarket/order-utils";
import { ApiKeyCreds, UserOrder } from "./types";
import { createL1Headers, createL2Headers } from "./headers";
import { CREDS_CREATION_WARNING } from "./constants";
import { get, post } from "./helpers";
import { L1_AUTH_UNAVAILABLE_ERROR, L2_AUTH_NOT_AVAILABLE } from "./errors";
import { createOrder } from "./orders";
import { orderToJson } from "./orders/utils";

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

        const endpoint = `${this.host}/get-api-keys`;
        const headerArgs = {
            method: "GET",
            requestPath: "/get-api-keys",
        };

        const headers = await createL2Headers(
            this.signer as Wallet | JsonRpcSigner,
            this.creds as ApiKeyCreds,
            headerArgs,
        );

        const resp = await get(endpoint, headers);
        return resp.data;
    }

    public async createOrder(userOrder: UserOrder): Promise<LimitOrderAndSignature> {
        this.canL1Auth();
        const orderAndSig = await createOrder(this.signer as Wallet | JsonRpcSigner, userOrder);
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


    // public async cancel(orderID: string): Promise<any> {
    //     this.canL2Auth();
    // }

    public async postOrder(order: LimitOrderAndSignature): Promise<any> {
        this.canL2Auth();
        const endpoint = `${this.host}/order`;
        const orderPayload = orderToJson(order);
        const l2HeaderArgs = {
            method: "POST",
            requestPath: "/order",
            body: JSON.stringify(orderPayload),
        };

        const headers = await createL2Headers(
            this.signer as Wallet | JsonRpcSigner,
            this.creds as ApiKeyCreds,
            l2HeaderArgs,
        );
        // TODO: add an api response type to types
        const resp = await post(endpoint, headers, orderPayload);
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

    // public async getApiKeys() {
    //     //TODO
    // }

    // public async postOrder() {
    //     // TODO
    // }

    // public async cancelOrder() {
    //     // TODO
    // }
}
