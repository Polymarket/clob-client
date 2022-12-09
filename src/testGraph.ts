import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
dotenvConfig({ path: resolve(__dirname, "../.env") });
import { getHistoricUserMarketPositions, getUserMarketPositions } from "@polymarket/graphsdk";

async function test() {
    // const positions = await getHistoricUserMarketPositions(
    //     "0x3d337b38456ce815325e623ca2ab136b8fcb4414",
    //     [36465807],
    // );
    // console.log(JSON.stringify(positions));

    const positions = await getUserMarketPositions("0x3d337b38456ce815325e623ca2ab136b8fcb4414");
    console.log(JSON.stringify(positions));
}

(async () => {
    await test();
})();
