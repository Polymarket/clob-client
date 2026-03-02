import { buildClobEip712Signature, buildPolyHmacSignature } from "../signing/index.ts";
import type { ApiKeyCreds, Chain, L1PolyHeader, L2HeaderArgs, L2PolyHeader, L2WithBuilderHeader } from "../types.ts";
import type { BuilderHeaderPayload } from "@polymarket/builder-signing-sdk";
import { getSignerAddress } from "../signer.ts";
import type { ClobSigner } from "../signer.ts";

export const createL1Headers = async (
    signer: ClobSigner,
    chainId: Chain,
    nonce?: number,
    timestamp?: number,
): Promise<L1PolyHeader> => {
    let ts = Math.floor(Date.now() / 1000);
    if (timestamp !== undefined) {
        ts = timestamp;
    }
    let n = 0; // Default nonce is 0
    if (nonce !== undefined) {
        n = nonce;
    }

    const sig = await buildClobEip712Signature(signer, chainId, ts, n);
    const address = await getSignerAddress(signer);

    const headers = {
        POLY_ADDRESS: address,
        POLY_SIGNATURE: sig,
        POLY_TIMESTAMP: `${ts}`,
        POLY_NONCE: `${n}`,
    };
    return headers;
};

export const createL2Headers = async (
    signer: ClobSigner,
    creds: ApiKeyCreds,
    l2HeaderArgs: L2HeaderArgs,
    timestamp?: number,
): Promise<L2PolyHeader> => {
    let ts = Math.floor(Date.now() / 1000);
    if (timestamp !== undefined) {
        ts = timestamp;
    }
    const address = await getSignerAddress(signer);

    const sig = await buildPolyHmacSignature(
        creds.secret,
        ts,
        l2HeaderArgs.method,
        l2HeaderArgs.requestPath,
        l2HeaderArgs.body,
    );

    const headers = {
        POLY_ADDRESS: address,
        POLY_SIGNATURE: sig,
        POLY_TIMESTAMP: `${ts}`,
        POLY_API_KEY: creds.key,
        POLY_PASSPHRASE: creds.passphrase,
    };

    return headers;
};

export const injectBuilderHeaders = (
    l2Header: L2PolyHeader,
    builderHeaders: BuilderHeaderPayload,
): L2WithBuilderHeader => ({
    ...l2Header,
    ...builderHeaders,
}) as L2WithBuilderHeader;
