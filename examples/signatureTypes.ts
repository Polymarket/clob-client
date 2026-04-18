import { ethers } from "ethers";
import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
import { type ApiKeyCreds, Chain, ClobClient, SignatureType } from "../src/index.ts";

dotenvConfig({ path: resolve(import.meta.dirname, "../.env") });

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

    // ─── Option A: Explicit wallet type (existing API, still works) ───

    // EOA: Signature type 0
    const clobClient = new ClobClient(host, chainId, wallet, creds);

    // Polymarket Proxy Wallet: Signature type 1
    const proxyWalletAddress = "0x...";
    const polyProxyClient = new ClobClient(
        host,
        chainId,
        wallet,
        creds,
        SignatureType.POLY_PROXY,
        proxyWalletAddress,
    );

    // Polymarket Gnosis Safe: Signature type 2
    const gnosisSafeAddress = "0x...";
    const polyGnosisSafeClient = new ClobClient(
        host,
        chainId,
        wallet,
        creds,
        SignatureType.POLY_GNOSIS_SAFE,
        gnosisSafeAddress,
    );

    // ─── Option B: Auto-detect wallet type (new API) ───
    // Just provide the funderAddress (your Polymarket wallet) and an RPC URL.
    // The SDK figures out whether it's a Proxy or a Safe automatically.

    const polymarketWallet = "0x..."; // your address from polymarket.com/settings
    const autoDetectedClient = await ClobClient.create({
        host,
        chainId,
        signer: wallet,
        creds,
        funderAddress: polymarketWallet,
        rpcUrl: "https://polygon-rpc.com",
    });

    // EOA usage with ClobClient.create() — no funderAddress needed
    const eaoClient = await ClobClient.create({
        host,
        chainId,
        signer: wallet,
        creds,
    });

    void clobClient;
    void polyProxyClient;
    void polyGnosisSafeClient;
    void autoDetectedClient;
    void eaoClient;
}

main();
