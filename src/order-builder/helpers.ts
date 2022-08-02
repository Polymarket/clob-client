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
    TimeInForce,
} from "@polymarket/order-utils";
import { ethers } from "ethers";
import { OrderCreationArgs, UserMarketOrder, UserLimitOrder, MarketOrderCreationArgs, Side } from "../types";
import { COLLATERAL_TOKEN_DECIMALS, CONDITIONAL_TOKEN_DECIMALS } from "./constants";
import { getJsonRpcSigner } from "./utils";

/**
 * Translate simple user order to args used to generate LimitOrders
 */
export const buildLimitOrderCreationArgs = async (
    signer: string,
    maker: string,
    chainID: number,
    exchange: string,
    executor: string,
    collateral: string,
    conditional: string,
    signatureType: SignatureType,
    userOrder: UserLimitOrder,
): Promise<OrderCreationArgs> => {
    let makerAsset: string;
    let takerAsset: string;

    let makerAssetID: string | undefined;
    let takerAssetID: string | undefined;

    let makerAmount: string;
    let takerAmount: string;

    const price = userOrder.price as number;

    if (userOrder.side === Side.BUY) {
        makerAsset = collateral;
        takerAsset = conditional;
        makerAssetID = undefined;
        takerAssetID = userOrder.tokenID;

        // force 2 decimals places
        const rawTakerAmt = parseFloat(userOrder.size.toFixed(2));
        const rawPrice = parseFloat(userOrder.price.toFixed(2));
        const rawMakerAmt = (rawTakerAmt*rawPrice).toFixed(4);
        makerAmount = ethers.utils.parseUnits(rawMakerAmt.toString(), COLLATERAL_TOKEN_DECIMALS).toString();
        takerAmount = ethers.utils.parseUnits(rawTakerAmt.toString(), CONDITIONAL_TOKEN_DECIMALS).toString();
    } else {
        makerAsset = conditional;
        takerAsset = collateral;
        makerAssetID = userOrder.tokenID;
        takerAssetID = undefined;
        const rawMakerAmt = parseFloat(userOrder.size.toFixed(2));
        makerAmount = ethers.utils.parseUnits(rawMakerAmt.toString(), CONDITIONAL_TOKEN_DECIMALS).toString();
        const rawPrice = parseFloat(userOrder.price.toFixed(2));
        const rawTakerAmt = parseFloat((rawPrice * rawMakerAmt).toFixed(4));
        takerAmount = ethers.utils.parseUnits(rawTakerAmt.toString(), COLLATERAL_TOKEN_DECIMALS).toString();
    }

    return {
        chainID,
        exchange,
        executor,
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
    conditional: string,
    signatureType: SignatureType,
    userOrder: UserMarketOrder,
): Promise<MarketOrderCreationArgs> => {
    let makerAsset: string;
    let takerAsset: string;

    let makerAssetID: string | undefined;
    let takerAssetID: string | undefined;

    let makerAmount: string;

    let minAmountReceived = "0"; // Default to 0

    let timeInForce: TimeInForce = "FOK";
    if (userOrder.timeInForce) {
        timeInForce = userOrder.timeInForce;
    }

    if (userOrder.side === Side.BUY) {
        // market buy
        makerAsset = collateral; // Set maker asset to collateral if market buy
        takerAsset = conditional; // taker Asset to ConditionalToken
        makerAssetID = undefined;
        takerAssetID = userOrder.tokenID;

        if (timeInForce === "IOC") {
            // force 2 decimals places
            const rawMakerAmt = parseFloat((userOrder.size * userOrder.worstPrice!).toFixed(2));
            makerAmount = ethers.utils.parseUnits(rawMakerAmt.toString(), COLLATERAL_TOKEN_DECIMALS).toString();

            // Calculate minimum amount received
            const roundedSize = userOrder.size.toFixed(2).toString();
            minAmountReceived = ethers.utils.parseUnits(roundedSize, COLLATERAL_TOKEN_DECIMALS).toString();
        } else {
            // We always round sizes to 2 decimal places
            const roundedMakerAmt = userOrder.size.toFixed(2).toString();
            makerAmount = ethers.utils.parseUnits(roundedMakerAmt, COLLATERAL_TOKEN_DECIMALS).toString();

            // Calculate minimum amount received
            if (userOrder.worstPrice !== undefined) {
                const worstPrice = userOrder.worstPrice as number;
                const minAmt = parseFloat((userOrder.size / worstPrice).toFixed(2));
                minAmountReceived = ethers.utils.parseUnits(minAmt.toString(), COLLATERAL_TOKEN_DECIMALS).toString();
            }
        }
    } else {
        // market sell
        makerAsset = conditional;
        takerAsset = collateral;
        makerAssetID = userOrder.tokenID;
        takerAssetID = undefined;
        const roundedMakerAmt = userOrder.size.toFixed(2).toString();
        makerAmount = ethers.utils.parseUnits(roundedMakerAmt, CONDITIONAL_TOKEN_DECIMALS).toString();

        // Calculate minimum amount received
        if (userOrder.worstPrice !== undefined) {
            const worstPrice = userOrder.worstPrice as number;
            const minAmt = parseFloat((userOrder.size * worstPrice).toFixed(2));
            minAmountReceived = ethers.utils.parseUnits(minAmt.toString(), COLLATERAL_TOKEN_DECIMALS).toString();
        }
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
        minAmountReceived,
        timeInForce,
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
        takerAddress: args.executor,
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
    const address = await jsonRpcSigner.getAddress();
    const limitOrderSignature = await limitOrderBuilder.buildOrderSignature(address, limitOrderTypedData);

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
    const address = await jsonRpcSigner.getAddress();
    const sig = await marketOrderBuilder.buildOrderSignature(address, typedData);

    const orderAndSignature: MarketOrderAndSignature = {
        order: marketOrder,
        signature: sig,
        orderType: "market",
        minAmountReceived: args.minAmountReceived,
        timeInForce: args.timeInForce,
    };
    console.log(`Generated Market order!`);
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
        case SignatureType.POLY_GNOSIS_SAFE:
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
    const executor = clobContracts.Executor;
    const collateral = clobContracts.Collateral;
    const conditional = clobContracts.Conditional;

    const orderArgs = await buildLimitOrderCreationArgs(
        signerAddress,
        maker,
        chainID,
        exchange,
        executor,
        collateral,
        conditional,
        signatureType,
        userOrder,
    );
    const orderAndSig = await buildOrder(eoaSigner, orderArgs);
    console.log(`Generated limit order!`);
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
    const conditional = clobContracts.Conditional;

    const marketOrderArgs = await buildMarketOrderCreationArgs(
        signerAddress,
        maker,
        chainID,
        exchange,
        collateral,
        conditional,
        signatureType,
        userMarketOrder,
    );

    const marketOrderAndSig = await buildMarketOrder(eoaSigner, marketOrderArgs);
    return marketOrderAndSig;
};
