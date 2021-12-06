import { ethers } from "ethers";
import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
import { ApiKeyCreds, ClobClient, Side } from "../src";

dotenvConfig({ path: resolve(__dirname, "../.env") });

async function populateBook(client: ClobClient) {
    const orders = [
        { side: Side.SELL, price: 0.75, size: 100 },
        { side: Side.SELL, price: 0.5, size: 100 }, // 50
    ];

    for (const newOrder of orders) {
        await client.postLimitOrder(
            await client.createLimitOrder({
                asset: {
                    address: "0xadbeD21409324e0fcB80AE8b5e662B0C857D85ed",
                    condition: "YES",
                },
                side: newOrder.side,
                price: newOrder.price,
                size: newOrder.size,
            }),
        );
    }
}

async function market(client: ClobClient) {
    await client.postMarketOrder(
        await client.createMarketOrder({
            asset: {
                address: "0xadbeD21409324e0fcB80AE8b5e662B0C857D85ed",
                condition: "YES",
            },
            side: Side.BUY,
            size: 150,
        }),
    );
}

async function main() {
    const provider = new ethers.providers.JsonRpcProvider(`https://kovan.infura.io/v3/${process.env.INFURA_KEY}`);
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
    await populateBook(clobClient);
    await market(clobClient);

    console.log(`Done!`);
}

main();
