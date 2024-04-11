import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
import { Chain, ClobClient } from "../src";

dotenvConfig({ path: resolve(__dirname, "../.env") });

async function main() {
    const host = process.env.CLOB_API_URL || "http://localhost:8080";
    const chainId = parseInt(`${process.env.CHAIN_ID || Chain.AMOY}`) as Chain;
    const clobClient = new ClobClient(host, chainId);

    console.log("market", await clobClient.getMarket("condition_id"));

    console.log("markets", await clobClient.getMarkets());

    console.log("simplified markets", await clobClient.getSimplifiedMarkets());

    console.log("sampling markets", await clobClient.getSamplingMarkets());

    console.log("sampling simplified markets", await clobClient.getSamplingSimplifiedMarkets());
}

main();
