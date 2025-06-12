import { Side as UtilsSide, SignedOrder } from "@polymarket/order-utils";
import { createHash } from "crypto";
import { NewOrder, OrderBookSummary, OrderType, Side, TickSize } from "./types";

export function orderToJson<T extends OrderType>(
    order: SignedOrder,
    owner: string,
    orderType: T,
    deferExec = false,
): NewOrder<T> {
    let side = Side.BUY;
    if (order.side == UtilsSide.BUY) {
        side = Side.BUY;
    } else {
        side = Side.SELL;
    }

    return {
        deferExec,
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
    } as NewOrder<T>;
}

export const roundNormal = (num: number, decimals: number): number => {
    if (decimalPlaces(num) <= decimals) {
        return num;
    }
    return Math.round((num + Number.EPSILON) * 10 ** decimals) / 10 ** decimals;
};

export const roundDown = (num: number, decimals: number): number => {
    if (decimalPlaces(num) <= decimals) {
        return num;
    }
    return Math.floor(num * 10 ** decimals) / 10 ** decimals;
};

export const roundUp = (num: number, decimals: number): number => {
    if (decimalPlaces(num) <= decimals) {
        return num;
    }
    return Math.ceil(num * 10 ** decimals) / 10 ** decimals;
};

export const decimalPlaces = (num: number): number => {
    if (Number.isInteger(num)) {
        return 0;
    }

    const arr = num.toString().split(".");
    if (arr.length <= 1) {
        return 0;
    }

    return arr[1].length;
};

/**
 * Calculates the hash for the given orderbook
 * @param orderbook
 * @returns
 */
export const generateOrderBookSummaryHash = (orderbook: OrderBookSummary): string => {
    orderbook.hash = "";
    const hash = createHash("sha1").update(JSON.stringify(orderbook)).digest("hex");
    orderbook.hash = hash;
    return hash;
};

export const isTickSizeSmaller = (a: TickSize, b: TickSize): boolean => {
    return parseFloat(a) < parseFloat(b);
};

export const priceValid = (price: number, tickSize: TickSize): boolean => {
    return price >= parseFloat(tickSize) && price <= 1 - parseFloat(tickSize);
};
