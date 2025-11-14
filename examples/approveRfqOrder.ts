import { ethers } from "ethers";
import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
import { ApiKeyCreds, Chain, RfqClient } from "../src";

dotenvConfig({ path: resolve(__dirname, "../.env") });

async function main() {
    const wallet = new ethers.Wallet(`${process.env.PK}`);
    const chainId = parseInt(`${process.env.CHAIN_ID || Chain.AMOY}`) as Chain;
    const signerAddress = await wallet.getAddress();
    console.log(`Address: ${signerAddress}, chainId: ${chainId}`);

    const host = process.env.CLOB_API_URL || "http://localhost:8080";
    const key = `${process.env.CLOB_API_KEY}`;

    const creds: ApiKeyCreds = {
        key,
        secret: `${process.env.CLOB_SECRET}`,
        passphrase: `${process.env.CLOB_PASS_PHRASE}`,
    };
    const clobClient = new RfqClient(host, chainId, wallet, creds);

    console.log("Approving order...");
    // approve the order
    const approvedOrder = await clobClient.approveRfqOrder({
        requestId: "0197656d-56ee-74a4-a06a-3b179121f3bf",
        quoteId: "0197656f-7b33-78fa-9343-b6ef4c55f80f",
        expiration: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
    });
    console.log("rfqQuote - Approved Order", approvedOrder);
}

main(); 
