import { BigNumber, constants, ethers } from "ethers";
import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
import { Chain } from "../src";
import { getContractConfig } from "../src/config";
import { usdcAbi } from "./abi/usdcAbi";
import { ctfAbi } from "./abi/ctfAbi";

dotenvConfig({ path: resolve(__dirname, "../.env") });

/**
 * NegRisk markets require separate allowances
 * for the NegRiskCtfExchange and the NegRiskAdapter.
 */

export function getWallet(mainnetQ: boolean): ethers.Wallet {
    const pk = process.env.PK as string;
    const rpcToken: string = process.env.RPC_TOKEN as string;
    let rpcUrl = "";
    if (mainnetQ) {
        rpcUrl = `https://polygon-mainnet.g.alchemy.com/v2/${rpcToken}`;
    } else {
        rpcUrl = `https://polygon-amoy.g.alchemy.com/v2/${rpcToken}`;
    }
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    let wallet = new ethers.Wallet(pk);
    wallet = wallet.connect(provider);
    return wallet;
}

export function getUsdcContract(mainnetQ: boolean, wallet: ethers.Wallet): ethers.Contract {
    const chainId = mainnetQ ? 137 : 80002;
    const contractConfig = getContractConfig(chainId);
    return new ethers.Contract(contractConfig.collateral, usdcAbi, wallet);
}

export function getCtfContract(mainnetQ: boolean, wallet: ethers.Wallet): ethers.Contract {
    const chainId = mainnetQ ? 137 : 80002;
    const contractConfig = getContractConfig(chainId);
    return new ethers.Contract(contractConfig.conditionalTokens, ctfAbi, wallet);
}

async function main() {
    // --------------------------
    // SET MAINNET OR AMOY HERE
    const isMainnet = false;
    // --------------------------
    const wallet = getWallet(isMainnet);
    const chainId = parseInt(`${process.env.CHAIN_ID || Chain.AMOY}`) as Chain;
    console.log(`Address: ${await wallet.getAddress()}, chainId: ${chainId}`);

    const contractConfig = getContractConfig(chainId);
    const usdc = getUsdcContract(isMainnet, wallet);
    const ctf = getCtfContract(isMainnet, wallet);

    console.log(`usdc: ${usdc.address}`);
    console.log(`ctf: ${ctf.address}`);

    const usdcAllowanceNegRiskAdapter = (await usdc.allowance(
        wallet.address,
        contractConfig.negRiskAdapter,
    )) as BigNumber;
    console.log(`usdcAllowanceNegRiskAdapter: ${usdcAllowanceNegRiskAdapter}`);
    const usdcAllowanceNegRiskExchange = (await usdc.allowance(
        wallet.address,
        contractConfig.negRiskExchange,
    )) as BigNumber;
    const conditionalTokensAllowanceNegRiskExchange = (await ctf.isApprovedForAll(
        wallet.address,
        contractConfig.negRiskExchange,
    )) as BigNumber;
    const conditionalTokensAllowanceNegRiskAdapter = (await ctf.isApprovedForAll(
        wallet.address,
        contractConfig.negRiskAdapter,
    )) as BigNumber;

    let txn;

    // for splitting through the NegRiskAdapter
    if (!usdcAllowanceNegRiskAdapter.gt(constants.Zero)) {
        txn = await usdc.approve(contractConfig.negRiskAdapter, constants.MaxUint256, {
            gasPrice: 100_000_000_000,
            gasLimit: 200_000,
        });
        console.log(`Setting USDC allowance for NegRiskAdapter: ${txn.hash}`);
    }
    if (!usdcAllowanceNegRiskExchange.gt(constants.Zero)) {
        txn = await usdc.approve(contractConfig.negRiskExchange, constants.MaxUint256, {
            gasPrice: 100_000_000_000,
            gasLimit: 200_000,
        });
        console.log(`Setting USDC allowance for NegRiskExchange: ${txn.hash}`);
    }
    if (!conditionalTokensAllowanceNegRiskExchange) {
        txn = await ctf.setApprovalForAll(contractConfig.negRiskExchange, true, {
            gasPrice: 100_000_000_000,
            gasLimit: 200_000,
        });
        console.log(`Setting Conditional Tokens allowance for NegRiskExchange: ${txn.hash}`);
    }
    if (!conditionalTokensAllowanceNegRiskAdapter) {
        txn = await ctf.setApprovalForAll(contractConfig.negRiskAdapter, true, {
            gasPrice: 100_000_000_000,
            gasLimit: 200_000,
        });
        console.log(`Setting Conditional Tokens allowance for NegRiskAdapter: ${txn.hash}`);
    }
    console.log("Allowances set");
}

main();
