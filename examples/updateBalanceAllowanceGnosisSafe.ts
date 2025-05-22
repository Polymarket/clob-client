import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
import { ethers } from "ethers";
import Safe from "@safe-global/protocol-kit";
// ✅ works with protocol‑kit v5.2.x
import type { MetaTransactionData } from "@safe-global/safe-core-sdk-types";
import { ApiKeyCreds, AssetType, Chain, ClobClient, getContractConfig } from "../src";

/* -------------------------------------------------------------------------- */
/* 0.  Load env vars                                                          */
/* -------------------------------------------------------------------------- */
dotenvConfig({ path: resolve(__dirname, "../.env") });

(async () => {
    /* ------------------------------------------------------------------------ */
    /* 1.  Environment – provider, signer, Safe                                */
    /* ------------------------------------------------------------------------ */
    const chainId = Number(process.env.CHAIN_ID ?? Chain.AMOY) as Chain;
    const { collateral: USDC_ADDRESS } = getContractConfig(chainId);

    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_PROVIDER_URL);
    const signer = new ethers.Wallet(`${process.env.PK}`, provider);
    const safe = await Safe.init({
        provider: `${process.env.RPC_PROVIDER_URL}`,
        signer: `${process.env.PK}`,
        safeAddress: `${process.env.SAFE_ADDRESS}`,
    });

    /* ------------------------------------------------------------------------ */
    /* 2.  Instantiate the CLOB client                                         */
    /* ------------------------------------------------------------------------ */
    const creds: ApiKeyCreds = {
        key: `${process.env.CLOB_API_KEY}`,
        secret: `${process.env.CLOB_SECRET}`,
        passphrase: `${process.env.CLOB_PASS_PHRASE}`,
    };
    const clob = new ClobClient(`${process.env.CLOB_API_URL}`, chainId, signer, creds);

    /* ------------------------------------------------------------------------ */
    /* 3.  Helper – encode approve()                                           */
    /* ------------------------------------------------------------------------ */
    const ERC20_ABI = ["function approve(address,uint256)"];
    const erc20Interface = new ethers.utils.Interface(ERC20_ABI);

    const allowanceAmount = ethers.utils.parseUnits("1000", 6); // 1,000 USDC

    /* ------------------------------------------------------------------------ */
    /* 4.  Fetch allowance targets from CLOB                                   */
    /* ------------------------------------------------------------------------ */
    const { allowances } = await clob.getBalanceAllowance({
        asset_type: AssetType.COLLATERAL,
    });

    if (!allowances || Object.keys(allowances).length === 0) {
        console.log("Nothing to update – exiting.");
        return;
    }

    /* ------------------------------------------------------------------------ */
    /* 5.  Build one MultiSend batch                                           */
    /* ------------------------------------------------------------------------ */
    const txs: MetaTransactionData[] = [];

    for (const spender of Object.keys(allowances)) {
        txs.push({
            to: USDC_ADDRESS,
            value: "0",
            data: erc20Interface.encodeFunctionData("approve", [spender, allowanceAmount]),
            operation: 0, // CALL
        });
    }

    const safeTx = await safe.createTransaction({
        transactions: txs,
        options: { safeTxGas: "80000" }, // ⚠ adjust if batch very large
    });

    /* ------------------------------------------------------------------------ */
    /* 6.  Sign (threshold‑1) & execute                                        */
    /* ------------------------------------------------------------------------ */
    await safe.signTransaction(safeTx);

    const receipt = await safe.executeTransaction(safeTx);
    console.log("✅ Batch approve executed – tx:", receipt.hash);
})();
