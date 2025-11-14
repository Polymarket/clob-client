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

    console.log("Getting RFQ configuration...");
    const config = await clobClient.rfqConfig();
    console.log("RFQ Configuration:", JSON.stringify(config, null, 2));
}

main().catch(error => {
    console.error("Error:", error);
    process.exit(1);
});
