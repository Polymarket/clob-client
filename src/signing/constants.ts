export const CLOB_DOMAIN_NAME = "ClobAuthDomain";
export const CLOB_VERSION = "1";
export const MSG_TO_SIGN = "This message attests that I control the given wallet";

export const CLOB_DOMAIN = {
    name: CLOB_DOMAIN_NAME,
    version: CLOB_VERSION,
    chainId: 1,
};

export const CLOB_TYPES = {
    ClobAuth: [
        { name: "address", type: "address" },
        { name: "timestamp", type: "string" },
        { name: "message", type: "string" },
    ],
};
