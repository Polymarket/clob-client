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

    const host = process.env.CLOB_API_URL || "http://localhost:8080";
    const clobClient = new ClobClient(host, wallet);

    console.log(`Price: `);
    const resp = await clobClient.getLastTradePrice("16678291189211314787145083999015737376658799626183230671758641503291735614088", "buy");
    console.log(resp);
}

main();
