import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
dotenvConfig({ path: resolve(__dirname, "../.env") });
//import { Side } from "./types";
import { setup } from "./testUtils";
setup(false, true)
    .then(r => console.log(r))
    .catch(e => console.log(e));
//createOrder(true, 0.2, Side.BUY, 15).then();
//cancelAllOrders(true).then();
//makeTrade(true, Side.SELL, 10).then();
//getTrades(true).then();
//getOrders(true).then();
//cancelOrder(true, "0x01b528478a01575ba34a82148e19483feb606115ee928f2bb99ab79446613573");
