import { BigNumber, constants, ethers } from "ethers";
import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
import { Chain } from "../src";
import { usdcAbi } from "./abi/usdcAbi";
import { ctfAbi } from "./abi/ctfAbi";
import { getContracts } from "@polymarket/order-utils";

dotenvConfig({ path: resolve(__dirname, "../.env") });

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
        const mainnetContracts = getContracts(137);
        return new ethers.Contract(mainnetContracts.Collateral, usdcAbi, wallet);
    }
    const mumbaiContracts = getContracts(80001);
    return new ethers.Contract(mumbaiContracts.Collateral, usdcAbi, wallet);
}

export function getCtfContract(mainnetQ: boolean, wallet: ethers.Wallet): ethers.Contract {
    if (mainnetQ) {
        const mainnetContracts = getContracts(137);
        return new ethers.Contract(mainnetContracts.Conditional, ctfAbi, wallet);
    }
    const mumbaiContracts = getContracts(80001);
    return new ethers.Contract(mumbaiContracts.Conditional, ctfAbi, wallet);
}

async function main() {
    // --------------------------
    // SET MAINNET OR MUMBAI HERE
    const isMainnet = false;
    // --------------------------
    const wallet = getWallet(isMainnet);
    const chainId = parseInt(`${process.env.CHAIN_ID || Chain.MUMBAI}`) as Chain;
    console.log(`Address: ${await wallet.getAddress()}, chainId: ${chainId}`);

    const contracts = getContracts(isMainnet ? 137 : 80001);
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
