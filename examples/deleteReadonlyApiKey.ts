import { ethers } from "ethers";
import { config as dotenvConfig } from "dotenv";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { Chain, ClobClient } from "../src/index.ts";
import type { ApiKeyCreds } from "../src/index.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
    const readonlyApiKey = "019abfc0-e060-7b10-a4eb-653a0e9e0e42";

    console.log(`Deleting readonly API key: ${readonlyApiKey}...`);
    const resp = await clobClient.deleteReadonlyApiKey(readonlyApiKey);
    console.log(`Response:`, resp);
    console.log(`Success: ${resp}`);
    console.log(`Complete!`);
}

main();

