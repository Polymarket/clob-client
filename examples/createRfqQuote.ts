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
    
    const quote = await clobClient.createRfqQuote(
        {
            requestId: "0196ef6a-743a-72eb-bfb6-c32d831c4a4d",
            assetIn: "0",
            assetOut: "34097058504275310827233323421517291090691602969494795225921954353603704046623",
            amountIn: "50000000",
            amountOut: "100000000",
            userType: 0,
        }
    );
    console.log("rfqQuote - Quote", quote);
}

main();
