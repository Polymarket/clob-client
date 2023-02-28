import { BigNumber, constants, ethers } from "ethers";
import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
import { Chain } from "../src";
import { usdcAbi } from "./abi/usdcAbi";
import { ctfAbi } from "./abi/ctfAbi";

dotenvConfig({ path: resolve(__dirname, "../.env") });

export const MUMBAI_CONTRACTS = {
    Exchange: "0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E",
    Collateral: "0x2E8DCfE708D44ae2e406a1c02DFE2Fa13012f961",
    Conditional: "0x7D8610E9567d2a6C9FBf66a5A13E9Ba8bb120d43",
};

export const MAINNET_CONTRACTS = {
    Exchange: "0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E",
    Collateral: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    Conditional: "0x4D97DCd97eC945f40cF65F87097ACe5EA0476045",
};

export function getWallet(mainnetQ: boolean): ethers.Wallet {
    const pk = process.env.PK as string;
    const rpcToken: string = process.env.RPC_TOKEN as string;
    let rpcUrl: string = "";
    if (mainnetQ) {
        rpcUrl = `https://polygon-mainnet.g.alchemy.com/v2/${rpcToken}`;
    } else {
        rpcUrl = `https://polygon-mumbai.g.alchemy.com/v2/${rpcToken}`;
    }
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    let wallet = new ethers.Wallet(pk);
    wallet = wallet.connect(provider);
    return wallet;
}

export function getUsdcContract(mainnetQ: boolean, wallet: ethers.Wallet): ethers.Contract {
    if (mainnetQ) {
        return new ethers.Contract(MAINNET_CONTRACTS.Collateral, usdcAbi, wallet);
    }
    return new ethers.Contract(MUMBAI_CONTRACTS.Collateral, usdcAbi, wallet);
}

export function getCtfContract(mainnetQ: boolean, wallet: ethers.Wallet): ethers.Contract {
    if (mainnetQ) {
        return new ethers.Contract(MAINNET_CONTRACTS.Conditional, ctfAbi, wallet);
    }
    return new ethers.Contract(MUMBAI_CONTRACTS.Conditional, ctfAbi, wallet);
}

async function main() {
    // --------------------------
    // SET MAINNET OR MUMBAI HERE
    const isMainnet = false;
    // --------------------------
    const wallet = getWallet(isMainnet);
    const chainId = parseInt(`${process.env.CHAIN_ID || Chain.MUMBAI}`) as Chain;
    console.log(`Address: ${await wallet.getAddress()}, chainId: ${chainId}`);

    const contracts = isMainnet ? MAINNET_CONTRACTS : MUMBAI_CONTRACTS;
    const usdc = getUsdcContract(isMainnet, wallet);
    const ctf = getCtfContract(isMainnet, wallet);

    console.log(`usdc: ${usdc.address}`);
    console.log(`ctf: ${ctf.address}`);

    const usdcAllowanceCtf = (await usdc.allowance(wallet.address, ctf.address)) as BigNumber;
    console.log(`usdcAllowanceCtf: ${usdcAllowanceCtf}`);
    const usdcAllowanceExchange = (await usdc.allowance(
        wallet.address,
        contracts.Exchange,
    )) as BigNumber;
    const conditionalTokensAllowanceExchange = (await ctf.isApprovedForAll(
        wallet.address,
        contracts.Exchange,
    )) as BigNumber;

    let txn;

    if (!usdcAllowanceCtf.gt(constants.Zero)) {
        txn = await usdc.approve(contracts.Conditional, constants.MaxUint256, {
            gasPrice: 100_000_000_000,
            gasLimit: 200_000,
        });
        console.log(`Setting USDC allowance for CTF: ${txn.hash}`);
    }
    if (!usdcAllowanceExchange.gt(constants.Zero)) {
        txn = await usdc.approve(contracts.Exchange, constants.MaxUint256, {
            gasPrice: 100_000_000_000,
            gasLimit: 200_000,
        });
        console.log(`Setting USDC allowance for Exchange: ${txn.hash}`);
    }
    if (!conditionalTokensAllowanceExchange) {
        txn = await ctf.setApprovalForAll(contracts.Exchange, true, {
            gasPrice: 100_000_000_000,
            gasLimit: 200_000,
        });
        console.log(`Setting Conditional Tokens allowance for Exchange: ${txn.hash}`);
    }
    console.log("Allowances set");
}

main();
