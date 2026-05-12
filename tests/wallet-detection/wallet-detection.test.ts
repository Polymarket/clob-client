import type { PublicClient } from "viem";
import { SignatureType } from "../../src/order-utils/index.ts";
import { Chain } from "../../src/types.ts";
import { detectWalletType, resolveWalletConfig } from "../../src/wallet-detection.ts";

const GNOSIS_SAFE_GET_OWNERS_SELECTOR = "0xa0e67e2b";

function mockPublicClient(overrides: {
    getCode?: (args: { address: string }) => Promise<string | undefined>;
    call?: (args: { to: string; data: string }) => Promise<{ data?: string }>;
}): PublicClient {
    return {
        getCode: overrides.getCode ?? (async () => "0x1234"),
        call: overrides.call ?? (async () => ({ data: undefined })),
    } as unknown as PublicClient;
}

describe("detectWalletType", () => {
    it("throws when no code is deployed at the address", async () => {
        const client = mockPublicClient({
            getCode: async () => "0x",
        });

        await expect(
            detectWalletType("0x0000000000000000000000000000000000000001", client),
        ).rejects.toThrow("No contract deployed");
    });

    it("throws when getCode returns undefined", async () => {
        const client = mockPublicClient({
            getCode: async () => undefined,
        });

        await expect(
            detectWalletType("0x0000000000000000000000000000000000000001", client),
        ).rejects.toThrow("No contract deployed");
    });

    it("returns POLY_GNOSIS_SAFE when getOwners() returns data", async () => {
        const ownersResponseData =
            "0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000001000000000000000000000000aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";

        const client = mockPublicClient({
            getCode: async () => "0xabcdef",
            call: async (args) => {
                expect(args.data).toBe(GNOSIS_SAFE_GET_OWNERS_SELECTOR);
                return { data: ownersResponseData };
            },
        });

        const result = await detectWalletType(
            "0x0000000000000000000000000000000000000001",
            client,
        );
        expect(result).toBe(SignatureType.POLY_GNOSIS_SAFE);
    });

    it("returns POLY_PROXY when getOwners() call reverts", async () => {
        const client = mockPublicClient({
            getCode: async () => "0xabcdef",
            call: async () => {
                throw new Error("execution reverted");
            },
        });

        const result = await detectWalletType(
            "0x0000000000000000000000000000000000000001",
            client,
        );
        expect(result).toBe(SignatureType.POLY_PROXY);
    });

    it("returns POLY_PROXY when getOwners() returns empty data", async () => {
        const client = mockPublicClient({
            getCode: async () => "0xabcdef",
            call: async () => ({ data: "0x" }),
        });

        const result = await detectWalletType(
            "0x0000000000000000000000000000000000000001",
            client,
        );
        expect(result).toBe(SignatureType.POLY_PROXY);
    });

    it("returns POLY_PROXY when getOwners() returns no data field", async () => {
        const client = mockPublicClient({
            getCode: async () => "0xabcdef",
            call: async () => ({}),
        });

        const result = await detectWalletType(
            "0x0000000000000000000000000000000000000001",
            client,
        );
        expect(result).toBe(SignatureType.POLY_PROXY);
    });

    it("throws when rpcUrl is given without chainId", async () => {
        await expect(
            detectWalletType(
                "0x0000000000000000000000000000000000000001",
                "https://polygon-rpc.com",
            ),
        ).rejects.toThrow("chainId is required");
    });
});

describe("resolveWalletConfig", () => {
    const signerAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

    it("returns EOA when no funderAddress is provided", async () => {
        const result = await resolveWalletConfig(signerAddress, {});
        expect(result.signatureType).toBe(SignatureType.EOA);
        expect(result.funderAddress).toBe(signerAddress);
    });

    it("returns EOA when funderAddress equals signerAddress", async () => {
        const result = await resolveWalletConfig(signerAddress, {
            funderAddress: signerAddress,
        });
        expect(result.signatureType).toBe(SignatureType.EOA);
        expect(result.funderAddress).toBe(signerAddress);
    });

    it("uses explicit signatureType when provided", async () => {
        const funder = "0x0000000000000000000000000000000000000042";
        const result = await resolveWalletConfig(signerAddress, {
            funderAddress: funder,
            signatureType: SignatureType.POLY_PROXY,
        });
        expect(result.signatureType).toBe(SignatureType.POLY_PROXY);
        expect(result.funderAddress).toBe(funder);
    });

    it("uses signerAddress as funderAddress when signatureType is explicit but funder is omitted", async () => {
        const result = await resolveWalletConfig(signerAddress, {
            signatureType: SignatureType.EOA,
        });
        expect(result.signatureType).toBe(SignatureType.EOA);
        expect(result.funderAddress).toBe(signerAddress);
    });

    it("throws when funderAddress differs from signer but no RPC is available", async () => {
        await expect(
            resolveWalletConfig(signerAddress, {
                funderAddress: "0x0000000000000000000000000000000000000042",
            }),
        ).rejects.toThrow("Cannot auto-detect wallet type without an RPC connection");
    });

    it("auto-detects POLY_GNOSIS_SAFE via RPC", async () => {
        const funder = "0x0000000000000000000000000000000000000042";
        const client = mockPublicClient({
            getCode: async () => "0xabcdef",
            call: async () => ({
                data: "0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000001000000000000000000000000aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            }),
        });

        const result = await resolveWalletConfig(signerAddress, {
            funderAddress: funder,
            clientOrUrl: client,
            chainId: Chain.POLYGON,
        });
        expect(result.signatureType).toBe(SignatureType.POLY_GNOSIS_SAFE);
        expect(result.funderAddress).toBe(funder);
    });

    it("auto-detects POLY_PROXY via RPC", async () => {
        const funder = "0x0000000000000000000000000000000000000042";
        const client = mockPublicClient({
            getCode: async () => "0xabcdef",
            call: async () => {
                throw new Error("execution reverted");
            },
        });

        const result = await resolveWalletConfig(signerAddress, {
            funderAddress: funder,
            clientOrUrl: client,
            chainId: Chain.POLYGON,
        });
        expect(result.signatureType).toBe(SignatureType.POLY_PROXY);
        expect(result.funderAddress).toBe(funder);
    });
});
