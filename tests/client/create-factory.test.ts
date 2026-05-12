import { ClobClient } from "../../src/client.ts";
import { SignatureType } from "../../src/order-utils/index.ts";
import { Chain } from "../../src/types.ts";
import type { ApiKeyCreds } from "../../src/types.ts";
import type { WalletClient } from "viem";

describe("ClobClient.create factory method", () => {
    const host = "http://localhost";
    const chainId = Chain.AMOY;
    const signerAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

    const walletClientMock = {
        account: { address: signerAddress },
        signTypedData: async (_args: unknown): Promise<string> => "0xdeadbeef",
    } as unknown as WalletClient;

    const creds: ApiKeyCreds = {
        key: "test-key",
        secret: "test-secret",
        passphrase: "test-passphrase",
    };

    it("creates an EOA client when no funderAddress is provided", async () => {
        const client = await ClobClient.create({
            host,
            chainId,
            signer: walletClientMock,
            creds,
        });

        expect(client).toBeInstanceOf(ClobClient);
        expect(client.orderBuilder.signatureType).toBe(SignatureType.EOA);
    });

    it("creates a client with explicit signatureType", async () => {
        const funder = "0x0000000000000000000000000000000000000042";
        const client = await ClobClient.create({
            host,
            chainId,
            signer: walletClientMock,
            creds,
            signatureType: SignatureType.POLY_PROXY,
            funderAddress: funder,
        });

        expect(client).toBeInstanceOf(ClobClient);
        expect(client.orderBuilder.signatureType).toBe(SignatureType.POLY_PROXY);
        expect(client.orderBuilder.funderAddress).toBe(funder);
    });

    it("creates a client without a signer", async () => {
        const client = await ClobClient.create({ host, chainId });
        expect(client).toBeInstanceOf(ClobClient);
    });

    it("throws when funderAddress differs from signer but no RPC is available", async () => {
        await expect(
            ClobClient.create({
                host,
                chainId,
                signer: walletClientMock,
                creds,
                funderAddress: "0x0000000000000000000000000000000000000042",
            }),
        ).rejects.toThrow("Cannot auto-detect wallet type without an RPC connection");
    });
});
