export const negRiskAdapterAbi = [
    {
        type: "constructor",
        inputs: [
            {
                name: "_ctf",
                type: "address",
                internalType: "address",
            },
            {
                name: "_collateral",
                type: "address",
                internalType: "address",
            },
            {
                name: "_vault",
                type: "address",
                internalType: "address",
            },
        ],
        stateMutability: "nonpayable",
    },
    {
        type: "function",
        name: "FEE_DENOMINATOR",
        inputs: [],
        outputs: [
            {
                name: "",
                type: "uint256",
                internalType: "uint256",
            },
        ],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "NO_TOKEN_BURN_ADDRESS",
        inputs: [],
        outputs: [
            {
                name: "",
                type: "address",
                internalType: "address",
            },
        ],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "addAdmin",
        inputs: [
            {
                name: "admin",
                type: "address",
                internalType: "address",
            },
        ],
        outputs: [],
        stateMutability: "nonpayable",
    },
    {
        type: "function",
        name: "admins",
        inputs: [
            {
                name: "",
                type: "address",
                internalType: "address",
            },
        ],
        outputs: [
            {
                name: "",
                type: "uint256",
                internalType: "uint256",
            },
        ],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "balanceOf",
        inputs: [
            {
                name: "_owner",
                type: "address",
                internalType: "address",
            },
            {
                name: "_id",
                type: "uint256",
                internalType: "uint256",
            },
        ],
        outputs: [
            {
                name: "",
                type: "uint256",
                internalType: "uint256",
            },
        ],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "balanceOfBatch",
        inputs: [
            {
                name: "_owners",
                type: "address[]",
                internalType: "address[]",
            },
            {
                name: "_ids",
                type: "uint256[]",
                internalType: "uint256[]",
            },
        ],
        outputs: [
            {
                name: "",
                type: "uint256[]",
                internalType: "uint256[]",
            },
        ],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "col",
        inputs: [],
        outputs: [
            {
                name: "",
                type: "address",
                internalType: "contract ERC20",
            },
        ],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "convertPositions",
        inputs: [
            {
                name: "_marketId",
                type: "bytes32",
                internalType: "bytes32",
            },
            {
                name: "_indexSet",
                type: "uint256",
                internalType: "uint256",
            },
            {
                name: "_amount",
                type: "uint256",
                internalType: "uint256",
            },
        ],
        outputs: [],
        stateMutability: "nonpayable",
    },
    {
        type: "function",
        name: "ctf",
        inputs: [],
        outputs: [
            {
                name: "",
                type: "address",
                internalType: "contract IConditionalTokens",
            },
        ],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "getConditionId",
        inputs: [
            {
                name: "_questionId",
                type: "bytes32",
                internalType: "bytes32",
            },
        ],
        outputs: [
            {
                name: "",
                type: "bytes32",
                internalType: "bytes32",
            },
        ],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "getDetermined",
        inputs: [
            {
                name: "_marketId",
                type: "bytes32",
                internalType: "bytes32",
            },
        ],
        outputs: [
            {
                name: "",
                type: "bool",
                internalType: "bool",
            },
        ],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "getFeeBips",
        inputs: [
            {
                name: "_marketId",
                type: "bytes32",
                internalType: "bytes32",
            },
        ],
        outputs: [
            {
                name: "",
                type: "uint256",
                internalType: "uint256",
            },
        ],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "getMarketData",
        inputs: [
            {
                name: "_marketId",
                type: "bytes32",
                internalType: "bytes32",
            },
        ],
        outputs: [
            {
                name: "",
                type: "bytes32",
                internalType: "MarketData",
            },
        ],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "getOracle",
        inputs: [
            {
                name: "_marketId",
                type: "bytes32",
                internalType: "bytes32",
            },
        ],
        outputs: [
            {
                name: "",
                type: "address",
                internalType: "address",
            },
        ],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "getPositionId",
        inputs: [
            {
                name: "_questionId",
                type: "bytes32",
                internalType: "bytes32",
            },
            {
                name: "_outcome",
                type: "bool",
                internalType: "bool",
            },
        ],
        outputs: [
            {
                name: "",
                type: "uint256",
                internalType: "uint256",
            },
        ],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "getQuestionCount",
        inputs: [
            {
                name: "_marketId",
                type: "bytes32",
                internalType: "bytes32",
            },
        ],
        outputs: [
            {
                name: "",
                type: "uint256",
                internalType: "uint256",
            },
        ],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "getResult",
        inputs: [
            {
                name: "_marketId",
                type: "bytes32",
                internalType: "bytes32",
            },
        ],
        outputs: [
            {
                name: "",
                type: "uint256",
                internalType: "uint256",
            },
        ],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "isAdmin",
        inputs: [
            {
                name: "addr",
                type: "address",
                internalType: "address",
            },
        ],
        outputs: [
            {
                name: "",
                type: "bool",
                internalType: "bool",
            },
        ],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "mergePositions",
        inputs: [
            {
                name: "_collateralToken",
                type: "address",
                internalType: "address",
            },
            {
                name: "",
                type: "bytes32",
                internalType: "bytes32",
            },
            {
                name: "_conditionId",
                type: "bytes32",
                internalType: "bytes32",
            },
            {
                name: "",
                type: "uint256[]",
                internalType: "uint256[]",
            },
            {
                name: "_amount",
                type: "uint256",
                internalType: "uint256",
            },
        ],
        outputs: [],
        stateMutability: "nonpayable",
    },
    {
        type: "function",
        name: "mergePositions",
        inputs: [
            {
                name: "_conditionId",
                type: "bytes32",
                internalType: "bytes32",
            },
            {
                name: "_amount",
                type: "uint256",
                internalType: "uint256",
            },
        ],
        outputs: [],
        stateMutability: "nonpayable",
    },
    {
        type: "function",
        name: "onERC1155BatchReceived",
        inputs: [
            {
                name: "",
                type: "address",
                internalType: "address",
            },
            {
                name: "",
                type: "address",
                internalType: "address",
            },
            {
                name: "",
                type: "uint256[]",
                internalType: "uint256[]",
            },
            {
                name: "",
                type: "uint256[]",
                internalType: "uint256[]",
            },
            {
                name: "",
                type: "bytes",
                internalType: "bytes",
            },
        ],
        outputs: [
            {
                name: "",
                type: "bytes4",
                internalType: "bytes4",
            },
        ],
        stateMutability: "nonpayable",
    },
    {
        type: "function",
        name: "onERC1155Received",
        inputs: [
            {
                name: "",
                type: "address",
                internalType: "address",
            },
            {
                name: "",
                type: "address",
                internalType: "address",
            },
            {
                name: "",
                type: "uint256",
                internalType: "uint256",
            },
            {
                name: "",
                type: "uint256",
                internalType: "uint256",
            },
            {
                name: "",
                type: "bytes",
                internalType: "bytes",
            },
        ],
        outputs: [
            {
                name: "",
                type: "bytes4",
                internalType: "bytes4",
            },
        ],
        stateMutability: "nonpayable",
    },
    {
        type: "function",
        name: "prepareMarket",
        inputs: [
            {
                name: "_feeBips",
                type: "uint256",
                internalType: "uint256",
            },
            {
                name: "_metadata",
                type: "bytes",
                internalType: "bytes",
            },
        ],
        outputs: [
            {
                name: "",
                type: "bytes32",
                internalType: "bytes32",
            },
        ],
        stateMutability: "nonpayable",
    },
    {
        type: "function",
        name: "prepareQuestion",
        inputs: [
            {
                name: "_marketId",
                type: "bytes32",
                internalType: "bytes32",
            },
            {
                name: "_metadata",
                type: "bytes",
                internalType: "bytes",
            },
        ],
        outputs: [
            {
                name: "",
                type: "bytes32",
                internalType: "bytes32",
            },
        ],
        stateMutability: "nonpayable",
    },
    {
        type: "function",
        name: "redeemPositions",
        inputs: [
            {
                name: "_conditionId",
                type: "bytes32",
                internalType: "bytes32",
            },
            {
                name: "_amounts",
                type: "uint256[]",
                internalType: "uint256[]",
            },
        ],
        outputs: [],
        stateMutability: "nonpayable",
    },
    {
        type: "function",
        name: "removeAdmin",
        inputs: [
            {
                name: "admin",
                type: "address",
                internalType: "address",
            },
        ],
        outputs: [],
        stateMutability: "nonpayable",
    },
    {
        type: "function",
        name: "renounceAdmin",
        inputs: [],
        outputs: [],
        stateMutability: "nonpayable",
    },
    {
        type: "function",
        name: "reportOutcome",
        inputs: [
            {
                name: "_questionId",
                type: "bytes32",
                internalType: "bytes32",
            },
            {
                name: "_outcome",
                type: "bool",
                internalType: "bool",
            },
        ],
        outputs: [],
        stateMutability: "nonpayable",
    },
    {
        type: "function",
        name: "safeTransferFrom",
        inputs: [
            {
                name: "_from",
                type: "address",
                internalType: "address",
            },
            {
                name: "_to",
                type: "address",
                internalType: "address",
            },
            {
                name: "_id",
                type: "uint256",
                internalType: "uint256",
            },
            {
                name: "_value",
                type: "uint256",
                internalType: "uint256",
            },
            {
                name: "_data",
                type: "bytes",
                internalType: "bytes",
            },
        ],
        outputs: [],
        stateMutability: "nonpayable",
    },
    {
        type: "function",
        name: "splitPosition",
        inputs: [
            {
                name: "_collateralToken",
                type: "address",
                internalType: "address",
            },
            {
                name: "",
                type: "bytes32",
                internalType: "bytes32",
            },
            {
                name: "_conditionId",
                type: "bytes32",
                internalType: "bytes32",
            },
            {
                name: "",
                type: "uint256[]",
                internalType: "uint256[]",
            },
            {
                name: "_amount",
                type: "uint256",
                internalType: "uint256",
            },
        ],
        outputs: [],
        stateMutability: "nonpayable",
    },
    {
        type: "function",
        name: "splitPosition",
        inputs: [
            {
                name: "_conditionId",
                type: "bytes32",
                internalType: "bytes32",
            },
            {
                name: "_amount",
                type: "uint256",
                internalType: "uint256",
            },
        ],
        outputs: [],
        stateMutability: "nonpayable",
    },
    {
        type: "function",
        name: "vault",
        inputs: [],
        outputs: [
            {
                name: "",
                type: "address",
                internalType: "address",
            },
        ],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "wcol",
        inputs: [],
        outputs: [
            {
                name: "",
                type: "address",
                internalType: "contract WrappedCollateral",
            },
        ],
        stateMutability: "view",
    },
    {
        type: "event",
        name: "MarketPrepared",
        inputs: [
            {
                name: "marketId",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32",
            },
            {
                name: "oracle",
                type: "address",
                indexed: true,
                internalType: "address",
            },
            {
                name: "feeBips",
                type: "uint256",
                indexed: false,
                internalType: "uint256",
            },
            {
                name: "data",
                type: "bytes",
                indexed: false,
                internalType: "bytes",
            },
        ],
        anonymous: false,
    },
    {
        type: "event",
        name: "NewAdmin",
        inputs: [
            {
                name: "admin",
                type: "address",
                indexed: true,
                internalType: "address",
            },
            {
                name: "newAdminAddress",
                type: "address",
                indexed: true,
                internalType: "address",
            },
        ],
        anonymous: false,
    },
    {
        type: "event",
        name: "OutcomeReported",
        inputs: [
            {
                name: "marketId",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32",
            },
            {
                name: "questionId",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32",
            },
            {
                name: "outcome",
                type: "bool",
                indexed: false,
                internalType: "bool",
            },
        ],
        anonymous: false,
    },
    {
        type: "event",
        name: "PayoutRedemption",
        inputs: [
            {
                name: "redeemer",
                type: "address",
                indexed: true,
                internalType: "address",
            },
            {
                name: "conditionId",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32",
            },
            {
                name: "amounts",
                type: "uint256[]",
                indexed: false,
                internalType: "uint256[]",
            },
            {
                name: "payout",
                type: "uint256",
                indexed: false,
                internalType: "uint256",
            },
        ],
        anonymous: false,
    },
    {
        type: "event",
        name: "PositionSplit",
        inputs: [
            {
                name: "stakeholder",
                type: "address",
                indexed: true,
                internalType: "address",
            },
            {
                name: "conditionId",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32",
            },
            {
                name: "amount",
                type: "uint256",
                indexed: false,
                internalType: "uint256",
            },
        ],
        anonymous: false,
    },
    {
        type: "event",
        name: "PositionsConverted",
        inputs: [
            {
                name: "stakeholder",
                type: "address",
                indexed: true,
                internalType: "address",
            },
            {
                name: "marketId",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32",
            },
            {
                name: "indexSet",
                type: "uint256",
                indexed: true,
                internalType: "uint256",
            },
            {
                name: "amount",
                type: "uint256",
                indexed: false,
                internalType: "uint256",
            },
        ],
        anonymous: false,
    },
    {
        type: "event",
        name: "PositionsMerge",
        inputs: [
            {
                name: "stakeholder",
                type: "address",
                indexed: true,
                internalType: "address",
            },
            {
                name: "conditionId",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32",
            },
            {
                name: "amount",
                type: "uint256",
                indexed: false,
                internalType: "uint256",
            },
        ],
        anonymous: false,
    },
    {
        type: "event",
        name: "QuestionPrepared",
        inputs: [
            {
                name: "marketId",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32",
            },
            {
                name: "questionId",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32",
            },
            {
                name: "index",
                type: "uint256",
                indexed: false,
                internalType: "uint256",
            },
            {
                name: "data",
                type: "bytes",
                indexed: false,
                internalType: "bytes",
            },
        ],
        anonymous: false,
    },
    {
        type: "event",
        name: "RemovedAdmin",
        inputs: [
            {
                name: "admin",
                type: "address",
                indexed: true,
                internalType: "address",
            },
            {
                name: "removedAdmin",
                type: "address",
                indexed: true,
                internalType: "address",
            },
        ],
        anonymous: false,
    },
    {
        type: "error",
        name: "DeterminedFlagAlreadySet",
        inputs: [],
    },
    {
        type: "error",
        name: "FeeBipsOutOfBounds",
        inputs: [],
    },
    {
        type: "error",
        name: "IndexOutOfBounds",
        inputs: [],
    },
    {
        type: "error",
        name: "InvalidIndexSet",
        inputs: [],
    },
    {
        type: "error",
        name: "LengthMismatch",
        inputs: [],
    },
    {
        type: "error",
        name: "MarketAlreadyDetermined",
        inputs: [],
    },
    {
        type: "error",
        name: "MarketAlreadyPrepared",
        inputs: [],
    },
    {
        type: "error",
        name: "MarketNotPrepared",
        inputs: [],
    },
    {
        type: "error",
        name: "NoConvertiblePositions",
        inputs: [],
    },
    {
        type: "error",
        name: "NotAdmin",
        inputs: [],
    },
    {
        type: "error",
        name: "NotApprovedForAll",
        inputs: [],
    },
    {
        type: "error",
        name: "OnlyOracle",
        inputs: [],
    },
    {
        type: "error",
        name: "UnexpectedCollateralToken",
        inputs: [],
    },
];
