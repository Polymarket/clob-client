import { ethers } from "ethers";
import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
import axios from "axios";
import { Chain } from "../src";
import { GET_OPEN_ORDERS } from "../src/endpoints";

dotenvConfig({ path: resolve(__dirname, "../.env") });

async function main() {
    const wallet = new ethers.Wallet(`${process.env.PK}`);
    const chainId = parseInt(`${process.env.CHAIN_ID || Chain.AMOY}`) as Chain;
    const address = await wallet.getAddress();
    console.log(`Address: ${address}, chainId: ${chainId}`);

    const host = process.env.CLOB_API_URL || "http://localhost:8080";
    
    // Replace with your readonly API key from createReadonlyApiKey
    const readonlyApiKey = process.env.CLOB_READONLY_API_KEY || "your-readonly-api-key-here";

    // Get all open orders for the address
    const response1 = await axios.get(`${host}${GET_OPEN_ORDERS}`, {
        headers: {
            "POLY_READONLY_API_KEY": readonlyApiKey,
            "POLY_ADDRESS": address,
            "Content-Type": "application/json",
        },
        params: {
            maker_address: address,
        },
    });
    console.log(response1.data);
}

main();

