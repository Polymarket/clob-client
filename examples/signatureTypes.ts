import { ethers } from "ethers";
import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
import { ApiKeyCreds, Chain, ClobClient } from "../src";
import { SignatureType } from "@polymarket/order-utils";

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

    // Client used with an EOA: Signature type 0
    const clobClient = new ClobClient(host, chainId, wallet, creds);

    // Client used with a Polymarket Proxy Wallet: Signature type 1
    const proxyWalletAddress = "0x...";
    const polyProxyClient = new ClobClient(
        host,
        chainId,
        wallet,
        creds,
        SignatureType.POLY_PROXY,
        proxyWalletAddress,
    );

    // Client used with a Polymarket Gnosis safe: Signature Type 2
    const gnosisSafeAddress = "0x...";
    const polyGnosisSafeClient = new ClobClient(
        host,
        chainId,
        wallet,
        creds,
        SignatureType.POLY_GNOSIS_SAFE,
        gnosisSafeAddress,
    );
}

main();
