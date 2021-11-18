# Polymarket CLOB Client

This is a Typescript client for the Polymarket CLOB

### Usage

```ts
const host = "http://localhost:8080";
const creds: ApiKeyCreds = {
    key: `${process.env.CLOB_API_KEY}`,
    secret: `${process.env.CLOB_SECRET}`,
    passphrase: `${process.env.CLOB_PASS_PHRASE}`,
}

// Initialize the clob client
const clobClient = new ClobClient(host, wallet, creds);

//Approve the collateral token(USDC)

await clobClient.approve();

// Create a buy order for 100 YES for 0.50c
const order = await clobClient.createOrder({
    asset: { 
        address: "0xadbeD21409324e0fcB80AE8b5e662B0C857D85ed",
        condition: "YES",
    },
    price: 0.5,
    side: Side.Buy,
    size: 100,
});

// Send it to the server
const resp = await clobClient.postOrder(order);
```

See examples
