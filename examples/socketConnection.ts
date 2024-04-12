import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
dotenvConfig({ path: resolve(__dirname, "../.env") });
import { WebSocket } from "ws";
import { ApiKeyCreds } from "../src";

const YES_TOKEN_ID =
    "71321045679252212594626385532706912750332728571942532289631379312455583992563";
// eslint-disable-next-line max-len
const NO_TOKEN_ID = "52114319501245915516055106046884209969926127482827954674443846427813813222426";
const CONDITION_ID = "0x5f65177b394277fd294cd75650044e32ba009a95022d88a0c1d565897d72f8f1";

interface subscriptionMessage {
    auth: { apiKey: string; secret: string; passphrase: string };
    type: string;
    markets: string[];
    assets_ids: string[];
}

/**
 *
 * @param type user | market
 */
async function main(type: "user" | "market" | "live-activity") {
    const host = process.env.WS_URL || "ws://localhost:8081";
    console.log(`${host}/ws/${type}`);
    const ws = new WebSocket(`${host}/ws/${type}`); // change to market for market, user for user

    let subscriptionMessage: subscriptionMessage = {} as subscriptionMessage;

    if (type !== "live-activity") {
        const creds: ApiKeyCreds = {
            key: `${process.env.CLOB_API_KEY}`,
            secret: `${process.env.CLOB_SECRET}`,
            passphrase: `${process.env.CLOB_PASS_PHRASE}`,
        };

        subscriptionMessage = {
            auth: {
                apiKey: creds.key,
                secret: creds.secret,
                passphrase: creds.passphrase,
            },
            type, // change to market for market, user for user
            markets: [] as string[],
            assets_ids: [] as string[],
        };

        if (type == "user") {
            subscriptionMessage["markets"] = [CONDITION_ID];
        } else {
            subscriptionMessage["assets_ids"] = [YES_TOKEN_ID, NO_TOKEN_ID];
            // subscriptionMessage["assets_ids"] = [NO_TOKEN_ID];
        }
    }

    ws.on("open", function () {
        if (type !== "live-activity") {
            ws.send(JSON.stringify(subscriptionMessage)); // send sub message
        }

        setInterval(() => {
            console.log("PINGING");
            ws.send("PING");
        }, 50000);
    });

    ws.onmessage = function (msg: any) {
        console.log(msg.data);
    };

    ws.on("close", function (ev: any) {
        console.log("disconnected SOCKET - PORT : 5000, reason: " + ev);
    });
}

main("market");
