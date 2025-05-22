import { ethers } from "ethers";
import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
import { ApiKeyCreds, Chain, ClobClient, OrderType, Side } from "../src";

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

    const YES = "71321045679252212594626385532706912750332728571942532289631379312455583992563";
    // Create a YES market buy order for the equivalent of 100 USDC for the market price
    const marketBuyOrder = await clobClient.createMarketOrder({
        tokenID: YES,
        amount: 100, // $$$
        side: Side.BUY,
        orderType: OrderType.FOK, // or FAK
    });
    console.log("Created Market BUY Order", marketBuyOrder);

    // Send it to the server
    console.log(await clobClient.postOrder(marketBuyOrder, OrderType.FOK)); // or FAK

    // ------------------

    // Create the order and send it to the server in a single step
    const resp2 = await clobClient.createAndPostMarketOrder(
        {
            tokenID: YES,
            amount: 100, // $$$
            side: Side.BUY,
            orderType: OrderType.FOK, // or FAK
        },
        { tickSize: "0.01" },
        OrderType.FOK, // or FAK
    );
    console.log(resp2);
}

main();
