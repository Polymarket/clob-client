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
        "today earnings",
        await clobClient.getEarningsForUserForDay("2024-04-09" /* UTC TIME */),
    );
    console.log(
        "total earnings",
        await clobClient.getTotalEarningsForUserForDay("2024-04-09" /* UTC TIME */),
    );
    console.log("rewards percentages", await clobClient.getRewardPercentages());
    console.log("current rewards", await clobClient.getCurrentRewards());
    console.log(
        "rewards for market",
        await clobClient.getRawRewardsForMarket(
            "0x5f65177b394277fd294cd75650044e32ba009a95022d88a0c1d565897d72f8f1",
        ),
    );
    console.log(
        "rewards",
        await clobClient.getUserEarningsAndMarketsConfig(
            "2025-01-31" /* UTC TIME */,
            "earnings",
            "DESC",
            true,
        ),
    );
}

main();
