import { BigNumber } from "ethers";

export const ZERO = BigNumber.from("0");

export const MAINNET_HOST = "https://clob.polymarket.com";
export const MUMBAI_HOST = "https://clob-staging.polymarket.com";

export interface Contracts {
    Exchange: string;
    Collateral: string;
    Conditional: string;
}

export const MUMBAI_CONTRACTS: Contracts = {
    Exchange: "0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E",
    Collateral: "0x2E8DCfE708D44ae2e406a1c02DFE2Fa13012f961",
    Conditional: "0x7D8610E9567d2a6C9FBf66a5A13E9Ba8bb120d43",
};

export const MAINNET_CONTRACTS: Contracts = {
    Exchange: "0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E",
    Collateral: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    Conditional: "0x4D97DCd97eC945f40cF65F87097ACe5EA0476045",
};

export interface Market {
    Condition: string;
    Yes: string;
    No: string;
}

export const MUMBAI_MARKET: Market = {
    Condition: "0xbd31dc8a20211944f6b70f31557f1001557b59905b7738480ca09bd4532f84af",
    Yes: "1343197538147866997676250008839231694243646439454152539053893078719042421992",
    No: "16678291189211314787145083999015737376658799626183230671758641503291735614088",
};

export const MAINNET_MARKET: Market = {
    Condition: "0x41190eb9336ae73949c04f4900f9865092e69a57cf9c942a6157abf6ae8d16c6",
    Yes: "65818619657568813474341868652308942079804919287380422192892211131408793125422",
    No: "7499310772839000939827460818108209122328490677343888452292252718053799772723",
};
