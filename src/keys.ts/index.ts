import { JsonRpcSigner } from "@ethersproject/providers";
import { Wallet } from "@ethersproject/wallet";
import { post } from "../helpers";
import { buildClobEip712Signature } from "../signing";

export const createApiKey = async (endpoint: string, signer: Wallet | JsonRpcSigner): Promise<any> => {
    const now = Math.floor(Date.now() / 1000);
    const sig = await buildClobEip712Signature(signer, now);
    const address = await signer.getAddress();

    const headers = {
        POLY_ADDRESS: address,
        POLY_SIGNATURE: sig,
        POLY_TIMESTAMP: `${now}`,
    };
    return post(endpoint, headers);
};
