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
    const quote = await clobClient.getRfqQuotes({
        // quoteIds: [""],
        // Optional filters
        state: "active",           // Filter by quote state
        // markets: [""],    // Filter by specific markets
        // sizeMin: 5,               // Minimum size
        // sizeMax: 100,             // Maximum size
        // priceMin: 0.1,            // Minimum price
        // priceMax: 0.9,            // Maximum price
        // sortBy: "price",          // Sort by price
        // sortDir: "asc",           // Sort ascending
        limit: 10,                // Limit results
        // offset: 0                 // Pagination offset
    });
    console.log("rfqQuote - Quote", quote);
}

main();