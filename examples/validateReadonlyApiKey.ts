import { ethers } from "ethers";
import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
import { Chain, ClobClient } from "../src";

dotenvConfig({ path: resolve(__dirname, "../.env") });

async function main() {
    const wallet = new ethers.Wallet(`${process.env.PK}`);
    const chainId = parseInt(`${process.env.CHAIN_ID || Chain.AMOY}`) as Chain;
    const address = await wallet.getAddress();
    console.log(`Address: ${address}, chainId: ${chainId}`);

    const host = process.env.CLOB_API_URL || "http://localhost:8080";
    // Note: validateReadonlyApiKey is a public endpoint, so we don't need creds
    const clobClient = new ClobClient(host, chainId);

    // Replace with your readonly API key to validate
    const readonlyApiKey = process.env.READONLY_API_KEY || "your-readonly-api-key-here";

    console.log(`Validating readonly API key for address ${address}...`);
    const resp = await clobClient.validateReadonlyApiKey(address, readonlyApiKey);
    console.log(`Response:`, resp);
    console.log(`Complete!`);
}

main();

