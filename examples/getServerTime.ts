import { ethers } from "ethers";
import { ClobClient } from "../src";
import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";

dotenvConfig({ path: resolve(__dirname, "../.env") });


async function main(){
    const host = "http://localhost:8080"
    const clobClient = new ClobClient(host);

    console.log(`Server time: ${await clobClient.getServerTime()}`)
}

main();