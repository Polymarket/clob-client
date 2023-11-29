import { ethers } from "ethers";
import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
import { ApiKeyCreds, Chain, ClobClient } from "../src";

dotenvConfig({ path: resolve(__dirname, "../.env") });

async function main() {
    const wallet = new ethers.Wallet(`${process.env.PK}`);
    const chainId = parseInt(`${process.env.CHAIN_ID || Chain.MUMBAI}`) as Chain;
    console.log(`Address: ${await wallet.getAddress()}, chainId: ${chainId}`);

    const host = process.env.CLOB_API_URL || "http://localhost:8080";
    const creds: ApiKeyCreds = {
        key: `${process.env.CLOB_API_KEY}`,
        secret: `${process.env.CLOB_SECRET}`,
        passphrase: `${process.env.CLOB_PASS_PHRASE}`,
    };
    const clobClient = new ClobClient(host, chainId, wallet, creds);

    console.log(
        await clobClient.getOpenOrders({
            asset_id:
                // eslint-disable-next-line max-len
                "16678291189211314787145083999015737376658799626183230671758641503291735614088", // NO
            owner: creds.key,
        }),
    );
    console.log(
        await clobClient.getOpenOrders({
            asset_id:
                // eslint-disable-next-line max-len
                "1343197538147866997676250008839231694243646439454152539053893078719042421992", // YES
            owner: creds.key,
        }),
    );

    console.log(
        await clobClient.getOpenOrders({
            market: "0xbd31dc8a20211944f6b70f31557f1001557b59905b7738480ca09bd4532f84af",
            owner: creds.key,
        }),
    );
}

main();
