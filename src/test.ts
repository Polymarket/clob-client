import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
dotenvConfig({ path: resolve(__dirname, "../.env") });
import { Side } from "./types";
import { setup, createOrder, cancelAllOrders, makeTrade, getTrades, getOrders, cancelOrder } from "./testUtils";
//setup(false).then(r => console.log(r));
//createOrder(true, 0.2, Side.BUY, 15).then();
//cancelAllOrders(true).then();
//makeTrade(false, Side.SELL, 10).then();
//getTrades(true).then();
//getOrders(true).then();
cancelOrder(true, "0x01b528478a01575ba34a82148e19483feb606115ee928f2bb99ab79446613573");

// Todos:

// remove old methods from client

// orders changes
// remove open-orders endpoint
// have orders only return open orders (LIVE)
// have order statuses not be returned since they are live
// not getting associated trades (all null)

// trades
// I can't seem to get trades, what am I doing wrong?
// error: 'retrieving trades : rpc error: code = Internal desc = ERROR #22008 date/time field value out of range: "1666067902"' - getting this error when I add an "after" filter

// status empty in order post message; do we need this??

// why is order deleted?
/*
"limit_orders_sizes_prices": [
    [
        "15",
        "0.2",
        "9180014b-33c8-9240-a14b-bdca11c0a465"
    ]
*/

// size should be taken size so 10

// when a trade is made against an order do we get an order update event?

// can we get it so that we get a trade event for resting limit orders as well?

// can't get trades
// not getting any events after matched
// validation removes the order, but I get an UPDATE not cancel event
