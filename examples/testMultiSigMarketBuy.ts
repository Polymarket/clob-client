import { ethers } from "ethers";
import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
import { ApiKeyCreds, ClobClient, Side, SignatureType } from "../src";

dotenvConfig({ path: resolve(__dirname, "../.env") });

async function populateBook(client: ClobClient) {
    const orders = [
        { side: Side.SELL, price: 0.75, size: 100 },
        { side: Side.SELL, price: 0.5, size: 100 }, // 50
    ];

    for (const newOrder of orders) {
        await client.postOrder(
            await client.createLimitOrder({
                tokenID: "16678291189211314787145083999015737376658799626183230671758641503291735614088",
                side: newOrder.side,
                price: newOrder.price,
                size: newOrder.size,
            }),
        );
    }
}

async function market(client: ClobClient) {
    await client.postOrder(
        await client.createMarketOrder({
            tokenID: "16678291189211314787145083999015737376658799626183230671758641503291735614088",
            side: Side.BUY,
            size: 150,
        }),
    );
}

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

    // Create a clob client, using the CONTRACT signature scheme
    // and providing a multisig as funder address
    const clobPolyClient = new ClobClient(
        host,
        wallet,
        creds,
        SignatureType.CONTRACT,
        "0x5cc0c75CdB2235b453e22c9882fAa6945cD6Ec71",
    );

    await populateBook(clobPolyClient);
    await market(clobPolyClient);

    console.log(`Done!`);
}

main();
