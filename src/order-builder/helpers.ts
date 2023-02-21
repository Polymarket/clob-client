import { JsonRpcSigner } from "@ethersproject/providers";
import { Wallet } from "@ethersproject/wallet";
import { parseUnits } from "ethers/lib/utils";
import {
    ExchangeOrderBuilder,
    getContracts,
    OrderData,
    SignatureType,
    SignedOrder,
    Side as UtilsSide,
    COLLATERAL_TOKEN_DECIMALS,
    CONDITIONAL_TOKEN_DECIMALS,
} from "@polymarket/order-utils";
import { UserOrder, Side, Chain, UserMarketOrder } from "../types";
import { decimalPlaces, roundDown, roundNormal, roundUp } from "../utilities";

/**
 * Generate and sign a order
 *
 * @param signer
 * @param contractAddress ctf exchange contract address
 * @param chainId
 * @param OrderData
 * @returns SignedOrder
 */
export const buildOrder = async (
    signer: Wallet | JsonRpcSigner,
    contractAddress: string,
    chainId: number,
    orderData: OrderData,
): Promise<SignedOrder> => {
    const cTFExchangeOrderBuilder = new ExchangeOrderBuilder(contractAddress, chainId, signer);
    return cTFExchangeOrderBuilder.buildSignedOrder(orderData);
};

export const getOrderAmounts = (
    side: Side,
    size: number,
    price: number,
): { side: UtilsSide; rawMakerAmt: number; rawTakerAmt: number } => {
    const rawPrice = roundNormal(price, 2);

    if (side === Side.BUY) {
        // force 2 decimals places
        const rawTakerAmt = roundDown(size, 2);

        let rawMakerAmt = rawTakerAmt * rawPrice;
        if (decimalPlaces(rawMakerAmt) > 4) {
            rawMakerAmt = roundUp(rawMakerAmt, 8);
            if (decimalPlaces(rawMakerAmt) > 4) {
                rawMakerAmt = roundDown(rawMakerAmt, 4);
            }
        }

        return {
            side: UtilsSide.BUY,
            rawMakerAmt,
            rawTakerAmt,
        };
    } else {
        const rawMakerAmt = roundDown(size, 2);

        let rawTakerAmt = rawMakerAmt * rawPrice;
        if (decimalPlaces(rawTakerAmt) > 4) {
            rawTakerAmt = roundUp(rawTakerAmt, 8);
            if (decimalPlaces(rawTakerAmt) > 4) {
                rawTakerAmt = roundDown(rawTakerAmt, 4);
            }
        }

        return {
            side: UtilsSide.SELL,
            rawMakerAmt,
            rawTakerAmt,
        };
    }
};

/**
 * Translate simple user order to args used to generate Orders
 */
export const buildOrderCreationArgs = async (
    signer: string,
    maker: string,
    signatureType: SignatureType,
    userOrder: UserOrder,
): Promise<OrderData> => {
    const { side, rawMakerAmt, rawTakerAmt } = getOrderAmounts(
        userOrder.side,
        userOrder.size,
        userOrder.price,
    );

    const makerAmount = parseUnits(rawMakerAmt.toString(), COLLATERAL_TOKEN_DECIMALS).toString();
    const takerAmount = parseUnits(rawTakerAmt.toString(), CONDITIONAL_TOKEN_DECIMALS).toString();

    let taker;
    if (typeof userOrder.taker !== "undefined" && userOrder.taker) {
        taker = userOrder.taker;
    } else {
        taker = "0x0000000000000000000000000000000000000000";
    }

    let feeRateBps;
    if (typeof userOrder.feeRateBps !== "undefined" && userOrder.feeRateBps) {
        feeRateBps = userOrder.feeRateBps.toString();
    } else {
        feeRateBps = "0";
    }

    let nonce;
    if (typeof userOrder.nonce !== "undefined" && userOrder.nonce) {
        nonce = userOrder.nonce.toString();
    } else {
        nonce = "0";
    }

    return {
        maker,
        taker,
        tokenId: userOrder.tokenID,
        makerAmount,
        takerAmount,
        side,
        feeRateBps,
        nonce,
        signer,
        expiration: (userOrder.expiration || 0).toString(),
        signatureType,
    } as OrderData;
};

