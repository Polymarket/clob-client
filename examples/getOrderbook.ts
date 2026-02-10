import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
import { Chain, ClobClient } from "../src/index.ts";

dotenvConfig({ path: resolve(import.meta.dirname, "../.env") });

async function main() {
    const host = process.env.CLOB_API_URL || "http://localhost:8080";
    const chainId = parseInt(`${process.env.CHAIN_ID || Chain.AMOY}`) as Chain;
    const clobClient = new ClobClient(host, chainId);
    const YES = "34097058504275310827233323421517291090691602969494795225921954353603704046623";

    const orderbook = await clobClient.getOrderBook(YES);
    console.log("orderbook", orderbook);

    const hash = await clobClient.getOrderBookHash(orderbook);
    console.log("orderbook hash", hash);
}

main();
