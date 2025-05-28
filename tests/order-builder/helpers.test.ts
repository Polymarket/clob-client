import "mocha";
import { expect } from "chai";
import { UserOrder, Side, Chain, UserMarketOrder, OrderSummary, OrderType } from "../../src/types";
import {
    buildOrderCreationArgs,
    buildOrder,
    createOrder,
    buildMarketOrderCreationArgs,
    createMarketOrder,
    getOrderRawAmounts,
    getMarketOrderRawAmounts,
    ROUNDING_CONFIG,
    calculateBuyMarketPrice,
    calculateSellMarketPrice,
} from "../../src/order-builder/helpers";
import { OrderData, SignatureType, Side as UtilsSide } from "@polymarket/order-utils";
import { Wallet } from "@ethersproject/wallet";
import { decimalPlaces, roundDown, roundNormal } from "../../src/utilities";
import { ContractConfig, getContractConfig } from "../../src/config";

describe("helpers", () => {
    const chainId = Chain.AMOY;
    let wallet: Wallet;
    let contractConfig: ContractConfig;
    beforeEach(() => {
        // publicly known private key
        const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
        wallet = new Wallet(privateKey);
        contractConfig = getContractConfig(chainId);
    });

    describe("buildOrder", () => {
        describe("buy order", async () => {
            it("0.1", async () => {
                const order: UserOrder = {
                    tokenID: "123",
                    price: 0.5,
                    size: 21.04,
                    side: Side.BUY,
                    feeRateBps: 111,
                    nonce: 123,
                    expiration: 50000,
                    taker: "0x0000000000000000000000000000000000000003",
                };
                const orderData: OrderData = await buildOrderCreationArgs(
                    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                    SignatureType.EOA,
                    order,
                    ROUNDING_CONFIG["0.01"],
                );
                expect(orderData).not.null;
                expect(orderData).not.undefined;

                const signedOrder = await buildOrder(
                    wallet,
                    contractConfig.exchange,
                    chainId,
                    orderData,
                );
                expect(signedOrder).not.null;
                expect(signedOrder).not.undefined;

                expect(signedOrder.salt).not.empty;
                expect(signedOrder.maker).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                expect(signedOrder.signer).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                expect(signedOrder.taker).equal("0x0000000000000000000000000000000000000003");
                expect(signedOrder.tokenId).equal("123");
                expect(signedOrder.makerAmount).equal("10520000");
                expect(signedOrder.takerAmount).equal("21040000");
                expect(signedOrder.side).equal(UtilsSide.BUY);
                expect(signedOrder.expiration).equal("50000");
                expect(signedOrder.nonce).equal("123");
                expect(signedOrder.feeRateBps).equal("111");
                expect(signedOrder.signatureType).equal(SignatureType.EOA);
                expect(signedOrder.signature).not.empty;
            });

            it("0.01", async () => {
                const order: UserOrder = {
                    tokenID: "123",
                    price: 0.56,
                    size: 21.04,
                    side: Side.BUY,
                    feeRateBps: 111,
                    nonce: 123,
                    expiration: 50000,
                    taker: "0x0000000000000000000000000000000000000003",
                };
                const orderData: OrderData = await buildOrderCreationArgs(
                    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                    SignatureType.EOA,
                    order,
                    ROUNDING_CONFIG["0.01"],
                );
                expect(orderData).not.null;
                expect(orderData).not.undefined;

                const signedOrder = await buildOrder(
                    wallet,
                    contractConfig.exchange,
                    chainId,
                    orderData,
                );
                expect(signedOrder).not.null;
                expect(signedOrder).not.undefined;

                expect(signedOrder.salt).not.empty;
                expect(signedOrder.maker).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                expect(signedOrder.signer).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                expect(signedOrder.taker).equal("0x0000000000000000000000000000000000000003");
                expect(signedOrder.tokenId).equal("123");
                expect(signedOrder.makerAmount).equal("11782400");
                expect(signedOrder.takerAmount).equal("21040000");
                expect(signedOrder.side).equal(UtilsSide.BUY);
                expect(signedOrder.expiration).equal("50000");
                expect(signedOrder.nonce).equal("123");
                expect(signedOrder.feeRateBps).equal("111");
                expect(signedOrder.signatureType).equal(SignatureType.EOA);
                expect(signedOrder.signature).not.empty;
            });

            it("0.001", async () => {
                const order: UserOrder = {
                    tokenID: "123",
                    price: 0.056,
                    size: 21.04,
                    side: Side.BUY,
                    feeRateBps: 111,
                    nonce: 123,
                    expiration: 50000,
                    taker: "0x0000000000000000000000000000000000000003",
                };
                const orderData: OrderData = await buildOrderCreationArgs(
                    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                    SignatureType.EOA,
                    order,
                    ROUNDING_CONFIG["0.001"],
                );
                expect(orderData).not.null;
                expect(orderData).not.undefined;

                const signedOrder = await buildOrder(
                    wallet,
                    contractConfig.exchange,
                    chainId,
                    orderData,
                );
                expect(signedOrder).not.null;
                expect(signedOrder).not.undefined;

                expect(signedOrder.salt).not.empty;
                expect(signedOrder.maker).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                expect(signedOrder.signer).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                expect(signedOrder.taker).equal("0x0000000000000000000000000000000000000003");
                expect(signedOrder.tokenId).equal("123");
                expect(signedOrder.makerAmount).equal("1178240");
                expect(signedOrder.takerAmount).equal("21040000");
                expect(signedOrder.side).equal(UtilsSide.BUY);
                expect(signedOrder.expiration).equal("50000");
                expect(signedOrder.nonce).equal("123");
                expect(signedOrder.feeRateBps).equal("111");
                expect(signedOrder.signatureType).equal(SignatureType.EOA);
                expect(signedOrder.signature).not.empty;
            });

            it("0.0001", async () => {
                const order: UserOrder = {
                    tokenID: "123",
                    price: 0.0056,
                    size: 21.04,
                    side: Side.BUY,
                    feeRateBps: 111,
                    nonce: 123,
                    expiration: 50000,
                    taker: "0x0000000000000000000000000000000000000003",
                };
                const orderData: OrderData = await buildOrderCreationArgs(
                    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                    SignatureType.EOA,
                    order,
                    ROUNDING_CONFIG["0.0001"],
                );
                expect(orderData).not.null;
                expect(orderData).not.undefined;

                const signedOrder = await buildOrder(
                    wallet,
                    contractConfig.exchange,
                    chainId,
                    orderData,
                );
                expect(signedOrder).not.null;
                expect(signedOrder).not.undefined;

                expect(signedOrder.salt).not.empty;
                expect(signedOrder.maker).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                expect(signedOrder.signer).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                expect(signedOrder.taker).equal("0x0000000000000000000000000000000000000003");
                expect(signedOrder.tokenId).equal("123");
                expect(signedOrder.makerAmount).equal("117824");
                expect(signedOrder.takerAmount).equal("21040000");
                expect(signedOrder.side).equal(UtilsSide.BUY);
                expect(signedOrder.expiration).equal("50000");
                expect(signedOrder.nonce).equal("123");
                expect(signedOrder.feeRateBps).equal("111");
                expect(signedOrder.signatureType).equal(SignatureType.EOA);
                expect(signedOrder.signature).not.empty;
            });

            it("precision", async () => {
                const order: UserOrder = {
                    tokenID: "123",
                    price: 0.82,
                    size: 20.0,
                    side: Side.BUY,
                    feeRateBps: 0,
                    nonce: 123,
                    expiration: 50000,
                    taker: "0x0000000000000000000000000000000000000003",
                };
                const orderData: OrderData = await buildOrderCreationArgs(
                    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                    SignatureType.EOA,
                    order,
                    ROUNDING_CONFIG["0.01"],
                );
                expect(orderData).not.null;
                expect(orderData).not.undefined;

                const signedOrder = await buildOrder(
                    wallet,
                    contractConfig.exchange,
                    chainId,
                    orderData,
                );
                expect(signedOrder).not.null;
                expect(signedOrder).not.undefined;

                expect(signedOrder.salt).not.empty;
                expect(signedOrder.maker).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                expect(signedOrder.signer).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                expect(signedOrder.taker).equal("0x0000000000000000000000000000000000000003");
                expect(signedOrder.tokenId).equal("123");
                expect(signedOrder.makerAmount).equal("16400000");
                expect(signedOrder.takerAmount).equal("20000000");
                expect(signedOrder.side).equal(UtilsSide.BUY);
                expect(signedOrder.expiration).equal("50000");
                expect(signedOrder.nonce).equal("123");
                expect(signedOrder.feeRateBps).equal("0");
                expect(signedOrder.signatureType).equal(SignatureType.EOA);
                expect(signedOrder.signature).not.empty;
            });
        });

        describe("sell order", async () => {
            it("0.1", async () => {
                const order: UserOrder = {
                    tokenID: "5",
                    price: 0.5,
                    size: 21.04,
                    side: Side.SELL,
                    feeRateBps: 0,
                    nonce: 0,
                    taker: "0x0000000000000000000000000000000000000003",
                };
                const orderData: OrderData = await buildOrderCreationArgs(
                    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                    SignatureType.POLY_PROXY,
                    order,
                    ROUNDING_CONFIG["0.1"],
                );
                expect(orderData).not.null;
                expect(orderData).not.undefined;

                const signedOrder = await buildOrder(
                    wallet,
                    contractConfig.exchange,
                    chainId,
                    orderData,
                );
                expect(signedOrder).not.null;
                expect(signedOrder).not.undefined;

                expect(signedOrder.salt).not.empty;
                expect(signedOrder.maker).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                expect(signedOrder.signer).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                expect(signedOrder.taker).equal("0x0000000000000000000000000000000000000003");
                expect(signedOrder.tokenId).equal("5");
                expect(signedOrder.makerAmount).equal("21040000");
                expect(signedOrder.takerAmount).equal("10520000");
                expect(signedOrder.side).equal(UtilsSide.SELL);
                expect(signedOrder.expiration).equal("0");
                expect(signedOrder.nonce).equal("0");
                expect(signedOrder.feeRateBps).equal("0");
                expect(signedOrder.signatureType).equal(SignatureType.POLY_PROXY);
                expect(signedOrder.signature).not.empty;
            });

            it("0.01", async () => {
                const order: UserOrder = {
                    tokenID: "5",
                    price: 0.56,
                    size: 21.04,
                    side: Side.SELL,
                    feeRateBps: 0,
                    nonce: 0,
                    taker: "0x0000000000000000000000000000000000000003",
                };
                const orderData: OrderData = await buildOrderCreationArgs(
                    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                    SignatureType.POLY_PROXY,
                    order,
                    ROUNDING_CONFIG["0.01"],
                );
                expect(orderData).not.null;
                expect(orderData).not.undefined;

                const signedOrder = await buildOrder(
                    wallet,
                    contractConfig.exchange,
                    chainId,
                    orderData,
                );
                expect(signedOrder).not.null;
                expect(signedOrder).not.undefined;

                expect(signedOrder.salt).not.empty;
                expect(signedOrder.maker).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                expect(signedOrder.signer).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                expect(signedOrder.taker).equal("0x0000000000000000000000000000000000000003");
                expect(signedOrder.tokenId).equal("5");
                expect(signedOrder.makerAmount).equal("21040000");
                expect(signedOrder.takerAmount).equal("11782400");
                expect(signedOrder.side).equal(UtilsSide.SELL);
                expect(signedOrder.expiration).equal("0");
                expect(signedOrder.nonce).equal("0");
                expect(signedOrder.feeRateBps).equal("0");
                expect(signedOrder.signatureType).equal(SignatureType.POLY_PROXY);
                expect(signedOrder.signature).not.empty;
            });

            it("0.001", async () => {
                const order: UserOrder = {
                    tokenID: "5",
                    price: 0.056,
                    size: 21.04,
                    side: Side.SELL,
                    feeRateBps: 0,
                    nonce: 0,
                    taker: "0x0000000000000000000000000000000000000003",
                };
                const orderData: OrderData = await buildOrderCreationArgs(
                    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                    SignatureType.POLY_PROXY,
                    order,
                    ROUNDING_CONFIG["0.001"],
                );
                expect(orderData).not.null;
                expect(orderData).not.undefined;

                const signedOrder = await buildOrder(
                    wallet,
                    contractConfig.exchange,
                    chainId,
                    orderData,
                );
                expect(signedOrder).not.null;
                expect(signedOrder).not.undefined;

                expect(signedOrder.salt).not.empty;
                expect(signedOrder.maker).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                expect(signedOrder.signer).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                expect(signedOrder.taker).equal("0x0000000000000000000000000000000000000003");
                expect(signedOrder.tokenId).equal("5");
                expect(signedOrder.makerAmount).equal("21040000");
                expect(signedOrder.takerAmount).equal("1178240");
                expect(signedOrder.side).equal(UtilsSide.SELL);
                expect(signedOrder.expiration).equal("0");
                expect(signedOrder.nonce).equal("0");
                expect(signedOrder.feeRateBps).equal("0");
                expect(signedOrder.signatureType).equal(SignatureType.POLY_PROXY);
                expect(signedOrder.signature).not.empty;
            });

            it("0.0001", async () => {
                const order: UserOrder = {
                    tokenID: "5",
                    price: 0.0056,
                    size: 21.04,
                    side: Side.SELL,
                    feeRateBps: 0,
                    nonce: 0,
                    taker: "0x0000000000000000000000000000000000000003",
                };
                const orderData: OrderData = await buildOrderCreationArgs(
                    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                    SignatureType.POLY_PROXY,
                    order,
                    ROUNDING_CONFIG["0.0001"],
                );
                expect(orderData).not.null;
                expect(orderData).not.undefined;

                const signedOrder = await buildOrder(
                    wallet,
                    contractConfig.exchange,
                    chainId,
                    orderData,
                );
                expect(signedOrder).not.null;
                expect(signedOrder).not.undefined;

                expect(signedOrder.salt).not.empty;
                expect(signedOrder.maker).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                expect(signedOrder.signer).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                expect(signedOrder.taker).equal("0x0000000000000000000000000000000000000003");
                expect(signedOrder.tokenId).equal("5");
                expect(signedOrder.makerAmount).equal("21040000");
                expect(signedOrder.takerAmount).equal("117824");
                expect(signedOrder.side).equal(UtilsSide.SELL);
                expect(signedOrder.expiration).equal("0");
                expect(signedOrder.nonce).equal("0");
                expect(signedOrder.feeRateBps).equal("0");
                expect(signedOrder.signatureType).equal(SignatureType.POLY_PROXY);
                expect(signedOrder.signature).not.empty;
            });
        });
    });

    describe("getOrderRawAmounts", async () => {
        describe("buy", async () => {
            it("0.1", async () => {
                const delta_price = 0.1;
                const delta_size = 0.01;
                let size = 0.01;

                for (; size <= 1000; ) {
                    let price = 0.1;
                    for (; price <= 1; ) {
                        const { rawMakerAmt, rawTakerAmt } = getOrderRawAmounts(
                            Side.BUY,
                            size,
                            price,
                            ROUNDING_CONFIG["0.1"],
                        );

                        expect(decimalPlaces(rawMakerAmt)).to.lte(3);
                        expect(decimalPlaces(rawTakerAmt)).to.lte(2);
                        expect(roundNormal(rawMakerAmt / rawTakerAmt, 2)).to.gte(
                            roundNormal(price, 2),
                        );

                        price += delta_price;
                    }
                    size += delta_size;
                }
            });

            it("0.01", async () => {
                const delta_price = 0.01;
                const delta_size = 0.01;
                let size = 0.01;

                for (; size <= 100; ) {
                    let price = 0.01;
                    for (; price <= 1; ) {
                        const { rawMakerAmt, rawTakerAmt } = getOrderRawAmounts(
                            Side.BUY,
                            size,
                            price,
                            ROUNDING_CONFIG["0.01"],
                        );

                        expect(decimalPlaces(rawMakerAmt)).to.lte(4);
                        expect(decimalPlaces(rawTakerAmt)).to.lte(2);
                        expect(roundNormal(rawMakerAmt / rawTakerAmt, 4)).to.gte(
                            roundNormal(price, 4),
                        );

                        price += delta_price;
                    }
                    size += delta_size;
                }
            });

            it("0.001", async () => {
                const delta_price = 0.001;
                const delta_size = 0.01;
                let size = 0.01;

                for (; size <= 10; ) {
                    let price = 0.001;
                    for (; price <= 1; ) {
                        const { rawMakerAmt, rawTakerAmt } = getOrderRawAmounts(
                            Side.BUY,
                            size,
                            price,
                            ROUNDING_CONFIG["0.001"],
                        );

                        expect(decimalPlaces(rawMakerAmt)).to.lte(5);
                        expect(decimalPlaces(rawTakerAmt)).to.lte(2);
                        expect(roundNormal(rawMakerAmt / rawTakerAmt, 6)).to.gte(
                            roundNormal(price, 6),
                        );

                        price += delta_price;
                    }
                    size += delta_size;
                }
            });

            it("0.0001", async () => {
                const delta_price = 0.0001;
                const delta_size = 0.01;
                let size = 0.01;

                for (; size <= 1; ) {
                    let price = 0.0001;
                    for (; price <= 1; ) {
                        const { rawMakerAmt, rawTakerAmt } = getOrderRawAmounts(
                            Side.BUY,
                            size,
                            price,
                            ROUNDING_CONFIG["0.0001"],
                        );

                        expect(decimalPlaces(rawMakerAmt)).to.lte(6);
                        expect(decimalPlaces(rawTakerAmt)).to.lte(2);
                        expect(roundNormal(rawMakerAmt / rawTakerAmt, 8)).to.gte(
                            roundNormal(price, 8),
                        );

                        price += delta_price;
                    }
                    size += delta_size;
                }
            });
        });

        describe("sell", async () => {
            it("0.1", async () => {
                const delta_price = 0.1;
                const delta_size = 0.01;
                let size = 0.01;

                for (; size <= 1000; ) {
                    let price = 0.1;
                    for (; price <= 1; ) {
                        const { rawMakerAmt, rawTakerAmt } = getOrderRawAmounts(
                            Side.SELL,
                            size,
                            price,
                            ROUNDING_CONFIG["0.1"],
                        );

                        expect(decimalPlaces(rawMakerAmt)).to.lte(2);
                        expect(decimalPlaces(rawTakerAmt)).to.lte(3);
                        expect(roundNormal(rawTakerAmt / rawMakerAmt, 2)).to.lte(
                            roundNormal(price, 2),
                        );

                        price += delta_price;
                    }
                    size += delta_size;
                }
            });

            it("0.01", async () => {
                const delta_price = 0.01;
                const delta_size = 0.01;
                let size = 0.01;

                for (; size <= 100; ) {
                    let price = 0.01;
                    for (; price <= 1; ) {
                        const { rawMakerAmt, rawTakerAmt } = getOrderRawAmounts(
                            Side.SELL,
                            size,
                            price,
                            ROUNDING_CONFIG["0.01"],
                        );

                        expect(decimalPlaces(rawMakerAmt)).to.lte(2);
                        expect(decimalPlaces(rawTakerAmt)).to.lte(4);
                        expect(roundNormal(rawTakerAmt / rawMakerAmt, 4)).to.lte(
                            roundNormal(price, 4),
                        );

                        price += delta_price;
                    }
                    size += delta_size;
                }
            });

            it("0.001", async () => {
                const delta_price = 0.001;
                const delta_size = 0.01;
                let size = 0.01;

                for (; size <= 10; ) {
                    let price = 0.001;
                    for (; price <= 1; ) {
                        const { rawMakerAmt, rawTakerAmt } = getOrderRawAmounts(
                            Side.SELL,
                            size,
                            price,
                            ROUNDING_CONFIG["0.001"],
                        );

                        expect(decimalPlaces(rawMakerAmt)).to.lte(2);
                        expect(decimalPlaces(rawTakerAmt)).to.lte(5);
                        expect(roundNormal(rawTakerAmt / rawMakerAmt, 6)).to.lte(
                            roundNormal(price, 6),
                        );

                        price += delta_price;
                    }
                    size += delta_size;
                }
            });

            it("0.0001", async () => {
                const delta_price = 0.0001;
                const delta_size = 0.01;
                let size = 0.01;

                for (; size <= 1; ) {
                    let price = 0.0001;
                    for (; price <= 1; ) {
                        const { rawMakerAmt, rawTakerAmt } = getOrderRawAmounts(
                            Side.SELL,
                            size,
                            price,
                            ROUNDING_CONFIG["0.0001"],
                        );

                        expect(decimalPlaces(rawMakerAmt)).to.lte(2);
                        expect(decimalPlaces(rawTakerAmt)).to.lte(6);
                        expect(roundNormal(rawTakerAmt / rawMakerAmt, 8)).to.lte(
                            roundNormal(price, 8),
                        );

                        price += delta_price;
                    }
                    size += delta_size;
                }
            });
        });
    });

    describe("buildOrderCreationArgs", () => {
        describe("buy order", async () => {
            it("0.1", async () => {
                const order: UserOrder = {
                    tokenID: "123",
                    price: 0.5,
                    size: 21.04,
                    side: Side.BUY,
                    feeRateBps: 111,
                    nonce: 123,
                    expiration: 50000,
                };
                const orderData: OrderData = await buildOrderCreationArgs(
                    "0x0000000000000000000000000000000000000001",
                    "0x0000000000000000000000000000000000000002",
                    SignatureType.EOA,
                    order,
                    ROUNDING_CONFIG["0.1"],
                );
                expect(orderData).deep.equal({
                    maker: "0x0000000000000000000000000000000000000002",
                    taker: "0x0000000000000000000000000000000000000000",
                    tokenId: "123",
                    makerAmount: "10520000",
                    takerAmount: "21040000",
                    side: UtilsSide.BUY,
                    feeRateBps: "111",
                    nonce: "123",
                    signer: "0x0000000000000000000000000000000000000001",
                    expiration: "50000",
                    signatureType: SignatureType.EOA,
                });
            });

            it("0.01", async () => {
                const order: UserOrder = {
                    tokenID: "123",
                    price: 0.56,
                    size: 21.04,
                    side: Side.BUY,
                    feeRateBps: 111,
                    nonce: 123,
                    expiration: 50000,
                };
                const orderData: OrderData = await buildOrderCreationArgs(
                    "0x0000000000000000000000000000000000000001",
                    "0x0000000000000000000000000000000000000002",
                    SignatureType.EOA,
                    order,
                    ROUNDING_CONFIG["0.01"],
                );
                expect(orderData).deep.equal({
                    maker: "0x0000000000000000000000000000000000000002",
                    taker: "0x0000000000000000000000000000000000000000",
                    tokenId: "123",
                    makerAmount: "11782400",
                    takerAmount: "21040000",
                    side: UtilsSide.BUY,
                    feeRateBps: "111",
                    nonce: "123",
                    signer: "0x0000000000000000000000000000000000000001",
                    expiration: "50000",
                    signatureType: SignatureType.EOA,
                });
            });

            it("0.001", async () => {
                const order: UserOrder = {
                    tokenID: "123",
                    price: 0.056,
                    size: 21.04,
                    side: Side.BUY,
                    feeRateBps: 111,
                    nonce: 123,
                    expiration: 50000,
                };
                const orderData: OrderData = await buildOrderCreationArgs(
                    "0x0000000000000000000000000000000000000001",
                    "0x0000000000000000000000000000000000000002",
                    SignatureType.EOA,
                    order,
                    ROUNDING_CONFIG["0.001"],
                );
                expect(orderData).deep.equal({
                    maker: "0x0000000000000000000000000000000000000002",
                    taker: "0x0000000000000000000000000000000000000000",
                    tokenId: "123",
                    makerAmount: "1178240",
                    takerAmount: "21040000",
                    side: UtilsSide.BUY,
                    feeRateBps: "111",
                    nonce: "123",
                    signer: "0x0000000000000000000000000000000000000001",
                    expiration: "50000",
                    signatureType: SignatureType.EOA,
                });
            });

            it("0.0001", async () => {
                const order: UserOrder = {
                    tokenID: "123",
                    price: 0.0056,
                    size: 21.04,
                    side: Side.BUY,
                    feeRateBps: 111,
                    nonce: 123,
                    expiration: 50000,
                };
                const orderData: OrderData = await buildOrderCreationArgs(
                    "0x0000000000000000000000000000000000000001",
                    "0x0000000000000000000000000000000000000002",
                    SignatureType.EOA,
                    order,
                    ROUNDING_CONFIG["0.0001"],
                );
                expect(orderData).deep.equal({
                    maker: "0x0000000000000000000000000000000000000002",
                    taker: "0x0000000000000000000000000000000000000000",
                    tokenId: "123",
                    makerAmount: "117824",
                    takerAmount: "21040000",
                    side: UtilsSide.BUY,
                    feeRateBps: "111",
                    nonce: "123",
                    signer: "0x0000000000000000000000000000000000000001",
                    expiration: "50000",
                    signatureType: SignatureType.EOA,
                });
            });
        });

        describe("sell order", async () => {
            it("0.1", async () => {
                const order: UserOrder = {
                    tokenID: "5",
                    price: 0.5,
                    size: 21.04,
                    side: Side.SELL,
                    feeRateBps: 0,
                    nonce: 0,
                    taker: "0x000000000000000000000000000000000000000A",
                };
                const orderData: OrderData = await buildOrderCreationArgs(
                    "0x0000000000000000000000000000000000000001",
                    "0x0000000000000000000000000000000000000002",
                    SignatureType.POLY_PROXY,
                    order,
                    ROUNDING_CONFIG["0.1"],
                );
                expect(orderData).deep.equal({
                    maker: "0x0000000000000000000000000000000000000002",
                    taker: "0x000000000000000000000000000000000000000A",
                    tokenId: "5",
                    takerAmount: "10520000",
                    makerAmount: "21040000",
                    side: UtilsSide.SELL,
                    feeRateBps: "0",
                    nonce: "0",
                    signer: "0x0000000000000000000000000000000000000001",
                    expiration: "0",
                    signatureType: SignatureType.POLY_PROXY,
                });
            });

            it("0.01", async () => {
                const order: UserOrder = {
                    tokenID: "5",
                    price: 0.56,
                    size: 21.04,
                    side: Side.SELL,
                    feeRateBps: 0,
                    nonce: 0,
                    taker: "0x000000000000000000000000000000000000000A",
                };
                const orderData: OrderData = await buildOrderCreationArgs(
                    "0x0000000000000000000000000000000000000001",
                    "0x0000000000000000000000000000000000000002",
                    SignatureType.POLY_PROXY,
                    order,
                    ROUNDING_CONFIG["0.01"],
                );
                expect(orderData).deep.equal({
                    maker: "0x0000000000000000000000000000000000000002",
                    taker: "0x000000000000000000000000000000000000000A",
                    tokenId: "5",
                    takerAmount: "11782400",
                    makerAmount: "21040000",
                    side: UtilsSide.SELL,
                    feeRateBps: "0",
                    nonce: "0",
                    signer: "0x0000000000000000000000000000000000000001",
                    expiration: "0",
                    signatureType: SignatureType.POLY_PROXY,
                });
            });

            it("0.001", async () => {
                const order: UserOrder = {
                    tokenID: "5",
                    price: 0.056,
                    size: 21.04,
                    side: Side.SELL,
                    feeRateBps: 0,
                    nonce: 0,
                    taker: "0x000000000000000000000000000000000000000A",
                };
                const orderData: OrderData = await buildOrderCreationArgs(
                    "0x0000000000000000000000000000000000000001",
                    "0x0000000000000000000000000000000000000002",
                    SignatureType.POLY_PROXY,
                    order,
                    ROUNDING_CONFIG["0.001"],
                );
                expect(orderData).deep.equal({
                    maker: "0x0000000000000000000000000000000000000002",
                    taker: "0x000000000000000000000000000000000000000A",
                    tokenId: "5",
                    takerAmount: "1178240",
                    makerAmount: "21040000",
                    side: UtilsSide.SELL,
                    feeRateBps: "0",
                    nonce: "0",
                    signer: "0x0000000000000000000000000000000000000001",
                    expiration: "0",
                    signatureType: SignatureType.POLY_PROXY,
                });
            });

            it("0.0001", async () => {
                const order: UserOrder = {
                    tokenID: "5",
                    price: 0.0056,
                    size: 21.04,
                    side: Side.SELL,
                    feeRateBps: 0,
                    nonce: 0,
                    taker: "0x000000000000000000000000000000000000000A",
                };
                const orderData: OrderData = await buildOrderCreationArgs(
                    "0x0000000000000000000000000000000000000001",
                    "0x0000000000000000000000000000000000000002",
                    SignatureType.POLY_PROXY,
                    order,
                    ROUNDING_CONFIG["0.0001"],
                );
                expect(orderData).deep.equal({
                    maker: "0x0000000000000000000000000000000000000002",
                    taker: "0x000000000000000000000000000000000000000A",
                    tokenId: "5",
                    takerAmount: "117824",
                    makerAmount: "21040000",
                    side: UtilsSide.SELL,
                    feeRateBps: "0",
                    nonce: "0",
                    signer: "0x0000000000000000000000000000000000000001",
                    expiration: "0",
                    signatureType: SignatureType.POLY_PROXY,
                });
            });
        });

        describe("real cases", async () => {
            describe("0.1", async () => {
                it("correctly rounds price amounts for validity buy", async () => {
                    const order: UserOrder = {
                        tokenID: "123",
                        price: 0.5,
                        size: 21.04,
                        side: Side.BUY,
                        feeRateBps: 100,
                        nonce: 0,
                    };
                    const orderData: OrderData = await buildOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.1"],
                    );
                    expect(Number(orderData.makerAmount) / Number(orderData.takerAmount)).to.gte(
                        0.5,
                    );
                });

                it("correctly rounds price amounts for validity buy - 2", async () => {
                    const order: UserOrder = {
                        tokenID: "123",
                        price: 0.7,
                        size: 170,
                        side: Side.BUY,
                    };
                    const orderData: OrderData = await buildOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.1"],
                    );
                    expect(orderData.makerAmount).to.equal("119000000");
                    expect(orderData.takerAmount).to.equal("170000000");
                    expect(Number(orderData.makerAmount) / Number(orderData.takerAmount)).to.gte(
                        0.7,
                    );
                });

                it("correctly rounds price amounts for validity buy - 3", async () => {
                    const order: UserOrder = {
                        tokenID: "123",
                        price: 0.8,
                        size: 101,
                        side: Side.BUY,
                    };
                    const orderData: OrderData = await buildOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.1"],
                    );
                    expect(orderData.makerAmount).to.equal("80800000");
                    expect(orderData.takerAmount).to.equal("101000000");
                    expect(Number(orderData.makerAmount) / Number(orderData.takerAmount)).to.gte(
                        0.8,
                    );
                });

                it("correctly rounds price amounts for validity buy - 4", async () => {
                    const order: UserOrder = {
                        tokenID: "123",
                        size: 12.8205,
                        price: 0.7,
                        side: Side.BUY,
                    };
                    const orderData: OrderData = await buildOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.1"],
                    );
                    expect(orderData.makerAmount).to.equal("8974000");
                    expect(orderData.takerAmount).to.equal("12820000");
                    expect(Number(orderData.makerAmount) / Number(orderData.takerAmount)).to.gte(
                        0.7,
                    );
                });

                it("correctly rounds price amounts for validity buy - 5", async () => {
                    const order: UserOrder = {
                        tokenID: "123",
                        size: 2435.89,
                        price: 0.3,
                        side: Side.BUY,
                    };
                    const orderData: OrderData = await buildOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.1"],
                    );
                    expect(orderData.makerAmount).to.equal("730767000");
                    expect(orderData.takerAmount).to.equal("2435890000");
                    expect(Number(orderData.makerAmount) / Number(orderData.takerAmount)).to.gte(
                        0.3,
                    );
                });

                it("correctly rounds price amounts for validity sell", async () => {
                    const order: UserOrder = {
                        tokenID: "123",
                        price: 0.5,
                        size: 21.04,
                        side: Side.SELL,
                        feeRateBps: 100,
                        nonce: 0,
                    };

                    const orderData: OrderData = await buildOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.1"],
                    );
                    expect(Number(orderData.takerAmount) / Number(orderData.makerAmount)).to.equal(
                        0.5,
                    );
                });

                it("correctly rounds price amounts for validity sell - 2", async () => {
                    const order: UserOrder = {
                        tokenID: "123",
                        price: 0.7,
                        size: 170,
                        side: Side.SELL,
                    };
                    const orderData: OrderData = await buildOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.1"],
                    );
                    expect(orderData.takerAmount).to.equal("119000000");
                    expect(orderData.makerAmount).to.equal("170000000");
                    expect(Number(orderData.makerAmount) / Number(orderData.takerAmount)).to.gte(
                        0.7,
                    );
                });

                it("correctly rounds price amounts for validity sell - 3", async () => {
                    const order: UserOrder = {
                        tokenID: "123",
                        price: 0.8,
                        size: 101,
                        side: Side.SELL,
                    };
                    const orderData: OrderData = await buildOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.1"],
                    );
                    expect(orderData.makerAmount).to.equal("101000000");
                    expect(orderData.takerAmount).to.equal("80800000");
                    expect(Number(orderData.makerAmount) / Number(orderData.takerAmount)).to.gte(
                        0.8,
                    );
                });

                it("correctly rounds price amounts for validity sell - 4", async () => {
                    const order: UserOrder = {
                        tokenID: "123",
                        size: 12.8205,
                        price: 0.7,
                        side: Side.SELL,
                    };
                    const orderData: OrderData = await buildOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.1"],
                    );
                    expect(orderData.makerAmount).to.equal("12820000");
                    expect(orderData.takerAmount).to.equal("8974000");
                    expect(Number(orderData.takerAmount) / Number(orderData.makerAmount)).to.gte(
                        0.7,
                    );
                });

                it("correctly rounds price amounts for validity sell - 5", async () => {
                    const order: UserOrder = {
                        tokenID: "123",
                        size: 2435.89,
                        price: 0.3,
                        side: Side.SELL,
                    };
                    const orderData: OrderData = await buildOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.1"],
                    );
                    expect(orderData.makerAmount).to.equal("2435890000");
                    expect(orderData.takerAmount).to.equal("730767000");
                    expect(Number(orderData.takerAmount) / Number(orderData.makerAmount)).to.gte(
                        0.3,
                    );
                });
            });

            describe("0.01", async () => {
                it("correctly rounds price amounts for validity buy", async () => {
                    const order: UserOrder = {
                        tokenID: "123",
                        price: 0.56,
                        size: 21.04,
                        side: Side.BUY,
                        feeRateBps: 100,
                        nonce: 0,
                    };
                    const orderData: OrderData = await buildOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.01"],
                    );
                    expect(Number(orderData.makerAmount) / Number(orderData.takerAmount)).to.gte(
                        0.56,
                    );
                });

                it("correctly rounds price amounts for validity buy - 2", async () => {
                    const order: UserOrder = {
                        tokenID: "123",
                        price: 0.7,
                        size: 170,
                        side: Side.BUY,
                    };
                    const orderData: OrderData = await buildOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.01"],
                    );
                    expect(orderData.makerAmount).to.equal("119000000");
                    expect(orderData.takerAmount).to.equal("170000000");
                    expect(Number(orderData.makerAmount) / Number(orderData.takerAmount)).to.gte(
                        0.7,
                    );
                });

                it("correctly rounds price amounts for validity buy - 3", async () => {
                    const order: UserOrder = {
                        tokenID: "123",
                        price: 0.82,
                        size: 101,
                        side: Side.BUY,
                    };
                    const orderData: OrderData = await buildOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.01"],
                    );
                    expect(orderData.makerAmount).to.equal("82820000");
                    expect(orderData.takerAmount).to.equal("101000000");
                    expect(Number(orderData.makerAmount) / Number(orderData.takerAmount)).to.gte(
                        0.82,
                    );
                });

                it("correctly rounds price amounts for validity buy - 4", async () => {
                    const order: UserOrder = {
                        tokenID: "123",
                        size: 12.8205,
                        price: 0.78,
                        side: Side.BUY,
                    };
                    const orderData: OrderData = await buildOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.01"],
                    );
                    expect(orderData.makerAmount).to.equal("9999600");
                    expect(orderData.takerAmount).to.equal("12820000");
                    expect(Number(orderData.makerAmount) / Number(orderData.takerAmount)).to.gte(
                        0.78,
                    );
                });

                it("correctly rounds price amounts for validity buy - 5", async () => {
                    const order: UserOrder = {
                        tokenID: "123",
                        size: 2435.89,
                        price: 0.39,
                        side: Side.BUY,
                    };
                    const orderData: OrderData = await buildOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.01"],
                    );
                    expect(orderData.makerAmount).to.equal("949997100");
                    expect(orderData.takerAmount).to.equal("2435890000");
                    expect(Number(orderData.makerAmount) / Number(orderData.takerAmount)).to.gte(
                        0.39,
                    );
                });

                it("correctly rounds price amounts for validity sell", async () => {
                    const order: UserOrder = {
                        tokenID: "123",
                        price: 0.56,
                        size: 21.04,
                        side: Side.SELL,
                        feeRateBps: 100,
                        nonce: 0,
                    };

                    const orderData: OrderData = await buildOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.01"],
                    );
                    expect(Number(orderData.takerAmount) / Number(orderData.makerAmount)).to.equal(
                        0.56,
                    );
                });

                it("correctly rounds price amounts for validity sell - 2", async () => {
                    const order: UserOrder = {
                        tokenID: "123",
                        price: 0.7,
                        size: 170,
                        side: Side.SELL,
                    };
                    const orderData: OrderData = await buildOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.01"],
                    );
                    expect(orderData.takerAmount).to.equal("119000000");
                    expect(orderData.makerAmount).to.equal("170000000");
                    expect(Number(orderData.makerAmount) / Number(orderData.takerAmount)).to.gte(
                        0.7,
                    );
                });

                it("correctly rounds price amounts for validity sell - 3", async () => {
                    const order: UserOrder = {
                        tokenID: "123",
                        price: 0.82,
                        size: 101,
                        side: Side.SELL,
                    };
                    const orderData: OrderData = await buildOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.01"],
                    );
                    expect(orderData.makerAmount).to.equal("101000000");
                    expect(orderData.takerAmount).to.equal("82820000");
                    expect(Number(orderData.makerAmount) / Number(orderData.takerAmount)).to.gte(
                        0.82,
                    );
                });

                it("correctly rounds price amounts for validity sell - 4", async () => {
                    const order: UserOrder = {
                        tokenID: "123",
                        size: 12.8205,
                        price: 0.78,
                        side: Side.SELL,
                    };
                    const orderData: OrderData = await buildOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.01"],
                    );
                    expect(orderData.makerAmount).to.equal("12820000");
                    expect(orderData.takerAmount).to.equal("9999600");
                    expect(Number(orderData.takerAmount) / Number(orderData.makerAmount)).to.gte(
                        0.78,
                    );
                });

                it("correctly rounds price amounts for validity sell - 5", async () => {
                    const order: UserOrder = {
                        tokenID: "123",
                        size: 2435.89,
                        price: 0.39,
                        side: Side.SELL,
                    };
                    const orderData: OrderData = await buildOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.01"],
                    );
                    expect(orderData.makerAmount).to.equal("2435890000");
                    expect(orderData.takerAmount).to.equal("949997100");
                    expect(Number(orderData.takerAmount) / Number(orderData.makerAmount)).to.gte(
                        0.39,
                    );
                });
            });

            describe("0.001", async () => {
                it("correctly rounds price amounts for validity buy", async () => {
                    const order: UserOrder = {
                        tokenID: "123",
                        price: 0.056,
                        size: 21.04,
                        side: Side.BUY,
                        feeRateBps: 100,
                        nonce: 0,
                    };
                    const orderData: OrderData = await buildOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.001"],
                    );
                    expect(Number(orderData.makerAmount) / Number(orderData.takerAmount)).to.gte(
                        0.056,
                    );
                });

                it("correctly rounds price amounts for validity buy - 2", async () => {
                    const order: UserOrder = {
                        tokenID: "123",
                        price: 0.007,
                        size: 170,
                        side: Side.BUY,
                    };
                    const orderData: OrderData = await buildOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.001"],
                    );
                    expect(orderData.makerAmount).to.equal("1190000");
                    expect(orderData.takerAmount).to.equal("170000000");
                    expect(Number(orderData.makerAmount) / Number(orderData.takerAmount)).to.gte(
                        0.007,
                    );
                });

                it("correctly rounds price amounts for validity buy - 3", async () => {
                    const order: UserOrder = {
                        tokenID: "123",
                        price: 0.082,
                        size: 101,
                        side: Side.BUY,
                    };
                    const orderData: OrderData = await buildOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.001"],
                    );
                    expect(orderData.makerAmount).to.equal("8282000");
                    expect(orderData.takerAmount).to.equal("101000000");
                    expect(Number(orderData.makerAmount) / Number(orderData.takerAmount)).to.gte(
                        0.082,
                    );
                });

                it("correctly rounds price amounts for validity buy - 4", async () => {
                    const order: UserOrder = {
                        tokenID: "123",
                        size: 12.8205,
                        price: 0.078,
                        side: Side.BUY,
                    };
                    const orderData: OrderData = await buildOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.001"],
                    );
                    expect(orderData.makerAmount).to.equal("999960");
                    expect(orderData.takerAmount).to.equal("12820000");
                    expect(Number(orderData.makerAmount) / Number(orderData.takerAmount)).to.gte(
                        0.078,
                    );
                });

                it("correctly rounds price amounts for validity buy - 5", async () => {
                    const order: UserOrder = {
                        tokenID: "123",
                        size: 2435.89,
                        price: 0.039,
                        side: Side.BUY,
                    };
                    const orderData: OrderData = await buildOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.001"],
                    );
                    expect(orderData.makerAmount).to.equal("94999710");
                    expect(orderData.takerAmount).to.equal("2435890000");
                    expect(Number(orderData.makerAmount) / Number(orderData.takerAmount)).to.gte(
                        0.039,
                    );
                });

                it("correctly rounds price amounts for validity sell", async () => {
                    const order: UserOrder = {
                        tokenID: "123",
                        price: 0.056,
                        size: 21.04,
                        side: Side.SELL,
                        feeRateBps: 100,
                        nonce: 0,
                    };

                    const orderData: OrderData = await buildOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.001"],
                    );
                    expect(Number(orderData.takerAmount) / Number(orderData.makerAmount)).to.equal(
                        0.056,
                    );
                });

                it("correctly rounds price amounts for validity sell - 2", async () => {
                    const order: UserOrder = {
                        tokenID: "123",
                        price: 0.007,
                        size: 170,
                        side: Side.SELL,
                    };
                    const orderData: OrderData = await buildOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.001"],
                    );
                    expect(orderData.takerAmount).to.equal("1190000");
                    expect(orderData.makerAmount).to.equal("170000000");
                    expect(Number(orderData.makerAmount) / Number(orderData.takerAmount)).to.gte(
                        0.007,
                    );
                });

                it("correctly rounds price amounts for validity sell - 3", async () => {
                    const order: UserOrder = {
                        tokenID: "123",
                        price: 0.082,
                        size: 101,
                        side: Side.SELL,
                    };
                    const orderData: OrderData = await buildOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.001"],
                    );
                    expect(orderData.makerAmount).to.equal("101000000");
                    expect(orderData.takerAmount).to.equal("8282000");
                    expect(Number(orderData.makerAmount) / Number(orderData.takerAmount)).to.gte(
                        0.082,
                    );
                });

                it("correctly rounds price amounts for validity sell - 4", async () => {
                    const order: UserOrder = {
                        tokenID: "123",
                        size: 12.8205,
                        price: 0.078,
                        side: Side.SELL,
                    };
                    const orderData: OrderData = await buildOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.001"],
                    );
                    expect(orderData.makerAmount).to.equal("12820000");
                    expect(orderData.takerAmount).to.equal("999960");
                    expect(Number(orderData.takerAmount) / Number(orderData.makerAmount)).to.gte(
                        0.078,
                    );
                });

                it("correctly rounds price amounts for validity sell - 5", async () => {
                    const order: UserOrder = {
                        tokenID: "123",
                        size: 2435.89,
                        price: 0.039,
                        side: Side.SELL,
                    };
                    const orderData: OrderData = await buildOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.001"],
                    );
                    expect(orderData.makerAmount).to.equal("2435890000");
                    expect(orderData.takerAmount).to.equal("94999710");
                    expect(Number(orderData.takerAmount) / Number(orderData.makerAmount)).to.gte(
                        0.039,
                    );
                });
            });

            describe("0.0001", async () => {
                it("correctly rounds price amounts for validity buy", async () => {
                    const order: UserOrder = {
                        tokenID: "123",
                        price: 0.0056,
                        size: 21.04,
                        side: Side.BUY,
                        feeRateBps: 100,
                        nonce: 0,
                    };
                    const orderData: OrderData = await buildOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.0001"],
                    );
                    expect(Number(orderData.makerAmount) / Number(orderData.takerAmount)).to.gte(
                        0.0056,
                    );
                });

                it("correctly rounds price amounts for validity buy - 2", async () => {
                    const order: UserOrder = {
                        tokenID: "123",
                        price: 0.0007,
                        size: 170,
                        side: Side.BUY,
                    };
                    const orderData: OrderData = await buildOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.0001"],
                    );
                    expect(orderData.makerAmount).to.equal("119000");
                    expect(orderData.takerAmount).to.equal("170000000");
                    expect(Number(orderData.makerAmount) / Number(orderData.takerAmount)).to.gte(
                        0.0007,
                    );
                });

                it("correctly rounds price amounts for validity buy - 3", async () => {
                    const order: UserOrder = {
                        tokenID: "123",
                        price: 0.0082,
                        size: 101,
                        side: Side.BUY,
                    };
                    const orderData: OrderData = await buildOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.0001"],
                    );
                    expect(orderData.makerAmount).to.equal("828200");
                    expect(orderData.takerAmount).to.equal("101000000");
                    expect(Number(orderData.makerAmount) / Number(orderData.takerAmount)).to.gte(
                        0.0082,
                    );
                });

                it("correctly rounds price amounts for validity buy - 4", async () => {
                    const order: UserOrder = {
                        tokenID: "123",
                        size: 12.8205,
                        price: 0.0078,
                        side: Side.BUY,
                    };
                    const orderData: OrderData = await buildOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.0001"],
                    );
                    expect(orderData.makerAmount).to.equal("99996");
                    expect(orderData.takerAmount).to.equal("12820000");
                    expect(Number(orderData.makerAmount) / Number(orderData.takerAmount)).to.gte(
                        0.0078,
                    );
                });

                it("correctly rounds price amounts for validity buy - 5", async () => {
                    const order: UserOrder = {
                        tokenID: "123",
                        size: 2435.89,
                        price: 0.0039,
                        side: Side.BUY,
                    };
                    const orderData: OrderData = await buildOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.0001"],
                    );
                    expect(orderData.makerAmount).to.equal("9499971");
                    expect(orderData.takerAmount).to.equal("2435890000");
                    expect(Number(orderData.makerAmount) / Number(orderData.takerAmount)).to.gte(
                        0.0039,
                    );
                });

                it("correctly rounds price amounts for validity sell", async () => {
                    const order: UserOrder = {
                        tokenID: "123",
                        price: 0.0056,
                        size: 21.04,
                        side: Side.SELL,
                        feeRateBps: 100,
                        nonce: 0,
                    };

                    const orderData: OrderData = await buildOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.0001"],
                    );
                    expect(Number(orderData.takerAmount) / Number(orderData.makerAmount)).to.equal(
                        0.0056,
                    );
                });

                it("correctly rounds price amounts for validity sell - 2", async () => {
                    const order: UserOrder = {
                        tokenID: "123",
                        price: 0.0007,
                        size: 170,
                        side: Side.SELL,
                    };
                    const orderData: OrderData = await buildOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.0001"],
                    );
                    expect(orderData.takerAmount).to.equal("119000");
                    expect(orderData.makerAmount).to.equal("170000000");
                    expect(Number(orderData.makerAmount) / Number(orderData.takerAmount)).to.gte(
                        0.0007,
                    );
                });

                it("correctly rounds price amounts for validity sell - 3", async () => {
                    const order: UserOrder = {
                        tokenID: "123",
                        price: 0.0082,
                        size: 101,
                        side: Side.SELL,
                    };
                    const orderData: OrderData = await buildOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.0001"],
                    );
                    expect(orderData.makerAmount).to.equal("101000000");
                    expect(orderData.takerAmount).to.equal("828200");
                    expect(Number(orderData.makerAmount) / Number(orderData.takerAmount)).to.gte(
                        0.0082,
                    );
                });

                it("correctly rounds price amounts for validity sell - 4", async () => {
                    const order: UserOrder = {
                        tokenID: "123",
                        size: 12.8205,
                        price: 0.0078,
                        side: Side.SELL,
                    };
                    const orderData: OrderData = await buildOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.0001"],
                    );
                    expect(orderData.makerAmount).to.equal("12820000");
                    expect(orderData.takerAmount).to.equal("99996");
                    expect(Number(orderData.takerAmount) / Number(orderData.makerAmount)).to.gte(
                        0.0078,
                    );
                });

                it("correctly rounds price amounts for validity sell - 5", async () => {
                    const order: UserOrder = {
                        tokenID: "123",
                        size: 2435.89,
                        price: 0.0039,
                        side: Side.SELL,
                    };
                    const orderData: OrderData = await buildOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.0001"],
                    );
                    expect(orderData.makerAmount).to.equal("2435890000");
                    expect(orderData.takerAmount).to.equal("9499971");
                    expect(Number(orderData.takerAmount) / Number(orderData.makerAmount)).to.gte(
                        0.0039,
                    );
                });
            });
        });
    });

    describe("createOrder", () => {
        describe("CTF Exchange", () => {
            describe("buy order", async () => {
                it("0.1", async () => {
                    const order: UserOrder = {
                        tokenID: "123",
                        price: 0.5,
                        size: 21.04,
                        side: Side.BUY,
                        feeRateBps: 111,
                        nonce: 123,
                        expiration: 50000,
                    };

                    const signedOrder = await createOrder(
                        wallet,
                        Chain.AMOY,
                        SignatureType.EOA,
                        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                        order,
                        { tickSize: "0.1", negRisk: false },
                    );
                    expect(signedOrder).not.null;
                    expect(signedOrder).not.undefined;

                    expect(signedOrder.salt).not.empty;
                    expect(signedOrder.maker).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                    expect(signedOrder.signer).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                    expect(signedOrder.taker).equal("0x0000000000000000000000000000000000000000");
                    expect(signedOrder.tokenId).equal("123");
                    expect(signedOrder.makerAmount).equal("10520000");
                    expect(signedOrder.takerAmount).equal("21040000");
                    expect(signedOrder.side).equal(UtilsSide.BUY);
                    expect(signedOrder.expiration).equal("50000");
                    expect(signedOrder.nonce).equal("123");
                    expect(signedOrder.feeRateBps).equal("111");
                    expect(signedOrder.signatureType).equal(SignatureType.EOA);
                    expect(signedOrder.signature).not.empty;
                });

                it("0.01", async () => {
                    const order: UserOrder = {
                        tokenID: "123",
                        price: 0.56,
                        size: 21.04,
                        side: Side.BUY,
                        feeRateBps: 111,
                        nonce: 123,
                        expiration: 50000,
                    };

                    const signedOrder = await createOrder(
                        wallet,
                        Chain.AMOY,
                        SignatureType.EOA,
                        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                        order,
                        { tickSize: "0.01", negRisk: false },
                    );
                    expect(signedOrder).not.null;
                    expect(signedOrder).not.undefined;

                    expect(signedOrder.salt).not.empty;
                    expect(signedOrder.maker).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                    expect(signedOrder.signer).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                    expect(signedOrder.taker).equal("0x0000000000000000000000000000000000000000");
                    expect(signedOrder.tokenId).equal("123");
                    expect(signedOrder.makerAmount).equal("11782400");
                    expect(signedOrder.takerAmount).equal("21040000");
                    expect(signedOrder.side).equal(UtilsSide.BUY);
                    expect(signedOrder.expiration).equal("50000");
                    expect(signedOrder.nonce).equal("123");
                    expect(signedOrder.feeRateBps).equal("111");
                    expect(signedOrder.signatureType).equal(SignatureType.EOA);
                    expect(signedOrder.signature).not.empty;
                });

                it("0.001", async () => {
                    const order: UserOrder = {
                        tokenID: "123",
                        price: 0.056,
                        size: 21.04,
                        side: Side.BUY,
                        feeRateBps: 111,
                        nonce: 123,
                        expiration: 50000,
                    };

                    const signedOrder = await createOrder(
                        wallet,
                        Chain.AMOY,
                        SignatureType.EOA,
                        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                        order,
                        { tickSize: "0.001", negRisk: false },
                    );
                    expect(signedOrder).not.null;
                    expect(signedOrder).not.undefined;

                    expect(signedOrder.salt).not.empty;
                    expect(signedOrder.maker).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                    expect(signedOrder.signer).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                    expect(signedOrder.taker).equal("0x0000000000000000000000000000000000000000");
                    expect(signedOrder.tokenId).equal("123");
                    expect(signedOrder.makerAmount).equal("1178240");
                    expect(signedOrder.takerAmount).equal("21040000");
                    expect(signedOrder.side).equal(UtilsSide.BUY);
                    expect(signedOrder.expiration).equal("50000");
                    expect(signedOrder.nonce).equal("123");
                    expect(signedOrder.feeRateBps).equal("111");
                    expect(signedOrder.signatureType).equal(SignatureType.EOA);
                    expect(signedOrder.signature).not.empty;
                });

                it("0.0001", async () => {
                    const order: UserOrder = {
                        tokenID: "123",
                        price: 0.0056,
                        size: 21.04,
                        side: Side.BUY,
                        feeRateBps: 111,
                        nonce: 123,
                        expiration: 50000,
                    };

                    const signedOrder = await createOrder(
                        wallet,
                        Chain.AMOY,
                        SignatureType.EOA,
                        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                        order,
                        { tickSize: "0.0001", negRisk: false },
                    );
                    expect(signedOrder).not.null;
                    expect(signedOrder).not.undefined;

                    expect(signedOrder.salt).not.empty;
                    expect(signedOrder.maker).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                    expect(signedOrder.signer).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                    expect(signedOrder.taker).equal("0x0000000000000000000000000000000000000000");
                    expect(signedOrder.tokenId).equal("123");
                    expect(signedOrder.makerAmount).equal("117824");
                    expect(signedOrder.takerAmount).equal("21040000");
                    expect(signedOrder.side).equal(UtilsSide.BUY);
                    expect(signedOrder.expiration).equal("50000");
                    expect(signedOrder.nonce).equal("123");
                    expect(signedOrder.feeRateBps).equal("111");
                    expect(signedOrder.signatureType).equal(SignatureType.EOA);
                    expect(signedOrder.signature).not.empty;
                });
            });

            describe("sell order", async () => {
                it("0.1", async () => {
                    const order: UserOrder = {
                        tokenID: "5",
                        price: 0.5,
                        size: 21.04,
                        side: Side.SELL,
                        feeRateBps: 0,
                        nonce: 0,
                    };

                    const signedOrder = await createOrder(
                        wallet,
                        Chain.AMOY,
                        SignatureType.POLY_GNOSIS_SAFE,
                        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                        order,
                        { tickSize: "0.1", negRisk: false },
                    );

                    expect(signedOrder.salt).not.empty;
                    expect(signedOrder.maker).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                    expect(signedOrder.signer).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                    expect(signedOrder.taker).equal("0x0000000000000000000000000000000000000000");
                    expect(signedOrder.tokenId).equal("5");
                    expect(signedOrder.makerAmount).equal("21040000");
                    expect(signedOrder.takerAmount).equal("10520000");
                    expect(signedOrder.side).equal(UtilsSide.SELL);
                    expect(signedOrder.expiration).equal("0");
                    expect(signedOrder.nonce).equal("0");
                    expect(signedOrder.feeRateBps).equal("0");
                    expect(signedOrder.signatureType).equal(SignatureType.POLY_GNOSIS_SAFE);
                    expect(signedOrder.signature).not.empty;
                });

                it("0.01", async () => {
                    const order: UserOrder = {
                        tokenID: "5",
                        price: 0.56,
                        size: 21.04,
                        side: Side.SELL,
                        feeRateBps: 0,
                        nonce: 0,
                    };

                    const signedOrder = await createOrder(
                        wallet,
                        Chain.AMOY,
                        SignatureType.POLY_GNOSIS_SAFE,
                        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                        order,
                        { tickSize: "0.01", negRisk: false },
                    );

                    expect(signedOrder.salt).not.empty;
                    expect(signedOrder.maker).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                    expect(signedOrder.signer).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                    expect(signedOrder.taker).equal("0x0000000000000000000000000000000000000000");
                    expect(signedOrder.tokenId).equal("5");
                    expect(signedOrder.makerAmount).equal("21040000");
                    expect(signedOrder.takerAmount).equal("11782400");
                    expect(signedOrder.side).equal(UtilsSide.SELL);
                    expect(signedOrder.expiration).equal("0");
                    expect(signedOrder.nonce).equal("0");
                    expect(signedOrder.feeRateBps).equal("0");
                    expect(signedOrder.signatureType).equal(SignatureType.POLY_GNOSIS_SAFE);
                    expect(signedOrder.signature).not.empty;
                });

                it("0.001", async () => {
                    const order: UserOrder = {
                        tokenID: "5",
                        price: 0.056,
                        size: 21.04,
                        side: Side.SELL,
                        feeRateBps: 0,
                        nonce: 0,
                    };

                    const signedOrder = await createOrder(
                        wallet,
                        Chain.AMOY,
                        SignatureType.POLY_GNOSIS_SAFE,
                        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                        order,
                        { tickSize: "0.001", negRisk: false },
                    );

                    expect(signedOrder.salt).not.empty;
                    expect(signedOrder.maker).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                    expect(signedOrder.signer).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                    expect(signedOrder.taker).equal("0x0000000000000000000000000000000000000000");
                    expect(signedOrder.tokenId).equal("5");
                    expect(signedOrder.makerAmount).equal("21040000");
                    expect(signedOrder.takerAmount).equal("1178240");
                    expect(signedOrder.side).equal(UtilsSide.SELL);
                    expect(signedOrder.expiration).equal("0");
                    expect(signedOrder.nonce).equal("0");
                    expect(signedOrder.feeRateBps).equal("0");
                    expect(signedOrder.signatureType).equal(SignatureType.POLY_GNOSIS_SAFE);
                    expect(signedOrder.signature).not.empty;
                });

                it("0.0001", async () => {
                    const order: UserOrder = {
                        tokenID: "5",
                        price: 0.0056,
                        size: 21.04,
                        side: Side.SELL,
                        feeRateBps: 0,
                        nonce: 0,
                    };

                    const signedOrder = await createOrder(
                        wallet,
                        Chain.AMOY,
                        SignatureType.POLY_GNOSIS_SAFE,
                        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                        order,
                        { tickSize: "0.0001", negRisk: false },
                    );

                    expect(signedOrder.salt).not.empty;
                    expect(signedOrder.maker).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                    expect(signedOrder.signer).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                    expect(signedOrder.taker).equal("0x0000000000000000000000000000000000000000");
                    expect(signedOrder.tokenId).equal("5");
                    expect(signedOrder.makerAmount).equal("21040000");
                    expect(signedOrder.takerAmount).equal("117824");
                    expect(signedOrder.side).equal(UtilsSide.SELL);
                    expect(signedOrder.expiration).equal("0");
                    expect(signedOrder.nonce).equal("0");
                    expect(signedOrder.feeRateBps).equal("0");
                    expect(signedOrder.signatureType).equal(SignatureType.POLY_GNOSIS_SAFE);
                    expect(signedOrder.signature).not.empty;
                });
            });
        });

        describe("Neg RiskCTF Exchange", () => {
            describe("buy order", async () => {
                it("0.1", async () => {
                    const order: UserOrder = {
                        tokenID: "123",
                        price: 0.5,
                        size: 21.04,
                        side: Side.BUY,
                        feeRateBps: 111,
                        nonce: 123,
                        expiration: 50000,
                    };

                    const signedOrder = await createOrder(
                        wallet,
                        Chain.AMOY,
                        SignatureType.EOA,
                        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                        order,
                        { tickSize: "0.1", negRisk: true },
                    );
                    expect(signedOrder).not.null;
                    expect(signedOrder).not.undefined;

                    expect(signedOrder.salt).not.empty;
                    expect(signedOrder.maker).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                    expect(signedOrder.signer).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                    expect(signedOrder.taker).equal("0x0000000000000000000000000000000000000000");
                    expect(signedOrder.tokenId).equal("123");
                    expect(signedOrder.makerAmount).equal("10520000");
                    expect(signedOrder.takerAmount).equal("21040000");
                    expect(signedOrder.side).equal(UtilsSide.BUY);
                    expect(signedOrder.expiration).equal("50000");
                    expect(signedOrder.nonce).equal("123");
                    expect(signedOrder.feeRateBps).equal("111");
                    expect(signedOrder.signatureType).equal(SignatureType.EOA);
                    expect(signedOrder.signature).not.empty;
                });

                it("0.01", async () => {
                    const order: UserOrder = {
                        tokenID: "123",
                        price: 0.56,
                        size: 21.04,
                        side: Side.BUY,
                        feeRateBps: 111,
                        nonce: 123,
                        expiration: 50000,
                    };

                    const signedOrder = await createOrder(
                        wallet,
                        Chain.AMOY,
                        SignatureType.EOA,
                        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                        order,
                        { tickSize: "0.01", negRisk: true },
                    );
                    expect(signedOrder).not.null;
                    expect(signedOrder).not.undefined;

                    expect(signedOrder.salt).not.empty;
                    expect(signedOrder.maker).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                    expect(signedOrder.signer).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                    expect(signedOrder.taker).equal("0x0000000000000000000000000000000000000000");
                    expect(signedOrder.tokenId).equal("123");
                    expect(signedOrder.makerAmount).equal("11782400");
                    expect(signedOrder.takerAmount).equal("21040000");
                    expect(signedOrder.side).equal(UtilsSide.BUY);
                    expect(signedOrder.expiration).equal("50000");
                    expect(signedOrder.nonce).equal("123");
                    expect(signedOrder.feeRateBps).equal("111");
                    expect(signedOrder.signatureType).equal(SignatureType.EOA);
                    expect(signedOrder.signature).not.empty;
                });

                it("0.001", async () => {
                    const order: UserOrder = {
                        tokenID: "123",
                        price: 0.056,
                        size: 21.04,
                        side: Side.BUY,
                        feeRateBps: 111,
                        nonce: 123,
                        expiration: 50000,
                    };

                    const signedOrder = await createOrder(
                        wallet,
                        Chain.AMOY,
                        SignatureType.EOA,
                        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                        order,
                        { tickSize: "0.001", negRisk: true },
                    );
                    expect(signedOrder).not.null;
                    expect(signedOrder).not.undefined;

                    expect(signedOrder.salt).not.empty;
                    expect(signedOrder.maker).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                    expect(signedOrder.signer).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                    expect(signedOrder.taker).equal("0x0000000000000000000000000000000000000000");
                    expect(signedOrder.tokenId).equal("123");
                    expect(signedOrder.makerAmount).equal("1178240");
                    expect(signedOrder.takerAmount).equal("21040000");
                    expect(signedOrder.side).equal(UtilsSide.BUY);
                    expect(signedOrder.expiration).equal("50000");
                    expect(signedOrder.nonce).equal("123");
                    expect(signedOrder.feeRateBps).equal("111");
                    expect(signedOrder.signatureType).equal(SignatureType.EOA);
                    expect(signedOrder.signature).not.empty;
                });

                it("0.0001", async () => {
                    const order: UserOrder = {
                        tokenID: "123",
                        price: 0.0056,
                        size: 21.04,
                        side: Side.BUY,
                        feeRateBps: 111,
                        nonce: 123,
                        expiration: 50000,
                    };

                    const signedOrder = await createOrder(
                        wallet,
                        Chain.AMOY,
                        SignatureType.EOA,
                        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                        order,
                        { tickSize: "0.0001", negRisk: true },
                    );
                    expect(signedOrder).not.null;
                    expect(signedOrder).not.undefined;

                    expect(signedOrder.salt).not.empty;
                    expect(signedOrder.maker).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                    expect(signedOrder.signer).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                    expect(signedOrder.taker).equal("0x0000000000000000000000000000000000000000");
                    expect(signedOrder.tokenId).equal("123");
                    expect(signedOrder.makerAmount).equal("117824");
                    expect(signedOrder.takerAmount).equal("21040000");
                    expect(signedOrder.side).equal(UtilsSide.BUY);
                    expect(signedOrder.expiration).equal("50000");
                    expect(signedOrder.nonce).equal("123");
                    expect(signedOrder.feeRateBps).equal("111");
                    expect(signedOrder.signatureType).equal(SignatureType.EOA);
                    expect(signedOrder.signature).not.empty;
                });
            });

            describe("sell order", async () => {
                it("0.1", async () => {
                    const order: UserOrder = {
                        tokenID: "5",
                        price: 0.5,
                        size: 21.04,
                        side: Side.SELL,
                        feeRateBps: 0,
                        nonce: 0,
                    };

                    const signedOrder = await createOrder(
                        wallet,
                        Chain.AMOY,
                        SignatureType.POLY_GNOSIS_SAFE,
                        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                        order,
                        { tickSize: "0.1", negRisk: true },
                    );

                    expect(signedOrder.salt).not.empty;
                    expect(signedOrder.maker).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                    expect(signedOrder.signer).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                    expect(signedOrder.taker).equal("0x0000000000000000000000000000000000000000");
                    expect(signedOrder.tokenId).equal("5");
                    expect(signedOrder.makerAmount).equal("21040000");
                    expect(signedOrder.takerAmount).equal("10520000");
                    expect(signedOrder.side).equal(UtilsSide.SELL);
                    expect(signedOrder.expiration).equal("0");
                    expect(signedOrder.nonce).equal("0");
                    expect(signedOrder.feeRateBps).equal("0");
                    expect(signedOrder.signatureType).equal(SignatureType.POLY_GNOSIS_SAFE);
                    expect(signedOrder.signature).not.empty;
                });

                it("0.01", async () => {
                    const order: UserOrder = {
                        tokenID: "5",
                        price: 0.56,
                        size: 21.04,
                        side: Side.SELL,
                        feeRateBps: 0,
                        nonce: 0,
                    };

                    const signedOrder = await createOrder(
                        wallet,
                        Chain.AMOY,
                        SignatureType.POLY_GNOSIS_SAFE,
                        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                        order,
                        { tickSize: "0.01", negRisk: true },
                    );

                    expect(signedOrder.salt).not.empty;
                    expect(signedOrder.maker).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                    expect(signedOrder.signer).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                    expect(signedOrder.taker).equal("0x0000000000000000000000000000000000000000");
                    expect(signedOrder.tokenId).equal("5");
                    expect(signedOrder.makerAmount).equal("21040000");
                    expect(signedOrder.takerAmount).equal("11782400");
                    expect(signedOrder.side).equal(UtilsSide.SELL);
                    expect(signedOrder.expiration).equal("0");
                    expect(signedOrder.nonce).equal("0");
                    expect(signedOrder.feeRateBps).equal("0");
                    expect(signedOrder.signatureType).equal(SignatureType.POLY_GNOSIS_SAFE);
                    expect(signedOrder.signature).not.empty;
                });

                it("0.001", async () => {
                    const order: UserOrder = {
                        tokenID: "5",
                        price: 0.056,
                        size: 21.04,
                        side: Side.SELL,
                        feeRateBps: 0,
                        nonce: 0,
                    };

                    const signedOrder = await createOrder(
                        wallet,
                        Chain.AMOY,
                        SignatureType.POLY_GNOSIS_SAFE,
                        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                        order,
                        { tickSize: "0.001", negRisk: true },
                    );

                    expect(signedOrder.salt).not.empty;
                    expect(signedOrder.maker).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                    expect(signedOrder.signer).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                    expect(signedOrder.taker).equal("0x0000000000000000000000000000000000000000");
                    expect(signedOrder.tokenId).equal("5");
                    expect(signedOrder.makerAmount).equal("21040000");
                    expect(signedOrder.takerAmount).equal("1178240");
                    expect(signedOrder.side).equal(UtilsSide.SELL);
                    expect(signedOrder.expiration).equal("0");
                    expect(signedOrder.nonce).equal("0");
                    expect(signedOrder.feeRateBps).equal("0");
                    expect(signedOrder.signatureType).equal(SignatureType.POLY_GNOSIS_SAFE);
                    expect(signedOrder.signature).not.empty;
                });

                it("0.0001", async () => {
                    const order: UserOrder = {
                        tokenID: "5",
                        price: 0.0056,
                        size: 21.04,
                        side: Side.SELL,
                        feeRateBps: 0,
                        nonce: 0,
                    };

                    const signedOrder = await createOrder(
                        wallet,
                        Chain.AMOY,
                        SignatureType.POLY_GNOSIS_SAFE,
                        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                        order,
                        { tickSize: "0.0001", negRisk: true },
                    );

                    expect(signedOrder.salt).not.empty;
                    expect(signedOrder.maker).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                    expect(signedOrder.signer).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                    expect(signedOrder.taker).equal("0x0000000000000000000000000000000000000000");
                    expect(signedOrder.tokenId).equal("5");
                    expect(signedOrder.makerAmount).equal("21040000");
                    expect(signedOrder.takerAmount).equal("117824");
                    expect(signedOrder.side).equal(UtilsSide.SELL);
                    expect(signedOrder.expiration).equal("0");
                    expect(signedOrder.nonce).equal("0");
                    expect(signedOrder.feeRateBps).equal("0");
                    expect(signedOrder.signatureType).equal(SignatureType.POLY_GNOSIS_SAFE);
                    expect(signedOrder.signature).not.empty;
                });
            });
        });
    });

    describe("getMarketOrderRawAmounts", async () => {
        describe("market buy", async () => {
            it("0.1", async () => {
                const delta_price = 0.1;
                const delta_size = 0.01;
                let size = 0.01;

                for (; size <= 1000; ) {
                    let price = 0.1;
                    for (; price <= 1; ) {
                        price = roundNormal(price, 8);
                        const { rawMakerAmt, rawTakerAmt } = getMarketOrderRawAmounts(
                            Side.BUY,
                            size,
                            price,
                            ROUNDING_CONFIG["0.1"],
                        );

                        expect(decimalPlaces(rawMakerAmt)).to.lte(2);
                        expect(decimalPlaces(rawTakerAmt)).to.lte(3);
                        expect(roundNormal(rawMakerAmt / rawTakerAmt, 2)).to.gte(
                            roundNormal(price, 2),
                        );

                        price += delta_price;
                    }
                    size += delta_size;
                }
            });

            it("0.01", async () => {
                const delta_price = 0.01;
                const delta_size = 0.01;
                let size = 0.01;

                for (; size <= 100; ) {
                    let price = 0.01;
                    for (; price <= 1; ) {
                        price = roundNormal(price, 8);
                        const { rawMakerAmt, rawTakerAmt } = getMarketOrderRawAmounts(
                            Side.BUY,
                            size,
                            price,
                            ROUNDING_CONFIG["0.01"],
                        );

                        expect(decimalPlaces(rawMakerAmt)).to.lte(2);
                        expect(decimalPlaces(rawTakerAmt)).to.lte(4);
                        expect(roundNormal(rawMakerAmt / rawTakerAmt, 4)).to.gte(
                            roundNormal(price, 4),
                        );

                        price += delta_price;
                    }
                    size += delta_size;
                }
            });

            it("0.001", async () => {
                const delta_price = 0.001;
                const delta_size = 0.01;
                let size = 0.01;

                for (; size <= 10; ) {
                    let price = 0.001;
                    for (; price <= 1; ) {
                        price = roundNormal(price, 8);
                        const { rawMakerAmt, rawTakerAmt } = getMarketOrderRawAmounts(
                            Side.BUY,
                            size,
                            price,
                            ROUNDING_CONFIG["0.001"],
                        );

                        expect(decimalPlaces(rawMakerAmt)).to.lte(2);
                        expect(decimalPlaces(rawTakerAmt)).to.lte(5);
                        expect(roundNormal(rawMakerAmt / rawTakerAmt, 6)).to.gte(
                            roundNormal(price, 6),
                        );

                        price += delta_price;
                    }
                    size += delta_size;
                }
            });

            it("0.0001", async () => {
                const delta_price = 0.0001;
                const delta_size = 0.01;
                let size = 0.01;

                for (; size <= 1; ) {
                    let price = 0.0001;
                    for (; price <= 1; ) {
                        price = roundNormal(price, 8);
                        const { rawMakerAmt, rawTakerAmt } = getMarketOrderRawAmounts(
                            Side.BUY,
                            size,
                            price,
                            ROUNDING_CONFIG["0.0001"],
                        );

                        expect(decimalPlaces(rawMakerAmt)).to.lte(2);
                        expect(decimalPlaces(rawTakerAmt)).to.lte(6);
                        expect(roundNormal(rawMakerAmt / rawTakerAmt, 8)).to.gte(
                            roundNormal(price, 8),
                        );

                        price += delta_price;
                    }
                    size += delta_size;
                }
            });
        });
        describe("market sell", async () => {
            it("0.1", async () => {
                const delta_price = 0.1;
                const delta_size = 0.01;
                let size = 0.01;

                for (; size <= 1000; ) {
                    let price = 0.1;
                    for (; price <= 1; ) {
                        price = roundNormal(price, 8);
                        const { rawMakerAmt, rawTakerAmt } = getMarketOrderRawAmounts(
                            Side.SELL,
                            size,
                            price,
                            ROUNDING_CONFIG["0.1"],
                        );

                        expect(decimalPlaces(rawMakerAmt)).to.lte(2);
                        expect(decimalPlaces(rawTakerAmt)).to.lte(3);
                        expect(roundNormal(rawTakerAmt / rawMakerAmt, 2)).to.lte(
                            roundNormal(price, 2),
                        );

                        price += delta_price;
                    }
                    size += delta_size;
                }
            });

            it("0.01", async () => {
                const delta_price = 0.01;
                const delta_size = 0.01;
                let size = 0.01;

                for (; size <= 100; ) {
                    let price = 0.01;
                    for (; price <= 1; ) {
                        price = roundNormal(price, 8);
                        const { rawMakerAmt, rawTakerAmt } = getMarketOrderRawAmounts(
                            Side.SELL,
                            size,
                            price,
                            ROUNDING_CONFIG["0.01"],
                        );

                        expect(decimalPlaces(rawMakerAmt)).to.lte(2);
                        expect(decimalPlaces(rawTakerAmt)).to.lte(4);
                        expect(roundNormal(rawTakerAmt / rawMakerAmt, 4)).to.lte(
                            roundNormal(price, 4),
                        );

                        price += delta_price;
                    }
                    size += delta_size;
                }
            });

            it("0.001", async () => {
                const delta_price = 0.001;
                const delta_size = 0.01;
                let size = 0.01;

                for (; size <= 10; ) {
                    let price = 0.001;
                    for (; price <= 1; ) {
                        price = roundNormal(price, 8);
                        const { rawMakerAmt, rawTakerAmt } = getMarketOrderRawAmounts(
                            Side.SELL,
                            size,
                            price,
                            ROUNDING_CONFIG["0.001"],
                        );

                        expect(decimalPlaces(rawMakerAmt)).to.lte(2);
                        expect(decimalPlaces(rawTakerAmt)).to.lte(5);
                        expect(roundNormal(rawTakerAmt / rawMakerAmt, 6)).to.lte(
                            roundNormal(price, 6),
                        );

                        price += delta_price;
                    }
                    size += delta_size;
                }
            });

            it("0.0001", async () => {
                const delta_price = 0.0001;
                const delta_size = 0.01;
                let size = 0.01;

                for (; size <= 1; ) {
                    let price = 0.0001;
                    for (; price <= 1; ) {
                        price = roundNormal(price, 8);
                        const { rawMakerAmt, rawTakerAmt } = getMarketOrderRawAmounts(
                            Side.SELL,
                            size,
                            price,
                            ROUNDING_CONFIG["0.0001"],
                        );

                        expect(decimalPlaces(rawMakerAmt)).to.lte(2);
                        expect(decimalPlaces(rawTakerAmt)).to.lte(6);
                        expect(roundNormal(rawTakerAmt / rawMakerAmt, 8)).to.lte(
                            roundNormal(price, 8),
                        );

                        price += delta_price;
                    }
                    size += delta_size;
                }
            });
        });
    });

    describe("buildMarketOrderCreationArgs", () => {
        describe("market buy order", async () => {
            it("0.1", async () => {
                const order: UserMarketOrder = {
                    side: Side.BUY,
                    tokenID: "123",
                    price: 0.5,
                    amount: 100,
                    feeRateBps: 111,
                    nonce: 123,
                };
                const orderData: OrderData = await buildMarketOrderCreationArgs(
                    "0x0000000000000000000000000000000000000001",
                    "0x0000000000000000000000000000000000000002",
                    SignatureType.EOA,
                    order,
                    ROUNDING_CONFIG["0.1"],
                );
                expect(orderData).deep.equal({
                    maker: "0x0000000000000000000000000000000000000002",
                    taker: "0x0000000000000000000000000000000000000000",
                    tokenId: "123",
                    makerAmount: "100000000",
                    takerAmount: "200000000",
                    side: UtilsSide.BUY,
                    feeRateBps: "111",
                    nonce: "123",
                    signer: "0x0000000000000000000000000000000000000001",
                    expiration: "0",
                    signatureType: SignatureType.EOA,
                });
            });

            it("0.01", async () => {
                const order: UserMarketOrder = {
                    side: Side.BUY,
                    tokenID: "123",
                    price: 0.56,
                    amount: 100,
                    feeRateBps: 111,
                    nonce: 123,
                };
                const orderData: OrderData = await buildMarketOrderCreationArgs(
                    "0x0000000000000000000000000000000000000001",
                    "0x0000000000000000000000000000000000000002",
                    SignatureType.EOA,
                    order,
                    ROUNDING_CONFIG["0.01"],
                );
                expect(orderData).deep.equal({
                    maker: "0x0000000000000000000000000000000000000002",
                    taker: "0x0000000000000000000000000000000000000000",
                    tokenId: "123",
                    makerAmount: "100000000",
                    takerAmount: "178571400",
                    side: UtilsSide.BUY,
                    feeRateBps: "111",
                    nonce: "123",
                    signer: "0x0000000000000000000000000000000000000001",
                    expiration: "0",
                    signatureType: SignatureType.EOA,
                });
            });

            it("0.001", async () => {
                const order: UserMarketOrder = {
                    side: Side.BUY,
                    tokenID: "123",
                    price: 0.056,
                    amount: 100,
                    feeRateBps: 111,
                    nonce: 123,
                };
                const orderData: OrderData = await buildMarketOrderCreationArgs(
                    "0x0000000000000000000000000000000000000001",
                    "0x0000000000000000000000000000000000000002",
                    SignatureType.EOA,
                    order,
                    ROUNDING_CONFIG["0.001"],
                );
                expect(orderData).deep.equal({
                    maker: "0x0000000000000000000000000000000000000002",
                    taker: "0x0000000000000000000000000000000000000000",
                    tokenId: "123",
                    makerAmount: "100000000",
                    takerAmount: "1785714280",
                    side: UtilsSide.BUY,
                    feeRateBps: "111",
                    nonce: "123",
                    signer: "0x0000000000000000000000000000000000000001",
                    expiration: "0",
                    signatureType: SignatureType.EOA,
                });
            });

            it("0.0001", async () => {
                const order: UserMarketOrder = {
                    side: Side.BUY,
                    tokenID: "123",
                    price: 0.0056,
                    amount: 100,
                    feeRateBps: 111,
                    nonce: 123,
                };
                const orderData: OrderData = await buildMarketOrderCreationArgs(
                    "0x0000000000000000000000000000000000000001",
                    "0x0000000000000000000000000000000000000002",
                    SignatureType.EOA,
                    order,
                    ROUNDING_CONFIG["0.0001"],
                );
                expect(orderData).deep.equal({
                    maker: "0x0000000000000000000000000000000000000002",
                    taker: "0x0000000000000000000000000000000000000000",
                    tokenId: "123",
                    makerAmount: "100000000",
                    takerAmount: "17857142857",
                    side: UtilsSide.BUY,
                    feeRateBps: "111",
                    nonce: "123",
                    signer: "0x0000000000000000000000000000000000000001",
                    expiration: "0",
                    signatureType: SignatureType.EOA,
                });
            });
        });

        describe("market sell order", async () => {
            it("0.1", async () => {
                const order: UserMarketOrder = {
                    side: Side.SELL,
                    tokenID: "123",
                    price: 0.5,
                    amount: 100,
                    feeRateBps: 111,
                    nonce: 123,
                };
                const orderData: OrderData = await buildMarketOrderCreationArgs(
                    "0x0000000000000000000000000000000000000001",
                    "0x0000000000000000000000000000000000000002",
                    SignatureType.EOA,
                    order,
                    ROUNDING_CONFIG["0.1"],
                );
                expect(orderData).deep.equal({
                    maker: "0x0000000000000000000000000000000000000002",
                    taker: "0x0000000000000000000000000000000000000000",
                    tokenId: "123",
                    makerAmount: "100000000",
                    takerAmount: "50000000",
                    side: UtilsSide.SELL,
                    feeRateBps: "111",
                    nonce: "123",
                    signer: "0x0000000000000000000000000000000000000001",
                    expiration: "0",
                    signatureType: SignatureType.EOA,
                });
            });

            it("0.01", async () => {
                const order: UserMarketOrder = {
                    side: Side.SELL,
                    tokenID: "123",
                    price: 0.56,
                    amount: 100,
                    feeRateBps: 111,
                    nonce: 123,
                };
                const orderData: OrderData = await buildMarketOrderCreationArgs(
                    "0x0000000000000000000000000000000000000001",
                    "0x0000000000000000000000000000000000000002",
                    SignatureType.EOA,
                    order,
                    ROUNDING_CONFIG["0.01"],
                );
                expect(orderData).deep.equal({
                    maker: "0x0000000000000000000000000000000000000002",
                    taker: "0x0000000000000000000000000000000000000000",
                    tokenId: "123",
                    makerAmount: "100000000",
                    takerAmount: "56000000",
                    side: UtilsSide.SELL,
                    feeRateBps: "111",
                    nonce: "123",
                    signer: "0x0000000000000000000000000000000000000001",
                    expiration: "0",
                    signatureType: SignatureType.EOA,
                });
            });

            it("0.001", async () => {
                const order: UserMarketOrder = {
                    side: Side.SELL,
                    tokenID: "123",
                    price: 0.056,
                    amount: 100,
                    feeRateBps: 111,
                    nonce: 123,
                };
                const orderData: OrderData = await buildMarketOrderCreationArgs(
                    "0x0000000000000000000000000000000000000001",
                    "0x0000000000000000000000000000000000000002",
                    SignatureType.EOA,
                    order,
                    ROUNDING_CONFIG["0.001"],
                );
                expect(orderData).deep.equal({
                    maker: "0x0000000000000000000000000000000000000002",
                    taker: "0x0000000000000000000000000000000000000000",
                    tokenId: "123",
                    makerAmount: "100000000",
                    takerAmount: "5600000",
                    side: UtilsSide.SELL,
                    feeRateBps: "111",
                    nonce: "123",
                    signer: "0x0000000000000000000000000000000000000001",
                    expiration: "0",
                    signatureType: SignatureType.EOA,
                });
            });

            it("0.0001", async () => {
                const order: UserMarketOrder = {
                    side: Side.SELL,
                    tokenID: "123",
                    price: 0.0056,
                    amount: 100,
                    feeRateBps: 111,
                    nonce: 123,
                };
                const orderData: OrderData = await buildMarketOrderCreationArgs(
                    "0x0000000000000000000000000000000000000001",
                    "0x0000000000000000000000000000000000000002",
                    SignatureType.EOA,
                    order,
                    ROUNDING_CONFIG["0.0001"],
                );
                expect(orderData).deep.equal({
                    maker: "0x0000000000000000000000000000000000000002",
                    taker: "0x0000000000000000000000000000000000000000",
                    tokenId: "123",
                    makerAmount: "100000000",
                    takerAmount: "560000",
                    side: UtilsSide.SELL,
                    feeRateBps: "111",
                    nonce: "123",
                    signer: "0x0000000000000000000000000000000000000001",
                    expiration: "0",
                    signatureType: SignatureType.EOA,
                });
            });
        });

        describe("real cases", async () => {
            describe("0.1", async () => {
                it("market buy order with a different price", async () => {
                    const order: UserMarketOrder = {
                        side: Side.BUY,
                        tokenID: "123",
                        price: 0.5,
                        amount: 100,
                        feeRateBps: 111,
                        nonce: 123,
                    };
                    const orderData: OrderData = await buildMarketOrderCreationArgs(
                        "0x0000000000000000000000000000000000000001",
                        "0x0000000000000000000000000000000000000002",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.1"],
                    );
                    expect(orderData).deep.equal({
                        maker: "0x0000000000000000000000000000000000000002",
                        taker: "0x0000000000000000000000000000000000000000",
                        tokenId: "123",
                        makerAmount: "100000000",
                        takerAmount: "200000000",
                        side: UtilsSide.BUY,
                        feeRateBps: "111",
                        nonce: "123",
                        signer: "0x0000000000000000000000000000000000000001",
                        expiration: "0",
                        signatureType: SignatureType.EOA,
                    });
                });

                it("correctly rounds price amounts for validity buy", async () => {
                    const order: UserMarketOrder = {
                        side: Side.BUY,
                        tokenID: "123",
                        price: 0.5,
                        amount: 21.04,
                        feeRateBps: 100,
                        nonce: 0,
                    };
                    const orderData: OrderData = await buildMarketOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.1"],
                    );

                    const price = roundDown(
                        Number(orderData.makerAmount) / Number(orderData.takerAmount),
                        2,
                    );
                    expect(price).to.equal(0.5);
                    expect(Number(orderData.makerAmount) / Number(orderData.takerAmount)).to.gte(
                        0.5,
                    );
                });

                it("correctly rounds price amounts for validity buy - 2", async () => {
                    const order: UserMarketOrder = {
                        side: Side.BUY,
                        tokenID: "123",
                        price: 0.7,
                        amount: 119,
                    };
                    const orderData: OrderData = await buildMarketOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.1"],
                    );

                    expect(orderData.makerAmount).to.equal("119000000");
                    expect(orderData.takerAmount).to.equal("170000000");

                    const price = roundDown(
                        Number(orderData.makerAmount) / Number(orderData.takerAmount),
                        2,
                    );
                    expect(price).to.equal(0.7);
                    expect(Number(orderData.makerAmount) / Number(orderData.takerAmount)).to.gte(
                        0.7,
                    );
                });

                it("correctly rounds price amounts for validity buy - 3", async () => {
                    const order: UserMarketOrder = {
                        side: Side.BUY,
                        tokenID: "123",
                        price: 0.8,
                        amount: 82.8,
                    };
                    const orderData: OrderData = await buildMarketOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.1"],
                    );
                    expect(orderData.makerAmount).to.equal("82800000");
                    expect(orderData.takerAmount).to.equal("103500000");
                    expect(Number(orderData.makerAmount) / Number(orderData.takerAmount)).to.gte(
                        0.8,
                    );
                });

                it("correctly rounds price amounts for validity buy - 4", async () => {
                    const order: UserMarketOrder = {
                        side: Side.BUY,
                        tokenID: "123",
                        price: 0.7,
                        amount: 9.9996,
                    };
                    const orderData: OrderData = await buildMarketOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.1"],
                    );
                    expect(orderData.makerAmount).to.equal("9990000");
                    expect(orderData.takerAmount).to.equal("14271000");
                    expect(Number(orderData.makerAmount) / Number(orderData.takerAmount)).to.gte(
                        0.7,
                    );
                });

                it("correctly rounds price amounts for validity buy - 5", async () => {
                    const order: UserMarketOrder = {
                        side: Side.BUY,
                        tokenID: "123",
                        price: 0.3,
                        amount: 949.9971,
                    };
                    const orderData: OrderData = await buildMarketOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.1"],
                    );
                    expect(orderData.makerAmount).to.equal("949990000");
                    expect(orderData.takerAmount).to.equal("3166633000");
                    expect(Number(orderData.makerAmount) / Number(orderData.takerAmount)).to.gte(
                        0.3,
                    );
                });

                it("correctly rounds price amounts for validity buy - 6", async () => {
                    const order: UserMarketOrder = {
                        side: Side.BUY,
                        tokenID: "123",
                        price: 0.5,
                        amount: 1,
                    };
                    const orderData: OrderData = await buildMarketOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.1"],
                    );
                    expect(orderData.makerAmount).to.equal("1000000");
                    expect(orderData.takerAmount).to.equal("2000000");
                    expect(Number(orderData.makerAmount) / Number(orderData.takerAmount)).to.gte(
                        0.5,
                    );
                });

                it("correctly rounds price amounts for validity buy - 7", async () => {
                    const order: UserMarketOrder = {
                        side: Side.BUY,
                        tokenID: "123",
                        price: 0.5,
                        amount: 1,
                    };
                    const orderData: OrderData = await buildMarketOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.01"],
                    );
                    expect(orderData.makerAmount).to.equal("1000000");
                    expect(orderData.takerAmount).to.equal("2000000");
                    expect(Number(orderData.makerAmount) / Number(orderData.takerAmount)).to.gte(
                        0.5,
                    );
                });
            });

            describe("0.01", async () => {
                it("market buy order with a different price", async () => {
                    const order: UserMarketOrder = {
                        side: Side.BUY,
                        tokenID: "123",
                        price: 0.05,
                        amount: 100,
                        feeRateBps: 111,
                        nonce: 123,
                    };
                    const orderData: OrderData = await buildMarketOrderCreationArgs(
                        "0x0000000000000000000000000000000000000001",
                        "0x0000000000000000000000000000000000000002",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.01"],
                    );
                    expect(orderData).deep.equal({
                        maker: "0x0000000000000000000000000000000000000002",
                        taker: "0x0000000000000000000000000000000000000000",
                        tokenId: "123",
                        makerAmount: "100000000",
                        takerAmount: "2000000000",
                        side: UtilsSide.BUY,
                        feeRateBps: "111",
                        nonce: "123",
                        signer: "0x0000000000000000000000000000000000000001",
                        expiration: "0",
                        signatureType: SignatureType.EOA,
                    });
                });

                it("correctly rounds price amounts for validity buy", async () => {
                    const order: UserMarketOrder = {
                        side: Side.BUY,
                        tokenID: "123",
                        price: 0.56,
                        amount: 21.04,
                        feeRateBps: 100,
                        nonce: 0,
                    };
                    const orderData: OrderData = await buildMarketOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.01"],
                    );

                    const price = roundDown(
                        Number(orderData.makerAmount) / Number(orderData.takerAmount),
                        2,
                    );
                    expect(price).to.equal(0.56);
                    expect(
                        Number(orderData.makerAmount) / Number(orderData.takerAmount),
                    ).to.greaterThan(0.56);
                });

                it("correctly rounds price amounts for validity buy - 2", async () => {
                    const order: UserMarketOrder = {
                        side: Side.BUY,
                        tokenID: "123",
                        price: 0.07,
                        amount: 119,
                    };
                    const orderData: OrderData = await buildMarketOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.01"],
                    );

                    expect(orderData.makerAmount).to.equal("119000000");
                    expect(orderData.takerAmount).to.equal("1700000000");

                    const price = roundDown(
                        Number(orderData.makerAmount) / Number(orderData.takerAmount),
                        2,
                    );
                    expect(price).to.equal(0.07);
                    expect(Number(orderData.makerAmount) / Number(orderData.takerAmount)).to.gte(
                        0.07,
                    );
                });

                it("correctly rounds price amounts for validity buy - 3", async () => {
                    const order: UserMarketOrder = {
                        side: Side.BUY,
                        tokenID: "123",
                        price: 0.82,
                        amount: 82.82,
                    };
                    const orderData: OrderData = await buildMarketOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.01"],
                    );
                    expect(orderData.makerAmount).to.equal("82820000");
                    expect(orderData.takerAmount).to.equal("101000000");
                    expect(Number(orderData.makerAmount) / Number(orderData.takerAmount)).to.gte(
                        0.82,
                    );
                });

                it("correctly rounds price amounts for validity buy - 4", async () => {
                    const order: UserMarketOrder = {
                        side: Side.BUY,
                        tokenID: "123",
                        price: 0.78,
                        amount: 9.9996,
                    };
                    const orderData: OrderData = await buildMarketOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.01"],
                    );
                    expect(orderData.makerAmount).to.equal("9990000");
                    expect(orderData.takerAmount).to.equal("12807600");
                    expect(Number(orderData.makerAmount) / Number(orderData.takerAmount)).to.gte(
                        0.78,
                    );
                });

                it("correctly rounds price amounts for validity buy - 5", async () => {
                    const order: UserMarketOrder = {
                        side: Side.BUY,
                        tokenID: "123",
                        price: 0.39,
                        amount: 949.9971,
                    };
                    const orderData: OrderData = await buildMarketOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.01"],
                    );
                    expect(orderData.makerAmount).to.equal("949990000");
                    expect(orderData.takerAmount).to.equal("2435871700");
                    expect(Number(orderData.makerAmount) / Number(orderData.takerAmount)).to.gte(
                        0.39,
                    );
                });

                it("correctly rounds price amounts for validity buy - 6", async () => {
                    const order: UserMarketOrder = {
                        side: Side.BUY,
                        tokenID: "123",
                        price: 0.56,
                        amount: 1,
                    };
                    const orderData: OrderData = await buildMarketOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.01"],
                    );
                    expect(orderData.makerAmount).to.equal("1000000");
                    expect(orderData.takerAmount).to.equal("1785700");
                    expect(Number(orderData.makerAmount) / Number(orderData.takerAmount)).to.gte(
                        0.56,
                    );
                });

                it("correctly rounds price amounts for validity buy - 7", async () => {
                    const order: UserMarketOrder = {
                        side: Side.BUY,
                        tokenID: "123",
                        price: 0.57,
                        amount: 1,
                    };
                    const orderData: OrderData = await buildMarketOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.01"],
                    );
                    expect(orderData.makerAmount).to.equal("1000000");
                    expect(orderData.takerAmount).to.equal("1754300");
                    expect(Number(orderData.makerAmount) / Number(orderData.takerAmount)).to.gte(
                        0.57,
                    );
                });
            });

            describe("0.001", async () => {
                it("market buy order with a different price", async () => {
                    const order: UserMarketOrder = {
                        side: Side.BUY,
                        tokenID: "123",
                        price: 0.005,
                        amount: 100,
                        feeRateBps: 111,
                        nonce: 123,
                    };
                    const orderData: OrderData = await buildMarketOrderCreationArgs(
                        "0x0000000000000000000000000000000000000001",
                        "0x0000000000000000000000000000000000000002",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.001"],
                    );
                    expect(orderData).deep.equal({
                        maker: "0x0000000000000000000000000000000000000002",
                        taker: "0x0000000000000000000000000000000000000000",
                        tokenId: "123",
                        makerAmount: "100000000",
                        takerAmount: "20000000000",
                        side: UtilsSide.BUY,
                        feeRateBps: "111",
                        nonce: "123",
                        signer: "0x0000000000000000000000000000000000000001",
                        expiration: "0",
                        signatureType: SignatureType.EOA,
                    });
                });

                it("correctly rounds price amounts for validity buy", async () => {
                    const order: UserMarketOrder = {
                        side: Side.BUY,
                        tokenID: "123",
                        price: 0.056,
                        amount: 21.04,
                        feeRateBps: 100,
                        nonce: 0,
                    };
                    const orderData: OrderData = await buildMarketOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.001"],
                    );

                    const price = roundDown(
                        Number(orderData.makerAmount) / Number(orderData.takerAmount),
                        6,
                    );
                    expect(price).to.equal(0.056);
                    expect(
                        Number(orderData.makerAmount) / Number(orderData.takerAmount),
                    ).to.greaterThan(0.056);
                });

                it("correctly rounds price amounts for validity buy - 2", async () => {
                    const order: UserMarketOrder = {
                        side: Side.BUY,
                        tokenID: "123",
                        price: 0.007,
                        amount: 119,
                    };
                    const orderData: OrderData = await buildMarketOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.001"],
                    );

                    expect(orderData.makerAmount).to.equal("119000000");
                    expect(orderData.takerAmount).to.equal("17000000000");

                    const price = roundDown(
                        Number(orderData.makerAmount) / Number(orderData.takerAmount),
                        6,
                    );
                    expect(price).to.equal(0.007);
                    expect(Number(orderData.makerAmount) / Number(orderData.takerAmount)).to.gte(
                        0.007,
                    );
                });

                it("correctly rounds price amounts for validity buy - 3", async () => {
                    const order: UserMarketOrder = {
                        side: Side.BUY,
                        tokenID: "123",
                        price: 0.082,
                        amount: 82.82,
                    };
                    const orderData: OrderData = await buildMarketOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.001"],
                    );
                    expect(orderData.makerAmount).to.equal("82820000");
                    expect(orderData.takerAmount).to.equal("1010000000");
                    expect(Number(orderData.makerAmount) / Number(orderData.takerAmount)).to.gte(
                        0.082,
                    );
                });

                it("correctly rounds price amounts for validity buy - 4", async () => {
                    const order: UserMarketOrder = {
                        side: Side.BUY,
                        tokenID: "123",
                        price: 0.078,
                        amount: 9.9996,
                    };
                    const orderData: OrderData = await buildMarketOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.001"],
                    );
                    expect(orderData.makerAmount).to.equal("9990000");
                    expect(orderData.takerAmount).to.equal("128076920");
                    expect(Number(orderData.makerAmount) / Number(orderData.takerAmount)).to.gte(
                        0.078,
                    );
                });

                it("correctly rounds price amounts for validity buy - 5", async () => {
                    const order: UserMarketOrder = {
                        side: Side.BUY,
                        tokenID: "123",
                        price: 0.039,
                        amount: 949.9971,
                    };
                    const orderData: OrderData = await buildMarketOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.001"],
                    );
                    expect(orderData.makerAmount).to.equal("949990000");
                    expect(orderData.takerAmount).to.equal("24358717940");
                    expect(Number(orderData.makerAmount) / Number(orderData.takerAmount)).to.gte(
                        0.039,
                    );
                });

                it("correctly rounds price amounts for validity buy - 6", async () => {
                    const order: UserMarketOrder = {
                        side: Side.BUY,
                        tokenID: "123",
                        price: 0.056,
                        amount: 1,
                    };
                    const orderData: OrderData = await buildMarketOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.001"],
                    );
                    expect(orderData.makerAmount).to.equal("1000000");
                    expect(orderData.takerAmount).to.equal("17857140");
                    expect(Number(orderData.makerAmount) / Number(orderData.takerAmount)).to.gte(
                        0.056,
                    );
                });

                it("correctly rounds price amounts for validity buy - 7", async () => {
                    const order: UserMarketOrder = {
                        side: Side.BUY,
                        tokenID: "123",
                        price: 0.057,
                        amount: 1,
                    };
                    const orderData: OrderData = await buildMarketOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.001"],
                    );
                    expect(orderData.makerAmount).to.equal("1000000");
                    expect(orderData.takerAmount).to.equal("17543850");
                    expect(Number(orderData.makerAmount) / Number(orderData.takerAmount)).to.gte(
                        0.057,
                    );
                });
            });

            describe("0.0001", async () => {
                it("market buy order with a different price", async () => {
                    const order: UserMarketOrder = {
                        side: Side.BUY,
                        tokenID: "123",
                        price: 0.0005,
                        amount: 100,
                        feeRateBps: 111,
                        nonce: 123,
                    };
                    const orderData: OrderData = await buildMarketOrderCreationArgs(
                        "0x0000000000000000000000000000000000000001",
                        "0x0000000000000000000000000000000000000002",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.0001"],
                    );
                    expect(orderData).deep.equal({
                        maker: "0x0000000000000000000000000000000000000002",
                        taker: "0x0000000000000000000000000000000000000000",
                        tokenId: "123",
                        makerAmount: "100000000",
                        takerAmount: "200000000000",
                        side: UtilsSide.BUY,
                        feeRateBps: "111",
                        nonce: "123",
                        signer: "0x0000000000000000000000000000000000000001",
                        expiration: "0",
                        signatureType: SignatureType.EOA,
                    });
                });

                it("correctly rounds price amounts for validity buy", async () => {
                    const order: UserMarketOrder = {
                        side: Side.BUY,
                        tokenID: "123",
                        price: 0.0056,
                        amount: 21.04,
                        feeRateBps: 100,
                        nonce: 0,
                    };
                    const orderData: OrderData = await buildMarketOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.0001"],
                    );

                    const price = roundDown(
                        Number(orderData.makerAmount) / Number(orderData.takerAmount),
                        8,
                    );
                    expect(price).to.equal(0.0056);
                    expect(
                        Number(orderData.makerAmount) / Number(orderData.takerAmount),
                    ).to.greaterThan(0.0056);
                });

                it("correctly rounds price amounts for validity buy - 2", async () => {
                    const order: UserMarketOrder = {
                        side: Side.BUY,
                        tokenID: "123",
                        price: 0.0007,
                        amount: 119,
                    };
                    const orderData: OrderData = await buildMarketOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.0001"],
                    );

                    expect(orderData.makerAmount).to.equal("119000000");
                    expect(orderData.takerAmount).to.equal("170000000000");

                    const price = roundDown(
                        Number(orderData.makerAmount) / Number(orderData.takerAmount),
                        8,
                    );
                    expect(price).to.equal(0.0007);
                    expect(Number(orderData.makerAmount) / Number(orderData.takerAmount)).to.gte(
                        0.0007,
                    );
                });

                it("correctly rounds price amounts for validity buy - 3", async () => {
                    const order: UserMarketOrder = {
                        side: Side.BUY,
                        tokenID: "123",
                        price: 0.0082,
                        amount: 82.82,
                    };
                    const orderData: OrderData = await buildMarketOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.0001"],
                    );
                    expect(orderData.makerAmount).to.equal("82820000");
                    expect(orderData.takerAmount).to.equal("10100000000");
                    expect(Number(orderData.makerAmount) / Number(orderData.takerAmount)).to.gte(
                        0.0082,
                    );
                });

                it("correctly rounds price amounts for validity buy - 4", async () => {
                    const order: UserMarketOrder = {
                        side: Side.BUY,
                        tokenID: "123",
                        price: 0.0078,
                        amount: 9.9996,
                    };
                    const orderData: OrderData = await buildMarketOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.0001"],
                    );
                    expect(orderData.makerAmount).to.equal("9990000");
                    expect(orderData.takerAmount).to.equal("1280769230");
                    expect(Number(orderData.makerAmount) / Number(orderData.takerAmount)).to.gte(
                        0.0078,
                    );
                });

                it("correctly rounds price amounts for validity buy - 5", async () => {
                    const order: UserMarketOrder = {
                        side: Side.BUY,
                        tokenID: "123",
                        price: 0.0039,
                        amount: 949.9971,
                    };
                    const orderData: OrderData = await buildMarketOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.0001"],
                    );
                    expect(orderData.makerAmount).to.equal("949990000");
                    expect(orderData.takerAmount).to.equal("243587179487");
                    expect(Number(orderData.makerAmount) / Number(orderData.takerAmount)).to.gte(
                        0.0039,
                    );
                });

                it("correctly rounds price amounts for validity buy - 6", async () => {
                    const order: UserMarketOrder = {
                        side: Side.BUY,
                        tokenID: "123",
                        price: 0.0056,
                        amount: 1,
                    };
                    const orderData: OrderData = await buildMarketOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.0001"],
                    );
                    expect(orderData.makerAmount).to.equal("1000000");
                    expect(orderData.takerAmount).to.equal("178571428");
                    expect(Number(orderData.makerAmount) / Number(orderData.takerAmount)).to.gte(
                        0.0056,
                    );
                });

                it("correctly rounds price amounts for validity buy - 7", async () => {
                    const order: UserMarketOrder = {
                        side: Side.BUY,
                        tokenID: "123",
                        price: 0.0057,
                        amount: 1,
                    };
                    const orderData: OrderData = await buildMarketOrderCreationArgs(
                        "",
                        "",
                        SignatureType.EOA,
                        order,
                        ROUNDING_CONFIG["0.0001"],
                    );
                    expect(orderData.makerAmount).to.equal("1000000");
                    expect(orderData.takerAmount).to.equal("175438596");
                    expect(Number(orderData.makerAmount) / Number(orderData.takerAmount)).to.gte(
                        0.0057,
                    );
                });
            });
        });
    });

    describe("createMarketOrder", () => {
        describe("CTF Exchange", () => {
            describe("buy order", async () => {
                it("0.1", async () => {
                    const order: UserMarketOrder = {
                        side: Side.BUY,
                        tokenID: "123",
                        price: 0.5,
                        amount: 100,
                        feeRateBps: 111,
                        nonce: 123,
                    };

                    const signedOrder = await createMarketOrder(
                        wallet,
                        Chain.AMOY,
                        SignatureType.EOA,
                        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                        order,
                        { tickSize: "0.1", negRisk: false },
                    );
                    expect(signedOrder).not.null;
                    expect(signedOrder).not.undefined;

                    expect(signedOrder.salt).not.empty;
                    expect(signedOrder.maker).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                    expect(signedOrder.signer).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                    expect(signedOrder.taker).equal("0x0000000000000000000000000000000000000000");
                    expect(signedOrder.tokenId).equal("123");
                    expect(signedOrder.makerAmount).equal("100000000");
                    expect(signedOrder.takerAmount).equal("200000000");
                    expect(signedOrder.side).equal(UtilsSide.BUY);
                    expect(signedOrder.expiration).equal("0");
                    expect(signedOrder.nonce).equal("123");
                    expect(signedOrder.feeRateBps).equal("111");
                    expect(signedOrder.signatureType).equal(SignatureType.EOA);
                    expect(signedOrder.signature).not.empty;
                });

                it("0.01", async () => {
                    const order: UserMarketOrder = {
                        side: Side.BUY,
                        tokenID: "123",
                        price: 0.56,
                        amount: 100,
                        feeRateBps: 111,
                        nonce: 123,
                    };

                    const signedOrder = await createMarketOrder(
                        wallet,
                        Chain.AMOY,
                        SignatureType.EOA,
                        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                        order,
                        { tickSize: "0.01", negRisk: false },
                    );
                    expect(signedOrder).not.null;
                    expect(signedOrder).not.undefined;

                    expect(signedOrder.salt).not.empty;
                    expect(signedOrder.maker).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                    expect(signedOrder.signer).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                    expect(signedOrder.taker).equal("0x0000000000000000000000000000000000000000");
                    expect(signedOrder.tokenId).equal("123");
                    expect(signedOrder.makerAmount).equal("100000000");
                    expect(signedOrder.takerAmount).equal("178571400");
                    expect(signedOrder.side).equal(UtilsSide.BUY);
                    expect(signedOrder.expiration).equal("0");
                    expect(signedOrder.nonce).equal("123");
                    expect(signedOrder.feeRateBps).equal("111");
                    expect(signedOrder.signatureType).equal(SignatureType.EOA);
                    expect(signedOrder.signature).not.empty;
                });

                it("0.001", async () => {
                    const order: UserMarketOrder = {
                        side: Side.BUY,
                        tokenID: "123",
                        price: 0.056,
                        amount: 100,
                        feeRateBps: 111,
                        nonce: 123,
                    };

                    const signedOrder = await createMarketOrder(
                        wallet,
                        Chain.AMOY,
                        SignatureType.EOA,
                        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                        order,
                        { tickSize: "0.001", negRisk: false },
                    );
                    expect(signedOrder).not.null;
                    expect(signedOrder).not.undefined;

                    expect(signedOrder.salt).not.empty;
                    expect(signedOrder.maker).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                    expect(signedOrder.signer).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                    expect(signedOrder.taker).equal("0x0000000000000000000000000000000000000000");
                    expect(signedOrder.tokenId).equal("123");
                    expect(signedOrder.makerAmount).equal("100000000");
                    expect(signedOrder.takerAmount).equal("1785714280");
                    expect(signedOrder.side).equal(UtilsSide.BUY);
                    expect(signedOrder.expiration).equal("0");
                    expect(signedOrder.nonce).equal("123");
                    expect(signedOrder.feeRateBps).equal("111");
                    expect(signedOrder.signatureType).equal(SignatureType.EOA);
                    expect(signedOrder.signature).not.empty;
                });

                it("0.0001", async () => {
                    const order: UserMarketOrder = {
                        side: Side.BUY,
                        tokenID: "123",
                        price: 0.0056,
                        amount: 100,
                        feeRateBps: 111,
                        nonce: 123,
                    };

                    const signedOrder = await createMarketOrder(
                        wallet,
                        Chain.AMOY,
                        SignatureType.EOA,
                        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                        order,
                        { tickSize: "0.0001", negRisk: false },
                    );
                    expect(signedOrder).not.null;
                    expect(signedOrder).not.undefined;

                    expect(signedOrder.salt).not.empty;
                    expect(signedOrder.maker).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                    expect(signedOrder.signer).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                    expect(signedOrder.taker).equal("0x0000000000000000000000000000000000000000");
                    expect(signedOrder.tokenId).equal("123");
                    expect(signedOrder.makerAmount).equal("100000000");
                    expect(signedOrder.takerAmount).equal("17857142857");
                    expect(signedOrder.side).equal(UtilsSide.BUY);
                    expect(signedOrder.expiration).equal("0");
                    expect(signedOrder.nonce).equal("123");
                    expect(signedOrder.feeRateBps).equal("111");
                    expect(signedOrder.signatureType).equal(SignatureType.EOA);
                    expect(signedOrder.signature).not.empty;
                });
            });

            describe("sell order", async () => {
                it("0.1", async () => {
                    const order: UserMarketOrder = {
                        side: Side.SELL,
                        tokenID: "123",
                        price: 0.5,
                        amount: 100,
                        feeRateBps: 111,
                        nonce: 123,
                    };

                    const signedOrder = await createMarketOrder(
                        wallet,
                        Chain.AMOY,
                        SignatureType.EOA,
                        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                        order,
                        { tickSize: "0.1", negRisk: false },
                    );
                    expect(signedOrder).not.null;
                    expect(signedOrder).not.undefined;

                    expect(signedOrder.salt).not.empty;
                    expect(signedOrder.maker).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                    expect(signedOrder.signer).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                    expect(signedOrder.taker).equal("0x0000000000000000000000000000000000000000");
                    expect(signedOrder.tokenId).equal("123");
                    expect(signedOrder.makerAmount).equal("100000000");
                    expect(signedOrder.takerAmount).equal("50000000");
                    expect(signedOrder.side).equal(UtilsSide.SELL);
                    expect(signedOrder.expiration).equal("0");
                    expect(signedOrder.nonce).equal("123");
                    expect(signedOrder.feeRateBps).equal("111");
                    expect(signedOrder.signatureType).equal(SignatureType.EOA);
                    expect(signedOrder.signature).not.empty;
                });

                it("0.01", async () => {
                    const order: UserMarketOrder = {
                        side: Side.SELL,
                        tokenID: "123",
                        price: 0.56,
                        amount: 100,
                        feeRateBps: 111,
                        nonce: 123,
                    };

                    const signedOrder = await createMarketOrder(
                        wallet,
                        Chain.AMOY,
                        SignatureType.EOA,
                        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                        order,
                        { tickSize: "0.01", negRisk: false },
                    );
                    expect(signedOrder).not.null;
                    expect(signedOrder).not.undefined;

                    expect(signedOrder.salt).not.empty;
                    expect(signedOrder.maker).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                    expect(signedOrder.signer).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                    expect(signedOrder.taker).equal("0x0000000000000000000000000000000000000000");
                    expect(signedOrder.tokenId).equal("123");
                    expect(signedOrder.makerAmount).equal("100000000");
                    expect(signedOrder.takerAmount).equal("56000000");
                    expect(signedOrder.side).equal(UtilsSide.SELL);
                    expect(signedOrder.expiration).equal("0");
                    expect(signedOrder.nonce).equal("123");
                    expect(signedOrder.feeRateBps).equal("111");
                    expect(signedOrder.signatureType).equal(SignatureType.EOA);
                    expect(signedOrder.signature).not.empty;
                });

                it("0.001", async () => {
                    const order: UserMarketOrder = {
                        side: Side.SELL,
                        tokenID: "123",
                        price: 0.056,
                        amount: 100,
                        feeRateBps: 111,
                        nonce: 123,
                    };

                    const signedOrder = await createMarketOrder(
                        wallet,
                        Chain.AMOY,
                        SignatureType.EOA,
                        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                        order,
                        { tickSize: "0.001", negRisk: false },
                    );
                    expect(signedOrder).not.null;
                    expect(signedOrder).not.undefined;

                    expect(signedOrder.salt).not.empty;
                    expect(signedOrder.maker).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                    expect(signedOrder.signer).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                    expect(signedOrder.taker).equal("0x0000000000000000000000000000000000000000");
                    expect(signedOrder.tokenId).equal("123");
                    expect(signedOrder.makerAmount).equal("100000000");
                    expect(signedOrder.takerAmount).equal("5600000");
                    expect(signedOrder.side).equal(UtilsSide.SELL);
                    expect(signedOrder.expiration).equal("0");
                    expect(signedOrder.nonce).equal("123");
                    expect(signedOrder.feeRateBps).equal("111");
                    expect(signedOrder.signatureType).equal(SignatureType.EOA);
                    expect(signedOrder.signature).not.empty;
                });

                it("0.0001", async () => {
                    const order: UserMarketOrder = {
                        side: Side.SELL,
                        tokenID: "123",
                        price: 0.0056,
                        amount: 100,
                        feeRateBps: 111,
                        nonce: 123,
                    };

                    const signedOrder = await createMarketOrder(
                        wallet,
                        Chain.AMOY,
                        SignatureType.EOA,
                        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                        order,
                        { tickSize: "0.0001", negRisk: false },
                    );
                    expect(signedOrder).not.null;
                    expect(signedOrder).not.undefined;

                    expect(signedOrder.salt).not.empty;
                    expect(signedOrder.maker).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                    expect(signedOrder.signer).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                    expect(signedOrder.taker).equal("0x0000000000000000000000000000000000000000");
                    expect(signedOrder.tokenId).equal("123");
                    expect(signedOrder.makerAmount).equal("100000000");
                    expect(signedOrder.takerAmount).equal("560000");
                    expect(signedOrder.side).equal(UtilsSide.SELL);
                    expect(signedOrder.expiration).equal("0");
                    expect(signedOrder.nonce).equal("123");
                    expect(signedOrder.feeRateBps).equal("111");
                    expect(signedOrder.signatureType).equal(SignatureType.EOA);
                    expect(signedOrder.signature).not.empty;
                });
            });
        });

        describe("Neg Risk CTF Exchange", () => {
            describe("buy order", async () => {
                it("0.1", async () => {
                    const order: UserMarketOrder = {
                        side: Side.BUY,
                        tokenID: "123",
                        price: 0.5,
                        amount: 100,
                        feeRateBps: 111,
                        nonce: 123,
                    };

                    const signedOrder = await createMarketOrder(
                        wallet,
                        Chain.AMOY,
                        SignatureType.EOA,
                        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                        order,
                        { tickSize: "0.1", negRisk: true },
                    );
                    expect(signedOrder).not.null;
                    expect(signedOrder).not.undefined;

                    expect(signedOrder.salt).not.empty;
                    expect(signedOrder.maker).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                    expect(signedOrder.signer).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                    expect(signedOrder.taker).equal("0x0000000000000000000000000000000000000000");
                    expect(signedOrder.tokenId).equal("123");
                    expect(signedOrder.makerAmount).equal("100000000");
                    expect(signedOrder.takerAmount).equal("200000000");
                    expect(signedOrder.side).equal(UtilsSide.BUY);
                    expect(signedOrder.expiration).equal("0");
                    expect(signedOrder.nonce).equal("123");
                    expect(signedOrder.feeRateBps).equal("111");
                    expect(signedOrder.signatureType).equal(SignatureType.EOA);
                    expect(signedOrder.signature).not.empty;
                });

                it("0.01", async () => {
                    const order: UserMarketOrder = {
                        side: Side.BUY,
                        tokenID: "123",
                        price: 0.56,
                        amount: 100,
                        feeRateBps: 111,
                        nonce: 123,
                    };

                    const signedOrder = await createMarketOrder(
                        wallet,
                        Chain.AMOY,
                        SignatureType.EOA,
                        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                        order,
                        { tickSize: "0.01", negRisk: true },
                    );
                    expect(signedOrder).not.null;
                    expect(signedOrder).not.undefined;

                    expect(signedOrder.salt).not.empty;
                    expect(signedOrder.maker).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                    expect(signedOrder.signer).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                    expect(signedOrder.taker).equal("0x0000000000000000000000000000000000000000");
                    expect(signedOrder.tokenId).equal("123");
                    expect(signedOrder.makerAmount).equal("100000000");
                    expect(signedOrder.takerAmount).equal("178571400");
                    expect(signedOrder.side).equal(UtilsSide.BUY);
                    expect(signedOrder.expiration).equal("0");
                    expect(signedOrder.nonce).equal("123");
                    expect(signedOrder.feeRateBps).equal("111");
                    expect(signedOrder.signatureType).equal(SignatureType.EOA);
                    expect(signedOrder.signature).not.empty;
                });

                it("0.001", async () => {
                    const order: UserMarketOrder = {
                        side: Side.BUY,
                        tokenID: "123",
                        price: 0.056,
                        amount: 100,
                        feeRateBps: 111,
                        nonce: 123,
                    };

                    const signedOrder = await createMarketOrder(
                        wallet,
                        Chain.AMOY,
                        SignatureType.EOA,
                        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                        order,
                        { tickSize: "0.001", negRisk: true },
                    );
                    expect(signedOrder).not.null;
                    expect(signedOrder).not.undefined;

                    expect(signedOrder.salt).not.empty;
                    expect(signedOrder.maker).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                    expect(signedOrder.signer).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                    expect(signedOrder.taker).equal("0x0000000000000000000000000000000000000000");
                    expect(signedOrder.tokenId).equal("123");
                    expect(signedOrder.makerAmount).equal("100000000");
                    expect(signedOrder.takerAmount).equal("1785714280");
                    expect(signedOrder.side).equal(UtilsSide.BUY);
                    expect(signedOrder.expiration).equal("0");
                    expect(signedOrder.nonce).equal("123");
                    expect(signedOrder.feeRateBps).equal("111");
                    expect(signedOrder.signatureType).equal(SignatureType.EOA);
                    expect(signedOrder.signature).not.empty;
                });

                it("0.0001", async () => {
                    const order: UserMarketOrder = {
                        side: Side.BUY,
                        tokenID: "123",
                        price: 0.0056,
                        amount: 100,
                        feeRateBps: 111,
                        nonce: 123,
                    };

                    const signedOrder = await createMarketOrder(
                        wallet,
                        Chain.AMOY,
                        SignatureType.EOA,
                        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                        order,
                        { tickSize: "0.0001", negRisk: true },
                    );
                    expect(signedOrder).not.null;
                    expect(signedOrder).not.undefined;

                    expect(signedOrder.salt).not.empty;
                    expect(signedOrder.maker).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                    expect(signedOrder.signer).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                    expect(signedOrder.taker).equal("0x0000000000000000000000000000000000000000");
                    expect(signedOrder.tokenId).equal("123");
                    expect(signedOrder.makerAmount).equal("100000000");
                    expect(signedOrder.takerAmount).equal("17857142857");
                    expect(signedOrder.side).equal(UtilsSide.BUY);
                    expect(signedOrder.expiration).equal("0");
                    expect(signedOrder.nonce).equal("123");
                    expect(signedOrder.feeRateBps).equal("111");
                    expect(signedOrder.signatureType).equal(SignatureType.EOA);
                    expect(signedOrder.signature).not.empty;
                });
            });

            describe("sell order", async () => {
                it("0.1", async () => {
                    const order: UserMarketOrder = {
                        side: Side.SELL,
                        tokenID: "123",
                        price: 0.5,
                        amount: 100,
                        feeRateBps: 111,
                        nonce: 123,
                    };

                    const signedOrder = await createMarketOrder(
                        wallet,
                        Chain.AMOY,
                        SignatureType.EOA,
                        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                        order,
                        { tickSize: "0.1", negRisk: true },
                    );
                    expect(signedOrder).not.null;
                    expect(signedOrder).not.undefined;

                    expect(signedOrder.salt).not.empty;
                    expect(signedOrder.maker).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                    expect(signedOrder.signer).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                    expect(signedOrder.taker).equal("0x0000000000000000000000000000000000000000");
                    expect(signedOrder.tokenId).equal("123");
                    expect(signedOrder.makerAmount).equal("100000000");
                    expect(signedOrder.takerAmount).equal("50000000");
                    expect(signedOrder.side).equal(UtilsSide.SELL);
                    expect(signedOrder.expiration).equal("0");
                    expect(signedOrder.nonce).equal("123");
                    expect(signedOrder.feeRateBps).equal("111");
                    expect(signedOrder.signatureType).equal(SignatureType.EOA);
                    expect(signedOrder.signature).not.empty;
                });

                it("0.01", async () => {
                    const order: UserMarketOrder = {
                        side: Side.SELL,
                        tokenID: "123",
                        price: 0.56,
                        amount: 100,
                        feeRateBps: 111,
                        nonce: 123,
                    };

                    const signedOrder = await createMarketOrder(
                        wallet,
                        Chain.AMOY,
                        SignatureType.EOA,
                        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                        order,
                        { tickSize: "0.01", negRisk: true },
                    );
                    expect(signedOrder).not.null;
                    expect(signedOrder).not.undefined;

                    expect(signedOrder.salt).not.empty;
                    expect(signedOrder.maker).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                    expect(signedOrder.signer).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                    expect(signedOrder.taker).equal("0x0000000000000000000000000000000000000000");
                    expect(signedOrder.tokenId).equal("123");
                    expect(signedOrder.makerAmount).equal("100000000");
                    expect(signedOrder.takerAmount).equal("56000000");
                    expect(signedOrder.side).equal(UtilsSide.SELL);
                    expect(signedOrder.expiration).equal("0");
                    expect(signedOrder.nonce).equal("123");
                    expect(signedOrder.feeRateBps).equal("111");
                    expect(signedOrder.signatureType).equal(SignatureType.EOA);
                    expect(signedOrder.signature).not.empty;
                });

                it("0.001", async () => {
                    const order: UserMarketOrder = {
                        side: Side.SELL,
                        tokenID: "123",
                        price: 0.056,
                        amount: 100,
                        feeRateBps: 111,
                        nonce: 123,
                    };

                    const signedOrder = await createMarketOrder(
                        wallet,
                        Chain.AMOY,
                        SignatureType.EOA,
                        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                        order,
                        { tickSize: "0.001", negRisk: true },
                    );
                    expect(signedOrder).not.null;
                    expect(signedOrder).not.undefined;

                    expect(signedOrder.salt).not.empty;
                    expect(signedOrder.maker).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                    expect(signedOrder.signer).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                    expect(signedOrder.taker).equal("0x0000000000000000000000000000000000000000");
                    expect(signedOrder.tokenId).equal("123");
                    expect(signedOrder.makerAmount).equal("100000000");
                    expect(signedOrder.takerAmount).equal("5600000");
                    expect(signedOrder.side).equal(UtilsSide.SELL);
                    expect(signedOrder.expiration).equal("0");
                    expect(signedOrder.nonce).equal("123");
                    expect(signedOrder.feeRateBps).equal("111");
                    expect(signedOrder.signatureType).equal(SignatureType.EOA);
                    expect(signedOrder.signature).not.empty;
                });

                it("0.0001", async () => {
                    const order: UserMarketOrder = {
                        side: Side.SELL,
                        tokenID: "123",
                        price: 0.0056,
                        amount: 100,
                        feeRateBps: 111,
                        nonce: 123,
                    };

                    const signedOrder = await createMarketOrder(
                        wallet,
                        Chain.AMOY,
                        SignatureType.EOA,
                        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                        order,
                        { tickSize: "0.0001", negRisk: true },
                    );
                    expect(signedOrder).not.null;
                    expect(signedOrder).not.undefined;

                    expect(signedOrder.salt).not.empty;
                    expect(signedOrder.maker).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                    expect(signedOrder.signer).equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
                    expect(signedOrder.taker).equal("0x0000000000000000000000000000000000000000");
                    expect(signedOrder.tokenId).equal("123");
                    expect(signedOrder.makerAmount).equal("100000000");
                    expect(signedOrder.takerAmount).equal("560000");
                    expect(signedOrder.side).equal(UtilsSide.SELL);
                    expect(signedOrder.expiration).equal("0");
                    expect(signedOrder.nonce).equal("123");
                    expect(signedOrder.feeRateBps).equal("111");
                    expect(signedOrder.signatureType).equal(SignatureType.EOA);
                    expect(signedOrder.signature).not.empty;
                });
            });
        });
    });

    describe("calculateBuyMarketPrice FOK", () => {
        it("empty orderbook", () => {
            expect(() => calculateBuyMarketPrice([], 100, OrderType.FOK)).to.throw("no match");
        });
        it("not enough", () => {
            const positions = [
                { price: "0.5", size: "100" },
                { price: "0.4", size: "100" },
            ] as OrderSummary[];
            expect(() => calculateBuyMarketPrice(positions, 100, OrderType.FOK)).to.throw(
                "no match",
            );
        });
        it("ok", () => {
            let positions = [
                { price: "0.5", size: "100" },
                { price: "0.4", size: "100" },
                { price: "0.3", size: "100" },
            ] as OrderSummary[];
            expect(calculateBuyMarketPrice(positions, 100, OrderType.FOK)).equal(0.5);

            positions = [
                { price: "0.5", size: "100" },
                { price: "0.4", size: "200" },
                { price: "0.3", size: "100" },
            ] as OrderSummary[];
            expect(calculateBuyMarketPrice(positions, 100, OrderType.FOK)).equal(0.4);

            positions = [
                { price: "0.5", size: "120" },
                { price: "0.4", size: "100" },
                { price: "0.3", size: "100" },
            ] as OrderSummary[];
            expect(calculateBuyMarketPrice(positions, 100, OrderType.FOK)).equal(0.5);

            positions = [
                { price: "0.5", size: "200" },
                { price: "0.4", size: "100" },
                { price: "0.3", size: "100" },
            ] as OrderSummary[];
            expect(calculateBuyMarketPrice(positions, 100, OrderType.FOK)).equal(0.5);
        });
    });

    describe("calculateSellMarketPrice FOK", () => {
        it("empty orderbook", () => {
            expect(() => calculateSellMarketPrice([], 100, OrderType.FOK)).to.throw("no match");
        });
        it("not enough", () => {
            const positions = [
                { price: "0.4", size: "10" },
                { price: "0.5", size: "10" },
            ] as OrderSummary[];
            expect(() => calculateSellMarketPrice(positions, 100, OrderType.FOK)).to.throw(
                "no match",
            );
        });
        it("ok", () => {
            let positions = [
                { price: "0.3", size: "100" },
                { price: "0.4", size: "100" },
                { price: "0.5", size: "100" },
            ] as OrderSummary[];
            expect(calculateSellMarketPrice(positions, 100, OrderType.FOK)).equal(0.5);

            positions = [
                { price: "0.3", size: "100" },
                { price: "0.4", size: "100" },
                { price: "0.5", size: "100" },
            ] as OrderSummary[];
            expect(calculateSellMarketPrice(positions, 300, OrderType.FOK)).equal(0.3);

            positions = [
                { price: "0.3", size: "100" },
                { price: "0.4", size: "200" },
                { price: "0.5", size: "100" },
            ] as OrderSummary[];
            expect(calculateSellMarketPrice(positions, 300, OrderType.FOK)).equal(0.4);

            positions = [
                { price: "0.3", size: "334" },
                { price: "0.4", size: "100" },
                { price: "0.5", size: "1000" },
            ] as OrderSummary[];
            expect(calculateSellMarketPrice(positions, 600, OrderType.FOK)).equal(0.5);
        });
    });

    describe("calculateBuyMarketPrice FAK", () => {
        it("empty orderbook", () => {
            expect(() => calculateBuyMarketPrice([], 100, OrderType.FAK)).to.throw("no match");
        });
        it("not enough", () => {
            let positions = [
                { price: "0.5", size: "100" },
                { price: "0.4", size: "100" },
            ] as OrderSummary[];
            expect(calculateBuyMarketPrice(positions, 100, OrderType.FAK)).equal(0.5);
            positions = [
                { price: "0.6", size: "100" },
                { price: "0.55", size: "100" },
                { price: "0.5", size: "100" },
            ] as OrderSummary[];
            expect(calculateBuyMarketPrice(positions, 200, OrderType.FAK)).equal(0.6);
        });
        it("ok", () => {
            let positions = [
                { price: "0.5", size: "100" },
                { price: "0.4", size: "100" },
                { price: "0.3", size: "100" },
            ] as OrderSummary[];
            expect(calculateBuyMarketPrice(positions, 100, OrderType.FAK)).equal(0.5);

            positions = [
                { price: "0.5", size: "100" },
                { price: "0.4", size: "200" },
                { price: "0.3", size: "100" },
            ] as OrderSummary[];
            expect(calculateBuyMarketPrice(positions, 100, OrderType.FAK)).equal(0.4);

            positions = [
                { price: "0.5", size: "120" },
                { price: "0.4", size: "100" },
                { price: "0.3", size: "100" },
            ] as OrderSummary[];
            expect(calculateBuyMarketPrice(positions, 100, OrderType.FAK)).equal(0.5);

            positions = [
                { price: "0.5", size: "200" },
                { price: "0.4", size: "100" },
                { price: "0.3", size: "100" },
            ] as OrderSummary[];
            expect(calculateBuyMarketPrice(positions, 100, OrderType.FAK)).equal(0.5);
        });
    });

    describe("calculateSellMarketPrice FAK", () => {
        it("empty orderbook", () => {
            expect(() => calculateSellMarketPrice([], 100, OrderType.FAK)).to.throw("no match");
        });
        it("not enough", () => {
            const positions = [
                { price: "0.4", size: "10" },
                { price: "0.5", size: "10" },
            ] as OrderSummary[];
            expect(calculateSellMarketPrice(positions, 100, OrderType.FAK)).equal(0.4);
        });
        it("ok", () => {
            let positions = [
                { price: "0.3", size: "100" },
                { price: "0.4", size: "100" },
                { price: "0.5", size: "100" },
            ] as OrderSummary[];
            expect(calculateSellMarketPrice(positions, 100, OrderType.FAK)).equal(0.5);

            positions = [
                { price: "0.3", size: "100" },
                { price: "0.4", size: "100" },
                { price: "0.5", size: "100" },
            ] as OrderSummary[];
            expect(calculateSellMarketPrice(positions, 300, OrderType.FAK)).equal(0.3);

            positions = [
                { price: "0.3", size: "100" },
                { price: "0.4", size: "200" },
                { price: "0.5", size: "100" },
            ] as OrderSummary[];
            expect(calculateSellMarketPrice(positions, 300, OrderType.FAK)).equal(0.4);

            positions = [
                { price: "0.3", size: "334" },
                { price: "0.4", size: "100" },
                { price: "0.5", size: "1000" },
            ] as OrderSummary[];
            expect(calculateSellMarketPrice(positions, 600, OrderType.FAK)).equal(0.5);
        });
    });
});
