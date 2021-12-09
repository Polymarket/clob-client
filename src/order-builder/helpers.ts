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
    SignatureType,
} from "@polymarket/order-utils";
import { ethers } from "ethers";
import { OrderCreationArgs, UserMarketOrder, UserLimitOrder, MarketOrderCreationArgs, Side } from "../types";
import { COLLATERAL_TOKEN_DECIMALS } from "./constants";
import { getJsonRpcSigner, getTokenID } from "./utils";

/**
 * Translate simple user order to args used to generate LimitOrders
 */
export const buildLimitOrderCreationArgs = async (
    signer: string,
    maker: string,
    chainID: number,
    exchange: string,
    collateral: string,
    signatureType: SignatureType,
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
        signer,
        maker,
        makerAsset,
        makerAmount,
        makerAssetID,
        takerAsset,
        takerAmount,
        takerAssetID,
        signatureType,
    };
};

/**
 * Translate simple user order to args used to generate MarketOrders
 */
export const buildMarketOrderCreationArgs = async (
    signer: string,
    maker: string,
    chainID: number,
    exchange: string,
    collateral: string,
    signatureType: SignatureType,
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
    return {
        chainID,
        exchange,
        signer,
        maker,
        makerAsset,
        makerAmount,
        makerAssetID,
        takerAsset,
        takerAssetID,
        signatureType,
    };
};

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
        signer: args.signer,
        sigType: args.signatureType,
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
        orderType: "limit",
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
        signer: args.signer,
        sigType: args.signatureType,
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

const getSigner = (eoa: string, makerAddress: string, sigType: number): string => {
    switch (sigType) {
        case SignatureType.EOA:
            // signer is always the EOA address for EOA sigs
            return eoa;
        case SignatureType.CONTRACT:
            // signer is the contract address/ funder address
            return makerAddress;
        case SignatureType.POLY_PROXY:
            // signer is the eoa
            return eoa;
        default:
            throw new Error("invalid signature type");
    }
};

export const createLimitOrder = async (
    eoaSigner: Wallet | JsonRpcSigner,
    signatureType: SignatureType,
    funderAddress: string | undefined,
    userOrder: UserLimitOrder,
): Promise<any> => {
    const chainID = await eoaSigner.getChainId();
    const eoaSignerAddress = await eoaSigner.getAddress();
    // If funder address is not given, use the signer address
    const maker = funderAddress === undefined ? eoaSignerAddress : funderAddress;
    const signerAddress = getSigner(eoaSignerAddress, maker, signatureType);

    const clobContracts: ClobContracts = getContracts(chainID);
    const exchange = clobContracts.Exchange;
    const collateral = clobContracts.Collateral;

    const orderArgs = await buildLimitOrderCreationArgs(
        signerAddress,
        maker,
        chainID,
        exchange,
        collateral,
        signatureType,
        userOrder,
    );
    const orderAndSig = await buildOrder(eoaSigner, orderArgs);
    console.log(`Generated limit order!`);
    console.log(orderAndSig);
    return orderAndSig;
};

export const createMarketOrder = async (
    eoaSigner: Wallet | JsonRpcSigner,
    signatureType: SignatureType,
    funderAddress: string | undefined,
    userMarketOrder: UserMarketOrder,
): Promise<any> => {
    const chainID = await eoaSigner.getChainId();
    const eoaSignerAddress = await eoaSigner.getAddress();
    // If funder address is not given, use the signer address
    const maker = funderAddress === undefined ? eoaSignerAddress : funderAddress;
    const signerAddress = getSigner(eoaSignerAddress, maker, signatureType);

    const clobContracts: ClobContracts = getContracts(chainID);
    const exchange = clobContracts.Exchange;
    const collateral = clobContracts.Collateral;

    const marketOrderArgs = await buildMarketOrderCreationArgs(
        signerAddress,
        maker,
        chainID,
        exchange,
        collateral,
        signatureType,
        userMarketOrder,
    );

    const marketOrderAndSig = await buildMarketOrder(eoaSigner, marketOrderArgs);
    console.log(`Generated market ${userMarketOrder.side} order!`);
    console.log(marketOrderAndSig);
    return marketOrderAndSig;
};
