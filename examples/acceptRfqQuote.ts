import { ethers } from "ethers";
import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
import { ApiKeyCreds, Chain, ClobClient,  } from "../src";

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

    console.log("Accepting quote...");
    // accept the quote
    const acceptedQuote = await clobClient.acceptRfqQuote({
        requestId: "01975c17-4cd2-747e-823e-a27735bfa2d0",
        quoteId: "01975c18-16d1-7b7d-8066-4f8c89358042",
        expiration: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
    });
    console.log("rfqQuote - Accepted Quote", acceptedQuote);

}

main().catch(error => {
    console.error("Error:", error);
    process.exit(1);
}); 
