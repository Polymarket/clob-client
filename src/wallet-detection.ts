import { type Address, createPublicClient, getAddress, http, type PublicClient } from "viem";
import { polygon, polygonAmoy } from "viem/chains";
import { SignatureType } from "./order-utils/index.ts";
import type { Chain } from "./types.ts";

export interface WalletDetectionResult {
    signatureType: SignatureType;
    funderAddress: string;
}

const GNOSIS_SAFE_GET_OWNERS_SELECTOR = "0xa0e67e2b" as const;

function getViemChain(chainId: Chain) {
    switch (chainId) {
        case 137:
            return polygon;
        case 80002:
            return polygonAmoy;
        default:
            throw new Error(`Unsupported chainId for wallet detection: ${chainId}`);
    }
}

function ensurePublicClient(clientOrUrl: PublicClient | string, chainId?: Chain): PublicClient {
    if (typeof clientOrUrl === "string") {
        if (chainId === undefined) {
            throw new Error("chainId is required when providing an rpcUrl string");
        }
        return createPublicClient({
            chain: getViemChain(chainId),
            transport: http(clientOrUrl),
        });
    }
    return clientOrUrl;
}

/**
 * Detects whether a smart-contract wallet is a Polymarket Gnosis Safe or a
 * Polymarket Proxy by inspecting on-chain bytecode behaviour.
 *
 * Works by calling the Gnosis Safe `getOwners()` function on the address.
 * If the call returns data the wallet is a Safe; otherwise it is assumed to
 * be a Polymarket Proxy.
 *
 * @param funderAddress - The smart-contract wallet address to classify.
 * @param clientOrUrl   - A viem `PublicClient` **or** an RPC URL string.
 * @param chainId       - Required when `clientOrUrl` is a string.
 * @returns The matching `SignatureType`.
 */
export async function detectWalletType(
    funderAddress: string,
    clientOrUrl: PublicClient | string,
    chainId?: Chain,
): Promise<SignatureType> {
    const client = ensurePublicClient(clientOrUrl, chainId);
    const addr = getAddress(funderAddress) as Address;

    const code = await client.getCode({ address: addr });
    if (!code || code === "0x") {
        throw new Error(
            `No contract deployed at ${funderAddress}. ` +
                "If this is a plain EOA, omit the funderAddress parameter.",
        );
    }

    try {
        const result = await client.call({
            to: addr,
            data: GNOSIS_SAFE_GET_OWNERS_SELECTOR,
        });
        if (result.data && result.data.length > 2) {
            return SignatureType.POLY_GNOSIS_SAFE;
        }
    } catch {
        // getOwners() reverted → not a Safe
    }

    return SignatureType.POLY_PROXY;
}

/**
 * Resolves the full wallet configuration for a signer.
 *
 * When `funderAddress` is supplied but `signatureType` is not, the function
 * auto-detects the wallet type via an on-chain check (requires `clientOrUrl`).
 *
 * @returns `{ signatureType, funderAddress }` ready to pass into the
 *          `ClobClient` constructor or `OrderBuilder`.
 */
export async function resolveWalletConfig(
    signerAddress: string,
    options: {
        funderAddress?: string;
        signatureType?: SignatureType;
        clientOrUrl?: PublicClient | string;
        chainId?: Chain;
    },
): Promise<WalletDetectionResult> {
    const { funderAddress, signatureType, clientOrUrl, chainId } = options;

    if (signatureType !== undefined) {
        return {
            signatureType,
            funderAddress: funderAddress ?? signerAddress,
        };
    }

    if (!funderAddress || getAddress(funderAddress) === getAddress(signerAddress)) {
        return { signatureType: SignatureType.EOA, funderAddress: signerAddress };
    }

    if (!clientOrUrl) {
        throw new Error(
            "Cannot auto-detect wallet type without an RPC connection. " +
                "Provide signatureType explicitly, or pass an rpcUrl / publicClient.",
        );
    }

    const detected = await detectWalletType(funderAddress, clientOrUrl, chainId);
    return { signatureType: detected, funderAddress };
}
