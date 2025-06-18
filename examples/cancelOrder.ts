import { ApiKeyCreds, ClobClient, OrderType, Side, } from "@polymarket/clob-client";
import { Wallet } from "@ethersproject/wallet";

const host = 'https://clob.polymarket.com';
const funder = '';//This is your Polymarket Profile Address, where you send UDSC to.'
const private_key = "" 
//0: Browser Wallet(Metamask, Coinbase Wallet, etc)
//1: Magic/Email Login
const signatureType = 1; 
const chainId = 137;

async function main() {
    
    const wallet = new Wallet(private_key); //This is your Private Key. If using email login export from https://reveal.magic.link/polymarket otherwise export from your Web3 Application
    const creds = new ClobClient(host, chainId, wallet).createOrDeriveApiKey();
    const clobClient = new ClobClient(host, chainId, wallet, await creds, signatureType, funder);

    // Send it to the server
    const resp = await clobClient.cancelOrder({
        orderID: "0x989af24e7bdf0f815e464d5560a0657735a9199fa3a6cd7fb968c85cc65d18b4", // Example orderID
    });
    console.log(resp);
    console.log(`Done!`);
}

main();
