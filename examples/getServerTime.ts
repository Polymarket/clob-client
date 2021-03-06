import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
import { ClobClient } from "../src";

dotenvConfig({ path: resolve(__dirname, "../.env") });

async function main() {
    const host = process.env.CLOB_API_URL || "http://localhost:8080";
    const clobClient = new ClobClient(host);

    console.log(`Server time: ${await clobClient.getServerTime()}`);
}

main();
