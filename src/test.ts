import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
dotenvConfig({ path: resolve(__dirname, "../.env") });
import { ApiKeyCreds, Side } from "./types";
import {
    setup,
    createOrder,
    getOrders,
    getOrder,
    cancelAllOrders,
    getTrades,
    cancelOrder,
    checkFundingAllowance,
    createMarketBuyOrder,
    getTradesForCreds,
    getLastestPriceHistoryDataPoint,
    deleteZeroApiKey,
    createZeroApiKey,
    deriveZeroApiKey,
    getApiKeysTest,
    getPrice,
    getMidpoint,
    getApiKey,
    createOrderWithCreds,
    mergeMax,
} from "./testUtils";

import { buildOrderCreationArgs } from "./order-builder/helpers";
import { MUMBAI_MARKET, MAINNET_MARKET, MUMBAI_MARKET_TWO } from "./testConstants";

// setup(true, true)
//     .then(r => console.log(r))
//     .catch(e => console.log(e));

// getApiKey(true, true)
//     .then(r => console.log(r))
//     .catch(e => console.log(e));

//createOrder(true, true, MAINNET_MARKET.Yes, 0.2, Side.BUY, 100).then();
//mergeMax(true, true).then();
//createOrder(false, true, MUMBAI_MARKET_TWO.Yes, 0.49, Side.BUY, 20).then();
//createMarketBuyOrder(false, false, MUMBAI_MARKET.Yes, 0.52, 15);

//cancelAllOrders(true, true).then();

//getTrades(false, true, false, MUMBAI_MARKET.Condition).then(); // not correct (I was taker, should only be one maker_orders_sizes_prices)
//getOrders(false, true, MUMBAI_MARKET.Condition).then();
//console.log(MUMBAI_MARKET.Condition);

//getOrder(false, true, "0x38a73eed1e6d177545e9ab027abddfb7e08dbe975fa777123b1752d203d6ac88").then();
//cancelOrder(true, true, "0xca701f7e88098d2ad5bc446983c8f8f19d21380bcc3b722b53dce20b37d75026");

//isOperator;

//checkFundingAllowance(false, "0x8208003B936d73694A90b2da579F85BFCf870Cc1").then();

// const credsToUse: ApiKeyCreds = {
//     key: process.env.APIKEY as string,
//     secret: process.env.SECRET as string,
//     passphrase: process.env.PASSPHRASE as string,
// };

//createOrderWithCreds(true, credsToUse, MAINNET_MARKET.Yes, 0, Side.BUY, 20).then();

// getTradesForCreds(
//     true,
//     false,
//     credsToUse,
//     "0x388911E52Bb2EB440B9f03eD24bcef13C93E1499".toLowerCase(),
//     "0x41190eb9336ae73949c04f4900f9865092e69a57cf9c942a6157abf6ae8d16c6",
// ).then();

//getLastestPriceHistoryDataPoint(true, MAINNET_MARKET.Yes).then();

// buildOrderCreationArgs("", "", 0, { tokenID: "", price: 0.57, size: 10, side: Side.SELL }).then(r =>
//     console.log(r),
// );

//deleteZeroApiKey(false, true);

//deriveZeroApiKey(false, true).then();

//getApiKeysTest(false, true).then();

//createOrder(false, true, MUMBAI_MARKET.Yes, 0.57, Side.BUY, 10).then();

//getMidpoint(false, true, MUMBAI_MARKET.Yes);
