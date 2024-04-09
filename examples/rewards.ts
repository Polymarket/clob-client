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
        "today earnings",
        await clobClient.getEarningsForUserForDay("2024-04-09" /* UTC TIME */),
    );
    console.log("rewards percentages", await clobClient.getRewardPercentages());
    console.log("current rewards", await clobClient.getCurrentRewards());
    console.log(
        "rewards for market",
        await clobClient.getRawRewardsForMarket(
            "0xbd31dc8a20211944f6b70f31557f1001557b59905b7738480ca09bd4532f84af",
        ),
    );
    console.log(
        "rewards",
        await clobClient.getUserEarningsAndMarketsConfig(
            "2024-04-09" /* UTC TIME */,
            "earnings",
            "DESC",
        ),
    );
}

main();
