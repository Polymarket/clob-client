import { ethers } from "ethers";
import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
import type { ApiKeyCreds } from "../src/index.ts";
import { Chain, ClobClient } from "../src/index.ts";

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
	const clobClient = new ClobClient(host, chainId, wallet, creds);

	const result = await clobClient.rfq.cancelRfqRequest(
		{
			requestId: "019afa26-7755-7a40-89de-a9d6bc9d9bf0",
		}
	);
	console.log(result);
}

main();
