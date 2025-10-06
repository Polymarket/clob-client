import { ethers } from "ethers";
import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
import { ApiKeyCreds, Chain } from "../src";
import { ClobClient } from "../src";
import { SignatureType } from "@polymarket/order-utils";

dotenvConfig({ path: resolve(__dirname, "../.env") });

function getWallet(mainnetQ: boolean): ethers.Wallet {
    const pk = process.env.PK as string;
    const rpcToken: string = process.env.RPC_TOKEN as string;
    let rpcUrl = "";
    if (mainnetQ) {
        rpcUrl = `https://polygon-mainnet.g.alchemy.com/v2/${rpcToken}`;
    } else {
        rpcUrl = `https://polygon-amoy.g.alchemy.com/v2/${rpcToken}`;
    }
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    let wallet = new ethers.Wallet(pk);
    wallet = wallet.connect(provider);
    return wallet;
}

/**
 * Redeem market outcome tokens for EOA (Externally Owned Account) wallets
 * Use this function if you're using a standard wallet (private key)
 */
export async function redeemForEOA() {
    const chainId = parseInt(`${process.env.CHAIN_ID || Chain.AMOY}`) as Chain;
    // --------------------------
    // SET MAINNET OR AMOY HERE
    const isMainnet = chainId === Chain.POLYGON;
    // --------------------------

    const wallet = getWallet(isMainnet);
    const host = process.env.CLOB_API_URL || "http://localhost:8080";
    const creds: ApiKeyCreds = {
        key: `${process.env.CLOB_API_KEY}`,
        secret: `${process.env.CLOB_SECRET}`,
        passphrase: `${process.env.CLOB_PASS_PHRASE}`,
    };

    console.log(`Address: ${await wallet.getAddress()}, chainId: ${chainId}`);

    const clobClient = new ClobClient(host, chainId, wallet, creds, SignatureType.EOA);

    // Market and condition IDs for a resolved market
    // Replace these with actual values from a resolved market
    const conditionId = "0xabcdef..."; // Condition ID (32-byte hash)

    try {
        console.log("Redeeming outcome tokens for EOA wallet...");
        const receipt = await clobClient.redeemPositions({
            ConditionID: conditionId,
        });

        console.log(`Transaction successful! Hash: ${receipt.transactionHash}`);
        console.log(`Block number: ${receipt.blockNumber}`);
    } catch (error) {
        console.error("Error redeeming outcome:", error);
    }
}

/**
 * Redeem market outcome tokens for Proxy/Safe wallets
 * Use this function if you're using a Polymarket account (Magic/Email or Browser wallet)
 */
export async function redeemForProxy() {
    const chainId = parseInt(`${process.env.CHAIN_ID || Chain.AMOY}`) as Chain;
    // --------------------------
    // SET MAINNET OR AMOY HERE
    const isMainnet = chainId === Chain.POLYGON;
    // --------------------------

    const wallet = getWallet(isMainnet);
    const host = process.env.CLOB_API_URL || "http://localhost:8080";
    const creds: ApiKeyCreds = {
        key: `${process.env.CLOB_API_KEY}`,
        secret: `${process.env.CLOB_SECRET}`,
        passphrase: `${process.env.CLOB_PASS_PHRASE}`,
    };

    // Use this if you do not have API keys.
    // const clobClientForKeys = new ClobClient(host, chainId, wallet);
    //
    // const creds = await clobClientForKeys.createOrDeriveApiKey(1);

    console.log(`Address: ${await wallet.getAddress()}, chainId: ${chainId}`);

    // Market and condition IDs for a resolved market
    // Replace these with actual values from a resolved market
    const conditionId = "0x9ba..."; // Condition ID (32-byte hash)
    const proxyWalletAddress = "0xB1..."; // Your Safe/Proxy wallet address

    // For proxy wallets, use POLY_GNOSIS_SAFE or POLY_PROXY signature type
    const clobClient = new ClobClient(
        host,
        chainId,
        wallet,
        creds,
        SignatureType.POLY_GNOSIS_SAFE,
        proxyWalletAddress,
    );

    try {
        console.log("Redeeming outcome tokens for Proxy wallet...");
        const receipt = await clobClient.redeemPositions({
            ConditionID: conditionId,
        });

        console.log(`Transaction successful! Hash: ${receipt.transactionHash}`);
        console.log(`Block number: ${receipt.blockNumber}`);
    } catch (error) {
        console.error("Error redeeming outcome:", error);
    }
}

// Example usage:
// Uncomment one of the following to run:

// For EOA wallets (standard private key wallets):
// redeemForEOA();

// For Proxy/Safe wallets (Polymarket accounts):
// redeemForProxy();
