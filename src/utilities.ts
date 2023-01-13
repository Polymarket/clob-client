import { Side as UtilsSide, SignedOrder } from "@polymarket/order-utils";
import { NewOrder, OrderType, Side } from "./types";

export const orderToJson = (order: SignedOrder, owner: string, orderType: OrderType): NewOrder => {
    let side = Side.BUY;
    if (order.side == UtilsSide.BUY) {
        side = Side.BUY;
    } else {
        side = Side.SELL;
    }
    return {
        order: {
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
        },
        owner,
        orderType,
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

export const decimalPlaces = (num: number): number => {
    if (Number.isInteger(num)) {
        return 0;
    }
    const arr = num.toString().split(".");
    return arr[1].length;
};
