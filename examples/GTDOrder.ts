import { ethers } from "ethers";
import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
import { ApiKeyCreds, Chain, ClobClient, OrderType, Side } from "../src";

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

    // Create a buy order for 100 YES for 0.50c with an expiration of 1 minute
    // We add an extra 10s because Clob has a security threshold of 10 seconds before canceling it.
    const YES = "71321045679252212594626385532706912750332728571942532289631379312455583992563";
    const oneMinute = parseInt(((new Date().getTime() + 60 * 1000 + 10 * 1000) / 1000).toString());

    const order = await clobClient.createOrder({
        tokenID: YES,
        price: 0.5,
        side: Side.SELL,
        size: 1000,
        expiration: oneMinute,
    });
    console.log("Created Order", order);

    // Send it to the server
    const resp = await clobClient.postOrder(order, OrderType.GTD);
    console.log(resp);

    // Create the order and send it to the server in a single step
    const resp2 = await clobClient.createAndPostOrder(
        {
            tokenID: YES,
            price: 0.5,
            side: Side.BUY,
            size: 100,
            expiration: oneMinute,
        },
        { tickSize: "0.01" },
        OrderType.GTD,
    );
    console.log(resp2);
}

main();
