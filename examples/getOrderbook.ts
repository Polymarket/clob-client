import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
import { Chain, ClobClient } from "../src";

dotenvConfig({ path: resolve(__dirname, "../.env") });

async function main() {
    const host = process.env.CLOB_API_URL || "http://localhost:8080";
    const chainId = parseInt(`${process.env.CHAIN_ID || Chain.AMOY}`) as Chain;
    const clobClient = new ClobClient(host, chainId);
    const YES = "71321045679252212594626385532706912750332728571942532289631379312455583992563";

    const orderbook = await clobClient.getOrderBook(YES);
    console.log("orderbook", orderbook);

    const hash = clobClient.getOrderBookHash(orderbook);
    console.log("orderbook hash", hash);
}

main();
