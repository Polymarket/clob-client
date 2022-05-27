import { ethers } from "ethers";
import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
import { ApiKeyCreds, ClobClient } from "../src";

dotenvConfig({ path: resolve(__dirname, "../.env") });

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
    const clobClient = new ClobClient(host, wallet, creds);

    const YES_TOKEN_ID="16678291189211314787145083999015737376658799626183230671758641503291735614088"
    const NO_TOKEN_ID="1343197538147866997676250008839231694243646439454152539053893078719042421992"

    clobClient.getPrice(
      YES_TOKEN_ID,
      "buy"
    ).then((price:any)=> console.log('YES', 'BUY', price));

    clobClient.getPrice(
      YES_TOKEN_ID,
      "sell"
    ).then((price:any)=> console.log('YES', 'SELL', price));

    clobClient.getPrice(
      NO_TOKEN_ID,
      "buy"
    ).then((price:any)=> console.log('NO', 'BUY', price));
    
    clobClient.getPrice(
      NO_TOKEN_ID,
      "sell"
    ).then((price:any)=> console.log('NO', 'SELL', price));
}

main();
