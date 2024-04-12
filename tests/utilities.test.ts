/* eslint-disable max-len */
import "mocha";
import { expect } from "chai";
import {
    decimalPlaces,
    generateOrderBookSummaryHash,
    isTickSizeSmaller,
    orderToJson,
    priceValid,
    roundDown,
} from "../src/utilities";
import { Side as UtilsSide, SignatureType } from "@polymarket/order-utils";
import { Chain, OrderBookSummary, OrderType, Side, UserMarketOrder, UserOrder } from "../src";
import { Wallet } from "@ethersproject/wallet";
import { createMarketBuyOrder, createOrder } from "../src/order-builder/helpers";

describe("utilities", () => {
    describe("orderToJson", () => {
        it("GTD buy", () => {
            const jsonOrder = orderToJson(
                {
                    salt: "1000",
                    maker: "0x0000000000000000000000000000000000000001",
                    signer: "0x0000000000000000000000000000000000000002",
                    taker: "0x0000000000000000000000000000000000000003",
                    tokenId: "1",
                    makerAmount: "100000000",
                    takerAmount: "50000000",
                    side: UtilsSide.BUY,
                    expiration: "0",
                    nonce: "1",
                    feeRateBps: "100",
                    signatureType: SignatureType.POLY_GNOSIS_SAFE,
                    signature: "0x",
                },
                "aaaa-bbbb-cccc-dddd",
                OrderType.GTD,
            );
            expect(jsonOrder).not.null;
            expect(jsonOrder).not.undefined;

            expect(jsonOrder).deep.equal({
                order: {
                    salt: 1000,
                    maker: "0x0000000000000000000000000000000000000001",
                    signer: "0x0000000000000000000000000000000000000002",
                    taker: "0x0000000000000000000000000000000000000003",
                    tokenId: "1",
                    makerAmount: "100000000",
                    takerAmount: "50000000",
                    side: "BUY",
                    expiration: "0",
                    nonce: "1",
                    feeRateBps: "100",
                    signatureType: 2,
                    signature: "0x",
                },
                owner: "aaaa-bbbb-cccc-dddd",
                orderType: "GTD",
            });
        });

        it("GTD sell", () => {
            const jsonOrder = orderToJson(
                {
                    salt: "1000",
                    maker: "0x0000000000000000000000000000000000000001",
                    signer: "0x0000000000000000000000000000000000000002",
                    taker: "0x0000000000000000000000000000000000000003",
                    tokenId: "1",
                    makerAmount: "100000000",
                    takerAmount: "50000000",
                    side: UtilsSide.SELL,
                    expiration: "0",
                    nonce: "1",
                    feeRateBps: "100",
                    signatureType: SignatureType.POLY_GNOSIS_SAFE,
                    signature: "0x",
                },
                "aaaa-bbbb-cccc-dddd",
                OrderType.GTD,
            );
            expect(jsonOrder).not.null;
            expect(jsonOrder).not.undefined;

            expect(jsonOrder).deep.equal({
                order: {
                    salt: 1000,
                    maker: "0x0000000000000000000000000000000000000001",
                    signer: "0x0000000000000000000000000000000000000002",
                    taker: "0x0000000000000000000000000000000000000003",
                    tokenId: "1",
                    makerAmount: "100000000",
                    takerAmount: "50000000",
                    side: "SELL",
                    expiration: "0",
                    nonce: "1",
                    feeRateBps: "100",
                    signatureType: 2,
                    signature: "0x",
                },
                owner: "aaaa-bbbb-cccc-dddd",
                orderType: "GTD",
            });
        });

        it("GTC buy", () => {
            const jsonOrder = orderToJson(
                {
                    salt: "1000",
                    maker: "0x0000000000000000000000000000000000000001",
                    signer: "0x0000000000000000000000000000000000000002",
                    taker: "0x0000000000000000000000000000000000000003",
                    tokenId: "1",
                    makerAmount: "100000000",
                    takerAmount: "50000000",
                    side: UtilsSide.BUY,
                    expiration: "0",
                    nonce: "1",
                    feeRateBps: "100",
                    signatureType: SignatureType.POLY_GNOSIS_SAFE,
                    signature: "0x",
                },
                "aaaa-bbbb-cccc-dddd",
                OrderType.GTC,
            );
            expect(jsonOrder).not.null;
            expect(jsonOrder).not.undefined;

            expect(jsonOrder).deep.equal({
                order: {
                    salt: 1000,
                    maker: "0x0000000000000000000000000000000000000001",
                    signer: "0x0000000000000000000000000000000000000002",
                    taker: "0x0000000000000000000000000000000000000003",
                    tokenId: "1",
                    makerAmount: "100000000",
                    takerAmount: "50000000",
                    side: "BUY",
                    expiration: "0",
                    nonce: "1",
                    feeRateBps: "100",
                    signatureType: 2,
                    signature: "0x",
                },
                owner: "aaaa-bbbb-cccc-dddd",
                orderType: "GTC",
            });
        });

        it("GTC sell", () => {
            const jsonOrder = orderToJson(
                {
                    salt: "1000",
                    maker: "0x0000000000000000000000000000000000000001",
                    signer: "0x0000000000000000000000000000000000000002",
                    taker: "0x0000000000000000000000000000000000000003",
                    tokenId: "1",
                    makerAmount: "50000000",
                    takerAmount: "100000000",
                    side: UtilsSide.SELL,
                    expiration: "0",
                    nonce: "1",
                    feeRateBps: "100",
                    signatureType: SignatureType.POLY_PROXY,
                    signature: "0x",
                },
                "aaaa-bbbb-cccc-dddd",
                OrderType.GTC,
            );
            expect(jsonOrder).not.null;
            expect(jsonOrder).not.undefined;

            expect(jsonOrder).deep.equal({
                order: {
                    salt: 1000,
                    maker: "0x0000000000000000000000000000000000000001",
                    signer: "0x0000000000000000000000000000000000000002",
                    taker: "0x0000000000000000000000000000000000000003",
                    tokenId: "1",
                    makerAmount: "50000000",
                    takerAmount: "100000000",
                    side: "SELL",
                    expiration: "0",
                    nonce: "1",
                    feeRateBps: "100",
                    signatureType: 1,
                    signature: "0x",
                },
                owner: "aaaa-bbbb-cccc-dddd",
                orderType: "GTC",
            });
        });

        it("FOK buy", () => {
            const jsonOrder = orderToJson(
                {
                    salt: "1000",
                    maker: "0x0000000000000000000000000000000000000001",
                    signer: "0x0000000000000000000000000000000000000002",
                    taker: "0x0000000000000000000000000000000000000003",
                    tokenId: "1",
                    makerAmount: "100000000",
                    takerAmount: "200000000",
                    side: UtilsSide.BUY,
                    expiration: "0",
                    nonce: "1",
                    feeRateBps: "100",
                    signatureType: SignatureType.POLY_GNOSIS_SAFE,
                    signature: "0x",
                },
                "aaaa-bbbb-cccc-dddd",
                OrderType.FOK,
            );
            expect(jsonOrder).not.null;
            expect(jsonOrder).not.undefined;

            expect(jsonOrder).deep.equal({
                order: {
                    salt: 1000,
                    maker: "0x0000000000000000000000000000000000000001",
                    signer: "0x0000000000000000000000000000000000000002",
                    taker: "0x0000000000000000000000000000000000000003",
                    tokenId: "1",
                    makerAmount: "100000000",
                    takerAmount: "200000000",
                    side: "BUY",
                    expiration: "0",
                    nonce: "1",
                    feeRateBps: "100",
                    signatureType: 2,
                    signature: "0x",
                },
                owner: "aaaa-bbbb-cccc-dddd",
                orderType: "FOK",
            });
        });

        describe("All orders combinations", async () => {
            describe("CTF Exchange", async () => {
                describe("0.1", async () => {
                    // publicly known private key
                    const token =
                        "71321045679252212594626385532706912750332728571942532289631379312455583992563";
                    const privateKey =
                        "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
                    const address = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
                    const wallet = new Wallet(privateKey);
                    const chainId = Chain.AMOY;
                    const owner = "f4f247b7-4ac7-ff29-a152-04fda0a8755a";

                    it("GTD BUY EOA", async () => {
                        const userOrder: UserOrder = {
                            tokenID: token,
                            price: 0.5,
                            side: Side.BUY,
                            size: 100,
                            expiration: 1709948026,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.EOA,
                            address,
                            userOrder,
                            { tickSize: "0.1", negRisk: false },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTDOrder = orderToJson(signedOrder, owner, OrderType.GTD);
                        expect(jsonGTDOrder).not.null;
                        expect(jsonGTDOrder).not.undefined;

                        expect(jsonGTDOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "50000000",
                                takerAmount: "100000000",
                                side: "BUY",
                                expiration: "1709948026",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 0,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTD,
                        });
                    });

                    it("GTD BUY POLY_PROXY", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.5,
                            side: Side.BUY,
                            size: 100,
                            expiration: 1709948026,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_PROXY,
                            address,
                            userOrder,
                            { tickSize: "0.1", negRisk: false },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTDOrder = orderToJson(signedOrder, owner, OrderType.GTD);
                        expect(jsonGTDOrder).not.null;
                        expect(jsonGTDOrder).not.undefined;

                        expect(jsonGTDOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "50000000",
                                takerAmount: "100000000",
                                side: "BUY",
                                expiration: "1709948026",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 1,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTD,
                        });
                    });

                    it("GTD BUY POLY_GNOSIS_SAFE", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.5,
                            side: Side.BUY,
                            size: 100,
                            expiration: 1709948026,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_GNOSIS_SAFE,
                            address,
                            userOrder,
                            { tickSize: "0.1", negRisk: false },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTDOrder = orderToJson(signedOrder, owner, OrderType.GTD);
                        expect(jsonGTDOrder).not.null;
                        expect(jsonGTDOrder).not.undefined;

                        expect(jsonGTDOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "50000000",
                                takerAmount: "100000000",
                                side: "BUY",
                                expiration: "1709948026",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 2,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTD,
                        });
                    });

                    it("GTD SELL EOA", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.5,
                            side: Side.SELL,
                            size: 100,
                            expiration: 1709948026,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.EOA,
                            address,
                            userOrder,
                            { tickSize: "0.1", negRisk: false },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTDOrder = orderToJson(signedOrder, owner, OrderType.GTD);
                        expect(jsonGTDOrder).not.null;
                        expect(jsonGTDOrder).not.undefined;

                        expect(jsonGTDOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "50000000",
                                side: "SELL",
                                expiration: "1709948026",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 0,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTD,
                        });
                    });

                    it("GTD SELL POLY_PROXY", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.5,
                            side: Side.SELL,
                            size: 100,
                            expiration: 1709948026,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_PROXY,
                            address,
                            userOrder,
                            { tickSize: "0.1", negRisk: false },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTDOrder = orderToJson(signedOrder, owner, OrderType.GTD);
                        expect(jsonGTDOrder).not.null;
                        expect(jsonGTDOrder).not.undefined;

                        expect(jsonGTDOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "50000000",
                                side: "SELL",
                                expiration: "1709948026",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 1,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTD,
                        });
                    });

                    it("GTD SELL POLY_GNOSIS_SAFE", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.5,
                            side: Side.SELL,
                            size: 100,
                            expiration: 1709948026,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_GNOSIS_SAFE,
                            address,
                            userOrder,
                            { tickSize: "0.1", negRisk: false },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTDOrder = orderToJson(signedOrder, owner, OrderType.GTD);
                        expect(jsonGTDOrder).not.null;
                        expect(jsonGTDOrder).not.undefined;

                        expect(jsonGTDOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "50000000",
                                side: "SELL",
                                expiration: "1709948026",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 2,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTD,
                        });
                    });

                    it("GTC BUY EOA", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.5,
                            side: Side.BUY,
                            size: 100,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.EOA,
                            address,
                            userOrder,
                            { tickSize: "0.1", negRisk: false },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTCOrder = orderToJson(signedOrder, owner, OrderType.GTC);
                        expect(jsonGTCOrder).not.null;
                        expect(jsonGTCOrder).not.undefined;

                        expect(jsonGTCOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "50000000",
                                takerAmount: "100000000",
                                side: "BUY",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 0,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTC,
                        });
                    });

                    it("GTC BUY POLY_PROXY", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.5,
                            side: Side.BUY,
                            size: 100,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_PROXY,
                            address,
                            userOrder,
                            { tickSize: "0.1", negRisk: false },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTCOrder = orderToJson(signedOrder, owner, OrderType.GTC);
                        expect(jsonGTCOrder).not.null;
                        expect(jsonGTCOrder).not.undefined;

                        expect(jsonGTCOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "50000000",
                                takerAmount: "100000000",
                                side: "BUY",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 1,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTC,
                        });
                    });

                    it("GTC BUY POLY_GNOSIS_SAFE", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.5,
                            side: Side.BUY,
                            size: 100,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_GNOSIS_SAFE,
                            address,
                            userOrder,
                            { tickSize: "0.1", negRisk: false },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTCOrder = orderToJson(signedOrder, owner, OrderType.GTC);
                        expect(jsonGTCOrder).not.null;
                        expect(jsonGTCOrder).not.undefined;

                        expect(jsonGTCOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "50000000",
                                takerAmount: "100000000",
                                side: "BUY",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 2,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTC,
                        });
                    });

                    it("GTC SELL EOA", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.5,
                            side: Side.SELL,
                            size: 100,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.EOA,
                            address,
                            userOrder,
                            { tickSize: "0.1", negRisk: false },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTCOrder = orderToJson(signedOrder, owner, OrderType.GTC);
                        expect(jsonGTCOrder).not.null;
                        expect(jsonGTCOrder).not.undefined;

                        expect(jsonGTCOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "50000000",
                                side: "SELL",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 0,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTC,
                        });
                    });

                    it("GTC SELL POLY_PROXY", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.5,
                            side: Side.SELL,
                            size: 100,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_PROXY,
                            address,
                            userOrder,
                            { tickSize: "0.1", negRisk: false },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTCOrder = orderToJson(signedOrder, owner, OrderType.GTC);
                        expect(jsonGTCOrder).not.null;
                        expect(jsonGTCOrder).not.undefined;

                        expect(jsonGTCOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "50000000",
                                side: "SELL",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 1,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTC,
                        });
                    });

                    it("GTC SELL POLY_GNOSIS_SAFE", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.5,
                            side: Side.SELL,
                            size: 100,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_GNOSIS_SAFE,
                            address,
                            userOrder,
                            { tickSize: "0.1", negRisk: false },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTCOrder = orderToJson(signedOrder, owner, OrderType.GTC);
                        expect(jsonGTCOrder).not.null;
                        expect(jsonGTCOrder).not.undefined;

                        expect(jsonGTCOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "50000000",
                                side: "SELL",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 2,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTC,
                        });
                    });

                    it("FOK BUY EOA", async () => {
                        const userMarketOrder: UserMarketOrder = {
                            tokenID: token,
                            price: 0.5,
                            amount: 100,
                        };
                        const signedOrder = await createMarketBuyOrder(
                            wallet,
                            chainId,
                            SignatureType.EOA,
                            address,
                            userMarketOrder,
                            { tickSize: "0.1", negRisk: false },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonFOKOrder = orderToJson(signedOrder, owner, OrderType.FOK);
                        expect(jsonFOKOrder).not.null;
                        expect(jsonFOKOrder).not.undefined;

                        expect(jsonFOKOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "200000000",
                                side: "BUY",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 0,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.FOK,
                        });
                    });

                    it("FOK BUY POLY_PROXY", async () => {
                        const userMarketOrder = {
                            tokenID: token,
                            price: 0.5,
                            amount: 100,
                        };
                        const signedOrder = await createMarketBuyOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_PROXY,
                            address,
                            userMarketOrder,
                            { tickSize: "0.1", negRisk: false },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonFOKOrder = orderToJson(signedOrder, owner, OrderType.FOK);
                        expect(jsonFOKOrder).not.null;
                        expect(jsonFOKOrder).not.undefined;

                        expect(jsonFOKOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "200000000",
                                side: "BUY",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 1,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.FOK,
                        });
                    });

                    it("FOK BUY POLY_GNOSIS_SAFE", async () => {
                        const userMarketOrder = {
                            tokenID: token,
                            price: 0.5,
                            amount: 100,
                        };
                        const signedOrder = await createMarketBuyOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_GNOSIS_SAFE,
                            address,
                            userMarketOrder,
                            { tickSize: "0.1", negRisk: false },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonFOKOrder = orderToJson(signedOrder, owner, OrderType.FOK);
                        expect(jsonFOKOrder).not.null;
                        expect(jsonFOKOrder).not.undefined;

                        expect(jsonFOKOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "200000000",
                                side: "BUY",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 2,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.FOK,
                        });
                    });
                });

                describe("0.01", async () => {
                    // publicly known private key
                    const token =
                        "71321045679252212594626385532706912750332728571942532289631379312455583992563";
                    const privateKey =
                        "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
                    const address = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
                    const wallet = new Wallet(privateKey);
                    const chainId = Chain.AMOY;
                    const owner = "f4f247b7-4ac7-ff29-a152-04fda0a8755a";

                    it("GTD BUY EOA", async () => {
                        const userOrder: UserOrder = {
                            tokenID: token,
                            price: 0.05,
                            side: Side.BUY,
                            size: 100,
                            expiration: 1709948026,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.EOA,
                            address,
                            userOrder,
                            { tickSize: "0.01", negRisk: false },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTDOrder = orderToJson(signedOrder, owner, OrderType.GTD);
                        expect(jsonGTDOrder).not.null;
                        expect(jsonGTDOrder).not.undefined;

                        expect(jsonGTDOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "5000000",
                                takerAmount: "100000000",
                                side: "BUY",
                                expiration: "1709948026",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 0,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTD,
                        });
                    });

                    it("GTD BUY POLY_PROXY", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.05,
                            side: Side.BUY,
                            size: 100,
                            expiration: 1709948026,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_PROXY,
                            address,
                            userOrder,
                            { tickSize: "0.01", negRisk: false },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTDOrder = orderToJson(signedOrder, owner, OrderType.GTD);
                        expect(jsonGTDOrder).not.null;
                        expect(jsonGTDOrder).not.undefined;

                        expect(jsonGTDOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "5000000",
                                takerAmount: "100000000",
                                side: "BUY",
                                expiration: "1709948026",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 1,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTD,
                        });
                    });

                    it("GTD BUY POLY_GNOSIS_SAFE", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.05,
                            side: Side.BUY,
                            size: 100,
                            expiration: 1709948026,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_GNOSIS_SAFE,
                            address,
                            userOrder,
                            { tickSize: "0.01", negRisk: false },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTDOrder = orderToJson(signedOrder, owner, OrderType.GTD);
                        expect(jsonGTDOrder).not.null;
                        expect(jsonGTDOrder).not.undefined;

                        expect(jsonGTDOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "5000000",
                                takerAmount: "100000000",
                                side: "BUY",
                                expiration: "1709948026",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 2,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTD,
                        });
                    });

                    it("GTD SELL EOA", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.05,
                            side: Side.SELL,
                            size: 100,
                            expiration: 1709948026,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.EOA,
                            address,
                            userOrder,
                            { tickSize: "0.01", negRisk: false },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTDOrder = orderToJson(signedOrder, owner, OrderType.GTD);
                        expect(jsonGTDOrder).not.null;
                        expect(jsonGTDOrder).not.undefined;

                        expect(jsonGTDOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "5000000",
                                side: "SELL",
                                expiration: "1709948026",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 0,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTD,
                        });
                    });

                    it("GTD SELL POLY_PROXY", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.05,
                            side: Side.SELL,
                            size: 100,
                            expiration: 1709948026,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_PROXY,
                            address,
                            userOrder,
                            { tickSize: "0.01", negRisk: false },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTDOrder = orderToJson(signedOrder, owner, OrderType.GTD);
                        expect(jsonGTDOrder).not.null;
                        expect(jsonGTDOrder).not.undefined;

                        expect(jsonGTDOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "5000000",
                                side: "SELL",
                                expiration: "1709948026",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 1,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTD,
                        });
                    });

                    it("GTD SELL POLY_GNOSIS_SAFE", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.05,
                            side: Side.SELL,
                            size: 100,
                            expiration: 1709948026,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_GNOSIS_SAFE,
                            address,
                            userOrder,
                            { tickSize: "0.01", negRisk: false },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTDOrder = orderToJson(signedOrder, owner, OrderType.GTD);
                        expect(jsonGTDOrder).not.null;
                        expect(jsonGTDOrder).not.undefined;

                        expect(jsonGTDOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "5000000",
                                side: "SELL",
                                expiration: "1709948026",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 2,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTD,
                        });
                    });

                    it("GTC BUY EOA", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.05,
                            side: Side.BUY,
                            size: 100,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.EOA,
                            address,
                            userOrder,
                            { tickSize: "0.01", negRisk: false },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTCOrder = orderToJson(signedOrder, owner, OrderType.GTC);
                        expect(jsonGTCOrder).not.null;
                        expect(jsonGTCOrder).not.undefined;

                        expect(jsonGTCOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "5000000",
                                takerAmount: "100000000",
                                side: "BUY",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 0,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTC,
                        });
                    });

                    it("GTC BUY POLY_PROXY", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.05,
                            side: Side.BUY,
                            size: 100,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_PROXY,
                            address,
                            userOrder,
                            { tickSize: "0.01", negRisk: false },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTCOrder = orderToJson(signedOrder, owner, OrderType.GTC);
                        expect(jsonGTCOrder).not.null;
                        expect(jsonGTCOrder).not.undefined;

                        expect(jsonGTCOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "5000000",
                                takerAmount: "100000000",
                                side: "BUY",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 1,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTC,
                        });
                    });

                    it("GTC BUY POLY_GNOSIS_SAFE", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.05,
                            side: Side.BUY,
                            size: 100,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_GNOSIS_SAFE,
                            address,
                            userOrder,
                            { tickSize: "0.01", negRisk: false },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTCOrder = orderToJson(signedOrder, owner, OrderType.GTC);
                        expect(jsonGTCOrder).not.null;
                        expect(jsonGTCOrder).not.undefined;

                        expect(jsonGTCOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "5000000",
                                takerAmount: "100000000",
                                side: "BUY",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 2,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTC,
                        });
                    });

                    it("GTC SELL EOA", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.05,
                            side: Side.SELL,
                            size: 100,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.EOA,
                            address,
                            userOrder,
                            { tickSize: "0.01", negRisk: false },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTCOrder = orderToJson(signedOrder, owner, OrderType.GTC);
                        expect(jsonGTCOrder).not.null;
                        expect(jsonGTCOrder).not.undefined;

                        expect(jsonGTCOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "5000000",
                                side: "SELL",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 0,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTC,
                        });
                    });

                    it("GTC SELL POLY_PROXY", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.05,
                            side: Side.SELL,
                            size: 100,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_PROXY,
                            address,
                            userOrder,
                            { tickSize: "0.01", negRisk: false },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTCOrder = orderToJson(signedOrder, owner, OrderType.GTC);
                        expect(jsonGTCOrder).not.null;
                        expect(jsonGTCOrder).not.undefined;

                        expect(jsonGTCOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "5000000",
                                side: "SELL",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 1,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTC,
                        });
                    });

                    it("GTC SELL POLY_GNOSIS_SAFE", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.05,
                            side: Side.SELL,
                            size: 100,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_GNOSIS_SAFE,
                            address,
                            userOrder,
                            { tickSize: "0.01", negRisk: false },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTCOrder = orderToJson(signedOrder, owner, OrderType.GTC);
                        expect(jsonGTCOrder).not.null;
                        expect(jsonGTCOrder).not.undefined;

                        expect(jsonGTCOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "5000000",
                                side: "SELL",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 2,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTC,
                        });
                    });

                    it("FOK BUY EOA", async () => {
                        const userMarketOrder: UserMarketOrder = {
                            tokenID: token,
                            price: 0.05,
                            amount: 100,
                        };
                        const signedOrder = await createMarketBuyOrder(
                            wallet,
                            chainId,
                            SignatureType.EOA,
                            address,
                            userMarketOrder,
                            { tickSize: "0.01", negRisk: false },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonFOKOrder = orderToJson(signedOrder, owner, OrderType.FOK);
                        expect(jsonFOKOrder).not.null;
                        expect(jsonFOKOrder).not.undefined;

                        expect(jsonFOKOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "2000000000",
                                side: "BUY",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 0,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.FOK,
                        });
                    });

                    it("FOK BUY POLY_PROXY", async () => {
                        const userMarketOrder = {
                            tokenID: token,
                            price: 0.05,
                            amount: 100,
                        };
                        const signedOrder = await createMarketBuyOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_PROXY,
                            address,
                            userMarketOrder,
                            { tickSize: "0.01", negRisk: false },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonFOKOrder = orderToJson(signedOrder, owner, OrderType.FOK);
                        expect(jsonFOKOrder).not.null;
                        expect(jsonFOKOrder).not.undefined;

                        expect(jsonFOKOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "2000000000",
                                side: "BUY",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 1,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.FOK,
                        });
                    });

                    it("FOK BUY POLY_GNOSIS_SAFE", async () => {
                        const userMarketOrder = {
                            tokenID: token,
                            price: 0.05,
                            amount: 100,
                        };
                        const signedOrder = await createMarketBuyOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_GNOSIS_SAFE,
                            address,
                            userMarketOrder,
                            { tickSize: "0.01", negRisk: false },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonFOKOrder = orderToJson(signedOrder, owner, OrderType.FOK);
                        expect(jsonFOKOrder).not.null;
                        expect(jsonFOKOrder).not.undefined;

                        expect(jsonFOKOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "2000000000",
                                side: "BUY",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 2,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.FOK,
                        });
                    });
                });

                describe("0.001", async () => {
                    // publicly known private key
                    const token =
                        "71321045679252212594626385532706912750332728571942532289631379312455583992563";
                    const privateKey =
                        "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
                    const address = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
                    const wallet = new Wallet(privateKey);
                    const chainId = Chain.AMOY;
                    const owner = "f4f247b7-4ac7-ff29-a152-04fda0a8755a";

                    it("GTD BUY EOA", async () => {
                        const userOrder: UserOrder = {
                            tokenID: token,
                            price: 0.005,
                            side: Side.BUY,
                            size: 100,
                            expiration: 1709948026,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.EOA,
                            address,
                            userOrder,
                            { tickSize: "0.001", negRisk: false },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTDOrder = orderToJson(signedOrder, owner, OrderType.GTD);
                        expect(jsonGTDOrder).not.null;
                        expect(jsonGTDOrder).not.undefined;

                        expect(jsonGTDOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "500000",
                                takerAmount: "100000000",
                                side: "BUY",
                                expiration: "1709948026",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 0,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTD,
                        });
                    });

                    it("GTD BUY POLY_PROXY", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.005,
                            side: Side.BUY,
                            size: 100,
                            expiration: 1709948026,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_PROXY,
                            address,
                            userOrder,
                            { tickSize: "0.001", negRisk: false },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTDOrder = orderToJson(signedOrder, owner, OrderType.GTD);
                        expect(jsonGTDOrder).not.null;
                        expect(jsonGTDOrder).not.undefined;

                        expect(jsonGTDOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "500000",
                                takerAmount: "100000000",
                                side: "BUY",
                                expiration: "1709948026",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 1,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTD,
                        });
                    });

                    it("GTD BUY POLY_GNOSIS_SAFE", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.005,
                            side: Side.BUY,
                            size: 100,
                            expiration: 1709948026,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_GNOSIS_SAFE,
                            address,
                            userOrder,
                            { tickSize: "0.001", negRisk: false },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTDOrder = orderToJson(signedOrder, owner, OrderType.GTD);
                        expect(jsonGTDOrder).not.null;
                        expect(jsonGTDOrder).not.undefined;

                        expect(jsonGTDOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "500000",
                                takerAmount: "100000000",
                                side: "BUY",
                                expiration: "1709948026",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 2,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTD,
                        });
                    });

                    it("GTD SELL EOA", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.005,
                            side: Side.SELL,
                            size: 100,
                            expiration: 1709948026,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.EOA,
                            address,
                            userOrder,
                            { tickSize: "0.001", negRisk: false },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTDOrder = orderToJson(signedOrder, owner, OrderType.GTD);
                        expect(jsonGTDOrder).not.null;
                        expect(jsonGTDOrder).not.undefined;

                        expect(jsonGTDOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "500000",
                                side: "SELL",
                                expiration: "1709948026",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 0,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTD,
                        });
                    });

                    it("GTD SELL POLY_PROXY", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.005,
                            side: Side.SELL,
                            size: 100,
                            expiration: 1709948026,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_PROXY,
                            address,
                            userOrder,
                            { tickSize: "0.001", negRisk: false },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTDOrder = orderToJson(signedOrder, owner, OrderType.GTD);
                        expect(jsonGTDOrder).not.null;
                        expect(jsonGTDOrder).not.undefined;

                        expect(jsonGTDOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "500000",
                                side: "SELL",
                                expiration: "1709948026",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 1,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTD,
                        });
                    });

                    it("GTD SELL POLY_GNOSIS_SAFE", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.005,
                            side: Side.SELL,
                            size: 100,
                            expiration: 1709948026,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_GNOSIS_SAFE,
                            address,
                            userOrder,
                            { tickSize: "0.001", negRisk: false },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTDOrder = orderToJson(signedOrder, owner, OrderType.GTD);
                        expect(jsonGTDOrder).not.null;
                        expect(jsonGTDOrder).not.undefined;

                        expect(jsonGTDOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "500000",
                                side: "SELL",
                                expiration: "1709948026",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 2,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTD,
                        });
                    });

                    it("GTC BUY EOA", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.005,
                            side: Side.BUY,
                            size: 100,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.EOA,
                            address,
                            userOrder,
                            { tickSize: "0.001", negRisk: false },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTCOrder = orderToJson(signedOrder, owner, OrderType.GTC);
                        expect(jsonGTCOrder).not.null;
                        expect(jsonGTCOrder).not.undefined;

                        expect(jsonGTCOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "500000",
                                takerAmount: "100000000",
                                side: "BUY",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 0,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTC,
                        });
                    });

                    it("GTC BUY POLY_PROXY", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.005,
                            side: Side.BUY,
                            size: 100,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_PROXY,
                            address,
                            userOrder,
                            { tickSize: "0.001", negRisk: false },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTCOrder = orderToJson(signedOrder, owner, OrderType.GTC);
                        expect(jsonGTCOrder).not.null;
                        expect(jsonGTCOrder).not.undefined;

                        expect(jsonGTCOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "500000",
                                takerAmount: "100000000",
                                side: "BUY",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 1,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTC,
                        });
                    });

                    it("GTC BUY POLY_GNOSIS_SAFE", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.005,
                            side: Side.BUY,
                            size: 100,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_GNOSIS_SAFE,
                            address,
                            userOrder,
                            { tickSize: "0.001", negRisk: false },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTCOrder = orderToJson(signedOrder, owner, OrderType.GTC);
                        expect(jsonGTCOrder).not.null;
                        expect(jsonGTCOrder).not.undefined;

                        expect(jsonGTCOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "500000",
                                takerAmount: "100000000",
                                side: "BUY",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 2,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTC,
                        });
                    });

                    it("GTC SELL EOA", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.005,
                            side: Side.SELL,
                            size: 100,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.EOA,
                            address,
                            userOrder,
                            { tickSize: "0.001", negRisk: false },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTCOrder = orderToJson(signedOrder, owner, OrderType.GTC);
                        expect(jsonGTCOrder).not.null;
                        expect(jsonGTCOrder).not.undefined;

                        expect(jsonGTCOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "500000",
                                side: "SELL",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 0,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTC,
                        });
                    });

                    it("GTC SELL POLY_PROXY", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.005,
                            side: Side.SELL,
                            size: 100,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_PROXY,
                            address,
                            userOrder,
                            { tickSize: "0.001", negRisk: false },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTCOrder = orderToJson(signedOrder, owner, OrderType.GTC);
                        expect(jsonGTCOrder).not.null;
                        expect(jsonGTCOrder).not.undefined;

                        expect(jsonGTCOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "500000",
                                side: "SELL",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 1,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTC,
                        });
                    });

                    it("GTC SELL POLY_GNOSIS_SAFE", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.005,
                            side: Side.SELL,
                            size: 100,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_GNOSIS_SAFE,
                            address,
                            userOrder,
                            { tickSize: "0.001", negRisk: false },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTCOrder = orderToJson(signedOrder, owner, OrderType.GTC);
                        expect(jsonGTCOrder).not.null;
                        expect(jsonGTCOrder).not.undefined;

                        expect(jsonGTCOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "500000",
                                side: "SELL",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 2,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTC,
                        });
                    });

                    it("FOK BUY EOA", async () => {
                        const userMarketOrder: UserMarketOrder = {
                            tokenID: token,
                            price: 0.005,
                            amount: 100,
                        };
                        const signedOrder = await createMarketBuyOrder(
                            wallet,
                            chainId,
                            SignatureType.EOA,
                            address,
                            userMarketOrder,
                            { tickSize: "0.001", negRisk: false },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonFOKOrder = orderToJson(signedOrder, owner, OrderType.FOK);
                        expect(jsonFOKOrder).not.null;
                        expect(jsonFOKOrder).not.undefined;

                        expect(jsonFOKOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "20000000000",
                                side: "BUY",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 0,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.FOK,
                        });
                    });

                    it("FOK BUY POLY_PROXY", async () => {
                        const userMarketOrder = {
                            tokenID: token,
                            price: 0.005,
                            amount: 100,
                        };
                        const signedOrder = await createMarketBuyOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_PROXY,
                            address,
                            userMarketOrder,
                            { tickSize: "0.001", negRisk: false },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonFOKOrder = orderToJson(signedOrder, owner, OrderType.FOK);
                        expect(jsonFOKOrder).not.null;
                        expect(jsonFOKOrder).not.undefined;

                        expect(jsonFOKOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "20000000000",
                                side: "BUY",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 1,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.FOK,
                        });
                    });

                    it("FOK BUY POLY_GNOSIS_SAFE", async () => {
                        const userMarketOrder = {
                            tokenID: token,
                            price: 0.005,
                            amount: 100,
                        };
                        const signedOrder = await createMarketBuyOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_GNOSIS_SAFE,
                            address,
                            userMarketOrder,
                            { tickSize: "0.001", negRisk: false },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonFOKOrder = orderToJson(signedOrder, owner, OrderType.FOK);
                        expect(jsonFOKOrder).not.null;
                        expect(jsonFOKOrder).not.undefined;

                        expect(jsonFOKOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "20000000000",
                                side: "BUY",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 2,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.FOK,
                        });
                    });
                });

                describe("0.0001", async () => {
                    // publicly known private key
                    const token =
                        "71321045679252212594626385532706912750332728571942532289631379312455583992563";
                    const privateKey =
                        "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
                    const address = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
                    const wallet = new Wallet(privateKey);
                    const chainId = Chain.AMOY;
                    const owner = "f4f247b7-4ac7-ff29-a152-04fda0a8755a";

                    it("GTD BUY EOA", async () => {
                        const userOrder: UserOrder = {
                            tokenID: token,
                            price: 0.0005,
                            side: Side.BUY,
                            size: 100,
                            expiration: 1709948026,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.EOA,
                            address,
                            userOrder,
                            { tickSize: "0.0001", negRisk: false },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTDOrder = orderToJson(signedOrder, owner, OrderType.GTD);
                        expect(jsonGTDOrder).not.null;
                        expect(jsonGTDOrder).not.undefined;

                        expect(jsonGTDOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "50000",
                                takerAmount: "100000000",
                                side: "BUY",
                                expiration: "1709948026",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 0,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTD,
                        });
                    });

                    it("GTD BUY POLY_PROXY", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.0005,
                            side: Side.BUY,
                            size: 100,
                            expiration: 1709948026,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_PROXY,
                            address,
                            userOrder,
                            { tickSize: "0.0001", negRisk: false },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTDOrder = orderToJson(signedOrder, owner, OrderType.GTD);
                        expect(jsonGTDOrder).not.null;
                        expect(jsonGTDOrder).not.undefined;

                        expect(jsonGTDOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "50000",
                                takerAmount: "100000000",
                                side: "BUY",
                                expiration: "1709948026",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 1,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTD,
                        });
                    });

                    it("GTD BUY POLY_GNOSIS_SAFE", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.0005,
                            side: Side.BUY,
                            size: 100,
                            expiration: 1709948026,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_GNOSIS_SAFE,
                            address,
                            userOrder,
                            { tickSize: "0.0001", negRisk: false },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTDOrder = orderToJson(signedOrder, owner, OrderType.GTD);
                        expect(jsonGTDOrder).not.null;
                        expect(jsonGTDOrder).not.undefined;

                        expect(jsonGTDOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "50000",
                                takerAmount: "100000000",
                                side: "BUY",
                                expiration: "1709948026",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 2,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTD,
                        });
                    });

                    it("GTD SELL EOA", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.0005,
                            side: Side.SELL,
                            size: 100,
                            expiration: 1709948026,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.EOA,
                            address,
                            userOrder,
                            { tickSize: "0.0001", negRisk: false },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTDOrder = orderToJson(signedOrder, owner, OrderType.GTD);
                        expect(jsonGTDOrder).not.null;
                        expect(jsonGTDOrder).not.undefined;

                        expect(jsonGTDOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "50000",
                                side: "SELL",
                                expiration: "1709948026",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 0,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTD,
                        });
                    });

                    it("GTD SELL POLY_PROXY", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.0005,
                            side: Side.SELL,
                            size: 100,
                            expiration: 1709948026,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_PROXY,
                            address,
                            userOrder,
                            { tickSize: "0.0001", negRisk: false },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTDOrder = orderToJson(signedOrder, owner, OrderType.GTD);
                        expect(jsonGTDOrder).not.null;
                        expect(jsonGTDOrder).not.undefined;

                        expect(jsonGTDOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "50000",
                                side: "SELL",
                                expiration: "1709948026",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 1,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTD,
                        });
                    });

                    it("GTD SELL POLY_GNOSIS_SAFE", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.0005,
                            side: Side.SELL,
                            size: 100,
                            expiration: 1709948026,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_GNOSIS_SAFE,
                            address,
                            userOrder,
                            { tickSize: "0.0001", negRisk: false },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTDOrder = orderToJson(signedOrder, owner, OrderType.GTD);
                        expect(jsonGTDOrder).not.null;
                        expect(jsonGTDOrder).not.undefined;

                        expect(jsonGTDOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "50000",
                                side: "SELL",
                                expiration: "1709948026",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 2,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTD,
                        });
                    });

                    it("GTC BUY EOA", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.0005,
                            side: Side.BUY,
                            size: 100,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.EOA,
                            address,
                            userOrder,
                            { tickSize: "0.0001", negRisk: false },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTCOrder = orderToJson(signedOrder, owner, OrderType.GTC);
                        expect(jsonGTCOrder).not.null;
                        expect(jsonGTCOrder).not.undefined;

                        expect(jsonGTCOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "50000",
                                takerAmount: "100000000",
                                side: "BUY",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 0,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTC,
                        });
                    });

                    it("GTC BUY POLY_PROXY", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.0005,
                            side: Side.BUY,
                            size: 100,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_PROXY,
                            address,
                            userOrder,
                            { tickSize: "0.0001", negRisk: false },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTCOrder = orderToJson(signedOrder, owner, OrderType.GTC);
                        expect(jsonGTCOrder).not.null;
                        expect(jsonGTCOrder).not.undefined;

                        expect(jsonGTCOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "50000",
                                takerAmount: "100000000",
                                side: "BUY",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 1,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTC,
                        });
                    });

                    it("GTC BUY POLY_GNOSIS_SAFE", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.0005,
                            side: Side.BUY,
                            size: 100,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_GNOSIS_SAFE,
                            address,
                            userOrder,
                            { tickSize: "0.0001", negRisk: false },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTCOrder = orderToJson(signedOrder, owner, OrderType.GTC);
                        expect(jsonGTCOrder).not.null;
                        expect(jsonGTCOrder).not.undefined;

                        expect(jsonGTCOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "50000",
                                takerAmount: "100000000",
                                side: "BUY",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 2,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTC,
                        });
                    });

                    it("GTC SELL EOA", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.0005,
                            side: Side.SELL,
                            size: 100,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.EOA,
                            address,
                            userOrder,
                            { tickSize: "0.0001", negRisk: false },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTCOrder = orderToJson(signedOrder, owner, OrderType.GTC);
                        expect(jsonGTCOrder).not.null;
                        expect(jsonGTCOrder).not.undefined;

                        expect(jsonGTCOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "50000",
                                side: "SELL",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 0,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTC,
                        });
                    });

                    it("GTC SELL POLY_PROXY", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.0005,
                            side: Side.SELL,
                            size: 100,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_PROXY,
                            address,
                            userOrder,
                            { tickSize: "0.0001", negRisk: false },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTCOrder = orderToJson(signedOrder, owner, OrderType.GTC);
                        expect(jsonGTCOrder).not.null;
                        expect(jsonGTCOrder).not.undefined;

                        expect(jsonGTCOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "50000",
                                side: "SELL",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 1,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTC,
                        });
                    });

                    it("GTC SELL POLY_GNOSIS_SAFE", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.0005,
                            side: Side.SELL,
                            size: 100,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_GNOSIS_SAFE,
                            address,
                            userOrder,
                            { tickSize: "0.0001", negRisk: false },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTCOrder = orderToJson(signedOrder, owner, OrderType.GTC);
                        expect(jsonGTCOrder).not.null;
                        expect(jsonGTCOrder).not.undefined;

                        expect(jsonGTCOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "50000",
                                side: "SELL",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 2,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTC,
                        });
                    });

                    it("FOK BUY EOA", async () => {
                        const userMarketOrder: UserMarketOrder = {
                            tokenID: token,
                            price: 0.0005,
                            amount: 100,
                        };
                        const signedOrder = await createMarketBuyOrder(
                            wallet,
                            chainId,
                            SignatureType.EOA,
                            address,
                            userMarketOrder,
                            { tickSize: "0.0001", negRisk: false },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonFOKOrder = orderToJson(signedOrder, owner, OrderType.FOK);
                        expect(jsonFOKOrder).not.null;
                        expect(jsonFOKOrder).not.undefined;

                        expect(jsonFOKOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "200000000000",
                                side: "BUY",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 0,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.FOK,
                        });
                    });

                    it("FOK BUY POLY_PROXY", async () => {
                        const userMarketOrder = {
                            tokenID: token,
                            price: 0.0005,
                            amount: 100,
                        };
                        const signedOrder = await createMarketBuyOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_PROXY,
                            address,
                            userMarketOrder,
                            { tickSize: "0.0001", negRisk: false },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonFOKOrder = orderToJson(signedOrder, owner, OrderType.FOK);
                        expect(jsonFOKOrder).not.null;
                        expect(jsonFOKOrder).not.undefined;

                        expect(jsonFOKOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "200000000000",
                                side: "BUY",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 1,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.FOK,
                        });
                    });

                    it("FOK BUY POLY_GNOSIS_SAFE", async () => {
                        const userMarketOrder = {
                            tokenID: token,
                            price: 0.0005,
                            amount: 100,
                        };
                        const signedOrder = await createMarketBuyOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_GNOSIS_SAFE,
                            address,
                            userMarketOrder,
                            { tickSize: "0.0001", negRisk: false },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonFOKOrder = orderToJson(signedOrder, owner, OrderType.FOK);
                        expect(jsonFOKOrder).not.null;
                        expect(jsonFOKOrder).not.undefined;

                        expect(jsonFOKOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "200000000000",
                                side: "BUY",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 2,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.FOK,
                        });
                    });
                });
            });

            describe("Neg Risk CTF Exchange", async () => {
                describe("0.1", async () => {
                    // publicly known private key
                    const token =
                        "71321045679252212594626385532706912750332728571942532289631379312455583992563";
                    const privateKey =
                        "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
                    const address = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
                    const wallet = new Wallet(privateKey);
                    const chainId = Chain.AMOY;
                    const owner = "f4f247b7-4ac7-ff29-a152-04fda0a8755a";

                    it("GTD BUY EOA", async () => {
                        const userOrder: UserOrder = {
                            tokenID: token,
                            price: 0.5,
                            side: Side.BUY,
                            size: 100,
                            expiration: 1709948026,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.EOA,
                            address,
                            userOrder,
                            { tickSize: "0.1", negRisk: true },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTDOrder = orderToJson(signedOrder, owner, OrderType.GTD);
                        expect(jsonGTDOrder).not.null;
                        expect(jsonGTDOrder).not.undefined;

                        expect(jsonGTDOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "50000000",
                                takerAmount: "100000000",
                                side: "BUY",
                                expiration: "1709948026",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 0,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTD,
                        });
                    });

                    it("GTD BUY POLY_PROXY", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.5,
                            side: Side.BUY,
                            size: 100,
                            expiration: 1709948026,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_PROXY,
                            address,
                            userOrder,
                            { tickSize: "0.1", negRisk: true },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTDOrder = orderToJson(signedOrder, owner, OrderType.GTD);
                        expect(jsonGTDOrder).not.null;
                        expect(jsonGTDOrder).not.undefined;

                        expect(jsonGTDOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "50000000",
                                takerAmount: "100000000",
                                side: "BUY",
                                expiration: "1709948026",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 1,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTD,
                        });
                    });

                    it("GTD BUY POLY_GNOSIS_SAFE", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.5,
                            side: Side.BUY,
                            size: 100,
                            expiration: 1709948026,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_GNOSIS_SAFE,
                            address,
                            userOrder,
                            { tickSize: "0.1", negRisk: true },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTDOrder = orderToJson(signedOrder, owner, OrderType.GTD);
                        expect(jsonGTDOrder).not.null;
                        expect(jsonGTDOrder).not.undefined;

                        expect(jsonGTDOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "50000000",
                                takerAmount: "100000000",
                                side: "BUY",
                                expiration: "1709948026",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 2,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTD,
                        });
                    });

                    it("GTD SELL EOA", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.5,
                            side: Side.SELL,
                            size: 100,
                            expiration: 1709948026,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.EOA,
                            address,
                            userOrder,
                            { tickSize: "0.1", negRisk: true },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTDOrder = orderToJson(signedOrder, owner, OrderType.GTD);
                        expect(jsonGTDOrder).not.null;
                        expect(jsonGTDOrder).not.undefined;

                        expect(jsonGTDOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "50000000",
                                side: "SELL",
                                expiration: "1709948026",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 0,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTD,
                        });
                    });

                    it("GTD SELL POLY_PROXY", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.5,
                            side: Side.SELL,
                            size: 100,
                            expiration: 1709948026,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_PROXY,
                            address,
                            userOrder,
                            { tickSize: "0.1", negRisk: true },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTDOrder = orderToJson(signedOrder, owner, OrderType.GTD);
                        expect(jsonGTDOrder).not.null;
                        expect(jsonGTDOrder).not.undefined;

                        expect(jsonGTDOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "50000000",
                                side: "SELL",
                                expiration: "1709948026",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 1,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTD,
                        });
                    });

                    it("GTD SELL POLY_GNOSIS_SAFE", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.5,
                            side: Side.SELL,
                            size: 100,
                            expiration: 1709948026,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_GNOSIS_SAFE,
                            address,
                            userOrder,
                            { tickSize: "0.1", negRisk: true },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTDOrder = orderToJson(signedOrder, owner, OrderType.GTD);
                        expect(jsonGTDOrder).not.null;
                        expect(jsonGTDOrder).not.undefined;

                        expect(jsonGTDOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "50000000",
                                side: "SELL",
                                expiration: "1709948026",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 2,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTD,
                        });
                    });

                    it("GTC BUY EOA", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.5,
                            side: Side.BUY,
                            size: 100,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.EOA,
                            address,
                            userOrder,
                            { tickSize: "0.1", negRisk: true },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTCOrder = orderToJson(signedOrder, owner, OrderType.GTC);
                        expect(jsonGTCOrder).not.null;
                        expect(jsonGTCOrder).not.undefined;

                        expect(jsonGTCOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "50000000",
                                takerAmount: "100000000",
                                side: "BUY",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 0,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTC,
                        });
                    });

                    it("GTC BUY POLY_PROXY", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.5,
                            side: Side.BUY,
                            size: 100,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_PROXY,
                            address,
                            userOrder,
                            { tickSize: "0.1", negRisk: true },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTCOrder = orderToJson(signedOrder, owner, OrderType.GTC);
                        expect(jsonGTCOrder).not.null;
                        expect(jsonGTCOrder).not.undefined;

                        expect(jsonGTCOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "50000000",
                                takerAmount: "100000000",
                                side: "BUY",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 1,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTC,
                        });
                    });

                    it("GTC BUY POLY_GNOSIS_SAFE", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.5,
                            side: Side.BUY,
                            size: 100,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_GNOSIS_SAFE,
                            address,
                            userOrder,
                            { tickSize: "0.1", negRisk: true },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTCOrder = orderToJson(signedOrder, owner, OrderType.GTC);
                        expect(jsonGTCOrder).not.null;
                        expect(jsonGTCOrder).not.undefined;

                        expect(jsonGTCOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "50000000",
                                takerAmount: "100000000",
                                side: "BUY",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 2,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTC,
                        });
                    });

                    it("GTC SELL EOA", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.5,
                            side: Side.SELL,
                            size: 100,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.EOA,
                            address,
                            userOrder,
                            { tickSize: "0.1", negRisk: true },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTCOrder = orderToJson(signedOrder, owner, OrderType.GTC);
                        expect(jsonGTCOrder).not.null;
                        expect(jsonGTCOrder).not.undefined;

                        expect(jsonGTCOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "50000000",
                                side: "SELL",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 0,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTC,
                        });
                    });

                    it("GTC SELL POLY_PROXY", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.5,
                            side: Side.SELL,
                            size: 100,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_PROXY,
                            address,
                            userOrder,
                            { tickSize: "0.1", negRisk: true },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTCOrder = orderToJson(signedOrder, owner, OrderType.GTC);
                        expect(jsonGTCOrder).not.null;
                        expect(jsonGTCOrder).not.undefined;

                        expect(jsonGTCOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "50000000",
                                side: "SELL",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 1,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTC,
                        });
                    });

                    it("GTC SELL POLY_GNOSIS_SAFE", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.5,
                            side: Side.SELL,
                            size: 100,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_GNOSIS_SAFE,
                            address,
                            userOrder,
                            { tickSize: "0.1", negRisk: true },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTCOrder = orderToJson(signedOrder, owner, OrderType.GTC);
                        expect(jsonGTCOrder).not.null;
                        expect(jsonGTCOrder).not.undefined;

                        expect(jsonGTCOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "50000000",
                                side: "SELL",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 2,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTC,
                        });
                    });

                    it("FOK BUY EOA", async () => {
                        const userMarketOrder: UserMarketOrder = {
                            tokenID: token,
                            price: 0.5,
                            amount: 100,
                        };
                        const signedOrder = await createMarketBuyOrder(
                            wallet,
                            chainId,
                            SignatureType.EOA,
                            address,
                            userMarketOrder,
                            { tickSize: "0.1", negRisk: true },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonFOKOrder = orderToJson(signedOrder, owner, OrderType.FOK);
                        expect(jsonFOKOrder).not.null;
                        expect(jsonFOKOrder).not.undefined;

                        expect(jsonFOKOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "200000000",
                                side: "BUY",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 0,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.FOK,
                        });
                    });

                    it("FOK BUY POLY_PROXY", async () => {
                        const userMarketOrder = {
                            tokenID: token,
                            price: 0.5,
                            amount: 100,
                        };
                        const signedOrder = await createMarketBuyOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_PROXY,
                            address,
                            userMarketOrder,
                            { tickSize: "0.1", negRisk: true },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonFOKOrder = orderToJson(signedOrder, owner, OrderType.FOK);
                        expect(jsonFOKOrder).not.null;
                        expect(jsonFOKOrder).not.undefined;

                        expect(jsonFOKOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "200000000",
                                side: "BUY",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 1,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.FOK,
                        });
                    });

                    it("FOK BUY POLY_GNOSIS_SAFE", async () => {
                        const userMarketOrder = {
                            tokenID: token,
                            price: 0.5,
                            amount: 100,
                        };
                        const signedOrder = await createMarketBuyOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_GNOSIS_SAFE,
                            address,
                            userMarketOrder,
                            { tickSize: "0.1", negRisk: true },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonFOKOrder = orderToJson(signedOrder, owner, OrderType.FOK);
                        expect(jsonFOKOrder).not.null;
                        expect(jsonFOKOrder).not.undefined;

                        expect(jsonFOKOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "200000000",
                                side: "BUY",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 2,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.FOK,
                        });
                    });
                });

                describe("0.01", async () => {
                    // publicly known private key
                    const token =
                        "71321045679252212594626385532706912750332728571942532289631379312455583992563";
                    const privateKey =
                        "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
                    const address = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
                    const wallet = new Wallet(privateKey);
                    const chainId = Chain.AMOY;
                    const owner = "f4f247b7-4ac7-ff29-a152-04fda0a8755a";

                    it("GTD BUY EOA", async () => {
                        const userOrder: UserOrder = {
                            tokenID: token,
                            price: 0.05,
                            side: Side.BUY,
                            size: 100,
                            expiration: 1709948026,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.EOA,
                            address,
                            userOrder,
                            { tickSize: "0.01", negRisk: true },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTDOrder = orderToJson(signedOrder, owner, OrderType.GTD);
                        expect(jsonGTDOrder).not.null;
                        expect(jsonGTDOrder).not.undefined;

                        expect(jsonGTDOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "5000000",
                                takerAmount: "100000000",
                                side: "BUY",
                                expiration: "1709948026",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 0,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTD,
                        });
                    });

                    it("GTD BUY POLY_PROXY", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.05,
                            side: Side.BUY,
                            size: 100,
                            expiration: 1709948026,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_PROXY,
                            address,
                            userOrder,
                            { tickSize: "0.01", negRisk: true },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTDOrder = orderToJson(signedOrder, owner, OrderType.GTD);
                        expect(jsonGTDOrder).not.null;
                        expect(jsonGTDOrder).not.undefined;

                        expect(jsonGTDOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "5000000",
                                takerAmount: "100000000",
                                side: "BUY",
                                expiration: "1709948026",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 1,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTD,
                        });
                    });

                    it("GTD BUY POLY_GNOSIS_SAFE", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.05,
                            side: Side.BUY,
                            size: 100,
                            expiration: 1709948026,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_GNOSIS_SAFE,
                            address,
                            userOrder,
                            { tickSize: "0.01", negRisk: true },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTDOrder = orderToJson(signedOrder, owner, OrderType.GTD);
                        expect(jsonGTDOrder).not.null;
                        expect(jsonGTDOrder).not.undefined;

                        expect(jsonGTDOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "5000000",
                                takerAmount: "100000000",
                                side: "BUY",
                                expiration: "1709948026",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 2,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTD,
                        });
                    });

                    it("GTD SELL EOA", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.05,
                            side: Side.SELL,
                            size: 100,
                            expiration: 1709948026,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.EOA,
                            address,
                            userOrder,
                            { tickSize: "0.01", negRisk: true },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTDOrder = orderToJson(signedOrder, owner, OrderType.GTD);
                        expect(jsonGTDOrder).not.null;
                        expect(jsonGTDOrder).not.undefined;

                        expect(jsonGTDOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "5000000",
                                side: "SELL",
                                expiration: "1709948026",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 0,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTD,
                        });
                    });

                    it("GTD SELL POLY_PROXY", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.05,
                            side: Side.SELL,
                            size: 100,
                            expiration: 1709948026,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_PROXY,
                            address,
                            userOrder,
                            { tickSize: "0.01", negRisk: true },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTDOrder = orderToJson(signedOrder, owner, OrderType.GTD);
                        expect(jsonGTDOrder).not.null;
                        expect(jsonGTDOrder).not.undefined;

                        expect(jsonGTDOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "5000000",
                                side: "SELL",
                                expiration: "1709948026",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 1,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTD,
                        });
                    });

                    it("GTD SELL POLY_GNOSIS_SAFE", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.05,
                            side: Side.SELL,
                            size: 100,
                            expiration: 1709948026,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_GNOSIS_SAFE,
                            address,
                            userOrder,
                            { tickSize: "0.01", negRisk: true },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTDOrder = orderToJson(signedOrder, owner, OrderType.GTD);
                        expect(jsonGTDOrder).not.null;
                        expect(jsonGTDOrder).not.undefined;

                        expect(jsonGTDOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "5000000",
                                side: "SELL",
                                expiration: "1709948026",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 2,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTD,
                        });
                    });

                    it("GTC BUY EOA", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.05,
                            side: Side.BUY,
                            size: 100,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.EOA,
                            address,
                            userOrder,
                            { tickSize: "0.01", negRisk: true },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTCOrder = orderToJson(signedOrder, owner, OrderType.GTC);
                        expect(jsonGTCOrder).not.null;
                        expect(jsonGTCOrder).not.undefined;

                        expect(jsonGTCOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "5000000",
                                takerAmount: "100000000",
                                side: "BUY",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 0,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTC,
                        });
                    });

                    it("GTC BUY POLY_PROXY", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.05,
                            side: Side.BUY,
                            size: 100,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_PROXY,
                            address,
                            userOrder,
                            { tickSize: "0.01", negRisk: true },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTCOrder = orderToJson(signedOrder, owner, OrderType.GTC);
                        expect(jsonGTCOrder).not.null;
                        expect(jsonGTCOrder).not.undefined;

                        expect(jsonGTCOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "5000000",
                                takerAmount: "100000000",
                                side: "BUY",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 1,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTC,
                        });
                    });

                    it("GTC BUY POLY_GNOSIS_SAFE", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.05,
                            side: Side.BUY,
                            size: 100,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_GNOSIS_SAFE,
                            address,
                            userOrder,
                            { tickSize: "0.01", negRisk: true },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTCOrder = orderToJson(signedOrder, owner, OrderType.GTC);
                        expect(jsonGTCOrder).not.null;
                        expect(jsonGTCOrder).not.undefined;

                        expect(jsonGTCOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "5000000",
                                takerAmount: "100000000",
                                side: "BUY",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 2,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTC,
                        });
                    });

                    it("GTC SELL EOA", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.05,
                            side: Side.SELL,
                            size: 100,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.EOA,
                            address,
                            userOrder,
                            { tickSize: "0.01", negRisk: true },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTCOrder = orderToJson(signedOrder, owner, OrderType.GTC);
                        expect(jsonGTCOrder).not.null;
                        expect(jsonGTCOrder).not.undefined;

                        expect(jsonGTCOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "5000000",
                                side: "SELL",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 0,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTC,
                        });
                    });

                    it("GTC SELL POLY_PROXY", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.05,
                            side: Side.SELL,
                            size: 100,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_PROXY,
                            address,
                            userOrder,
                            { tickSize: "0.01", negRisk: true },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTCOrder = orderToJson(signedOrder, owner, OrderType.GTC);
                        expect(jsonGTCOrder).not.null;
                        expect(jsonGTCOrder).not.undefined;

                        expect(jsonGTCOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "5000000",
                                side: "SELL",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 1,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTC,
                        });
                    });

                    it("GTC SELL POLY_GNOSIS_SAFE", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.05,
                            side: Side.SELL,
                            size: 100,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_GNOSIS_SAFE,
                            address,
                            userOrder,
                            { tickSize: "0.01", negRisk: true },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTCOrder = orderToJson(signedOrder, owner, OrderType.GTC);
                        expect(jsonGTCOrder).not.null;
                        expect(jsonGTCOrder).not.undefined;

                        expect(jsonGTCOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "5000000",
                                side: "SELL",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 2,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTC,
                        });
                    });

                    it("FOK BUY EOA", async () => {
                        const userMarketOrder: UserMarketOrder = {
                            tokenID: token,
                            price: 0.05,
                            amount: 100,
                        };
                        const signedOrder = await createMarketBuyOrder(
                            wallet,
                            chainId,
                            SignatureType.EOA,
                            address,
                            userMarketOrder,
                            { tickSize: "0.01", negRisk: true },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonFOKOrder = orderToJson(signedOrder, owner, OrderType.FOK);
                        expect(jsonFOKOrder).not.null;
                        expect(jsonFOKOrder).not.undefined;

                        expect(jsonFOKOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "2000000000",
                                side: "BUY",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 0,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.FOK,
                        });
                    });

                    it("FOK BUY POLY_PROXY", async () => {
                        const userMarketOrder = {
                            tokenID: token,
                            price: 0.05,
                            amount: 100,
                        };
                        const signedOrder = await createMarketBuyOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_PROXY,
                            address,
                            userMarketOrder,
                            { tickSize: "0.01", negRisk: true },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonFOKOrder = orderToJson(signedOrder, owner, OrderType.FOK);
                        expect(jsonFOKOrder).not.null;
                        expect(jsonFOKOrder).not.undefined;

                        expect(jsonFOKOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "2000000000",
                                side: "BUY",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 1,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.FOK,
                        });
                    });

                    it("FOK BUY POLY_GNOSIS_SAFE", async () => {
                        const userMarketOrder = {
                            tokenID: token,
                            price: 0.05,
                            amount: 100,
                        };
                        const signedOrder = await createMarketBuyOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_GNOSIS_SAFE,
                            address,
                            userMarketOrder,
                            { tickSize: "0.01", negRisk: true },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonFOKOrder = orderToJson(signedOrder, owner, OrderType.FOK);
                        expect(jsonFOKOrder).not.null;
                        expect(jsonFOKOrder).not.undefined;

                        expect(jsonFOKOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "2000000000",
                                side: "BUY",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 2,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.FOK,
                        });
                    });
                });

                describe("0.001", async () => {
                    // publicly known private key
                    const token =
                        "71321045679252212594626385532706912750332728571942532289631379312455583992563";
                    const privateKey =
                        "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
                    const address = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
                    const wallet = new Wallet(privateKey);
                    const chainId = Chain.AMOY;
                    const owner = "f4f247b7-4ac7-ff29-a152-04fda0a8755a";

                    it("GTD BUY EOA", async () => {
                        const userOrder: UserOrder = {
                            tokenID: token,
                            price: 0.005,
                            side: Side.BUY,
                            size: 100,
                            expiration: 1709948026,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.EOA,
                            address,
                            userOrder,
                            { tickSize: "0.001", negRisk: true },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTDOrder = orderToJson(signedOrder, owner, OrderType.GTD);
                        expect(jsonGTDOrder).not.null;
                        expect(jsonGTDOrder).not.undefined;

                        expect(jsonGTDOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "500000",
                                takerAmount: "100000000",
                                side: "BUY",
                                expiration: "1709948026",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 0,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTD,
                        });
                    });

                    it("GTD BUY POLY_PROXY", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.005,
                            side: Side.BUY,
                            size: 100,
                            expiration: 1709948026,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_PROXY,
                            address,
                            userOrder,
                            { tickSize: "0.001", negRisk: true },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTDOrder = orderToJson(signedOrder, owner, OrderType.GTD);
                        expect(jsonGTDOrder).not.null;
                        expect(jsonGTDOrder).not.undefined;

                        expect(jsonGTDOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "500000",
                                takerAmount: "100000000",
                                side: "BUY",
                                expiration: "1709948026",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 1,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTD,
                        });
                    });

                    it("GTD BUY POLY_GNOSIS_SAFE", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.005,
                            side: Side.BUY,
                            size: 100,
                            expiration: 1709948026,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_GNOSIS_SAFE,
                            address,
                            userOrder,
                            { tickSize: "0.001", negRisk: true },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTDOrder = orderToJson(signedOrder, owner, OrderType.GTD);
                        expect(jsonGTDOrder).not.null;
                        expect(jsonGTDOrder).not.undefined;

                        expect(jsonGTDOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "500000",
                                takerAmount: "100000000",
                                side: "BUY",
                                expiration: "1709948026",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 2,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTD,
                        });
                    });

                    it("GTD SELL EOA", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.005,
                            side: Side.SELL,
                            size: 100,
                            expiration: 1709948026,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.EOA,
                            address,
                            userOrder,
                            { tickSize: "0.001", negRisk: true },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTDOrder = orderToJson(signedOrder, owner, OrderType.GTD);
                        expect(jsonGTDOrder).not.null;
                        expect(jsonGTDOrder).not.undefined;

                        expect(jsonGTDOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "500000",
                                side: "SELL",
                                expiration: "1709948026",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 0,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTD,
                        });
                    });

                    it("GTD SELL POLY_PROXY", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.005,
                            side: Side.SELL,
                            size: 100,
                            expiration: 1709948026,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_PROXY,
                            address,
                            userOrder,
                            { tickSize: "0.001", negRisk: true },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTDOrder = orderToJson(signedOrder, owner, OrderType.GTD);
                        expect(jsonGTDOrder).not.null;
                        expect(jsonGTDOrder).not.undefined;

                        expect(jsonGTDOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "500000",
                                side: "SELL",
                                expiration: "1709948026",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 1,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTD,
                        });
                    });

                    it("GTD SELL POLY_GNOSIS_SAFE", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.005,
                            side: Side.SELL,
                            size: 100,
                            expiration: 1709948026,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_GNOSIS_SAFE,
                            address,
                            userOrder,
                            { tickSize: "0.001", negRisk: true },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTDOrder = orderToJson(signedOrder, owner, OrderType.GTD);
                        expect(jsonGTDOrder).not.null;
                        expect(jsonGTDOrder).not.undefined;

                        expect(jsonGTDOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "500000",
                                side: "SELL",
                                expiration: "1709948026",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 2,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTD,
                        });
                    });

                    it("GTC BUY EOA", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.005,
                            side: Side.BUY,
                            size: 100,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.EOA,
                            address,
                            userOrder,
                            { tickSize: "0.001", negRisk: true },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTCOrder = orderToJson(signedOrder, owner, OrderType.GTC);
                        expect(jsonGTCOrder).not.null;
                        expect(jsonGTCOrder).not.undefined;

                        expect(jsonGTCOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "500000",
                                takerAmount: "100000000",
                                side: "BUY",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 0,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTC,
                        });
                    });

                    it("GTC BUY POLY_PROXY", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.005,
                            side: Side.BUY,
                            size: 100,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_PROXY,
                            address,
                            userOrder,
                            { tickSize: "0.001", negRisk: true },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTCOrder = orderToJson(signedOrder, owner, OrderType.GTC);
                        expect(jsonGTCOrder).not.null;
                        expect(jsonGTCOrder).not.undefined;

                        expect(jsonGTCOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "500000",
                                takerAmount: "100000000",
                                side: "BUY",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 1,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTC,
                        });
                    });

                    it("GTC BUY POLY_GNOSIS_SAFE", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.005,
                            side: Side.BUY,
                            size: 100,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_GNOSIS_SAFE,
                            address,
                            userOrder,
                            { tickSize: "0.001", negRisk: true },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTCOrder = orderToJson(signedOrder, owner, OrderType.GTC);
                        expect(jsonGTCOrder).not.null;
                        expect(jsonGTCOrder).not.undefined;

                        expect(jsonGTCOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "500000",
                                takerAmount: "100000000",
                                side: "BUY",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 2,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTC,
                        });
                    });

                    it("GTC SELL EOA", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.005,
                            side: Side.SELL,
                            size: 100,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.EOA,
                            address,
                            userOrder,
                            { tickSize: "0.001", negRisk: true },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTCOrder = orderToJson(signedOrder, owner, OrderType.GTC);
                        expect(jsonGTCOrder).not.null;
                        expect(jsonGTCOrder).not.undefined;

                        expect(jsonGTCOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "500000",
                                side: "SELL",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 0,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTC,
                        });
                    });

                    it("GTC SELL POLY_PROXY", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.005,
                            side: Side.SELL,
                            size: 100,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_PROXY,
                            address,
                            userOrder,
                            { tickSize: "0.001", negRisk: true },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTCOrder = orderToJson(signedOrder, owner, OrderType.GTC);
                        expect(jsonGTCOrder).not.null;
                        expect(jsonGTCOrder).not.undefined;

                        expect(jsonGTCOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "500000",
                                side: "SELL",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 1,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTC,
                        });
                    });

                    it("GTC SELL POLY_GNOSIS_SAFE", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.005,
                            side: Side.SELL,
                            size: 100,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_GNOSIS_SAFE,
                            address,
                            userOrder,
                            { tickSize: "0.001", negRisk: true },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTCOrder = orderToJson(signedOrder, owner, OrderType.GTC);
                        expect(jsonGTCOrder).not.null;
                        expect(jsonGTCOrder).not.undefined;

                        expect(jsonGTCOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "500000",
                                side: "SELL",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 2,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTC,
                        });
                    });

                    it("FOK BUY EOA", async () => {
                        const userMarketOrder: UserMarketOrder = {
                            tokenID: token,
                            price: 0.005,
                            amount: 100,
                        };
                        const signedOrder = await createMarketBuyOrder(
                            wallet,
                            chainId,
                            SignatureType.EOA,
                            address,
                            userMarketOrder,
                            { tickSize: "0.001", negRisk: true },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonFOKOrder = orderToJson(signedOrder, owner, OrderType.FOK);
                        expect(jsonFOKOrder).not.null;
                        expect(jsonFOKOrder).not.undefined;

                        expect(jsonFOKOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "20000000000",
                                side: "BUY",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 0,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.FOK,
                        });
                    });

                    it("FOK BUY POLY_PROXY", async () => {
                        const userMarketOrder = {
                            tokenID: token,
                            price: 0.005,
                            amount: 100,
                        };
                        const signedOrder = await createMarketBuyOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_PROXY,
                            address,
                            userMarketOrder,
                            { tickSize: "0.001", negRisk: true },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonFOKOrder = orderToJson(signedOrder, owner, OrderType.FOK);
                        expect(jsonFOKOrder).not.null;
                        expect(jsonFOKOrder).not.undefined;

                        expect(jsonFOKOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "20000000000",
                                side: "BUY",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 1,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.FOK,
                        });
                    });

                    it("FOK BUY POLY_GNOSIS_SAFE", async () => {
                        const userMarketOrder = {
                            tokenID: token,
                            price: 0.005,
                            amount: 100,
                        };
                        const signedOrder = await createMarketBuyOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_GNOSIS_SAFE,
                            address,
                            userMarketOrder,
                            { tickSize: "0.001", negRisk: true },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonFOKOrder = orderToJson(signedOrder, owner, OrderType.FOK);
                        expect(jsonFOKOrder).not.null;
                        expect(jsonFOKOrder).not.undefined;

                        expect(jsonFOKOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "20000000000",
                                side: "BUY",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 2,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.FOK,
                        });
                    });
                });

                describe("0.0001", async () => {
                    // publicly known private key
                    const token =
                        "71321045679252212594626385532706912750332728571942532289631379312455583992563";
                    const privateKey =
                        "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
                    const address = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
                    const wallet = new Wallet(privateKey);
                    const chainId = Chain.AMOY;
                    const owner = "f4f247b7-4ac7-ff29-a152-04fda0a8755a";

                    it("GTD BUY EOA", async () => {
                        const userOrder: UserOrder = {
                            tokenID: token,
                            price: 0.0005,
                            side: Side.BUY,
                            size: 100,
                            expiration: 1709948026,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.EOA,
                            address,
                            userOrder,
                            { tickSize: "0.0001", negRisk: true },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTDOrder = orderToJson(signedOrder, owner, OrderType.GTD);
                        expect(jsonGTDOrder).not.null;
                        expect(jsonGTDOrder).not.undefined;

                        expect(jsonGTDOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "50000",
                                takerAmount: "100000000",
                                side: "BUY",
                                expiration: "1709948026",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 0,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTD,
                        });
                    });

                    it("GTD BUY POLY_PROXY", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.0005,
                            side: Side.BUY,
                            size: 100,
                            expiration: 1709948026,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_PROXY,
                            address,
                            userOrder,
                            { tickSize: "0.0001", negRisk: true },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTDOrder = orderToJson(signedOrder, owner, OrderType.GTD);
                        expect(jsonGTDOrder).not.null;
                        expect(jsonGTDOrder).not.undefined;

                        expect(jsonGTDOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "50000",
                                takerAmount: "100000000",
                                side: "BUY",
                                expiration: "1709948026",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 1,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTD,
                        });
                    });

                    it("GTD BUY POLY_GNOSIS_SAFE", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.0005,
                            side: Side.BUY,
                            size: 100,
                            expiration: 1709948026,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_GNOSIS_SAFE,
                            address,
                            userOrder,
                            { tickSize: "0.0001", negRisk: true },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTDOrder = orderToJson(signedOrder, owner, OrderType.GTD);
                        expect(jsonGTDOrder).not.null;
                        expect(jsonGTDOrder).not.undefined;

                        expect(jsonGTDOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "50000",
                                takerAmount: "100000000",
                                side: "BUY",
                                expiration: "1709948026",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 2,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTD,
                        });
                    });

                    it("GTD SELL EOA", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.0005,
                            side: Side.SELL,
                            size: 100,
                            expiration: 1709948026,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.EOA,
                            address,
                            userOrder,
                            { tickSize: "0.0001", negRisk: true },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTDOrder = orderToJson(signedOrder, owner, OrderType.GTD);
                        expect(jsonGTDOrder).not.null;
                        expect(jsonGTDOrder).not.undefined;

                        expect(jsonGTDOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "50000",
                                side: "SELL",
                                expiration: "1709948026",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 0,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTD,
                        });
                    });

                    it("GTD SELL POLY_PROXY", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.0005,
                            side: Side.SELL,
                            size: 100,
                            expiration: 1709948026,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_PROXY,
                            address,
                            userOrder,
                            { tickSize: "0.0001", negRisk: true },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTDOrder = orderToJson(signedOrder, owner, OrderType.GTD);
                        expect(jsonGTDOrder).not.null;
                        expect(jsonGTDOrder).not.undefined;

                        expect(jsonGTDOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "50000",
                                side: "SELL",
                                expiration: "1709948026",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 1,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTD,
                        });
                    });

                    it("GTD SELL POLY_GNOSIS_SAFE", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.0005,
                            side: Side.SELL,
                            size: 100,
                            expiration: 1709948026,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_GNOSIS_SAFE,
                            address,
                            userOrder,
                            { tickSize: "0.0001", negRisk: true },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTDOrder = orderToJson(signedOrder, owner, OrderType.GTD);
                        expect(jsonGTDOrder).not.null;
                        expect(jsonGTDOrder).not.undefined;

                        expect(jsonGTDOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "50000",
                                side: "SELL",
                                expiration: "1709948026",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 2,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTD,
                        });
                    });

                    it("GTC BUY EOA", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.0005,
                            side: Side.BUY,
                            size: 100,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.EOA,
                            address,
                            userOrder,
                            { tickSize: "0.0001", negRisk: true },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTCOrder = orderToJson(signedOrder, owner, OrderType.GTC);
                        expect(jsonGTCOrder).not.null;
                        expect(jsonGTCOrder).not.undefined;

                        expect(jsonGTCOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "50000",
                                takerAmount: "100000000",
                                side: "BUY",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 0,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTC,
                        });
                    });

                    it("GTC BUY POLY_PROXY", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.0005,
                            side: Side.BUY,
                            size: 100,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_PROXY,
                            address,
                            userOrder,
                            { tickSize: "0.0001", negRisk: true },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTCOrder = orderToJson(signedOrder, owner, OrderType.GTC);
                        expect(jsonGTCOrder).not.null;
                        expect(jsonGTCOrder).not.undefined;

                        expect(jsonGTCOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "50000",
                                takerAmount: "100000000",
                                side: "BUY",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 1,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTC,
                        });
                    });

                    it("GTC BUY POLY_GNOSIS_SAFE", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.0005,
                            side: Side.BUY,
                            size: 100,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_GNOSIS_SAFE,
                            address,
                            userOrder,
                            { tickSize: "0.0001", negRisk: true },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTCOrder = orderToJson(signedOrder, owner, OrderType.GTC);
                        expect(jsonGTCOrder).not.null;
                        expect(jsonGTCOrder).not.undefined;

                        expect(jsonGTCOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "50000",
                                takerAmount: "100000000",
                                side: "BUY",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 2,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTC,
                        });
                    });

                    it("GTC SELL EOA", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.0005,
                            side: Side.SELL,
                            size: 100,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.EOA,
                            address,
                            userOrder,
                            { tickSize: "0.0001", negRisk: true },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTCOrder = orderToJson(signedOrder, owner, OrderType.GTC);
                        expect(jsonGTCOrder).not.null;
                        expect(jsonGTCOrder).not.undefined;

                        expect(jsonGTCOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "50000",
                                side: "SELL",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 0,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTC,
                        });
                    });

                    it("GTC SELL POLY_PROXY", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.0005,
                            side: Side.SELL,
                            size: 100,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_PROXY,
                            address,
                            userOrder,
                            { tickSize: "0.0001", negRisk: true },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTCOrder = orderToJson(signedOrder, owner, OrderType.GTC);
                        expect(jsonGTCOrder).not.null;
                        expect(jsonGTCOrder).not.undefined;

                        expect(jsonGTCOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "50000",
                                side: "SELL",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 1,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTC,
                        });
                    });

                    it("GTC SELL POLY_GNOSIS_SAFE", async () => {
                        const userOrder = {
                            tokenID: token,
                            price: 0.0005,
                            side: Side.SELL,
                            size: 100,
                        };
                        const signedOrder = await createOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_GNOSIS_SAFE,
                            address,
                            userOrder,
                            { tickSize: "0.0001", negRisk: true },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonGTCOrder = orderToJson(signedOrder, owner, OrderType.GTC);
                        expect(jsonGTCOrder).not.null;
                        expect(jsonGTCOrder).not.undefined;

                        expect(jsonGTCOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "50000",
                                side: "SELL",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 2,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.GTC,
                        });
                    });

                    it("FOK BUY EOA", async () => {
                        const userMarketOrder: UserMarketOrder = {
                            tokenID: token,
                            price: 0.0005,
                            amount: 100,
                        };
                        const signedOrder = await createMarketBuyOrder(
                            wallet,
                            chainId,
                            SignatureType.EOA,
                            address,
                            userMarketOrder,
                            { tickSize: "0.0001", negRisk: true },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonFOKOrder = orderToJson(signedOrder, owner, OrderType.FOK);
                        expect(jsonFOKOrder).not.null;
                        expect(jsonFOKOrder).not.undefined;

                        expect(jsonFOKOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "200000000000",
                                side: "BUY",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 0,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.FOK,
                        });
                    });

                    it("FOK BUY POLY_PROXY", async () => {
                        const userMarketOrder = {
                            tokenID: token,
                            price: 0.0005,
                            amount: 100,
                        };
                        const signedOrder = await createMarketBuyOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_PROXY,
                            address,
                            userMarketOrder,
                            { tickSize: "0.0001", negRisk: true },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonFOKOrder = orderToJson(signedOrder, owner, OrderType.FOK);
                        expect(jsonFOKOrder).not.null;
                        expect(jsonFOKOrder).not.undefined;

                        expect(jsonFOKOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "200000000000",
                                side: "BUY",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 1,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.FOK,
                        });
                    });

                    it("FOK BUY POLY_GNOSIS_SAFE", async () => {
                        const userMarketOrder = {
                            tokenID: token,
                            price: 0.0005,
                            amount: 100,
                        };
                        const signedOrder = await createMarketBuyOrder(
                            wallet,
                            chainId,
                            SignatureType.POLY_GNOSIS_SAFE,
                            address,
                            userMarketOrder,
                            { tickSize: "0.0001", negRisk: true },
                        );
                        expect(signedOrder).not.null;
                        expect(signedOrder).not.undefined;

                        const jsonFOKOrder = orderToJson(signedOrder, owner, OrderType.FOK);
                        expect(jsonFOKOrder).not.null;
                        expect(jsonFOKOrder).not.undefined;

                        expect(jsonFOKOrder).deep.equal({
                            order: {
                                salt: parseInt(signedOrder.salt),
                                maker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                signer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                                taker: "0x0000000000000000000000000000000000000000",
                                tokenId: token,
                                makerAmount: "100000000",
                                takerAmount: "200000000000",
                                side: "BUY",
                                expiration: "0",
                                nonce: "0",
                                feeRateBps: "0",
                                signatureType: 2,
                                signature: signedOrder.signature,
                            },
                            owner: owner,
                            orderType: OrderType.FOK,
                        });
                    });
                });
            });
        });
    });

    it("decimalPlaces", () => {
        expect(decimalPlaces(949.9970999999999)).to.equal(13);
        expect(decimalPlaces(949)).to.equal(0);
    });

    it("roundDown", () => {
        expect(roundDown(0.55, 2)).to.equal(0.55);
        expect(roundDown(0.56, 2)).to.equal(0.56);
        expect(roundDown(0.57, 2)).to.equal(0.57);

        expect(roundDown(0.55, 4)).to.equal(0.55);
        expect(roundDown(0.56, 4)).to.equal(0.56);
        expect(roundDown(0.57, 4)).to.equal(0.57);
    });

    it("generateOrderBookSummaryHash", () => {
        let orderbook = {
            market: "0xaabbcc",
            asset_id: "100",
            bids: [
                { price: "0.3", size: "100" },
                { price: "0.4", size: "100" },
            ],
            asks: [
                { price: "0.6", size: "100" },
                { price: "0.7", size: "100" },
            ],
            hash: "",
        } as OrderBookSummary;

        expect(generateOrderBookSummaryHash(orderbook)).to.equal(
            "b8b72c72c6534d1b3a4e7fb47b81672d0e94d5a5",
        );
        expect(orderbook.hash).to.equal("b8b72c72c6534d1b3a4e7fb47b81672d0e94d5a5");

        // -
        orderbook = {
            market: "0xaabbcc",
            asset_id: "100",
            bids: [
                { price: "0.3", size: "100" },
                { price: "0.4", size: "100" },
            ],
            asks: [
                { price: "0.6", size: "100" },
                { price: "0.7", size: "100" },
            ],
            hash: "b8b72c72c6534d1b3a4e7fb47b81672d0e94d5a5",
        } as OrderBookSummary;

        expect(generateOrderBookSummaryHash(orderbook)).to.equal(
            "b8b72c72c6534d1b3a4e7fb47b81672d0e94d5a5",
        );
        expect(orderbook.hash).to.equal("b8b72c72c6534d1b3a4e7fb47b81672d0e94d5a5");

        // -
        orderbook = {
            market: "0xaabbcc",
            asset_id: "100",
            bids: [],
            asks: [],
            hash: "",
        } as OrderBookSummary;

        expect(generateOrderBookSummaryHash(orderbook)).to.equal(
            "7f81a35a09e1933a96b05edb51ac4be4a6163146",
        );
        expect(orderbook.hash).to.equal("7f81a35a09e1933a96b05edb51ac4be4a6163146");
    });

    it("isTickSizeSmaller", () => {
        // 0.1
        expect(isTickSizeSmaller("0.1", "0.1")).to.be.false;
        expect(isTickSizeSmaller("0.1", "0.01")).to.be.false;
        expect(isTickSizeSmaller("0.1", "0.001")).to.be.false;
        expect(isTickSizeSmaller("0.1", "0.0001")).to.be.false;

        // 0.01
        expect(isTickSizeSmaller("0.01", "0.1")).to.be.true;
        expect(isTickSizeSmaller("0.01", "0.01")).to.be.false;
        expect(isTickSizeSmaller("0.01", "0.001")).to.be.false;
        expect(isTickSizeSmaller("0.01", "0.0001")).to.be.false;

        // 0.001
        expect(isTickSizeSmaller("0.001", "0.1")).to.be.true;
        expect(isTickSizeSmaller("0.001", "0.01")).to.be.true;
        expect(isTickSizeSmaller("0.001", "0.001")).to.be.false;
        expect(isTickSizeSmaller("0.001", "0.0001")).to.be.false;

        // 0.0001
        expect(isTickSizeSmaller("0.0001", "0.1")).to.be.true;
        expect(isTickSizeSmaller("0.0001", "0.01")).to.be.true;
        expect(isTickSizeSmaller("0.0001", "0.001")).to.be.true;
        expect(isTickSizeSmaller("0.0001", "0.0001")).to.be.false;
    });

    it("priceValid", () => {
        expect(priceValid(0.00001, "0.0001")).to.be.false;
        expect(priceValid(0.0001, "0.0001")).to.be.true;
        expect(priceValid(0.001, "0.0001")).to.be.true;
        expect(priceValid(0.01, "0.0001")).to.be.true;
        expect(priceValid(0.1, "0.0001")).to.be.true;
        expect(priceValid(0.9, "0.0001")).to.be.true;
        expect(priceValid(0.99, "0.0001")).to.be.true;
        expect(priceValid(0.999, "0.0001")).to.be.true;
        expect(priceValid(0.9999, "0.0001")).to.be.true;
        expect(priceValid(0.99999, "0.0001")).to.be.false;

        expect(priceValid(0.00001, "0.001")).to.be.false;
        expect(priceValid(0.0001, "0.001")).to.be.false;
        expect(priceValid(0.001, "0.001")).to.be.true;
        expect(priceValid(0.01, "0.001")).to.be.true;
        expect(priceValid(0.1, "0.001")).to.be.true;
        expect(priceValid(0.9, "0.001")).to.be.true;
        expect(priceValid(0.99, "0.001")).to.be.true;
        expect(priceValid(0.999, "0.001")).to.be.true;
        expect(priceValid(0.9999, "0.001")).to.be.false;
        expect(priceValid(0.99999, "0.001")).to.be.false;

        expect(priceValid(0.00001, "0.01")).to.be.false;
        expect(priceValid(0.0001, "0.01")).to.be.false;
        expect(priceValid(0.001, "0.01")).to.be.false;
        expect(priceValid(0.01, "0.01")).to.be.true;
        expect(priceValid(0.1, "0.01")).to.be.true;
        expect(priceValid(0.9, "0.01")).to.be.true;
        expect(priceValid(0.99, "0.01")).to.be.true;
        expect(priceValid(0.999, "0.01")).to.be.false;
        expect(priceValid(0.9999, "0.01")).to.be.false;
        expect(priceValid(0.99999, "0.01")).to.be.false;

        expect(priceValid(0.00001, "0.1")).to.be.false;
        expect(priceValid(0.0001, "0.1")).to.be.false;
        expect(priceValid(0.001, "0.1")).to.be.false;
        expect(priceValid(0.01, "0.1")).to.be.false;
        expect(priceValid(0.1, "0.1")).to.be.true;
        expect(priceValid(0.9, "0.1")).to.be.true;
        expect(priceValid(0.99, "0.1")).to.be.false;
        expect(priceValid(0.999, "0.1")).to.be.false;
        expect(priceValid(0.9999, "0.1")).to.be.false;
        expect(priceValid(0.99999, "0.1")).to.be.false;
    });
});
