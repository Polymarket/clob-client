import { JsonRpcSigner } from "@ethersproject/providers";
import { Wallet } from "@ethersproject/wallet";
import { buildClobEip712Signature, buildPolyHmacSignature } from "../signing";
import { ApiKeyCreds, Chain, L1PolyHeader, L2HeaderArgs, L2PolyHeader } from "../types";

export const createL1Headers = async (
    signer: Wallet | JsonRpcSigner,
    chainId: Chain,
    nonce?: number,
): Promise<L1PolyHeader> => {
    const ts = Math.floor(Date.now() / 1000);
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
    address?: string,
): Promise<L2PolyHeader> => {
    if (!address) {
        address = await signer.getAddress();
    }
    //const address = await signer.getAddress();
    const ts = Math.floor(Date.now() / 1000);

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
