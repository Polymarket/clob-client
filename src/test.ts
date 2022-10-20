import { ClobClient } from "./client";
import { Side } from "./types";
import { BigNumber, constants, utils } from "ethers";
import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
import config from "./config.json";
import { ethers } from "ethers";
import { usdcAbi } from "./usdcAbi";
import { ctfAbi } from "./ctfabi";
dotenvConfig({ path: resolve(__dirname, "../.env") });

enum BOT {
    ADMIN = 1,
    ARB,
    BOT_ONE,
    BOT_TWO,
}

export function getWallet(bot: BOT): ethers.Wallet {
    let pk = "";
    if (bot == BOT.ADMIN) {
        pk = config.admin.privateKey;
    } else if (bot == BOT.ARB) {
        pk = config.arb.privateKey;
    } else if (bot == BOT.BOT_ONE) {
        pk = config.bots.botOne.privateKey;
    } else if (bot == BOT.BOT_TWO) {
        pk = config.bots.botTwo.privateKey;
    }
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

const ZERO = BigNumber.from("0");
const HOST = "https://clob.polymarket.com";

export const USDC_MAINNET_ADDRESS = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
export const CTF_MAINNET_ADDRESS = "0x4D97DCd97eC945f40cF65F87097ACe5EA0476045";
export const LOP = "0xA5caFCC00E8D8E9121CC18B2DF279Eab5dE43bC5";
export const EXECUTOR = "0xb2a29463Df393a4CAef36541544715e6B48b80B7";

const conditionId = "0x41190eb9336ae73949c04f4900f9865092e69a57cf9c942a6157abf6ae8d16c6";

const yesTrump = "65818619657568813474341868652308942079804919287380422192892211131408793125422";
const noTrump = "7499310772839000939827460818108209122328490677343888452292252718053799772723";
const adminWallet = getWallet(BOT.ADMIN);
const usdc = getUsdcContract(adminWallet);
const ctf = getCtfContract(adminWallet);

export async function setup() {
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

export async function createOrder(price: number, side: Side, size: number) {
    console.log("Getting API credentials, ignore errors...");
    let clobClient = new ClobClient(HOST, adminWallet); // check version

    let creds;
    await clobClient.createApiKey(0);
    creds = (await clobClient.deriveApiKey()) as any;
    creds["key"] = creds["apiKey"];
    clobClient = new ClobClient(HOST, adminWallet, creds);

    console.log("API credentials set");

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
    let clobClient = new ClobClient(HOST, adminWallet); // check version

    let creds;
    await clobClient.createApiKey(0);
    creds = (await clobClient.deriveApiKey()) as any;
    creds["key"] = creds["apiKey"];
    clobClient = new ClobClient(HOST, adminWallet, creds);

    console.log("API credentials set");

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

export async function getOpenOrders() {
    const adminWallet = getWallet(BOT.ADMIN);
    console.log("Getting API credentials, ignore errors...");
    let clobClient = new ClobClient(HOST, adminWallet);

    let creds;
    try {
        await clobClient.createApiKey(0);
    } catch {}
    creds = (await clobClient.deriveApiKey()) as any;
    creds["key"] = creds["apiKey"];
    clobClient = new ClobClient(HOST, adminWallet, creds);

    console.log("API credentials set");
    console.log("Getting open orders...");
    let orders;
    orders = await clobClient.getOpenOrders({ owner: creds["key"], market: yesTrump });
    console.log(orders);
}

export async function getTrades() {
    const adminWallet = getWallet(BOT.ADMIN);
    console.log("Getting API credentials, ignore errors...");
    let clobClient = new ClobClient(HOST, adminWallet);

    let creds;
    try {
        await clobClient.createApiKey(0);
    } catch {}
    creds = (await clobClient.deriveApiKey()) as any;
    creds["key"] = creds["apiKey"];
    clobClient = new ClobClient(HOST, adminWallet, creds);

    console.log("API credentials set");
    console.log("Getting trades");
    let trades;
    trades = await clobClient.getTrades({
        market: yesTrump,
        taker: adminWallet.address.toLowerCase(),
        //maker: creds["key"],
        limit: 5,
        //after: "1666067902",
    });
    console.log(trades);
}

export async function cancelAllOrders() {
    const adminWallet = getWallet(BOT.ADMIN);
    console.log("Getting API credentials, ignore errors...");
    let clobClient = new ClobClient(HOST, adminWallet);

    let creds;
    try {
        await clobClient.createApiKey(0);
    } catch {}
    creds = (await clobClient.deriveApiKey()) as any;
    creds["key"] = creds["apiKey"];
    clobClient = new ClobClient(HOST, adminWallet, creds);

    console.log("API credentials set");
    console.log("Cancelling open orders...");
    await clobClient.cancelAll();
}
//setup().then((r) => console.log(r));
//createOrder(0.2, Side.BUY, 15).then((r) => console.log(r));
//getOpenOrders().then();
//cancelAllOrders().then();
//makeTrade(Side.SELL, 10).then();
getTrades().then();

// status empty in order post message:

/*
{
  success: true,
  errorMsg: '',
  orderID: '0x0d64bb64cd6c82a5410fff5483b5119b21e069d55f3173e7c055558f2fcb097c',
  transactionHash: '',
  status: ''
}
*/

// status not empty in post market order message

/*
{
  success: true,
  errorMsg: '',
  orderID: '0x25249782b559c1414eaca8be422d9b2d68aeb5cb23330b20cb9aaa9983e47784',
  transactionHash: '',
  status: 'matched' // why STATUS_PARTIAL_FILL? no associated trades
}
*/

// check refactored endpoints
// check get trades
// check get orders

// error: 'retrieving trades : rpc error: code = Internal desc = ERROR #22008 date/time field value out of range: "1666067902"'
// ^^ trades

// remove old methods from client

// orders returning old orders, want just live, what endpoint gives live?
