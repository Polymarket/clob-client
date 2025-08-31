import { BigNumber, ethers } from "ethers";
import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
import { ApiKeyCreds, AssetType, Chain, ClobClient } from "../src";
import { getContractConfig } from "../src/config";
import { ctfAbi } from "./abi/ctfAbi";
import { END_CURSOR, INITIAL_CURSOR } from "../src/constants";
import * as util from "util";

dotenvConfig({ path: resolve(__dirname, "../.env") });

const startedAt = Date.now();
const RAW_LIMIT = parseInt(process.env.RAW_LIMIT || "0", 10); // 0=无限制

const log = (...args: any[]) => console.log(new Date().toISOString(), "-", ...args);
const mask = (s?: string) => (s ? `${s.slice(0, 6)}…${s.slice(-4)}` : "");

function stringifyAny(v: any): string {
  try {
    return JSON.stringify(
      v,
      (_k, val) => {
        if (BigNumber.isBigNumber(val)) return val.toString();
        if (val && val._isBigNumber) return String(val.toString?.() ?? val);
        if (typeof val === "bigint") return val.toString();
        return val;
      },
      2
    );
  } catch {
    return util.inspect(v, { depth: null, colors: false, maxArrayLength: null });
  }
}

function dumpRaw(title: string, obj: any) {
  const s = stringifyAny(obj);
  if (RAW_LIMIT > 0 && s.length > RAW_LIMIT) {
    const half = Math.floor(RAW_LIMIT / 2);
    log(`[RAW:${title}] length=${s.length} > limit=${RAW_LIMIT}, showing head+tail`);
    console.log(s.slice(0, half) + "\n...\n" + s.slice(-half));
  } else {
    log(`[RAW:${title}]`);
    console.log(s);
  }
}

process.on("unhandledRejection", (reason) => {
  dumpRaw("UNHANDLED_REJECTION", reason);
});

