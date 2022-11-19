import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
dotenvConfig({ path: resolve(__dirname, "../.env") });
import { WebSocket } from "ws";
import { MAINNET_WSS_HOST, Market, MUMBAI_MARKET, MUMBAI_WSS_HOST } from "./testConstants";
import { ApiKeyCreds } from "./types";
import { getApiKey } from "./testUtils";

async function main(mainnetQ: boolean, adminQ: boolean, type: "user" | "market", market: Market) {
    let host: string;
    if (mainnetQ) {
        host = MAINNET_WSS_HOST;
    } else {
        host = MUMBAI_WSS_HOST;
    }
    let ws = new WebSocket(`${host}/${type}`);

    const creds: ApiKeyCreds = await getApiKey(mainnetQ, adminQ);

    let subscriptionMessage = {
        auth: {
            apiKey: creds.key,
            secret: creds.secret,
            passphrase: creds.passphrase,
        },
        type,
        markets: [] as string[],
        assets_ids: [] as string[],
    };

    if (type == "user") {
        subscriptionMessage["markets"] = [market.Condition];
    } else {
        subscriptionMessage["assets_ids"] = [market.Yes, market.No];
        //[market.Yes];
    }

    ws.send(JSON.stringify(subscriptionMessage)); // send sub message

    ws.onmessage = function (msg: any) {
        console.log(msg.data);
    };

    ws.on("close", function (ev: any) {
        console.log("disconnected SOCKET - PORT : 5000, reason: " + ev);
    });

    setInterval(() => {
        console.log("PINGING");
        ws.send("PING");
    }, 50000);
}

main(false, true, "user", MUMBAI_MARKET);
