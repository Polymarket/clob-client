type ContractConfig = {
    exchange: string;
    collateral: string;
    conditionalTokens: string;
};

const MUMBAI_CONTRACTS: ContractConfig = {
    exchange: "0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E",
    collateral: "0x2E8DCfE708D44ae2e406a1c02DFE2Fa13012f961",
    conditionalTokens: "0x7D8610E9567d2a6C9FBf66a5A13E9Ba8bb120d43",
};

const MATIC_CONTRACTS: ContractConfig = {
    exchange: "0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E",
    collateral: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    conditionalTokens: "0x4D97DCd97eC945f40cF65F87097ACe5EA0476045",
};

const NEG_RISK_MUMBAI_CONTRACTS: ContractConfig = {
    exchange: "0x", // TODO
    collateral: "0x", // TODO
    conditionalTokens: "0x7D8610E9567d2a6C9FBf66a5A13E9Ba8bb120d43",
};

const NEG_RISK_MATIC_CONTRACTS: ContractConfig = {
    exchange: "0x", // TODO
    collateral: "0x", // TODO
    conditionalTokens: "0x4D97DCd97eC945f40cF65F87097ACe5EA0476045",
};

const COLLATERAL_TOKEN_DECIMALS = 6;
const CONDITIONAL_TOKEN_DECIMALS = 6;

const getContractConfig = (chainID: number, negRisk = false): ContractConfig => {
    switch (chainID) {
        case 137:
            if (negRisk) {
                return NEG_RISK_MATIC_CONTRACTS;
            }
            return MATIC_CONTRACTS;
        case 80001:
            if (negRisk) {
                return NEG_RISK_MUMBAI_CONTRACTS;
            }
            return MUMBAI_CONTRACTS;
        default:
            throw new Error("Invalid network");
    }
};

export type { ContractConfig };
export { getContractConfig, COLLATERAL_TOKEN_DECIMALS, CONDITIONAL_TOKEN_DECIMALS };
