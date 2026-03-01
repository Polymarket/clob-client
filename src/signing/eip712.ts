import { MSG_TO_SIGN } from "./constants.ts";
import type { Chain } from "../types.ts";
import { getSignerAddress, signTypedDataWithSigner } from "../signer.ts";
import type { ClobSigner } from "../signer.ts";

/**
 * Builds the canonical Polymarket CLOB EIP712 signature
 * @param signer
 * @param ts
 * @returns string
 */
export const buildClobEip712Signature = async (
    signer: ClobSigner,
    chainId: Chain,
    timestamp: number,
    nonce: number,
): Promise<string> => {
    const address = await getSignerAddress(signer);
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
    const sig = await signTypedDataWithSigner({
        signer,
        domain,
        types,
        value,
        primaryType: "ClobAuth",
    });
    return sig;
};
