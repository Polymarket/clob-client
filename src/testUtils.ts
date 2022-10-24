import { ethers } from "ethers";
import { BigNumber, constants, utils } from "ethers";
import { usdcAbi } from "./usdcabi";
import { ctfAbi } from "./ctfabi";
import { Side } from "./types";
import {
    USDC_MAINNET_ADDRESS,
    CTF_MAINNET_ADDRESS,
    LOP,
    ZERO,
    EXECUTOR,
    conditionId,
    HOST,
    yesTrump,
} from "./testConstants";
import { ClobClient } from "./client";

export function getWallet(): ethers.Wallet {
    const pk = process.env.PK as string;
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    let wallet = new ethers.Wallet(pk);
    wallet = wallet.connect(provider);
    return wallet;
}

export function getUsdcContract(wallet: ethers.Wallet): ethers.Contract {
    return new ethers.Contract(USDC_MAINNET_ADDRESS, usdcAbi, wallet);
}

export function getCtfContract(wallet: ethers.Wallet): ethers.Contract {
    return new ethers.Contract(CTF_MAINNET_ADDRESS, ctfAbi, wallet);
}

export async function setup() {
    const adminWallet = getWallet();
    const usdc = getUsdcContract(adminWallet);
    const ctf = getCtfContract(adminWallet);

    console.log("Checking allowances...");

    const usdcAllowanceCtf = (await usdc.allowance(adminWallet.address, CTF_MAINNET_ADDRESS)) as BigNumber;
    const usdcAllowanceLop = (await usdc.allowance(adminWallet.address, LOP)) as BigNumber;
    const usdcAllowanceExecutor = (await usdc.allowance(adminWallet.address, EXECUTOR)) as BigNumber;
    const conditionalTokensAllowanceLop = (await ctf.isApprovedForAll(adminWallet.address, LOP)) as BigNumber;
    const conditionalTokensAllowanceExecutor = (await ctf.isApprovedForAll(adminWallet.address, EXECUTOR)) as BigNumber;
    let txn;
    if (!usdcAllowanceCtf.gt(ZERO)) {
        txn = await usdc.approve(CTF_MAINNET_ADDRESS, constants.MaxUint256, {
            gasPrice: 100_000_000_000,
            gasLimit: 200_000,
        });
        console.log(`Setting USDC allowance for CTF: ${txn.hash}`);
    }
    if (!usdcAllowanceLop.gt(ZERO)) {
        txn = await usdc.approve(LOP, constants.MaxUint256, {
            gasPrice: 100_000_000_000,
            gasLimit: 200_000,
        });
        console.log(`Setting USDC allowance for LOP: ${txn.hash}`);
    }
    if (!usdcAllowanceExecutor.gt(ZERO)) {
        txn = await usdc.approve(EXECUTOR, constants.MaxUint256, {
            gasPrice: 100_000_000_000,
            gasLimit: 200_000,
        });
        console.log(`Setting USDC allowance for EXECUTOR: ${txn.hash}`);
    }
    if (!conditionalTokensAllowanceLop) {
        txn = await ctf.setApprovalForAll(LOP, true, {
            gasPrice: 100_000_000_000,
            gasLimit: 200_000,
        });
        console.log(`Setting Conditional Tokens allowance for LOP: ${txn.hash}`);
    }
    if (!conditionalTokensAllowanceExecutor) {
        txn = await ctf.setApprovalForAll(EXECUTOR, true, {
            gasPrice: 100_000_000_000,
            gasLimit: 200_000,
        });
        console.log(`Setting Conditional Tokens allowance for EXECUTOR: ${txn.hash}`);
    }
    console.log("Allowances set");

    console.log("Minting conditional tokens for orders...");

    const parentConditionId = constants.HashZero;
    const partition = [1, 2];
    const yesNoMintAmount = utils.parseUnits("15", 6);
    const yesNoMintTxn = await ctf.splitPosition(
        USDC_MAINNET_ADDRESS,
        parentConditionId,
        conditionId,
        partition,
        yesNoMintAmount,
        {
            gasPrice: 100_000_000_000,
            gasLimit: 200_000,
        },
    );

    console.log(`Waiting for minting txn to be mined: ${yesNoMintTxn.hash}`);
    yesNoMintTxn.wait();

    return;
}

export async function getApiKey(): Promise<any> {
    const adminWallet = getWallet();
    console.log("Getting API credentials...");
    let clobClient = new ClobClient(HOST, adminWallet);

    let creds;
    try {
        creds = (await clobClient.deriveApiKey()) as any;
        if (creds["apiKey"] != null) {
            creds["key"] = creds["apiKey"];
            return creds;
        }
    } catch {}
    await clobClient.createApiKey(0);
    return await getApiKey();
}

export async function createOrder(price: number, side: Side, size: number) {
    const adminWallet = getWallet();
    const creds = await getApiKey();
    const clobClient = new ClobClient(HOST, adminWallet, creds);

    console.log(`Placing order...`);

    let limitOrder;

    limitOrder = await clobClient.createLimitOrder({
        tokenID: yesTrump,
        price: price,
        side: side,
        size: size,
    });

    const resp = await clobClient.postOrder(limitOrder);
    console.log(resp);
}

export async function makeTrade(side: Side, size: number) {
    const adminWallet = getWallet();
    const creds = await getApiKey();
    const clobClient = new ClobClient(HOST, adminWallet, creds);

    console.log(`Placing market order...`);

    let marketOrder;

    marketOrder = await clobClient.createMarketOrder({
        tokenID: yesTrump,
        side: side,
        size: size,
    });

    const resp = await clobClient.postOrder(marketOrder);
    console.log(resp);
}

export async function getOrders() {
    const adminWallet = getWallet();
    const creds = await getApiKey();

    const clobClient = new ClobClient(HOST, adminWallet, creds);

    console.log("Getting open orders...");
    let orders;
    orders = await clobClient.getOrders({ owner: creds["key"], market: yesTrump });
    console.log(orders);
}

export async function getTrades() {
    const adminWallet = getWallet();
    const creds = await getApiKey();

    const clobClient = new ClobClient(HOST, adminWallet, creds);

    console.log("API credentials set");
    console.log("Getting trades");
    let trades;
    trades = await clobClient.getTrades({
        market: yesTrump,
        taker: adminWallet.address.toLowerCase(),
        limit: 100,
        after: "1666057902",
    });
    console.log(JSON.stringify(trades, null, 4));
    //console.log(trades);
}

export async function cancelAllOrders() {
    const adminWallet = getWallet();
    const creds = await getApiKey();
    creds["key"] = creds["apiKey"];
    const clobClient = new ClobClient(HOST, adminWallet, creds);

    console.log("API credentials set");
    console.log("Cancelling open orders...");
    await clobClient.cancelAll();
}
