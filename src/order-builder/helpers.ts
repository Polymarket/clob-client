import { JsonRpcSigner } from "@ethersproject/providers";
import { Wallet } from "@ethersproject/wallet";
import { parseUnits } from "@ethersproject/units";
import {
    ExchangeOrderBuilder,
    OrderData,
    SignatureType,
    SignedOrder,
    Side as UtilsSide,
} from "@polymarket/order-utils";
import {
    UserOrder,
    Side,
    Chain,
    UserMarketOrder,
    TickSize,
    RoundConfig,
    OrderOptions,
} from "../types";
import { decimalPlaces, roundDown, roundNormal, roundUp } from "../utilities";
import {
    COLLATERAL_TOKEN_DECIMALS,
    CONDITIONAL_TOKEN_DECIMALS,
    getContractConfig,
} from "src/config";

export const ROUNDING_CONFIG: Record<TickSize, RoundConfig> = {
    "0.1": {
        price: 1,
        size: 2,
        amount: 3,
    },
    "0.01": {
        price: 2,
        size: 2,
        amount: 4,
    },
    "0.001": {
        price: 3,
        size: 2,
        amount: 5,
    },
    "0.0001": {
        price: 4,
        size: 2,
        amount: 6,
    },
};

/**
 * Generate and sign a order
 *
 * @param signer
 * @param exchangeAddress ctf exchange contract address
 * @param chainId
 * @param OrderData
 * @returns SignedOrder
 */
export const buildOrder = async (
    signer: Wallet | JsonRpcSigner,
    exchangeAddress: string,
    chainId: number,
    orderData: OrderData,
): Promise<SignedOrder> => {
    const cTFExchangeOrderBuilder = new ExchangeOrderBuilder(exchangeAddress, chainId, signer);
    return cTFExchangeOrderBuilder.buildSignedOrder(orderData);
};

export const getOrderRawAmounts = (
    side: Side,
    size: number,
    price: number,
    roundConfig: RoundConfig,
): { side: UtilsSide; rawMakerAmt: number; rawTakerAmt: number } => {
    const rawPrice = roundNormal(price, roundConfig.price);

    if (side === Side.BUY) {
        // force 2 decimals places
        const rawTakerAmt = roundDown(size, roundConfig.size);

        let rawMakerAmt = rawTakerAmt * rawPrice;
        if (decimalPlaces(rawMakerAmt) > roundConfig.amount) {
            rawMakerAmt = roundUp(rawMakerAmt, roundConfig.amount + 4);
            if (decimalPlaces(rawMakerAmt) > roundConfig.amount) {
                rawMakerAmt = roundDown(rawMakerAmt, roundConfig.amount);
            }
        }

        return {
            side: UtilsSide.BUY,
            rawMakerAmt,
            rawTakerAmt,
        };
    } else {
        const rawMakerAmt = roundDown(size, roundConfig.size);

        let rawTakerAmt = rawMakerAmt * rawPrice;
        if (decimalPlaces(rawTakerAmt) > roundConfig.amount) {
            rawTakerAmt = roundUp(rawTakerAmt, roundConfig.amount + 4);
            if (decimalPlaces(rawTakerAmt) > roundConfig.amount) {
                rawTakerAmt = roundDown(rawTakerAmt, roundConfig.amount);
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
    roundConfig: RoundConfig,
): Promise<OrderData> => {
    const { side, rawMakerAmt, rawTakerAmt } = getOrderRawAmounts(
        userOrder.side,
        userOrder.size,
        userOrder.price,
        roundConfig,
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
    orderOptions: OrderOptions,
): Promise<SignedOrder> => {
    const eoaSignerAddress = await eoaSigner.getAddress();

    // If funder address is not given, use the signer address
    const maker = funderAddress === undefined ? eoaSignerAddress : funderAddress;
    const contractConfig = getContractConfig(chainId, orderOptions.negRisk);

    const orderData = await buildOrderCreationArgs(
        eoaSignerAddress,
        maker,
        signatureType,
        userOrder,
        ROUNDING_CONFIG[orderOptions.tickSize],
    );
    return buildOrder(eoaSigner, contractConfig.exchange, chainId, orderData);
};

export const getMarketBuyOrderRawAmounts = (
    amount: number,
    price: number,
    roundConfig: RoundConfig,
): { rawMakerAmt: number; rawTakerAmt: number } => {
    // force 2 decimals places
    const rawMakerAmt = roundDown(amount, roundConfig.size);
    const rawPrice = roundDown(price, roundConfig.price);

    let rawTakerAmt = rawMakerAmt / rawPrice;
    if (decimalPlaces(rawTakerAmt) > roundConfig.amount) {
        rawTakerAmt = roundUp(rawTakerAmt, roundConfig.amount + 4);
        if (decimalPlaces(rawTakerAmt) > roundConfig.amount) {
            rawTakerAmt = roundDown(rawTakerAmt, roundConfig.amount);
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
    roundConfig: RoundConfig,
): Promise<OrderData> => {
    const { rawMakerAmt, rawTakerAmt } = getMarketBuyOrderRawAmounts(
        userMarketOrder.amount,
        userMarketOrder.price || 1,
        roundConfig,
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
    orderOptions: OrderOptions,
): Promise<SignedOrder> => {
    const eoaSignerAddress = await eoaSigner.getAddress();

    // If funder address is not given, use the signer address
    const maker = funderAddress === undefined ? eoaSignerAddress : funderAddress;
    const contractConfig = getContractConfig(chainId, orderOptions.negRisk);

    const orderData = await buildMarketBuyOrderCreationArgs(
        eoaSignerAddress,
        maker,
        signatureType,
        userMarketOrder,
        ROUNDING_CONFIG[orderOptions.tickSize],
    );
    return buildOrder(eoaSigner, contractConfig.exchange, chainId, orderData);
};
