import { JsonRpcSigner } from "@ethersproject/providers";
import { Wallet } from "@ethersproject/wallet";
import { buildClobEip712Signature, buildPolyHmacSignature } from "../signing";
import { ApiKeyCreds, Chain, L1PolyHeader, L2HeaderArgs, L2PolyHeader, L2WithBuilderHeader } from "../types";
import { BuilderApiKeyCreds, BuilderHeaderPayload, BuilderSigner } from "@polymarket/builder-signing-sdk";

export const createL1Headers = async (
    signer: Wallet | JsonRpcSigner,
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
    const address = await signer.getAddress();

    const headers = {
        POLY_ADDRESS: address,
        POLY_SIGNATURE: sig,
        POLY_TIMESTAMP: `${ts}`,
        POLY_NONCE: `${n}`,
    };
    return headers;
};

export const createL2Headers = async (
    signer: Wallet | JsonRpcSigner,
    creds: ApiKeyCreds,
    l2HeaderArgs: L2HeaderArgs,
    timestamp?: number,
): Promise<L2PolyHeader> => {
    let ts = Math.floor(Date.now() / 1000);
    if (timestamp !== undefined) {
        ts = timestamp;
    }
    const address = await signer.getAddress();

    const sig = buildPolyHmacSignature(
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

export const createBuilderHeaders = async (
    builderCreds: BuilderApiKeyCreds,
    l2Header: L2PolyHeader,
    l2HeaderArgs: L2HeaderArgs,
): Promise<L2WithBuilderHeader> => {
    const signer = new BuilderSigner(builderCreds);
    const builderHeaders = signer.createBuilderHeaderPayload(
        l2HeaderArgs.method,
        l2HeaderArgs.requestPath,
        l2HeaderArgs.body,
    );

    return injectBuilderHeaders(l2Header, builderHeaders);
};

export const injectBuilderHeaders = (
    l2Header: L2PolyHeader,
    builderHeaders: BuilderHeaderPayload,
): L2WithBuilderHeader => {
    return {
        POLY_ADDRESS: l2Header.POLY_ADDRESS,
        POLY_SIGNATURE: l2Header.POLY_SIGNATURE,
        POLY_TIMESTAMP: l2Header.POLY_TIMESTAMP,
        POLY_API_KEY: l2Header.POLY_API_KEY,
        POLY_PASSPHRASE: l2Header.POLY_PASSPHRASE,
        POLY_BUILDER_API_KEY: builderHeaders.POLY_BUILDER_API_KEY,
        POLY_BUILDER_PASSPHRASE: builderHeaders.POLY_BUILDER_PASSPHRASE,
        POLY_BUILDER_TIMESTAMP: builderHeaders.POLY_BUILDER_TIMESTAMP,
        POLY_BUILDER_SIGNATURE: builderHeaders.POLY_BUILDER_SIGNATURE,
    };
}

