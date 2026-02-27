import type { EIP712Object } from "./eip712.model.ts";
import type { Side } from "./order-side.model.ts";
import type { SignatureType } from "./signature-types.model.ts";

export type OrderSignature = string;

export type OrderHash = string;

export interface OrderData {
    /**
     * Maker of the order, i.e the source of funds for the order
     */
    maker: string;

    /**
     * Address of the order taker. The zero address is used to indicate a public order
     */
    taker: string;

    /**
     * Token Id of the CTF ERC1155 asset to be bought or sold.
     * If BUY, this is the tokenId of the asset to be bought, i.e the makerAssetId
     * If SELL, this is the tokenId of the asset to be sold, i.e the takerAssetId
     */
    tokenId: string;

    /**
     * Maker amount, i.e the max amount of tokens to be sold
     */
    makerAmount: string;

    /**
     * Taker amount, i.e the minimum amount of tokens to be received
     */
    takerAmount: string;

    /**
     * The side of the order, BUY or SELL
     */
    side: Side;

    /**
     * Fee rate, in basis points, charged to the order maker, charged on proceeds
     */
    feeRateBps: string;

    /**
     * Nonce used for onchain cancellations
     */
    nonce: string;

    /**
     * Signer of the order. Optional, if it is not present the signer is the maker of the order.
     */
    signer?: string;

    /**
     * Timestamp after which the order is expired.
     * Optional, if it is not present the value is "0" (no expiration)
     */
    expiration?: string;

    /**
     * Signature type used by the Order. Default value "EOA"
     */
    signatureType?: SignatureType;
}

export interface Order extends EIP712Object {
    /**
     * Unique salt to ensure entropy
     */
    readonly salt: string;

    /**
     * Maker of the order, i.e the source of funds for the order
     */
    readonly maker: string;

    /**
     * Signer of the order
     */
    readonly signer: string;

    /**
     * Address of the order taker. The zero address is used to indicate a public order
     */
    readonly taker: string;

    /**
     * Token Id of the CTF ERC1155 asset to be bought or sold.
     * If BUY, this is the tokenId of the asset to be bought, i.e the makerAssetId
     * If SELL, this is the tokenId of the asset to be sold, i.e the takerAssetId
     */
    readonly tokenId: string;

    /**
     * Maker amount, i.e the max amount of tokens to be sold
     */
    readonly makerAmount: string;

    /**
     * Taker amount, i.e the minimum amount of tokens to be received
     */
    readonly takerAmount: string;

    /**
     * Timestamp after which the order is expired
     */
    readonly expiration: string;

    /**
     * Nonce used for onchain cancellations
     */
    readonly nonce: string;

    /**
     * Fee rate, in basis points, charged to the order maker, charged on proceeds
     */
    readonly feeRateBps: string;

    /**
     * The side of the order, BUY or SELL
     */
    readonly side: Side;

    /**
     * Signature type used by the Order
     */
    readonly signatureType: SignatureType;
}

export interface SignedOrder extends Order {
    /**
     * The order signature
     */
    readonly signature: OrderSignature;
}
