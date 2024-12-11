
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

    // only first page 
    console.log(
        await clobClient.getTradesPaginated({
            market: "0x5f65177b394277fd294cd75650044e32ba009a95022d88a0c1d565897d72f8f1",
            maker_address: await wallet.getAddress(),
        })
    );

    // fetch only second page 
    console.log(
        await clobClient.getTradesPaginated({
            market: "0x5f65177b394277fd294cd75650044e32ba009a95022d88a0c1d565897d72f8f1",
            maker_address: await wallet.getAddress(),
		}, "MzAw")
    );
}

main();