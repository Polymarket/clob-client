import "mocha";
import { expect } from "chai";
import { buildClobEip712Signature } from "../../src/signing/eip712";
import { Chain } from "../../src/types";
import { Wallet } from "@ethersproject/wallet";

describe("eip712", () => {
    let wallet: Wallet;
    beforeEach(() => {
        // publicly known private key
        const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
        wallet = new Wallet(privateKey);
    });

    it("buildClobEip712Signature", async () => {
        const signature = await buildClobEip712Signature(wallet, Chain.AMOY, 10000000, 23);
        expect(signature).not.null;
        expect(signature).not.undefined;
        expect(signature).not.empty;
        expect(signature).equal(
            // eslint-disable-next-line max-len
            "0xf62319a987514da40e57e2f4d7529f7bac38f0355bd88bb5adbb3768d80de6c1682518e0af677d5260366425f4361e7b70c25ae232aff0ab2331e2b164a1aedc1b",
        );
    });
});
