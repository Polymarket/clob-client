import { ethers } from "ethers";
import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
import { ApiKeyCreds, Chain, ClobClient, Side } from "../src";

dotenvConfig({ path: resolve(__dirname, "../.env") });

async function main() {
    const wallet = new ethers.Wallet(`${process.env.PK}`);
    const chainId = parseInt(`${process.env.CHAIN_ID || Chain.AMOY}`) as Chain;
    console.log(`Address: ${await wallet.getAddress()}, chainId: ${chainId}`);

    const host = process.env.CLOB_API_URL || "http://localhost:8080";
    const creds: ApiKeyCreds = {
        key: `${process.env.CLOB_API_KEY}`,
        secret: `${process.env.CLOB_SECRET}`,
        passphrase: `${process.env.CLOB_PASS_PHRASE}`,
    };
    const clobClient = new ClobClient(host, chainId, wallet, creds);

    const YES = "71321045679252212594626385532706912750332728571942532289631379312455583992563";
    const yes_bid = await clobClient.createOrder({
        tokenID: YES,
        price: 0.4,
        side: Side.BUY,
        size: 100,
        feeRateBps: 0,
        nonce: 0,
    });
    console.log("creating order", yes_bid);
    await clobClient.postOrder(yes_bid);

    const yes_ask = await clobClient.createOrder({
        tokenID: YES,
        price: 0.6,
        side: Side.SELL,
        size: 100,
        feeRateBps: 0,
        nonce: 0,
    });
    console.log("creating order", yes_ask);
    await clobClient.postOrder(yes_ask);

    const NO = "52114319501245915516055106046884209969926127482827954674443846427813813222426";
    const no_bid = await clobClient.createOrder({
        tokenID: NO,
        price: 0.4,
        side: Side.BUY,
        size: 100,
        feeRateBps: 0,
        nonce: 0,
    });
    console.log("creating order", no_bid);
    await clobClient.postOrder(no_bid);

    const no_ask = await clobClient.createOrder({
        tokenID: NO,
        price: 0.6,
        side: Side.SELL,
        size: 100,
        feeRateBps: 0,
        nonce: 0,
    });
    console.log("creating order", no_ask);
    await clobClient.postOrder(no_ask);

    console.log(`Done!`);
}

main();
