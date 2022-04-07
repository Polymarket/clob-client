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
    };
};

const buildQueryParams = (url: string, param: string, value: string) : string => {
    const last = url.at(url.length - 1);
    // Check the last char in the url string
    // if ?, append the param directly: api.com?param=value
    if (last === "?") {

    }
}

export const addQueryParamsToUrl = (baseUrl: string, params?: FilterParams): string => {
    let url = baseUrl;
    if (params !== undefined) {
        url = `${url}?`;
        if (params.market !== undefined) {
            const last = url.at(url.length - 1);
            if (last === "?") {

            }
            url = `${url}market=${params.market}`;
        }
        if (params.max !== undefined) {
            url = `${url}?max=${params.max}`;
        }
        if (params.startTs !== undefined) {
            url = `${url}startTs=${params.startTs}`;
        }
        if (params.endTs !== undefined) {
            url = `${url}endTs=${params.endTs}`;
        }
    }
    return url;
};
