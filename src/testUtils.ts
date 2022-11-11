import { ethers } from "ethers";
import { BigNumber, constants, utils } from "ethers";
import { usdcAbi } from "./usdcabi";
import { ctfAbi } from "./ctfabi";
//import { Side } from "./types";
import {
    ZERO,
    MAINNET_CONTRACTS,
    MUMBAI_CONTRACTS,
    //MAINNET_HOST,
    //MUMBAI_HOST,
    MAINNET_MARKET,
    MUMBAI_MARKET,
    Contracts,
    Market,
} from "./testConstants";
//import { ClobClient } from "./client";

export function getWallet(mainnetQ: boolean, adminQ: boolean): ethers.Wallet {
    let pk: string;
    if (adminQ) {
        pk = process.env.PK as string;
    } else {
        pk = process.env.PKALT as string;
    }
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

export async function setup(mainnetQ: boolean, adminQ: boolean) {
    const wallet = getWallet(mainnetQ, adminQ);
    console.log(`Wallet Address: ${wallet.address}`);

    const usdc = getUsdcContract(mainnetQ, wallet);
    const ctf = getCtfContract(mainnetQ, wallet);

    let contracts: Contracts;
    let market: Market;

    if (mainnetQ) {
        contracts = MAINNET_CONTRACTS;
        market = MAINNET_MARKET;
    } else {
        contracts = MUMBAI_CONTRACTS;
        market = MUMBAI_MARKET;
    }

    let txn;

    if (!mainnetQ) {
        txn = await usdc.mint(wallet.address, utils.parseUnits("200", 6), {
            gasPrice: 100_000_000_000,
            gasLimit: 200_000,
        });
        console.log(`Minting Mumbai USDC: ${txn.hash}`);
    }

    console.log("Checking allowances...");

    const usdcAllowanceCtf = (await usdc.allowance(wallet.address, ctf.address)) as BigNumber;
    const usdcAllowanceExchange = (await usdc.allowance(
        wallet.address,
        contracts.Exchange,
    )) as BigNumber;
    const conditionalTokensAllowanceExchange = (await ctf.isApprovedForAll(
        wallet.address,
        contracts.Exchange,
    )) as BigNumber;
    if (!usdcAllowanceCtf.gt(ZERO)) {
        txn = await usdc.approve(contracts.Conditional, constants.MaxUint256, {
            gasPrice: 100_000_000_000,
            gasLimit: 200_000,
        });
        console.log(`Setting USDC allowance for CTF: ${txn.hash}`);
    }
    if (!usdcAllowanceExchange.gt(ZERO)) {
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

    console.log("Minting conditional tokens for orders...");

    const parentConditionId = constants.HashZero;
    const partition = [1, 2];
    const yesNoMintAmount = utils.parseUnits("100", 6);
    const yesNoMintTxn = await ctf.splitPosition(
        contracts.Collateral,
        parentConditionId,
        market.Condition,
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

/*

export async function getApiKey(adminQ: boolean): Promise<any> {
    const wallet = getWallet(adminQ);
    console.log("Getting API credentials...");
    let clobClient = new ClobClient(HOST, wallet);

    let creds;
    try {
        creds = (await clobClient.deriveApiKey()) as any;
        if (creds["apiKey"] != null) {
            creds["key"] = creds["apiKey"];
            return creds;
        }
    } catch {}
    await clobClient.createApiKey(0);
    return await getApiKey(adminQ);
}

export async function createOrder(adminQ: boolean, price: number, side: Side, size: number) {
    const wallet = getWallet(adminQ);
    const creds = await getApiKey(adminQ);
    const clobClient = new ClobClient(HOST, wallet, creds);

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

export async function makeTrade(adminQ: boolean, side: Side, size: number) {
    const wallet = getWallet(adminQ);
    const creds = await getApiKey(adminQ);
    const clobClient = new ClobClient(HOST, wallet, creds);

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

export async function getOrders(adminQ: boolean) {
    const wallet = getWallet(adminQ);
    const creds = await getApiKey(adminQ);

    const clobClient = new ClobClient(HOST, wallet, creds);

    console.log("Getting open orders...");
    let orders;
    orders = await clobClient.getOrders({ owner: creds["key"], market: yesTrump });
    console.log(orders);
}

export async function getTrades(adminQ: boolean) {
    const wallet = getWallet(adminQ);
    const creds = await getApiKey(adminQ);

    const clobClient = new ClobClient(HOST, wallet, creds);

    console.log("API credentials set");
    console.log("Getting trades");
    let trades;
    trades = await clobClient.getTrades({
        market: yesTrump,
        taker: wallet.address.toLowerCase(),
        limit: 100,
        after: "1666057902",
    });
    console.log(JSON.stringify(trades, null, 4));
    //console.log(trades);
}

export async function cancelAllOrders(adminQ: boolean) {
    const wallet = getWallet(adminQ);
    const creds = await getApiKey(adminQ);
    creds["key"] = creds["apiKey"];
    const clobClient = new ClobClient(HOST, wallet, creds);

    console.log("API credentials set");
    console.log("Cancelling open orders...");
    await clobClient.cancelAll();
}

export async function cancelOrder(adminQ: boolean, orderId: string) {
    const wallet = getWallet(adminQ);
    const creds = await getApiKey(adminQ);
    creds["key"] = creds["apiKey"];
    const clobClient = new ClobClient(HOST, wallet, creds);

    console.log("API credentials set");
    console.log("Cancelling order...");
    await clobClient.cancelOrder({ orderID: orderId });
}
*/
