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
        const signature = await buildClobEip712Signature(wallet, Chain.MUMBAI, 10000000, 23);
        expect(signature).not.null;
        expect(signature).not.undefined;
        expect(signature).not.empty;
        expect(signature).equal(
            // eslint-disable-next-line max-len
            "0xd91760ebcb14e814e9e12600b9bc7cd6bf13ebc175f6a28538b4925763f94f90012da34dd71290d441c28bc4f9b2281d3eb9ecfd1c9a63db1ce9ca85c89c914c1b",
        );
    });
});
