import "mocha";
import { expect } from "chai";
import { buildClobEip712Signature } from "../../src/signing/eip712";
import { Wallet, providers } from "ethers";

describe("eip712", () => {
    let wallet: Wallet;
    beforeEach(() => {
        const provider = new providers.JsonRpcProvider(process.env.RPC_URL);
        const pk = new Wallet(`${process.env.PK}`);
        wallet = pk.connect(provider);
    });

    it("buildClobEip712Signature", async () => {
        const signature = await buildClobEip712Signature(wallet, 10000000, 23);
        expect(signature).not.null;
        expect(signature).not.undefined;
        expect(signature).not.empty;
        expect(signature).equal(
            "0x72cc01378ab0e724a9978956e9f1d8a21fd01e65dc23356c3ee3f1f30c56e7296bd87f2ddc2b53bcaf88e9b1a1ac2d0bddfbaac3c3d36e03f7f97f57c17e53cf1c",
        );
    });
});
