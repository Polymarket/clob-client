import { ethers } from "ethers";
import { ClobClient } from "../src";
import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";

dotenvConfig({ path: resolve(__dirname, "../.env") });


async function main(){
    const provider = new ethers.providers.JsonRpcProvider(`https://kovan.infura.io/v3/${process.env.INFURA_KEY}`);
    const pk = new ethers.Wallet(`${process.env.PK}`);
    const wallet = pk.connect(provider);
    console.log(`Address: ${await wallet.getAddress()}`);
    
    const host = "http://localhost:8080"
    const clobClient = new ClobClient(host, wallet);

    console.log(`Response: `);
    const resp = await clobClient.createApiKey();
    console.log(resp);
}

main();