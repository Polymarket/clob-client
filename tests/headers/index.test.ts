import "mocha";
import { expect } from "chai";
import { createL1Headers, createL2Headers } from "../../src/headers/index.ts";
import { Wallet } from "ethers";
import { Chain } from "../../src/types.ts";
import type { ApiKeyCreds } from "../../src/types.ts";
import type { WalletClient } from "viem";

describe("headers", () => {
    const chainId = Chain.AMOY;
    let wallet: Wallet;
    let creds: ApiKeyCreds;
    beforeEach(() => {
        // publicly known private key
        const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
        wallet = new Wallet(privateKey);

        creds = {
            key: "000000000-0000-0000-0000-000000000000",
            passphrase: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            secret: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
        };
    });

    describe("createL1Headers", async () => {
        it("no nonce", async () => {
            const l1Headers = await createL1Headers(wallet, chainId);
            expect(l1Headers).not.null;
            expect(l1Headers).not.undefined;

            expect(l1Headers.POLY_ADDRESS).equal(wallet.address);
            expect(l1Headers.POLY_SIGNATURE).not.empty;
            expect(l1Headers.POLY_TIMESTAMP).not.empty;
            expect(parseInt(l1Headers.POLY_TIMESTAMP) <= Math.floor(Date.now() / 1000)).true;
            expect(l1Headers.POLY_NONCE).equal("0");
        });

        it("nonce", async () => {
            const l1Headers = await createL1Headers(wallet, chainId, 1012);
            expect(l1Headers).not.null;
            expect(l1Headers).not.undefined;

            expect(l1Headers.POLY_ADDRESS).equal(wallet.address);
            expect(l1Headers.POLY_SIGNATURE).not.empty;
            expect(l1Headers.POLY_TIMESTAMP).not.empty;
            expect(parseInt(l1Headers.POLY_TIMESTAMP) <= Math.floor(Date.now() / 1000)).true;
            expect(l1Headers.POLY_NONCE).equal("1012");
        });

        it("wallet client signer", async () => {
            const accountAddress = "0x00000000000000000000000000000000000000a1";
            const walletClientMock = {
                account: { address: accountAddress },
                signTypedData: async (_args: unknown) => "0xdeadbeef",
            } as unknown as WalletClient;

            const l1Headers = await createL1Headers(walletClientMock, chainId, 3, 1700000000);
            expect(l1Headers.POLY_ADDRESS).equal(accountAddress);
            expect(l1Headers.POLY_SIGNATURE).equal("0xdeadbeef");
            expect(l1Headers.POLY_TIMESTAMP).equal("1700000000");
            expect(l1Headers.POLY_NONCE).equal("3");
        });
    });

    describe("createL2Headers", async () => {
        it("no body", async () => {
            const l2Headers = await createL2Headers(wallet, creds, {
                method: "get",
                requestPath: "/order",
            });
            expect(l2Headers).not.null;
            expect(l2Headers).not.undefined;

            expect(l2Headers.POLY_ADDRESS).equal(wallet.address);
            expect(l2Headers.POLY_SIGNATURE).not.empty;
            expect(l2Headers.POLY_TIMESTAMP).not.empty;
            expect(parseInt(l2Headers.POLY_TIMESTAMP) <= Math.floor(Date.now() / 1000)).true;
            expect(l2Headers.POLY_API_KEY).equal(creds.key);
            expect(l2Headers.POLY_PASSPHRASE).equal(creds.passphrase);
        });

        it("body", async () => {
            const l2Headers = await createL2Headers(wallet, creds, {
                method: "get",
                requestPath: "/order",
                body: '{"hash": "0x123"}',
            });
            expect(l2Headers).not.null;
            expect(l2Headers).not.undefined;

            expect(l2Headers.POLY_ADDRESS).equal(wallet.address);
            expect(l2Headers.POLY_SIGNATURE).not.empty;
            expect(l2Headers.POLY_TIMESTAMP).not.empty;
            expect(parseInt(l2Headers.POLY_TIMESTAMP) <= Math.floor(Date.now() / 1000)).true;
            expect(l2Headers.POLY_API_KEY).equal(creds.key);
            expect(l2Headers.POLY_PASSPHRASE).equal(creds.passphrase);
        });

        it("wallet client signer with requestAddresses fallback", async () => {
            const requestedAddress = "0x00000000000000000000000000000000000000a2";
            const walletClientMock = {
                signTypedData: async (_args: unknown) => "0xdeadbeef",
                requestAddresses: async () => [requestedAddress],
            } as unknown as WalletClient;

            const l2Headers = await createL2Headers(walletClientMock, creds, {
                method: "get",
                requestPath: "/order",
            }, 1700000000);

            expect(l2Headers.POLY_ADDRESS).equal(requestedAddress);
            expect(l2Headers.POLY_SIGNATURE).not.empty;
            expect(l2Headers.POLY_TIMESTAMP).equal("1700000000");
            expect(l2Headers.POLY_API_KEY).equal(creds.key);
            expect(l2Headers.POLY_PASSPHRASE).equal(creds.passphrase);
        });
    });
});
