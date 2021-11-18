import { getSignerFromWallet, LimitOrderAndSignature, MarketOrderAndSignature } from "@polymarket/order-utils";
import { JsonRpcProvider, JsonRpcSigner } from "@ethersproject/providers";
import { Wallet } from "@ethersproject/wallet";
import { ethers } from "ethers";
import { OrderCreationArgs, Side, UserMarketOrder, UserLimitOrder, MarketOrderCreationArgs } from "../types";
import { COLLATERAL_TOKEN_DECIMALS } from "./constants";

export const getTokenID = (condition: string): number => {
    switch (condition.toLowerCase()) {
        // TODO: assuming YES = 0, NO = 1, following the [Yes, No] structure
        // will be a problem for scalars, non binary markets, figure out fix
        case "yes":
            return 0;
        case "no":
            return 1;
        default:
            throw new Error("Invalid asset condition");
    }
};

/**
 * Translate simple user order to args used to generate LimitOrders
 * @param maker
 * @param chainID
 * @param exchange
 * @param collateral
 * @param userOrder
 */
export const buildLimitOrderCreationArgs = async (
    maker: string,
    chainID: number,
    exchange: string,
    collateral: string,
    userOrder: UserLimitOrder,
): Promise<OrderCreationArgs> => {
    let makerAsset: string;
    let takerAsset: string;

    let makerAssetID: number | undefined;
    let takerAssetID: number | undefined;

    let makerAmount: string;
    let takerAmount: string;

    const price = userOrder.price as number;

    if (userOrder.side === Side.BUY) {
        makerAsset = collateral;
        takerAsset = userOrder.asset.address;
        makerAssetID = undefined;
        takerAssetID = getTokenID(userOrder.asset.condition);
        // force 2 decimals places
        const rawMakerAmt = parseFloat((price * userOrder.size).toFixed(2));
        makerAmount = ethers.utils.parseUnits(rawMakerAmt.toString(), COLLATERAL_TOKEN_DECIMALS).toString();
        const rawTakerAmt = parseFloat(userOrder.size.toFixed(2));
        takerAmount = ethers.utils.parseEther(rawTakerAmt.toString()).toString();
    } else {
        makerAsset = userOrder.asset.address;
        takerAsset = collateral;
        makerAssetID = getTokenID(userOrder.asset.condition as string);
        takerAssetID = undefined;
        const rawMakerAmt = parseFloat(userOrder.size.toFixed(2));
        makerAmount = ethers.utils.parseEther(rawMakerAmt.toString()).toString();
        const rawTakerAmt = parseFloat((price * userOrder.size).toFixed(2));
        takerAmount = ethers.utils.parseUnits(rawTakerAmt.toString(), COLLATERAL_TOKEN_DECIMALS).toString();
    }

    return {
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
};

/**
 * Translate simple user order to args used to generate MarketOrders
 * @param maker
 * @param chainID
 * @param exchange
 * @param collateral
 * @param userMarketOrder
 * @returns
 */
export const buildMarketOrderCreationArgs = async (
    maker: string,
    chainID: number,
    exchange: string,
    collateral: string,
    userOrder: UserMarketOrder,
): Promise<MarketOrderCreationArgs> => {
    let makerAsset: string;
    let takerAsset: string;

    let makerAssetID: number | undefined;
    let takerAssetID: number | undefined;

    let makerAmount: string;

    if (userOrder.side === Side.BUY) {
        // market buy
        makerAsset = collateral; // Set maker asset to collateral if market buy
        takerAsset = userOrder.asset.address; // taker Asset to ConditionalToken
        makerAssetID = undefined;
        takerAssetID = getTokenID(userOrder.asset.condition);
        // We always round sizes to 2 decimal places
        const roundedMakerAmt = userOrder.size.toFixed(2).toString();
        makerAmount = ethers.utils.parseUnits(roundedMakerAmt, COLLATERAL_TOKEN_DECIMALS).toString();
    } else {
        // market sell
        makerAsset = userOrder.asset.address;
        takerAsset = collateral;
        makerAssetID = getTokenID(userOrder.asset.condition as string);
        takerAssetID = undefined;
        const roundedMakerAmt = userOrder.size.toFixed(2).toString();
        makerAmount = ethers.utils.parseEther(roundedMakerAmt).toString();
    }
    console.log(`Market order args: `);

    return {
        chainID,
        exchange,
        maker,
        makerAsset,
        makerAmount,
        makerAssetID,
        takerAsset,
        takerAssetID,
    };
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
        orderType: order.orderType,
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
        },
        signature: mktOrder.signature,
    };
};

export const getJsonRpcSigner = async (signer: Wallet | JsonRpcSigner, chainID: number): Promise<JsonRpcSigner> => {
    let jsonRpcSigner: JsonRpcSigner;
    if (signer instanceof Wallet) {
        jsonRpcSigner = await getSignerFromWallet(signer, chainID, signer.provider as JsonRpcProvider);
    } else {
        jsonRpcSigner = signer;
    }
    return jsonRpcSigner;
};
