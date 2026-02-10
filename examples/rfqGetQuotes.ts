import { ethers } from "ethers";
import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
import type { ApiKeyCreds } from "../src/index.ts";
import { Chain, ClobClient } from "../src/index.ts";

dotenvConfig({ path: resolve(import.meta.dirname, "../.env") });

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

    // Example: Get quotes on your requests (requester view)
    // Returns quotes that others have made on your requests
    const requesterQuotes = await clobClient.rfq.getRfqRequesterQuotes({
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
        offset: "MA==",                 // Pagination offset
    });
    console.log("Requester quotes:", requesterQuotes);

    // Example: Get quotes you have made (quoter view)
    // Returns quotes that you have made on others' requests
    const quoterQuotes = await clobClient.rfq.getRfqQuoterQuotes({
        state: "active",
        limit: 10,
    });
    console.log("Quoter quotes:", quoterQuotes);
}

main();
