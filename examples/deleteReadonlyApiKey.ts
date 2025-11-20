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

    // Replace with the readonly API key you want to delete
    const readonlyApiKey = "019a9fdb-2fe8-7555-a050-91d20a72fc1a";

    console.log(`Deleting readonly API key: ${readonlyApiKey}...`);
    const resp = await clobClient.deleteReadonlyApiKey(readonlyApiKey);
    console.log(`Response:`, resp);
    console.log(`Success: ${resp}`);
    console.log(`Complete!`);
}

main();

