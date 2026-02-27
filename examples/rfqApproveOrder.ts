import { ethers } from "ethers";
import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
import type { ApiKeyCreds } from "../src/index.ts";
import { Chain, ClobClient } from "../src/index.ts";
// import { SignatureType } from "../src/index.ts";

dotenvConfig({ path: resolve(import.meta.dirname, "../.env") });

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
    // For EOA signature type
    const clobClient = new ClobClient(host, chainId, wallet, creds);

    // For Polymarket Gnosis safe signature type
    // const funderAddress = "0x05259a655099324da89B0fC4F8A29816DcECb510";
    // const clobClient = new ClobClient(host, chainId, wallet, creds, SignatureType.POLY_GNOSIS_SAFE, funderAddress);

    console.log("Approving order...");
    // approve the order
    const result = await clobClient.rfq.approveRfqOrder({
        requestId: "019a83a9-f4c7-7c96-9139-2da2b2d934ef",
        quoteId: "019a83d7-0a92-730a-a686-f45acaad1c80",
        expiration: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now, refers to the order expiry, not quote expiry. For quote expiry, check the server RFQ config.
    });
    console.log(result);
}

main(); 
