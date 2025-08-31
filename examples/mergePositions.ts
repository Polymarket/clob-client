import { BigNumber, ethers } from "ethers";
import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
import { ApiKeyCreds, AssetType, Chain, ClobClient } from "../src";
import { getContractConfig } from "../src/config";
import { ctfAbi } from "./abi/ctfAbi";
import { END_CURSOR, INITIAL_CURSOR } from "../src/constants";

/**
 * Example script to automatically merge YES/NO positions.
 *
 * Usage:
 * 1. Copy `.env.example` to `.env` and fill in your credentials.
 * 2. Run `npm run merge-positions`.
 */

dotenvConfig({ path: resolve(__dirname, "../.env") });

async function main() {
    // --------------------------------------------------------------------
    // Fill in your own private key, RPC token and API credentials in .env
    // --------------------------------------------------------------------
    const pk = process.env.PK as string;
    const rpcToken = process.env.RPC_TOKEN as string;
    const host = process.env.CLOB_API_URL || "https://clob.polymarket.com";
    const chainId = parseInt(`${process.env.CHAIN_ID || Chain.AMOY}`) as Chain;

    const rpcUrl =
        chainId === Chain.POLYGON
            ? `https://polygon-mainnet.g.alchemy.com/v2/${rpcToken}`
            : `https://polygon-amoy.g.alchemy.com/v2/${rpcToken}`;
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(pk, provider);

    const creds: ApiKeyCreds = {
        key: `${process.env.CLOB_API_KEY || ""}`,
        secret: `${process.env.CLOB_SECRET || ""}`,
        passphrase: `${process.env.CLOB_PASS_PHRASE || ""}`,
    };

    const clobClient = new ClobClient(host, chainId, wallet, creds);
    const contractConfig = getContractConfig(chainId);
    const ctf = new ethers.Contract(contractConfig.conditionalTokens, ctfAbi, wallet);

    let nextCursor = INITIAL_CURSOR;
    while (nextCursor !== END_CURSOR) {
        const marketsResp = await clobClient.getMarkets(nextCursor);
        nextCursor = marketsResp.next_cursor;
        for (const market of marketsResp.data) {
            if (!market.tokens || market.tokens.length < 2) continue;
            const yesToken = market.tokens[0].token_id;
            const noToken = market.tokens[1].token_id;
            if (!yesToken || !noToken) continue;
            const conditionId = market.condition_id;

            const yesBalResp: any = await clobClient.getBalanceAllowance({
                asset_type: AssetType.CONDITIONAL,
                token_id: yesToken,
            });
            const noBalResp: any = await clobClient.getBalanceAllowance({
                asset_type: AssetType.CONDITIONAL,
                token_id: noToken,
            });
            if (yesBalResp.error || noBalResp.error) continue;
            if (!yesBalResp.balance || !noBalResp.balance) continue;
            const yesBal = BigNumber.from(yesBalResp.balance);
            const noBal = BigNumber.from(noBalResp.balance);
            if (yesBal.gt(0) && noBal.gt(0)) {
                const amount = yesBal.lt(noBal) ? yesBal : noBal;
                console.log(
                    `Merging ${ethers.utils.formatUnits(amount, 6)} shares for market ${
                        market.question || market.condition_id
                    }`,
                );
                const tx = await ctf.mergePositions(
                    contractConfig.collateral,
                    ethers.constants.HashZero,
                    conditionId,
                    [1, 2],
                    amount,
                    {
                        gasLimit: 200000,
                    },
                );
                console.log(`Submitted tx: ${tx.hash}`);
                await tx.wait();
                console.log("Merged");
            }
        }
    }
}

main().catch((err) => {
    console.error(err);
});
