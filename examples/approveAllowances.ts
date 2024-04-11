import { BigNumber, constants, ethers } from "ethers";
import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
import { Chain } from "../src";
import { getContractConfig } from "../src/config";
import { usdcAbi } from "./abi/usdcAbi";
import { ctfAbi } from "./abi/ctfAbi";

dotenvConfig({ path: resolve(__dirname, "../.env") });

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

    const usdcAllowanceCtf = (await usdc.allowance(wallet.address, ctf.address)) as BigNumber;
    console.log(`usdcAllowanceCtf: ${usdcAllowanceCtf}`);
    const usdcAllowanceExchange = (await usdc.allowance(
        wallet.address,
        contractConfig.exchange,
    )) as BigNumber;
    const conditionalTokensAllowanceExchange = (await ctf.isApprovedForAll(
        wallet.address,
        contractConfig.exchange,
    )) as BigNumber;

    let txn;

    if (!usdcAllowanceCtf.gt(constants.Zero)) {
        txn = await usdc.approve(contractConfig.conditionalTokens, constants.MaxUint256, {
            gasPrice: 100_000_000_000,
            gasLimit: 200_000,
        });
        console.log(`Setting USDC allowance for CTF: ${txn.hash}`);
    }
    if (!usdcAllowanceExchange.gt(constants.Zero)) {
        txn = await usdc.approve(contractConfig.exchange, constants.MaxUint256, {
            gasPrice: 100_000_000_000,
            gasLimit: 200_000,
        });
        console.log(`Setting USDC allowance for Exchange: ${txn.hash}`);
    }
    if (!conditionalTokensAllowanceExchange) {
        txn = await ctf.setApprovalForAll(contractConfig.exchange, true, {
            gasPrice: 100_000_000_000,
            gasLimit: 200_000,
        });
        console.log(`Setting Conditional Tokens allowance for Exchange: ${txn.hash}`);
    }
    console.log("Allowances set");
}

main();
