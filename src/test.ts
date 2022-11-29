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
} from "./testUtils";
import { MUMBAI_MARKET, MAINNET_MARKET } from "./testConstants";

// setup(true, true)
//     .then(r => console.log(r))
//     .catch(e => console.log(e));

// getApiKey(false, true)
//     .then(r => console.log(r))
//     .catch(e => console.log(e));

//createOrder(false, false, MUMBAI_MARKET.Yes, 0.52, Side.SELL, 30).then();
//createMarketBuyOrder(false, false, MUMBAI_MARKET.Yes, 0.52, 15);
//cancelAllOrders(false, false).then();
//getTrades(false, false, false, MUMBAI_MARKET.Condition).then(); // not correct (I was taker, should only be one maker_orders_sizes_prices)
//getOrders(false, true, MUMBAI_MARKET.Condition).then();

//getOrder(false, true, "0xce92e3bcafb10f4b8333560f8119dcb85ee66cc13572cb099656540f6ccf654f").then();
//cancelOrder(false, true, "0x01b528478a01575ba34a82148e19483feb606115ee928f2bb99ab79446613573");

//isOperator;

//checkFundingAllowance(false, "0x8208003B936d73694A90b2da579F85BFCf870Cc1").then();

const credsToUse: ApiKeyCreds = {
    key: process.env.APIKEY as string,
    secret: process.env.SECRET as string,
    passphrase: process.env.PASSPHRASE as string,
};

getTradesForCreds(
    true,
    false,
    credsToUse,
    "0x388911E52Bb2EB440B9f03eD24bcef13C93E1499".toLowerCase(),
    "0x41190eb9336ae73949c04f4900f9865092e69a57cf9c942a6157abf6ae8d16c6",
).then();
