import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
import { ClobClient } from "../src";

dotenvConfig({ path: resolve(__dirname, "../.env") });

async function main() {
    const host = "http://localhost:8080";
    const clobClient = new ClobClient(host);
    const resp = await clobClient.getOrderBook("16678291189211314787145083999015737376658799626183230671758641503291735614088")
    console.log(resp);
    /*
    {
        asks: [ { price: '0.60', size: '100', side: 'sell' } ],
        bids: [ { price: '0.40', size: '100', side: 'buy' } ]
    }
    */
}

main();
