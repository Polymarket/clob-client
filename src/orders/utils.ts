import { LimitOrderAndSignature } from "@polymarket/order-utils";
import { ethers } from "ethers";
import { OrderCreationArgs, Side, UserOrder } from "../types";
import { COLLATERAL_TOKEN_DECIMALS } from "./constants";

const getTokenID = (condition: string): number => {
    switch (condition.toLowerCase()) {
        case "yes":
            return 0;
        case "no":
            return 1;
        default:
            throw new Error("Invalid asset condition");
    }
};

/**
 * Translate simple user order to OrderCreationArgs
 * @param signer
 * @param userOrder
 */
export const buildOrderCreationArgs = async (
    maker: string,
    chainID: number,
    exchange: string,
    collateral: string,
    userOrder: UserOrder,
): Promise<OrderCreationArgs> => {
    let makerAsset: string;
    let takerAsset: string;

    let makerAssetID: number | undefined;
    let takerAssetID: number | undefined;

    let makerAmount: string;
    let takerAmount: string;

    if (userOrder.side === Side.Buy) {
        makerAsset = collateral;
        takerAsset = userOrder.asset.address;
        makerAssetID = undefined;
        takerAssetID = getTokenID(userOrder.asset.condition);
        const rawMakerAmt = userOrder.price * userOrder.size;
        makerAmount = ethers.utils.parseUnits(rawMakerAmt.toString(), COLLATERAL_TOKEN_DECIMALS).toString();
        const rawTakerAmt = userOrder.size;
        takerAmount = ethers.utils.parseEther(rawTakerAmt.toString()).toString();
    } else {
        makerAsset = userOrder.asset.address;
        takerAsset = collateral;
        makerAssetID = getTokenID(userOrder.asset.condition);
        takerAssetID = undefined;
        const rawMakerAmt = userOrder.size;
        makerAmount = ethers.utils.parseEther(rawMakerAmt.toString()).toString();
        const rawTakerAmt = userOrder.price * userOrder.size;
        takerAmount = ethers.utils.parseUnits(rawTakerAmt.toString(), COLLATERAL_TOKEN_DECIMALS).toString();
    }

    const orderCreateArgs: OrderCreationArgs = {
        chainID,
        exchange,
        maker,
        makerAsset,
        makerAmount,
        makerAssetID,
        takerAsset,
        takerAmount,
        takerAssetID,
    };
    return orderCreateArgs;
};

export const orderToJson = (order: LimitOrderAndSignature): any => {
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
        },
        signature: order.signature,
    };
};
