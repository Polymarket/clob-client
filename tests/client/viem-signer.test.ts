import "mocha";
import { expect } from "chai";
import { ClobClient } from "../../src/client.ts";
import { Chain } from "../../src/types.ts";
import type { ApiKeyCreds } from "../../src/types.ts";
import type { RequestOptions } from "../../src/http-helpers/index.ts";
import type { WalletClient } from "viem";

class TestableViemClient extends ClobClient {
    public lastHeaders?: RequestOptions["headers"];
    public nextGetResponse: any = {};
    public nextPostResponse: any = {};

    protected async get(_endpoint: string, options?: RequestOptions): Promise<any> {
        this.lastHeaders = options?.headers;
        return this.nextGetResponse;
    }

    protected async post(_endpoint: string, options?: RequestOptions): Promise<any> {
        this.lastHeaders = options?.headers;
        return this.nextPostResponse;
    }
}

describe("ClobClient viem signer support", () => {
    const host = "http://localhost";
    const chainId = Chain.AMOY;

    it("createApiKey works with WalletClient signer", async () => {
        const signerAddress = "0x00000000000000000000000000000000000000a1";
        const walletClientMock = {
            account: { address: signerAddress },
            signTypedData: async (_args: unknown): Promise<string> => "0xdeadbeef",
        } as unknown as WalletClient;

        const client = new TestableViemClient(host, chainId, walletClientMock);
        client.nextPostResponse = {
            apiKey: "k",
            secret: "s",
            passphrase: "p",
        };

        const response = await client.createApiKey();

        expect(response).to.deep.equal({
            key: "k",
            secret: "s",
            passphrase: "p",
        });
        expect(client.lastHeaders).to.deep.include({
            POLY_ADDRESS: signerAddress,
            POLY_SIGNATURE: "0xdeadbeef",
            POLY_NONCE: "0",
        });
    });

    it("getApiKeys works with WalletClient signer", async () => {
        const signerAddress = "0x00000000000000000000000000000000000000a2";
        const walletClientMock = {
            signTypedData: async (_args: unknown): Promise<string> => "0xdeadbeef",
            requestAddresses: async (): Promise<string[]> => [signerAddress],
        } as unknown as WalletClient;
        const creds: ApiKeyCreds = {
            key: "k",
            passphrase: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            secret: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
        };

        const client = new TestableViemClient(host, chainId, walletClientMock, creds);
        client.nextGetResponse = { apiKeys: [] };

        const response = await client.getApiKeys();

        expect(response).to.deep.equal({ apiKeys: [] });
        expect(client.lastHeaders).to.deep.include({
            POLY_ADDRESS: signerAddress,
            POLY_API_KEY: creds.key,
            POLY_PASSPHRASE: creds.passphrase,
        });
    });
});
