import { ethers } from "ethers";
import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
import { ApiKeyCreds, ClobClient, Side } from "../src";

dotenvConfig({ path: resolve(__dirname, "../.env") });

async function main() {
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const pk = new ethers.Wallet(`${process.env.PK}`);
    const wallet = pk.connect(provider);
    console.log(`Address: ${await wallet.getAddress()}`);

    const host = process.env.CLOB_API_URL || "http://localhost:8080";
    const creds: ApiKeyCreds = {
        key: `${process.env.CLOB_API_KEY}`,
        secret: `${process.env.CLOB_SECRET}`,
        passphrase: `${process.env.CLOB_PASS_PHRASE}`,
    };
    const clobClient = new ClobClient(host, wallet, creds);

    // YES: 16678291189211314787145083999015737376658799626183230671758641503291735614088
    // Create a market buy order, using 100 USDC to buy as many tokens as possible
    // Note: Size in market buy is the COLLATERAL size used to initiate the buy
    // While in a market sell, size is the amount of YES/NO tokens used to initiate the sell
    const order = await clobClient.createMarketOrder({
        tokenID: "16678291189211314787145083999015737376658799626183230671758641503291735614088",
        side: Side.BUY,
        size: 100,
    });
    console.log(`Market order: `);
    console.log(order);

    // Send it to the server
    const resp = await clobClient.postOrder(order);
    console.log(resp);
    console.log(`Done!`);
}

main();
