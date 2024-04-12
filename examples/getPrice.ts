import { ethers } from "ethers";
import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
import { ApiKeyCreds, Chain, ClobClient } from "../src";

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

    const YES_TOKEN_ID =
        "71321045679252212594626385532706912750332728571942532289631379312455583992563";
    const NO_TOKEN_ID =
        "52114319501245915516055106046884209969926127482827954674443846427813813222426";

    clobClient.getPrice(YES_TOKEN_ID, "buy").then((price: any) => console.log("YES", "BUY", price));
    clobClient
        .getPrice(YES_TOKEN_ID, "sell")
        .then((price: any) => console.log("YES", "SELL", price));
    clobClient.getPrice(NO_TOKEN_ID, "buy").then((price: any) => console.log("NO", "BUY", price));
    clobClient.getPrice(NO_TOKEN_ID, "sell").then((price: any) => console.log("NO", "SELL", price));
}

main();