async function main() {
  // --------------------------------------------------------------------
  // Env
  // --------------------------------------------------------------------
  const pk = process.env.PK as string;
  const rpcToken = process.env.RPC_TOKEN as string;
  const host = process.env.CLOB_API_URL || "https://clob.polymarket.com";
  const chainId = parseInt(`${process.env.CHAIN_ID || Chain.AMOY}`) as Chain;

  const rpcUrl =
    chainId === Chain.POLYGON
      ? `https://polygon-mainnet.g.alchemy.com/v2/${rpcToken}`
      : `https://polygon-amoy.g.alchemy.com/v2/${rpcToken}`;
  log("[BOOT] host:", host);
  log("[BOOT] chainId:", chainId);
  log("[BOOT] rpcUrl:", rpcUrl.replace(/v2\/.*/i, "v2/•••"));

  // --------------------------------------------------------------------
  // Provider / Wallet sanity checks
  // --------------------------------------------------------------------
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(pk, provider);
  const addr = await wallet.getAddress();

  const [network, block, gasPrice] = await Promise.all([
    provider.getNetwork(),
    provider.getBlockNumber(),
    provider.getGasPrice().catch(() => undefined),
  ]);

  dumpRaw("RPC.network", network);
  log("[RPC] latest block:", block);
  if (gasPrice) log("[RPC] gasPrice:", `${ethers.utils.formatUnits(gasPrice, "gwei")} gwei`);
  log("[WALLET] address:", addr);

  // --------------------------------------------------------------------
  // Clients / Contracts
  // --------------------------------------------------------------------
  const creds: ApiKeyCreds = {
    key: `${process.env.CLOB_API_KEY || ""}`,
    secret: `${process.env.CLOB_SECRET || ""}`,
    passphrase: `${process.env.CLOB_PASS_PHRASE || ""}`,
  };
  const clobClient = new ClobClient(host, chainId, wallet, creds);
  const contractConfig = getContractConfig(chainId);
  const ctf = new ethers.Contract(contractConfig.conditionalTokens, ctfAbi, wallet);
  log("[CTF] conditionalTokens:", contractConfig.conditionalTokens);
  log("[CTF] collateral:", contractConfig.collateral);

  // --------------------------------------------------------------------
  // Page loop
  // --------------------------------------------------------------------
  let nextCursor = INITIAL_CURSOR;
  let page = 0;
  let totalMerges = 0;

  while (nextCursor !== END_CURSOR) {
    page += 1;
    log(`[PAGE ${page}] fetching markets (cursor=${nextCursor})…`);
    console.time(`[PAGE ${page}] getMarkets`);
    let marketsResp: any;
    try {
      marketsResp = await clobClient.getMarkets(nextCursor);
    } catch (e: any) {
      console.timeEnd(`[PAGE ${page}] getMarkets`);
      dumpRaw(`[PAGE ${page}] getMarkets ERROR`, e);
      break;
    }
    console.timeEnd(`[PAGE ${page}] getMarkets`);
    dumpRaw(`[PAGE ${page}] getMarkets RESP`, marketsResp);

    nextCursor = marketsResp.next_cursor;
    const markets = marketsResp.data || [];
    log(`[PAGE ${page}] got ${markets.length} markets, next_cursor=${nextCursor}`);

    for (let i = 0; i < markets.length; i++) {
      const market = markets[i];
      dumpRaw(`MKT[${page}:${i + 1}] market object`, market);

      const label =
        market?.question ||
        market?.slug ||
        market?.title ||
        market?.condition_id ||
        `market#${i + 1}`;
      log(`  [MKT ${i + 1}/${markets.length}] ${label}`);

      if (!market.tokens || market.tokens.length < 2) {
        log("   └─ skip: market has <2 tokens");
        continue;
      }
      const yesToken = market.tokens[0]?.token_id;
      const noToken = market.tokens[1]?.token_id;
      if (!yesToken || !noToken) {
        log("   └─ skip: missing token ids");
        continue;
      }
      const conditionId = market.condition_id;
      log(`   ├─ tokens: YES=${yesToken} NO=${noToken}`);
      log(`   ├─ conditionId: ${conditionId}`);

      // Balances
      console.time("   │ getBalance YES");
      const yesBalResp: any = await clobClient
        .getBalanceAllowance({ asset_type: AssetType.CONDITIONAL, token_id: yesToken })
        .catch((e: any) => ({ __error__: true, detail: e }));
      console.timeEnd("   │ getBalance YES");
      dumpRaw("   │ RAW YES getBalanceAllowance", yesBalResp);

      console.time("   │ getBalance NO ");
      const noBalResp: any = await clobClient
        .getBalanceAllowance({ asset_type: AssetType.CONDITIONAL, token_id: noToken })
        .catch((e: any) => ({ __error__: true, detail: e }));
      console.timeEnd("   │ getBalance NO ");
      dumpRaw("   │ RAW NO  getBalanceAllowance", noBalResp);

      if ((yesBalResp && yesBalResp.__error__) || (noBalResp && noBalResp.__error__)) {
        log("   └─ skip: balance API error");
        continue;
      }

      const yesBalStr = yesBalResp?.balance || "0";
      const noBalStr = noBalResp?.balance || "0";
      const yesBal = BigNumber.from(yesBalStr);
      const noBal = BigNumber.from(noBalStr);
      log(
        `   ├─ balances: YES=${ethers.utils.formatUnits(yesBal, 6)} NO=${ethers.utils.formatUnits(noBal, 6)}`
      );
      if (yesBal.isZero() || noBal.isZero()) {
        log("   └─ skip: one side is zero, cannot merge");
        continue;
      }

      const amount = yesBal.lt(noBal) ? yesBal : noBal;
      log(`   ├─ merge amount: ${ethers.utils.formatUnits(amount, 6)} (6 decimals)`);

      // Preflight estimateGas
      try {
        const estGas = await ctf.estimateGas.mergePositions(
          contractConfig.collateral,
          ethers.constants.HashZero,
          conditionId,
          [1, 2],
          amount
        );
        dumpRaw("   │ RAW estimateGas.mergePositions", { estGas: estGas.toString() });
      } catch (e: any) {
        dumpRaw("   └─ estimateGas ERROR (likely revert)", e);
        continue;
      }

      // Optional: callStatic to surface revert reason
      try {
        const cs = await ctf.callStatic.mergePositions(
          contractConfig.collateral,
          ethers.constants.HashZero,
          conditionId,
          [1, 2],
          amount
        );
        dumpRaw("   │ RAW callStatic.mergePositions", cs);
      } catch (e: any) {
        dumpRaw("   │ callStatic.mergePositions ERROR (preflight)", e);
      }

      // Send tx
      try {
        const gPrice = await provider.getGasPrice().catch(() => undefined);
        if (gPrice) log(`   ├─ gasPrice now: ${ethers.utils.formatUnits(gPrice, "gwei")} gwei`);

        log(`   ├─ submitting tx…`);
        console.time("   │ tx submit→confirm");
        const tx = await ctf.mergePositions(
          contractConfig.collateral,
          ethers.constants.HashZero,
          conditionId,
          [1, 2],
          amount,
          {
            // 给点余量
            gasLimit: 200000,
          }
        );
        dumpRaw("   │ RAW tx (TransactionResponse)", tx);

        const receipt = await tx.wait();
        console.timeEnd("   │ tx submit→confirm");
        dumpRaw("   │ RAW receipt (TransactionReceipt)", receipt);

        log(
          `   └─ Merged ✅ (block ${receipt.blockNumber}, gasUsed ${receipt.gasUsed?.toString()})`
        );
        totalMerges += 1;
      } catch (e: any) {
        console.timeEnd("   │ tx submit→confirm");
        dumpRaw("   └─ merge FAILED ERROR", e);
      }
    }
  }

  log(
    `[DONE] pages processed: ${page}, merges: ${totalMerges}, elapsed ${(Date.now() - startedAt) / 1000
    }s`
  );
}

main().catch((err) => {
  dumpRaw("[FATAL] main.catch", err);
});
