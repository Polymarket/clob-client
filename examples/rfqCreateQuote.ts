import { ethers } from "ethers";
import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
import type { ApiKeyCreds } from "../src/index.ts";
import { Chain, ClobClient, Side } from "../src/index.ts";
// import { SignatureType } from "../src/index.ts";

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
	// For EOA signature type
	const clobClient = new ClobClient(host, chainId, wallet, creds);
	
	// For Polymarket Gnosis safe signature type
	// const funderAddress = "0x3D01803E19Db10D0b231feacc393ffbf5Aa20B32";
	// const clobClient = new ClobClient(host, chainId, wallet, creds, SignatureType.POLY_GNOSIS_SAFE, funderAddress);

	// Create a quote to sell 40 YES at 0.50 for $20 (responding to a BUY request)
	const YES = "34097058504275310827233323421517291090691602969494795225921954353603704046623"

	// Create and post the RFQ quote
	const quote = await clobClient.rfq.createRfqQuote(
		{
			requestId: "019b0437-a079-7452-bb4b-e52ac2562231",
			tokenID: YES,
			price: 0.5,
			side: Side.SELL,
			size: 40,
		},
		{ tickSize: "0.01" },
	);
	console.log(quote);
}
main();
