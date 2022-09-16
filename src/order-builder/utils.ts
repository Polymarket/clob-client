import { getSignerFromWallet } from "@polymarket/order-utils";
import { JsonRpcProvider, JsonRpcSigner } from "@ethersproject/providers";
import { Wallet } from "@ethersproject/wallet";

export const getJsonRpcSigner = async (
    signer: Wallet | JsonRpcSigner,
    chainID: number,
): Promise<JsonRpcSigner> => {
    if (signer instanceof Wallet) {
        return getSignerFromWallet(signer, chainID, signer.provider as JsonRpcProvider);
    }
    return signer;
};
