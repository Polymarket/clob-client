import { ethers } from "ethers";
import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
import { ApiKeyCreds, Chain, ClobClient } from "../src";

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

    // Example: Get quotes with various filters
    const requests = await clobClient.getRfqRequests({
        // requestIds: ["0197656d-56ee-74a4-a06a-3b179121f3bf"],
        // userAddress: "0x0000000000000000000000000000000000000000",
        // state: "active",
        // markets: ["0x0000000000000000000000000000000000000000"],
        // sizeMin: 5,
        // sizeMax: 100,
        // priceMin: 0.1,
        // priceMax: 0.9,
        // sortBy: "price",
        // sortDir: "asc",
        limit: 10,
        offset: "MA==",
    });
    console.log("rfqRequests - Requests", requests);
}

main();
