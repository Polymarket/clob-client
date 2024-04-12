import { ethers } from "ethers";
import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
import { ApiKeyCreds, Chain, ClobClient, Side } from "../src";
import { SignatureType } from "@polymarket/order-utils";

dotenvConfig({ path: resolve(__dirname, "../.env") });

async function populateBook(client: ClobClient) {
    const orders = [
        { side: Side.SELL, price: 0.75, size: 100 },
        { side: Side.SELL, price: 0.5, size: 100 }, // 50
    ];

    let i = 0;
    for (const newOrder of orders) {
        await client.postOrder(
            await client.createOrder({
                tokenID:
                    // eslint-disable-next-line max-len
                    "52114319501245915516055106046884209969926127482827954674443846427813813222426", // NO
                side: newOrder.side,
                price: newOrder.price,
                size: newOrder.size,
                feeRateBps: 100,
                nonce: i++,
            }),
        );
    }
}

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

    // Create a clob client, using the poly proxy signature scheme
    // and providing the proxy address
    const clobPolyClient = new ClobClient(
        host,
        chainId,
        wallet,
        creds,
        SignatureType.POLY_PROXY,
        "0xb57af06b944df7df17b9661652f72b954286ee07",
    );

    await populateBook(clobPolyClient);

    console.log(`Done!`);
}

main();
