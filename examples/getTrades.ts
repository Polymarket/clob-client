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

    console.log(
        await clobClient.getTrades({
            asset_id:
                // eslint-disable-next-line max-len
                "52114319501245915516055106046884209969926127482827954674443846427813813222426", // NO
            maker_address: await wallet.getAddress(),
        }),
    );
    console.log(
        await clobClient.getTrades({
            asset_id:
                // eslint-disable-next-line max-len
                "71321045679252212594626385532706912750332728571942532289631379312455583992563", // YES
            maker_address: await wallet.getAddress(),
        }),
    );
    console.log(
        await clobClient.getTrades({
            market: "0x5f65177b394277fd294cd75650044e32ba009a95022d88a0c1d565897d72f8f1",
            maker_address: await wallet.getAddress(),
        }),
    );

    // only first page - do not paginate
    console.log(
        await clobClient.getTrades(
            {
                market: "0x5f65177b394277fd294cd75650044e32ba009a95022d88a0c1d565897d72f8f1",
            },
            true,
        ),
    );
}

main();
