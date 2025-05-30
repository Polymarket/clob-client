import { ethers } from "ethers";
import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
import { ApiKeyCreds, Chain, ClobClient, OrderType, PostOrdersArgs, Side } from "../src";

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

    await clobClient.cancelAll();

    const YES = "71321045679252212594626385532706912750332728571942532289631379312455583992563";
    const orders: PostOrdersArgs[] = [
        {
            order: await clobClient.createOrder({
                tokenID: YES,
                price: 0.4,
                side: Side.BUY,
                size: 100,
            }),
            orderType: OrderType.GTC,
        },
        {
            order: await clobClient.createOrder({
                tokenID: YES,
                price: 0.45,
                side: Side.BUY,
                size: 100,
            }),
            orderType: OrderType.GTC,
        },
        {
            order: await clobClient.createOrder({
                tokenID: YES,
                price: 0.55,
                side: Side.SELL,
                size: 100,
            }),
            orderType: OrderType.GTC,
        },
        {
            order: await clobClient.createOrder({
                tokenID: YES,
                price: 0.6,
                side: Side.SELL,
                size: 100,
            }),
            orderType: OrderType.GTC,
        },
    ];

    // Send it to the server
    const resp = await clobClient.postOrders(orders);
    console.log(resp);
}

main();
