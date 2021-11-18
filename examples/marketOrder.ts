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

    // Create a market sell order for 150 YES tokens
    const order = await clobClient.createMarketOrder({
        asset: { 
            address: "0xadbeD21409324e0fcB80AE8b5e662B0C857D85ed",
            condition: "YES",
        },
        side: Side.SELL,
        size: 150,
    });


    // const order = await clobClient.createMarketOrder({
    //     asset: { 
    //         address: "0xadbeD21409324e0fcB80AE8b5e662B0C857D85ed",
    //         condition: "YES",
    //     },
    //     side: Side.BUY,
    //     size: 150,
    //     type: OrderType.MARKET,
    // });

    // Send it to the server
    const resp = await clobClient.postOrder(order);
    console.log(resp);
    console.log(`Done!`)
}

main();