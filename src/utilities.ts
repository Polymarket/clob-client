import { LimitOrderAndSignature, MarketOrderAndSignature } from "@polymarket/order-utils";

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
