type ContractConfig = {
    exchange: string;
    negRiskAdapter: string;
    negRiskExchange: string;
    collateral: string;
    conditionalTokens: string;
};

const AMOY_CONTRACTS: ContractConfig = {
    exchange: "0xdFE02Eb6733538f8Ea35D585af8DE5958AD99E40",
    negRiskAdapter: "0xd91E80cF2E7be2e162c6513ceD06f1dD0dA35296",
    negRiskExchange: "0xC5d563A36AE78145C45a50134d48A1215220f80a",
    collateral: "0x9c4e1703476e875070ee25b56a58b008cfb8fa78",
    conditionalTokens: "0x69308FB512518e39F9b16112fA8d994F4e2Bf8bB",
};

const MATIC_CONTRACTS: ContractConfig = {
    exchange: "0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E",
    negRiskAdapter: "0xd91E80cF2E7be2e162c6513ceD06f1dD0dA35296",
    negRiskExchange: "0xC5d563A36AE78145C45a50134d48A1215220f80a",
    collateral: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    conditionalTokens: "0x4D97DCd97eC945f40cF65F87097ACe5EA0476045",
};

const COLLATERAL_TOKEN_DECIMALS = 6;
const CONDITIONAL_TOKEN_DECIMALS = 6;

const getContractConfig = (chainID: number): ContractConfig => {
    switch (chainID) {
        case 137:
            return MATIC_CONTRACTS;
        case 80002:
            return AMOY_CONTRACTS;
        default:
            throw new Error("Invalid network");
    }
};

export type { ContractConfig };
export { getContractConfig, COLLATERAL_TOKEN_DECIMALS, CONDITIONAL_TOKEN_DECIMALS };
