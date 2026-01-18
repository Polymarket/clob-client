# Polymarket CLOB Client

<a href='https://www.npmjs.com/package/@polymarket/clob-client'>
    <img src='https://img.shields.io/npm/v/@polymarket/clob-client.svg' alt='NPM'/>
</a>

Typescript client for the Polymarket CLOB

## Installation

```bash
npm install @polymarket/clob-client ethers
# or
pnpm add @polymarket/clob-client ethers
```

## Quickstart

```ts
import { ClobClient, OrderType, Side } from "@polymarket/clob-client";
import { SignatureType } from "@polymarket/order-utils";
import { Wallet } from "@ethersproject/wallet";

const host = "https://clob.polymarket.com";
const chainId = 137; // Chain.POLYGON
const signer = new Wallet(process.env.PRIVATE_KEY || "");
const funder = "0x..."; // Wallet that holds USDC (proxy/contract wallets can use a different funder)

(async () => {
    // L1: derive or create an API key with a wallet signature
    const baseClient = new ClobClient(host, chainId, signer);
    const creds = await baseClient.createOrDeriveApiKey();

    // L2: trade-ready client (SignatureType is optional; defaults to EOA)
    const client = new ClobClient(host, chainId, signer, creds, SignatureType.EOA, funder);

    const order = await client.createAndPostOrder(
        {
            tokenID: "0x...",
            price: 0.51,
            side: Side.BUY,
            size: 10,
        },
        { tickSize: "0.001", negRisk: false },
        OrderType.GTC,
    );

    console.log(order);
})();
```

## Authentication cheatsheet

- L1 (wallet signature): required to derive/create API keys and to sign orders. Pass a `Wallet` or `JsonRpcSigner`.
- L2 (API key): required to post orders and access account-scoped endpoints. Persist `ApiKeyCreds` from `createOrDeriveApiKey`.
- Signature types: pass `signatureType` and an optional `funderAddress` when using proxy, smart-contract, or delegated wallets (see the `SignatureType` enum in `@polymarket/order-utils`).
- Other options: `geoBlockToken`, `useServerTime`, and `builderConfig` can be provided to the constructor for advanced flows.

See the [examples](examples/) directory for runnable scripts that cover common flows.

## Method reference

The list below groups the main client methods. Unless noted, methods return typed JSON responses from the CLOB API.

### Market data (public, no auth)
- `getOk()` – health check.
- `getServerTime()` – current server timestamp.
- `getSamplingSimplifiedMarkets(next_cursor?)` / `getSamplingMarkets(next_cursor?)` / `getSimplifiedMarkets(next_cursor?)` / `getMarkets(next_cursor?)` – paginated market discovery endpoints.
- `getMarket(conditionID)` – fetch a single market by condition id.
- `getOrderBook(tokenID)` / `getOrderBooks(bookParams[])` – aggregated order books.
- `getMidpoint(tokenID)` / `getMidpoints(bookParams[])`, `getPrice(tokenID, side)` / `getPrices(bookParams[])`, `getSpread(tokenID)` / `getSpreads(bookParams[])`, `getLastTradePrice(tokenID)` / `getLastTradesPrices(bookParams[])` – price and depth helpers.
- `getPricesHistory(filter)` – historical price data for the given market filter.
- `getMarketTradesEvents(conditionID)` – trade events for a market.
- `getTickSize(tokenID)`, `getNegRisk(tokenID)`, `getFeeRateBps(tokenID)` – fetch and cache market-level constraints.
- `calculateMarketPrice(tokenID, side, amount, orderType?)` – estimate the price for a market order using the live book.
- `getOrderBookHash(orderbook)` – calculate a deterministic hash for an order book snapshot.

### API keys and auth
- `createApiKey(nonce?)`, `deriveApiKey(nonce?)`, `createOrDeriveApiKey(nonce?)` – wallet-signed calls that return `ApiKeyCreds`.
- `getApiKeys()` – list API keys (L2 auth).
- `deleteApiKey()` – revoke the active API key (L2 auth).
- `getClosedOnlyMode()` – check if the account is restricted to closed mode (L2 auth).

### Orders and execution (wallet signature + API key)
- `createOrder(userOrder, options?)` – build and sign a limit order with tick-size and neg-risk validation.
- `createMarketOrder(userMarketOrder, options?)` – build and sign a market order; price is calculated if omitted.
- `createAndPostOrder(userOrder, options?, orderType?, deferExec?)` / `createAndPostMarketOrder(...)` – convenience helpers that sign and submit.
- `postOrder(order, orderType?, deferExec?)` / `postOrders([{ order, orderType }], deferExec?)` – submit signed orders.
- `getOrder(orderID)` – fetch a single order.
- `getOpenOrders(params?, only_first_page?, next_cursor?)` – paginated open orders for the user.
- `cancelOrder(payload)`, `cancelOrders(orderHashes)`, `cancelAll()`, `cancelMarketOrders(payload)` – cancel helpers.

### Trades and notifications
- `getTrades(params?, only_first_page?, next_cursor?)` – fetch trades, optionally auto-paginating.
- `getTradesPaginated(params?, next_cursor?)` – fetch a single page with metadata.
- `getNotifications()` / `dropNotifications(params?)` – user notifications.
- `getBuilderTrades(params?, next_cursor?)` – trades for builder-authenticated flows (builder API key required).

### Balances and allowances
- `getBalanceAllowance(params?)` – view balances/allowances for collateral or conditional tokens (L2 auth).
- `updateBalanceAllowance(params?)` – refresh the allowance for the given asset type (L2 auth).

### Rewards
- `getEarningsForUserForDay(date)` – paginated earnings per market (L2 auth).
- `getTotalEarningsForUserForDay(date)` – aggregated daily earnings (L2 auth).
- `getUserEarningsAndMarketsConfig(date, order_by?, position?, no_competition?)` – earnings with market configuration (L2 auth).
- `getRewardPercentages()` – liquidity reward percentages for the user (L2 auth).
- `getCurrentRewards()` – current reward-eligible markets (public).
- `getRawRewardsForMarket(conditionId)` – reward data for a specific market (public).

### Builder API keys (builderConfig required)
- `createBuilderApiKey()` / `getBuilderApiKeys()` – manage builder API keys (L2 auth).
- `revokeBuilderApiKey()` – revoke the active builder API key (builder auth).

See [examples](examples/) for full usage samples per endpoint.
