import { Side as UtilsSide, SignedOrder } from "@polymarket/order-utils";
import { FilterParams } from "./types";

export const orderToJson = (order: SignedOrder): any => {
    let side = "";
    if (order.side == UtilsSide.BUY) {
        side = "buy";
    } else {
        side = "sell";
    }
    return {
        salt: parseInt(order.salt, 10),
        maker: order.maker,
        signer: order.signer,
        taker: order.taker,
        tokenId: order.tokenId,
        makerAmount: order.makerAmount,
        takerAmount: order.takerAmount,
        side,
        expiration: order.expiration,
        nonce: order.nonce,
        feeRateBps: order.feeRateBps,
        signatureType: order.signatureType,
        signature: order.signature,
    };
};

export const buildQueryParams = (url: string, param: string, value: string): string => {
    let urlWithParams = url;
    const last = url.charAt(url.length - 1);
    // Check the last char in the url string
    // if ?, append the param directly: api.com?param=value
    if (last === "?") {
        urlWithParams = `${urlWithParams}${param}=${value}`;
    } else {
        // else append "&" then the param: api.com?param1=value1&param2=value2
        urlWithParams = `${urlWithParams}&${param}=${value}`;
    }
    return urlWithParams;
};

export const addQueryParamsToUrl = (baseUrl: string, params?: FilterParams): string => {
    let url = baseUrl;
    if (params !== undefined) {
        url = `${url}?`;
        if (params.market !== undefined) {
            url = buildQueryParams(url, "market", params.market as string);
        }
        if (params.max !== undefined) {
            url = buildQueryParams(url, "max", `${params.max}`);
        }
        if (params.startTs !== undefined) {
            url = buildQueryParams(url, "startTs", `${params.startTs}`);
        }
        if (params.endTs !== undefined) {
            url = buildQueryParams(url, "endTs", `${params.endTs}`);
        }
    }
    return url;
};

export const roundNormal = (num: number, decimals: number): number => {
    return Math.round((num + Number.EPSILON) * 10 ** decimals) / 10 ** decimals;
};

export const roundDown = (num: number, decimals: number): number => {
    return Math.floor(num * 10 ** decimals) / 10 ** decimals;
};

export const roundUp = (num: number, decimals: number): number => {
    return Math.ceil(num * 10 ** decimals) / 10 ** decimals;
};
