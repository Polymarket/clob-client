import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
import { Chain, ClobClient } from "../src";

dotenvConfig({ path: resolve(__dirname, "../.env") });

async function main() {
    const host = process.env.CLOB_API_URL || "http://localhost:8080";
    const chainId = parseInt(`${process.env.CHAIN_ID || Chain.AMOY}`) as Chain;
    const clobClient = new ClobClient(host, chainId);

    console.log("events", await clobClient.getMarketTradesEvents("condition_id"));
}

main();
