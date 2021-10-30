import { JsonRpcProvider, JsonRpcSigner } from "@ethersproject/providers";
import { Wallet } from "@ethersproject/wallet";
import {
    ClobContracts,
    EthersProviderConnector,
    getContracts,
    getSignerFromWallet,
    LimitOrderAndSignature,
    LimitOrderBuilder,
    LimitOrderData,
} from "@polymarket/order-utils";
import { OrderCreationArgs, UserOrder } from "../types";
import { buildOrderCreationArgs } from "./utils";

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

    const jsonRpcSigner = await getSignerFromWallet(signer, args.chainID, signer.provider as JsonRpcProvider);

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
    };

    return orderAndSignature;
};

export const createOrder = async (signer: Wallet | JsonRpcSigner, userOrder: UserOrder): Promise<any> => {
    const chainID = await signer.getChainId();
    const maker = await signer.getAddress();
    const clobContracts: ClobContracts = getContracts(chainID);
    const exchange = clobContracts.Exchange;
    const collateral = clobContracts.Collateral;

    const orderArgs = await buildOrderCreationArgs(maker, chainID, exchange, collateral, userOrder);
    const orderAndSig = buildOrder(signer, orderArgs);
    return orderAndSig;
};
