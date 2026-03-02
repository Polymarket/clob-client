import type { JsonRpcSigner } from "@ethersproject/providers";
import type { Wallet } from "@ethersproject/wallet";
import type { Account, Address, WalletClient } from "viem";

type TypedDataDomain = Record<string, unknown>;
type TypedDataTypes = Record<string, Array<{ name: string; type: string }>>;
type TypedDataValue = Record<string, unknown>;

type EthersSigner = Wallet | JsonRpcSigner;

export type ClobSigner = EthersSigner | WalletClient;

const isEthersTypedDataSigner = (signer: ClobSigner): signer is EthersSigner =>
    // eslint-disable-next-line no-underscore-dangle
    typeof (signer as EthersSigner)._signTypedData === "function";

const isWalletClientSigner = (signer: ClobSigner): signer is WalletClient =>
    typeof (signer as WalletClient).signTypedData === "function";

export const getWalletClientAddress = async (walletClient: WalletClient): Promise<Address> => {
    const accountAddress = walletClient.account?.address;
    if (typeof accountAddress === "string" && accountAddress.length > 0) {
        return accountAddress as Address;
    }

    if (typeof walletClient.requestAddresses === "function") {
        const [address] = await walletClient.requestAddresses();
        if (typeof address === "string" && address.length > 0) {
            return address as Address;
        }
    }

    if (typeof walletClient.getAddresses === "function") {
        const [address] = await walletClient.getAddresses();
        if (typeof address === "string" && address.length > 0) {
            return address as Address;
        }
    }

    throw new Error("wallet client is missing account address");
};

export const getSignerAddress = async (signer: ClobSigner): Promise<string> => {
    if (isEthersTypedDataSigner(signer)) {
        return signer.getAddress();
    }

    if (isWalletClientSigner(signer)) {
        return getWalletClientAddress(signer);
    }

    throw new Error("unsupported signer type");
};

export const signTypedDataWithSigner = async ({
    signer,
    domain,
    types,
    value,
    primaryType,
}: {
    signer: ClobSigner;
    domain: TypedDataDomain;
    types: TypedDataTypes;
    value: TypedDataValue;
    primaryType?: string;
}): Promise<string> => {
    if (isEthersTypedDataSigner(signer)) {
        // eslint-disable-next-line no-underscore-dangle
        return signer._signTypedData(domain, types, value);
    }

    if (isWalletClientSigner(signer)) {
        const account: Account | Address = signer.account ?? await getWalletClientAddress(signer);
        return signer.signTypedData({
            account,
            domain,
            types,
            primaryType,
            message: value,
        } as Parameters<WalletClient["signTypedData"]>[0]);
    }

    throw new Error("unsupported signer type");
};
