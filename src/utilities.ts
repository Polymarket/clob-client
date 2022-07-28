import { LimitOrderAndSignature, MarketOrderAndSignature } from "@polymarket/order-utils";
import { FilterParams } from "./types";

export const limitOrderToJson = (order: LimitOrderAndSignature): any => {
    return {
        order: {
            salt: parseInt(order.order.salt, 10),
            makerAsset: order.order.makerAsset,
            takerAsset: order.order.takerAsset,
            makerAssetData: order.order.makerAssetData,
            takerAssetData: order.order.takerAssetData,
            getMakerAmount: order.order.getMakerAmount,
            getTakerAmount: order.order.getTakerAmount,
            predicate: order.order.predicate,
            permit: order.order.permit,
            interaction: order.order.interaction,
            signer: order.order.signer,
            sigType: order.order.sigType,
        },
        signature: order.signature,
        orderType: "limit",
    };
};

export const marketOrderToJson = (mktOrder: MarketOrderAndSignature): any => {
    return {
        order: {
            salt: parseInt(mktOrder.order.salt, 10),
            maker: mktOrder.order.maker,
            makerAsset: mktOrder.order.makerAsset,
            makerAmount: mktOrder.order.makerAmount,
            makerAssetID: mktOrder.order.makerAssetID,
            takerAsset: mktOrder.order.takerAsset,
            takerAssetID: mktOrder.order.takerAssetID,
            signer: mktOrder.order.signer,
            sigType: mktOrder.order.sigType,
        },
        signature: mktOrder.signature,
        orderType: "market",
        minAmountReceived: mktOrder.minAmountReceived,
        timeInForce: mktOrder.timeInForce,
    };
};

const buildQueryParams = (url: string, param: string, value: string): string => {
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
