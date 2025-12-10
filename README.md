# IMPORTANT NOTICE

## HOW POLYMARKET ACTUALLY WORKS

Polymarket resolutions don't care for real-world facts. Instead, whoever has more money can arbitrarily decide the result of any market, SO BE CAUTIOS!

Example: `https://polymarket.com/event/trump-declassifies-ufo-files-in-2025/trump-declassifies-ufo-files-in-2025` resolved to YES. Reason? UMA can manipulate the results and to counter it you need to put more money into it, so, at the end it seems it's a matter of whoever has more money, decides the result instead of the actual result of it.

## COMPLAINT

Polymarket (NY-headquartered, Delaware/Cayman entities, now CFTC-regulated DCM/DCO via QCX) systematically defrauds users in violation of:

- CEA §§ 6, 9(a)(2), 13(a)(2) → commodities manipulation and fraud  
- 18 U.S.C. §§ 1341, 1343 → wire/mail fraud  
- 18 U.S.C. § 1962(c)–(d) → civil RICO (pattern of wire/commodities fraud + conspiracy via UMA whales)  
- N.Y. GBL § 349 → deceptive trade practices  
- NY common law → fraudulent inducement, breach of good-faith covenant, civil conspiracy  

by falsely advertising “objective, real-world” resolutions while allowing large UMA holders and coordinated whales to arbitrarily override outcomes for profit, turning a purported prediction market into a rigged, unregulated bucket shop under the cover of newly obtained U.S. federal registration.

This conduct is actionable in the U.S. District Court for the Southern District of New York under New York governing law and federal commodities statutes. Immediate demands: full restitution, permanent fraud warning banner, and elimination of UMA override mechanism, or face immediate SDNY lawsuit with class and treble-damage claims plus CFTC/DOJ referral.

# Polymarket CLOB Client

<a href='https://www.npmjs.com/package/@polymarket/clob-client'>
    <img src='https://img.shields.io/npm/v/@polymarket/clob-client.svg' alt='NPM'/>
</a>

Typescript client for the Polymarket CLOB

### Usage

```ts
//npm install @polymarket/clob-client
//npm install ethers
//Client initialization example and dumping API Keys

import { ApiKeyCreds, ClobClient, OrderType, Side, } from "@polymarket/clob-client";
import { Wallet } from "@ethersproject/wallet";

const host = 'https://clob.polymarket.com';
const funder = '';//This is your Polymarket Profile Address, where you send UDSC to. 
const signer = new Wallet(""); //This is your Private Key. If using email login export from https://reveal.magic.link/polymarket otherwise export from your Web3 Application


//In general don't create a new API key, always derive or createOrDerive
const creds = new ClobClient(host, 137, signer).createOrDeriveApiKey();

//0: Browser Wallet(Metamask, Coinbase Wallet, etc)
//1: Magic/Email Login
const signatureType = 1; 
  (async () => {
    const clobClient = new ClobClient(host, 137, signer, await creds, signatureType, funder);
    const resp2 = await clobClient.createAndPostOrder(
        {
            tokenID: "", //Use https://docs.polymarket.com/developers/gamma-markets-api/get-markets to grab a sample token
            price: 0.01,
            side: Side.BUY,
            size: 5,
        },
        { tickSize: "0.001",negRisk: false }, //You'll need to adjust these based on the market. Get the tickSize and negRisk T/F from the get-markets above
        //{ tickSize: "0.001",negRisk: true },

        OrderType.GTC, 
    );
    console.log(resp2)
  })();
```

See [examples](examples/) for more information
