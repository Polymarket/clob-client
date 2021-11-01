import { ethers } from "ethers";
import { ApiKeyCreds, Asset, ClobClient, Side } from "../src";
import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";

dotenvConfig({ path: resolve(__dirname, "../.env") });


async function main(){
    const provider = new ethers.providers.JsonRpcProvider(`https://kovan.infura.io/v3/${process.env.INFURA_KEY}`);
    const pk = new ethers.Wallet(`${process.env.PK}`);
    const wallet = pk.connect(provider);
    console.log(`Address: ${await wallet.getAddress()}`);
    
    const host = "http://localhost:8080";
    const creds: ApiKeyCreds = {
        key: `${process.env.CLOB_API_KEY}`,
        secret: `${process.env.CLOB_SECRET}`,
        passphrase: `${process.env.CLOB_PASS_PHRASE}`,
    }
    const clobClient = new ClobClient(host, wallet, creds);

    const orders = [
        {side: Side.Buy, price: 0.10, size: 1000},
        {side: Side.Buy, price: 0.40, size: 80},
        {side: Side.Buy, price: 0.44, size: 60},
        {side: Side.Buy, price: 0.50, size: 40},

        {side: Side.Sell, price: 0.60, size: 30},
        {side: Side.Sell, price: 0.60, size: 75},
        {side: Side.Sell, price: 0.75, size: 50},
        {side: Side.Sell, price: 0.99, size: 1000},
    ]

    for(const newOrder of orders){
        await clobClient.postOrder(
            await clobClient.createOrder({
                asset: { 
                    address: "0xadbeD21409324e0fcB80AE8b5e662B0C857D85ed",
                    condition: "YES",
                },
                side: newOrder.side,
                price: newOrder.price,
                size: newOrder.size,
        }));
    }
    console.log(`Done!`)
}

main();