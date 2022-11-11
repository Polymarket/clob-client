import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
dotenvConfig({ path: resolve(__dirname, "../.env") });
import { Side } from "./types";
import {
    createOrder,
    getOrders,
    getOrder,
    cancelAllOrders,
    getTrades,
    cancelOrder,
} from "./testUtils";
import { MUMBAI_MARKET } from "./testConstants";

// setup(false, true)
//     .then(r => console.log(r))
//     .catch(e => console.log(e));

// getApiKey(false, true)
//     .then(r => console.log(r))
//     .catch(e => console.log(e));

createOrder(false, true, MUMBAI_MARKET.No, 0.8, Side.BUY, 10).then();
//cancelAllOrders(false, true).then();
//getTrades(false, true, true, MUMBAI_MARKET.Condition).then();
//getOrders(false, true, MUMBAI_MARKET.Condition).then();

//getOrder(false, true, "0xce92e3bcafb10f4b8333560f8119dcb85ee66cc13572cb099656540f6ccf654f").then();
//cancelOrder(false, true, "0x01b528478a01575ba34a82148e19483feb606115ee928f2bb99ab79446613573");
