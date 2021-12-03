import { getSignerFromWallet } from "@polymarket/order-utils";
import { JsonRpcProvider, JsonRpcSigner } from "@ethersproject/providers";
import { Wallet } from "@ethersproject/wallet";

export const getTokenID = (condition: string): number => {
    switch (condition.toLowerCase()) {
        // TODO: assuming YES = 0, NO = 1, following the [Yes, No] structure
        // will be a problem for scalars, non binary markets, figure out fix
        case "yes":
            return 0;
        case "no":
            return 1;
        default:
            throw new Error("Invalid asset condition");
    }
};

export const getJsonRpcSigner = async (signer: Wallet | JsonRpcSigner, chainID: number): Promise<JsonRpcSigner> => {
    if (signer instanceof Wallet) {
        return getSignerFromWallet(signer, chainID, signer.provider as JsonRpcProvider);
    }
    return signer;
};
