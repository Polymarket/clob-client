import { ethers } from "ethers";
import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
import { Side as UtilsSide } from "@polymarket/order-utils";
import { ApiKeyCreds, Chain, ClobClient, Side } from "../src";

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
    
    // First create a signed order
    console.log("Creating order...");
    const signedOrder = await clobClient.createOrder({
        tokenID: "34097058504275310827233323421517291090691602969494795225921954353603704046623",
        price: 0.5, // Example price
        size: 1, // Example size
        side: Side.BUY,
        feeRateBps: 10, // 0.1%
        nonce: 1,
        expiration: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
        taker: "0xb2e4957625a2d9fC6bE4667Da890ACfd98167bD2",
    });

    
    console.log("Accepting quote...");
    const acceptedQuote = await clobClient.acceptRfqQuote({
        requestId: "your-request-id",
        quoteId: "your-quote-id",
        owner: key,
        ...signedOrder,
        expiration: parseInt(signedOrder.expiration),
        side: signedOrder.side === UtilsSide.BUY ? Side.BUY : Side.SELL,
        salt: parseInt(signedOrder.salt.toString())
    });
    console.log("rfqQuote - Accepted Quote", acceptedQuote);
}

main().catch(error => {
    console.error("Error:", error);
    process.exit(1);
}); 