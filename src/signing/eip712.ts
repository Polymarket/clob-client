import { Wallet } from "@ethersproject/wallet";
import { JsonRpcSigner } from "@ethersproject/providers";
import { MSG_TO_SIGN } from "./constants";
import { Chain } from "src/types";

/**
 * Builds the canonical Polymarket CLOB EIP712 signature
 * @param signer
 * @param ts
 * @returns string
 */
export const buildClobEip712Signature = async (
    signer: Wallet | JsonRpcSigner,
    chainId: Chain,
    timestamp: number,
    nonce: number,
): Promise<string> => {
    const address = await signer.getAddress();
    const ts = `${timestamp}`;

    const domain = {
        name: "ClobAuthDomain",
        version: "1",
        chainId: chainId,
    };

    const types = {
        ClobAuth: [
            { name: "address", type: "address" },
            { name: "timestamp", type: "string" },
            { name: "nonce", type: "uint256" },
            { name: "message", type: "string" },
        ],
    };
    const value = {
        address,
        timestamp: ts,
        nonce,
        message: MSG_TO_SIGN,
    };
    // eslint-disable-next-line no-underscore-dangle
    const sig = await signer._signTypedData(domain, types, value);
    return sig;
};
