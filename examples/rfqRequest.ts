import { ethers } from "ethers";
import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
import { ApiKeyCreds, Chain, ClobClient, Side } from "../src";

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
	
	// Create a buy order for 12 YES at 0.50 for $6 (min amount is 5 shares and $5)
	const YES = "34097058504275310827233323421517291090691602969494795225921954353603704046623";
	const request = await clobClient.createRfqRequest(
		{
			tokenID: YES,
			price: 0.5,
			side: Side.BUY,
			size: 12,
			feeRateBps: 0,
		},
		{ tickSize: "0.01" },
	);
	console.log("rfqRequest - Request", request);

	// Send it to the server
	const resp = await clobClient.postRfqRequest(request)
	console.log("rfqRequest - Response", resp);
}

main();