export const createOrder = async (
    eoaSigner: Wallet | JsonRpcSigner,
    chainId: Chain,
    signatureType: SignatureType,
    funderAddress: string | undefined,
    userOrder: UserOrder,
): Promise<SignedOrder> => {
    const eoaSignerAddress = await eoaSigner.getAddress();

    // If funder address is not given, use the signer address
    const maker = funderAddress === undefined ? eoaSignerAddress : funderAddress;
    const clobContracts = getContracts(chainId);

    const orderData = await buildOrderCreationArgs(
        eoaSignerAddress,
        maker,
        signatureType,
        userOrder,
    );
    return buildOrder(eoaSigner, clobContracts.Exchange, chainId, orderData);
};

export const getMarketBuyOrderRawAmounts = (
    amount: number,
    price: number,
): { rawMakerAmt: number; rawTakerAmt: number } => {
    // force 2 decimals places
    const rawMakerAmt = roundDown(amount, 2);
    const rawPrice = roundDown(price, 2);

    let rawTakerAmt = rawMakerAmt / rawPrice;
    if (decimalPlaces(rawTakerAmt) > 4) {
        rawTakerAmt = roundUp(rawTakerAmt, 8);
        if (decimalPlaces(rawTakerAmt) > 4) {
            rawTakerAmt = roundDown(rawTakerAmt, 4);
        }
    }

    return {
        rawMakerAmt,
        rawTakerAmt,
    };
};

/**
 * Translate simple user market order to args used to generate Orders
 */
export const buildMarketBuyOrderCreationArgs = async (
    signer: string,
    maker: string,
    signatureType: SignatureType,
    userMarketOrder: UserMarketOrder,
): Promise<OrderData> => {
    const { rawMakerAmt, rawTakerAmt } = getMarketBuyOrderRawAmounts(
        userMarketOrder.amount,
        userMarketOrder.price || 1,
    );

    const makerAmount = parseUnits(rawMakerAmt.toString(), COLLATERAL_TOKEN_DECIMALS).toString();
    const takerAmount = parseUnits(rawTakerAmt.toString(), CONDITIONAL_TOKEN_DECIMALS).toString();

    let taker;
    if (typeof userMarketOrder.taker !== "undefined" && userMarketOrder.taker) {
        taker = userMarketOrder.taker;
    } else {
        taker = "0x0000000000000000000000000000000000000000";
    }

    let feeRateBps;
    if (typeof userMarketOrder.feeRateBps !== "undefined" && userMarketOrder.feeRateBps) {
        feeRateBps = userMarketOrder.feeRateBps.toString();
    } else {
        feeRateBps = "0";
    }

    let nonce;
    if (typeof userMarketOrder.nonce !== "undefined" && userMarketOrder.nonce) {
        nonce = userMarketOrder.nonce.toString();
    } else {
        nonce = "0";
    }

    return {
        maker,
        taker,
        tokenId: userMarketOrder.tokenID,
        makerAmount,
        takerAmount,
        side: UtilsSide.BUY,
        feeRateBps,
        nonce,
        signer,
        expiration: (userMarketOrder.expiration || 0).toString(),
        signatureType,
    } as OrderData;
};

export const createMarketBuyOrder = async (
    eoaSigner: Wallet | JsonRpcSigner,
    chainId: Chain,
    signatureType: SignatureType,
    funderAddress: string | undefined,
    userMarketOrder: UserMarketOrder,
): Promise<SignedOrder> => {
    const eoaSignerAddress = await eoaSigner.getAddress();

    // If funder address is not given, use the signer address
    const maker = funderAddress === undefined ? eoaSignerAddress : funderAddress;
    const clobContracts = getContracts(chainId);

    const orderData = await buildMarketBuyOrderCreationArgs(
        eoaSignerAddress,
        maker,
        signatureType,
        userMarketOrder,
    );
    return buildOrder(eoaSigner, clobContracts.Exchange, chainId, orderData);
};
