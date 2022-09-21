import { ethers } from "ethers";
import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
import { Chain, ClobClient } from "../src";

dotenvConfig({ path: resolve(__dirname, "../.env") });

async function main() {
    const wallet = new ethers.Wallet(`${process.env.PK}`);
    const chainId = parseInt(`${process.env.CHAIN_ID || Chain.MUMBAI}`) as Chain;
    console.log(`Address: ${await wallet.getAddress()}, chainId: ${chainId}`);

    const host = process.env.CLOB_API_URL || "http://localhost:8080";
    const clobClient = new ClobClient(host, chainId, wallet);

    console.log(`Price: `);
    const resp = await clobClient.getLastTradePrice(
        "16678291189211314787145083999015737376658799626183230671758641503291735614088",
    );
    console.log(resp);
}

main();
