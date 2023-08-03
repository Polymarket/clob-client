import { ethers } from "ethers";
import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
import { ApiKeyCreds, Chain, ClobClient, PriceHistoryInterval, Side } from "../src";

dotenvConfig({ path: resolve(__dirname, "../.env") });

async function main() {
    const wallet = new ethers.Wallet(`${process.env.PK}`);
    const chainId = parseInt(`${process.env.CHAIN_ID || Chain.MUMBAI}`) as Chain;
    const geoBlockToken = process.env.GEO_BLOCK_TOKEN;
    console.log(`Address: ${await wallet.getAddress()}, chainId: ${chainId}`);

    const host = process.env.CLOB_API_URL || "http://localhost:8080";
    const creds: ApiKeyCreds = {
        key: `${process.env.CLOB_API_KEY}`,
        secret: `${process.env.CLOB_SECRET}`,
        passphrase: `${process.env.CLOB_PASS_PHRASE}`,
    };
    const geoClobClient = new ClobClient(
        host,
        chainId,
        wallet,
        creds,
        undefined,
        undefined,
        geoBlockToken,
    );

    const clobClient = new ClobClient(host, chainId, wallet, creds, undefined, undefined);

    // Create a buy order for 100 YES for 0.50c
    const YES = "1343197538147866997676250008839231694243646439454152539053893078719042421992";
    const order = await clobClient.createOrder(
        {
            tokenID: YES,
            price: 0.5,
            side: Side.BUY,
            size: 100,
        },
        "0.01",
    );
    console.log("Created Order", order);

    // cancel all orders
    const resp = await clobClient.cancelAll();
    console.log(resp);
    console.log(`Done!`);
}

main();
