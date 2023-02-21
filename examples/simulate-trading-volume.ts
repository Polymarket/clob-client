import { ethers } from "ethers";
import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
import { ApiKeyCreds, Chain, ClobClient, Side, UserOrder } from "../src";

dotenvConfig({ path: resolve(__dirname, "../.env") });

async function getClient(): Promise<ClobClient> {
    const wallet = new ethers.Wallet(`${process.env.PK}`);
    const chainId = parseInt(`${process.env.CHAIN_ID || Chain.MUMBAI}`) as Chain;
    const host = process.env.CLOB_API_URL || "http://localhost:8080";
    const creds: ApiKeyCreds = {
        key: `${process.env.CLOB_API_KEY}`,
        secret: `${process.env.CLOB_SECRET}`,
        passphrase: `${process.env.CLOB_PASS_PHRASE}`,
    };

    return new ClobClient(host, chainId, wallet, creds);
}

async function main() {
    const clobClient = await getClient();
    const YES = "1343197538147866997676250008839231694243646439454152539053893078719042421992";
    const ORDERS_QTY = 50; // <------ CHANGE THIS NUMBER TO INCREASE THE NUMBER OF ORDERS/TRADES PROCESSED AT THE SAME TIME.

    // BUYS
    console.log("BUYS");
    const buyOrder = {
        tokenID: YES,
        price: 0.5,
        side: Side.BUY,
        size: 100,
    } as UserOrder;

    const buyPromises: Promise<any>[] = [];
    for (let i = 0; i < ORDERS_QTY; i++) {
        buyPromises[i] = clobClient
            .postOrder(await clobClient.createOrder(buyOrder))
            .then(r => console.log(r.orderID, r.success, r.status));
    }

    await Promise.all(buyPromises);

    // SELLS
    console.log();
    console.log("SELLS");
    const sellOrder = {
        tokenID: YES,
        price: 0.5,
        side: Side.SELL,
        size: 100,
    } as UserOrder;

    const sellPromises: Promise<any>[] = [];
    for (let i = 0; i < ORDERS_QTY; i++) {
        sellPromises[i] = clobClient
            .postOrder(await clobClient.createOrder(sellOrder))
            .then(r => console.log(r.orderID, r.success, r.status));
    }

    await Promise.all(sellPromises);
}

main();
