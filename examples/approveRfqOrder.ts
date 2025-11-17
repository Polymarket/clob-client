import { ethers } from "ethers";
import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
import { ApiKeyCreds, Chain, ClobClient } from "../src";

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
    const clobClient = new ClobClient(host, chainId, wallet, creds);

    console.log("Approving order...");
    // approve the order
    const approvedOrder = await clobClient.rfq.approveRfqOrder({
        requestId: "019a83a9-f4c7-7c96-9139-2da2b2d934ef",
        quoteId: "019a83d7-0a92-730a-a686-f45acaad1c80",
        expiration: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
    });
    
    // Handle response with type-safe discriminated union
    if (approvedOrder.success) {
        console.log("✅ Order approved!");
        console.log("   Request ID:", approvedOrder.data.requestId);
        console.log("   Quote ID:", approvedOrder.data.quoteId);
        console.log("   Status:", approvedOrder.data.status);
    } else {
        console.error("❌ Error:", approvedOrder.error.code, "-", approvedOrder.error.message);
    }
}

main(); 
