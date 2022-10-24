import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
dotenvConfig({ path: resolve(__dirname, "../.env") });
import { WebSocket } from "ws";
import { getApiKey } from "./testUtils";

const yesTrump = "65818619657568813474341868652308942079804919287380422192892211131408793125422";

async function main() {
    let ws = new WebSocket("wss://ws-subscriptions-clob.polymarket.com/ws/user");

    let creds = await getApiKey();

    let subscriptionMessage = {
        auth: {
            apiKey: creds["key"],
            secret: creds["secret"],
            passphrase: creds["passphrase"],
        },
        market: yesTrump,
        type: "user",
    };

    ws.send(JSON.stringify(subscriptionMessage));

    ws.onmessage = function (msg) {
        console.log(msg.data);
    };

    ws.on("close", function (ev) {
        console.log("disconnected SOCKET - PORT : 5000, reason: " + ev);
    });

    const myTimeout = setInterval(() => {
        console.log("PINGING");
        ws.send("PING");
    }, 50000);
}

main();
