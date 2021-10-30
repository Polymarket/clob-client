import { JsonRpcSigner } from "@ethersproject/providers";
import { Wallet } from "@ethersproject/wallet";
import { buildClobEip712Signature } from "../signing";

export const createApiKeyHeaders = async (signer: Wallet | JsonRpcSigner): Promise<any> => {
    const now = Math.floor(Date.now() / 1000);
    const sig = await buildClobEip712Signature(signer, now);
    const address = await signer.getAddress();

    const headers = {
        POLY_ADDRESS: address,
        POLY_SIGNATURE: sig,
        POLY_TIMESTAMP: `${now}`,
    };
    return headers;
};
