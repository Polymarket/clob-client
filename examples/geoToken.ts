import { ethers } from "ethers";
import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
import { ApiKeyCreds, Chain, ClobClient, Side } from "../src";

dotenvConfig({ path: resolve(__dirname, "../.env") });

async function main() {
    const wallet = new ethers.Wallet(`${process.env.PK}`);
    const chainId = parseInt(`${process.env.CHAIN_ID || Chain.AMOY}`) as Chain;
    const geoBlockToken = process.env.GEO_BLOCK_TOKEN; // the geo block token
    console.log(`Address: ${await wallet.getAddress()}, chainId: ${chainId}`);

    const host = process.env.CLOB_API_URL || "http://localhost:8080";
    const creds: ApiKeyCreds = {
        key: `${process.env.CLOB_API_KEY}`,
        secret: `${process.env.CLOB_SECRET}`,
        passphrase: `${process.env.CLOB_PASS_PHRASE}`,
    };

    const clobClient = new ClobClient(
        host,
        chainId,
        wallet,
        creds,
        undefined,
        undefined,
        geoBlockToken,
    );

    // Create a buy order for 100 YES for 0.50c
    const YES = "71321045679252212594626385532706912750332728571942532289631379312455583992563";
    const order = await clobClient.createOrder(
        {
            tokenID: YES,
            price: 0.5,
            side: Side.BUY,
            size: 100,
        },
        { tickSize: "0.01" },
    );
    console.log("Created Order", order);

    // cancel all orders
    const resp = await clobClient.cancelAll();
    console.log(resp);
    console.log(`Done!`);
}

main();
