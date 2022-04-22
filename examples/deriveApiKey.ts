import { ethers } from "ethers";
import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
import { ClobClient } from "../src";

dotenvConfig({ path: resolve(__dirname, "../.env") });

async function main() {
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const pk = new ethers.Wallet(`${process.env.PK}`);
    const wallet = pk.connect(provider);
    console.log(`Address: ${await wallet.getAddress()}`);

    const host = "http://localhost:8080";
    const clobClient = new ClobClient(host, wallet);

    console.log(`Response: `);
    const resp = await clobClient.deriveApiKey();
    console.log(resp);
    console.log(`Complete!`);
}

main();
