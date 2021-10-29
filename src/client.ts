import { Wallet } from "@ethersproject/wallet";
import { JsonRpcSigner } from "@ethersproject/providers";
import { ApiKeyCreds } from "./types";
import { get } from "./helpers";
import { createApiKey } from "./keys.ts";

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
        if (this.signer === undefined) {
            // TODO: add some helpers to check and throw automatically
            throw new Error("Signer is needed to interact with this endpoint!");
        }

        const endpoint = `${this.host}/create-api-key`;
        const resp = await createApiKey(endpoint, this.signer);
        return resp.data;
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
