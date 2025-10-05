import { ethers } from "ethers";
import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
import { ApiKeyCreds, Chain, ClobClient } from "../src";
import { BuilderApiKeyCreds, BuilderConfig } from "@polymarket/builder-signing-sdk";

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

    const builderCreds: BuilderApiKeyCreds = {
        key: `${process.env.BUILDER_API_KEY}`,
        secret: `${process.env.BUILDER_SECRET}`,
        passphrase: `${process.env.BUILDER_PASS_PHRASE}`,
    };
    const builderConfig = new BuilderConfig({
        localBuilderCreds: builderCreds
    });
    // const builderConfig = new BuilderConfig({
    //     remoteBuilderSignerUrl: "http://localhost:8080/sign"
    // });
    const clobClient = new ClobClient(host, chainId, wallet, creds, undefined, undefined, undefined, false, builderConfig);

    const trades = await clobClient.getBuilderTrades();
    console.log(trades);
    console.log(`Done!`);
}

main();