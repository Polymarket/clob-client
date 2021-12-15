import { ethers } from "ethers";
import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
import { ApiKeyCreds, ClobClient, OrderPayload } from "../src";

dotenvConfig({ path: resolve(__dirname, "../.env") });

async function main() {
    const provider = new ethers.providers.JsonRpcProvider(process.env.ETH_RPC_URL);
    const pk = new ethers.Wallet(`${process.env.PK}`);
    const wallet = pk.connect(provider);
    console.log(`Address: ${await wallet.getAddress()}`);

    const host = "http://localhost:8080";
    // const host = "http://a9181e4b7f24c4ee48fa065683696f83-199534140.us-east-2.elb.amazonaws.com:8080";

    const creds: ApiKeyCreds = {
        key: `${process.env.CLOB_API_KEY}`,
        secret: `${process.env.CLOB_SECRET}`,
        passphrase: `${process.env.CLOB_PASS_PHRASE}`,
    };
    const clobClient = new ClobClient(host, wallet, creds);

    const payload: OrderPayload = {
        orderID: "0xb5bbb433248492fb7b4cea69275d7dec3b2f4514e9e98762082733e2c5cf0b9e",
    };

    // Send it to the server
    const resp = await clobClient.cancelOrder(payload);
    console.log(resp);
    console.log(`Done!`);
}

main();
