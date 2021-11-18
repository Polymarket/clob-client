import { JsonRpcSigner } from "@ethersproject/providers";
import { Wallet } from "@ethersproject/wallet";
import {
    ClobContracts,
    EthersProviderConnector,
    getContracts,
    LimitOrderAndSignature,
    LimitOrderBuilder,
    LimitOrderData,
    MarketOrderAndSignature,
    MarketOrderBuilder,
    MarketOrderData,
} from "@polymarket/order-utils";
import { OrderCreationArgs, UserMarketOrder, UserLimitOrder, MarketOrderCreationArgs } from "../types";
import { buildLimitOrderCreationArgs, buildMarketOrderCreationArgs, getJsonRpcSigner } from "./utils";

/**
 * Generate and sign a limit order
 *
 * @param signer
 * @param makerAmount
 * @param takerAmount
 * @param makerAssetType
 * @param takerAssetType
 * @param makerAssetID
 * @param takerAssetID
 * @returns
 */
const buildOrder = async (signer: Wallet | JsonRpcSigner, args: OrderCreationArgs): Promise<any> => {
    console.log(`Building Limit order signed by: ${args.maker}...`);
    const jsonRpcSigner = await getJsonRpcSigner(signer, args.chainID);
    const connector = new EthersProviderConnector(jsonRpcSigner);

    const limitOrderBuilder = new LimitOrderBuilder(args.exchange, args.chainID, connector);

    const limitOrderData: LimitOrderData = {
        exchangeAddress: args.exchange,
        makerAssetAddress: args.makerAsset,
        takerAssetAddress: args.takerAsset,
        makerAddress: args.maker,
        makerAmount: args.makerAmount,
        takerAmount: args.takerAmount,
    };

    if (args.makerAssetID !== undefined) {
        limitOrderData.makerAssetID = args.makerAssetID;
    }

    if (args.takerAssetID !== undefined) {
        limitOrderData.takerAssetID = args.takerAssetID;
    }
    // Create order
    const limitOrder = limitOrderBuilder.buildLimitOrder(limitOrderData);

    // And sign it with the maker address
    const limitOrderTypedData = limitOrderBuilder.buildLimitOrderTypedData(limitOrder);
    const limitOrderSignature = await limitOrderBuilder.buildOrderSignature(
        jsonRpcSigner._address,
        limitOrderTypedData,
    );

    const orderAndSignature: LimitOrderAndSignature = {
        order: limitOrder,
        signature: limitOrderSignature,
        orderType: "limit", // TODO: remove orderType from order-utils
    };

    return orderAndSignature;
};
/**
 *
 * @param signer
 * @param args
 */
const buildMarketOrder = async (signer: Wallet | JsonRpcSigner, args: MarketOrderCreationArgs): Promise<any> => {
    console.log(`Building Market order signed by: ${args.maker}...`);
    const jsonRpcSigner = await getJsonRpcSigner(signer, args.chainID);
    const connector = new EthersProviderConnector(jsonRpcSigner);

    const marketOrderBuilder = new MarketOrderBuilder(args.exchange, args.chainID, connector);

    const marketOrderData: MarketOrderData = {
        exchangeAddress: args.exchange,
        makerAssetAddress: args.makerAsset,
        takerAssetAddress: args.takerAsset,
        makerAddress: args.maker,
        makerAmount: args.makerAmount,
    };

    if (args.makerAssetID !== undefined) {
        marketOrderData.makerAssetID = args.makerAssetID;
    }

    if (args.takerAssetID !== undefined) {
        marketOrderData.takerAssetID = args.takerAssetID;
    }
    // Create order
    const marketOrder = marketOrderBuilder.buildMarketOrder(marketOrderData);

    // And sign it with the maker address
    const typedData = marketOrderBuilder.buildOrderTypedData(marketOrder);
    const sig = await marketOrderBuilder.buildOrderSignature(jsonRpcSigner._address, typedData);

    const orderAndSignature: MarketOrderAndSignature = {
        order: marketOrder,
        signature: sig,
    };
    console.log(`Market order and signature:`);
    console.log(orderAndSignature);

    return orderAndSignature;
};

export const createLimitOrder = async (signer: Wallet | JsonRpcSigner, userOrder: UserLimitOrder): Promise<any> => {
    const chainID = await signer.getChainId();
    const maker = await signer.getAddress();
    const clobContracts: ClobContracts = getContracts(chainID);
    const exchange = clobContracts.Exchange;
    const collateral = clobContracts.Collateral;

    const orderArgs = await buildLimitOrderCreationArgs(maker, chainID, exchange, collateral, userOrder);
    const orderAndSig = await buildOrder(signer, orderArgs);
    console.log(`Generated limit order: `);
    console.log(orderAndSig);
    return orderAndSig;
};

export const createMarketOrder = async (
    signer: Wallet | JsonRpcSigner,
    userMarketOrder: UserMarketOrder,
): Promise<any> => {
    const chainID = await signer.getChainId();
    const maker = await signer.getAddress();
    const clobContracts: ClobContracts = getContracts(chainID);
    const exchange = clobContracts.Exchange;
    const collateral = clobContracts.Collateral;

    const marketOrderArgs = await buildMarketOrderCreationArgs(maker, chainID, exchange, collateral, userMarketOrder);
    const marketOrderAndSig = await buildMarketOrder(signer, marketOrderArgs);
    console.log(`Generated market ${userMarketOrder.side} order: `);
    console.log(marketOrderAndSig);
    return marketOrderAndSig;
};
