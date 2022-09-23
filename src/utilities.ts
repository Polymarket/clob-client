import { Side as UtilsSide, SignedOrder } from "@polymarket/order-utils";

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

export const roundNormal = (num: number, decimals: number): number => {
    return Math.round((num + Number.EPSILON) * 10 ** decimals) / 10 ** decimals;
};

export const roundDown = (num: number, decimals: number): number => {
    return Math.floor(num * 10 ** decimals) / 10 ** decimals;
};

export const roundUp = (num: number, decimals: number): number => {
    return Math.ceil(num * 10 ** decimals) / 10 ** decimals;
};
