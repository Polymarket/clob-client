import { ethers } from "ethers";
import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
import { ApiKeyCreds, ClobClient } from "../src";

dotenvConfig({ path: resolve(__dirname, "../.env") });

async function main() {
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const pk = new ethers.Wallet(`${process.env.PK}`);
    const wallet = pk.connect(provider);
    console.log(`Address: ${await wallet.getAddress()}`);

    const host = "http://localhost:8080";
    const creds: ApiKeyCreds = {
        key: `${process.env.CLOB_API_KEY}`,
        secret: `${process.env.CLOB_SECRET}`,
        passphrase: `${process.env.CLOB_PASS_PHRASE}`,
    };
    const clobClient = new ClobClient(host, wallet, creds);

    const resp = await clobClient.getOpenOrders();
    console.log(resp);
    console.log(`Done!`);
}

main();
