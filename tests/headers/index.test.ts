import "mocha";
import { expect } from "chai";
import { createL1Headers, createL2Headers } from "../../src/headers/index";
import { Wallet } from "ethers";
import { ApiKeyCreds, Chain } from "../../src/types";

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
    });
});
