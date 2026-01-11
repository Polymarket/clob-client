/**
 * Demonstrates how to configure the CLOB client with authentication.
 */

import { ClobClient } from "../src";

async function main() {
  const apiKey = process.env.CLOB_API_KEY!;
  const apiSecret = process.env.CLOB_API_SECRET!;

  const client = new ClobClient({
    apiKey,
    apiSecret,
    baseUrl: "https://api.polymarket.com"
  });

  // Fetch account balances
  const balances = await client.getBalances();
  console.log(balances);
}

main().catch((err) => console.error(err));
