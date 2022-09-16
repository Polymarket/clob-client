import { JsonRpcSigner } from "@ethersproject/providers";
import { Wallet } from "@ethersproject/wallet";
import { parseUnits } from "ethers/lib/utils";
import {
    CTFExchangeOrderBuilder,
    EthersProviderConnector,
    getContracts,
    OrderData,
    SignatureType,
    SignedOrder,
    Side as UtilsSide,
    COLLATERAL_TOKEN_DECIMALS,
    CONDITIONAL_TOKEN_DECIMALS,
} from "@polymarket/order-utils";
import { getJsonRpcSigner } from "./utils";
import { UserOrder, Side } from "../types";
import { roundDown } from "../utilities";

/**
 * Translate simple user order to args used to generate Orders
 */
export const buildOrderCreationArgs = async (
    signer: string,
    maker: string,
    signatureType: SignatureType,
    userOrder: UserOrder,
): Promise<OrderData> => {
    let makerAssetId: string | undefined;
    let takerAssetId: string | undefined;

    let makerAmount: string;
    let takerAmount: string;

    let side: UtilsSide;

    if (userOrder.side === Side.BUY) {
        makerAssetId = undefined;
        takerAssetId = userOrder.tokenID;
        side = UtilsSide.BUY;

        // force 2 decimals places
        const rawTakerAmt = roundDown(userOrder.size, 2);
        const rawPrice = roundDown(userOrder.price, 2);
        const rawMakerAmt = roundDown(rawTakerAmt * rawPrice, 4);

        makerAmount = parseUnits(rawMakerAmt.toString(), COLLATERAL_TOKEN_DECIMALS).toString();
        takerAmount = parseUnits(rawTakerAmt.toString(), CONDITIONAL_TOKEN_DECIMALS).toString();
    } else {
        makerAssetId = userOrder.tokenID;
        takerAssetId = undefined;
        side = UtilsSide.SELL;

        const rawMakerAmt = roundDown(userOrder.size, 2);
        const rawPrice = roundDown(userOrder.price, 2);
        const rawTakerAmt = roundDown(rawPrice * rawMakerAmt, 4);

        makerAmount = parseUnits(rawMakerAmt.toString(), CONDITIONAL_TOKEN_DECIMALS).toString();
        takerAmount = parseUnits(rawTakerAmt.toString(), COLLATERAL_TOKEN_DECIMALS).toString();
    }

    return {
        makerAddress: maker,
        makerAssetId,
        takerAssetId,
        makerAmount,
        takerAmount,
        side,
        feeRateBps: userOrder.feeRateBps,
        nonce: userOrder.nonce.toString(),
        signer,
        expiration: (userOrder.expiration || 0).toString(),
        signatureType,
    } as OrderData;
};

/**
 * Generate and sign a order
 *
 * @param signer
 * @param contractAddress ctf exchange contract address
 * @param chainId
 * @param OrderData
 * @returns SignedOrder
 */
const buildOrder = async (
    signer: Wallet | JsonRpcSigner,
    contractAddress: string,
    chainId: number,
    orderData: OrderData,
): Promise<SignedOrder> => {
    console.log(`Building order signed by: ${orderData.makerAddress}...`);
    const jsonRpcSigner = await getJsonRpcSigner(signer, chainId);
    const connector = new EthersProviderConnector(jsonRpcSigner);
    const address = await jsonRpcSigner.getAddress();
    const cTFExchangeOrderBuilder = new CTFExchangeOrderBuilder(contractAddress, chainId, connector);

    return cTFExchangeOrderBuilder.buildSignedOrder(address, orderData);
};

const getSigner = (eoa: string, sigType: number): string => {
    switch (sigType) {
        case SignatureType.EOA:
            // signer is always the EOA address for EOA sigs
            return eoa;
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

export const createOrder = async (
    eoaSigner: Wallet | JsonRpcSigner,
    signatureType: SignatureType,
    funderAddress: string | undefined,
    userOrder: UserOrder,
): Promise<any> => {
    const chainId = await eoaSigner.getChainId();
    const eoaSignerAddress = await eoaSigner.getAddress();

    // If funder address is not given, use the signer address
    const maker = funderAddress === undefined ? eoaSignerAddress : funderAddress;
    const signerAddress = getSigner(eoaSignerAddress, signatureType);

    const clobContracts = getContracts(chainId);
    const ctfExchangecontractAddress = clobContracts.CTFExchange;

    const orderData = await buildOrderCreationArgs(signerAddress, maker, signatureType, userOrder);

    const signedOrder = await buildOrder(eoaSigner, ctfExchangecontractAddress, chainId, orderData);
    console.log(`Generated order!`);

    return signedOrder;
};
