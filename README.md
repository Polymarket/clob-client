# Polymarket CLOB Client

<a href='https://www.npmjs.com/package/@polymarket/clob-client'>
    <img src='https://img.shields.io/npm/v/@polymarket/clob-client.svg' alt='NPM'/>
</a>

Typescript client for the Polymarket CLOB

### Usage

```ts
const host = process.env.CLOB_API_URL || "http://localhost:8080";
const signer = new ethers.Wallet(`${process.env.PK}`);
const creds: ApiKeyCreds = {
    key: `${process.env.CLOB_API_KEY}`,
    secret: `${process.env.CLOB_SECRET}`,
    passphrase: `${process.env.CLOB_PASS_PHRASE}`,
}

// Initialize the clob client
// NOTE: the signer must be approved on the LimitOrderProtocol and OrderExecutor contracts
const clobClient = new ClobClient(host, signer, creds);

// Create a limit buy order for 100 YES for 0.50c
const order = await clobClient.createLimitOrder({
    tokenId: "16678291189211314787145083999015737376658799626183230671758641503291735614088",
    price: 0.5,
    side: Side.Buy,
    size: 100,
});

// Send it to the server
const resp = await clobClient.postOrder(order);

// Init a market sell of 100 YES tokens
const marketSell = await clobClient.createMarketOrder({
    tokenId: "16678291189211314787145083999015737376658799626183230671758641503291735614088",
    side: Side.Sell,
    size: 100,
});

await clobClient.postOrder(marketSell);
```

See [examples](examples/) for more information
