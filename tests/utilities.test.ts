import "mocha";
import { expect } from "chai";
import { decimalPlaces, generateOrderBookSummaryHash, orderToJson, roundDown } from "../src/utilities";
import { Side as UtilsSide, SignatureType } from "@polymarket/order-utils";
import { Chain, OrderBookSummary, OrderType, Side, UserMarketOrder, UserOrder } from "../src";
import { Wallet } from "@ethersproject/wallet";
import { createMarketBuyOrder, createOrder } from "../src/order-builder/helpers";

describe("utilities", () => {
    describe("orderToJson", () => {
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

        it("All orders combinations", async () => {
            // publicly known private key
            const token =
                "1343197538147866997676250008839231694243646439454152539053893078719042421992";
            const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
            const address = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
            const wallet = new Wallet(privateKey);
            const chainId = Chain.MUMBAI;
            const owner = "f4f247b7-4ac7-ff29-a152-04fda0a8755a";

            // GTC BUY EOA
            let userOrder: UserOrder = {
                tokenID: token,
                price: 0.5,
                side: Side.BUY,
                size: 100,
            };
            let signedOrder = await createOrder(
                wallet,
                chainId,
                SignatureType.EOA,
                address,
                userOrder,
            );
            expect(signedOrder).not.null;
            expect(signedOrder).not.undefined;

            let jsonOrder = orderToJson(signedOrder, owner, OrderType.GTC);
            expect(jsonOrder).not.null;
            expect(jsonOrder).not.undefined;

            expect(jsonOrder).deep.equal({
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

            // GTC BUY POLY_PROXY
            userOrder = {
                tokenID: token,
                price: 0.5,
                side: Side.BUY,
                size: 100,
            };
            signedOrder = await createOrder(
                wallet,
                chainId,
                SignatureType.POLY_PROXY,
                address,
                userOrder,
            );
            expect(signedOrder).not.null;
            expect(signedOrder).not.undefined;

            jsonOrder = orderToJson(signedOrder, owner, OrderType.GTC);
            expect(jsonOrder).not.null;
            expect(jsonOrder).not.undefined;

            expect(jsonOrder).deep.equal({
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

            // GTC BUY POLY_GNOSIS_SAFE
            userOrder = {
                tokenID: token,
                price: 0.5,
                side: Side.BUY,
                size: 100,
            };
            signedOrder = await createOrder(
                wallet,
                chainId,
                SignatureType.POLY_GNOSIS_SAFE,
                address,
                userOrder,
            );
            expect(signedOrder).not.null;
            expect(signedOrder).not.undefined;

            jsonOrder = orderToJson(signedOrder, owner, OrderType.GTC);
            expect(jsonOrder).not.null;
            expect(jsonOrder).not.undefined;

            expect(jsonOrder).deep.equal({
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

            // GTC SELL EOA
            userOrder = {
                tokenID: token,
                price: 0.5,
                side: Side.SELL,
                size: 100,
            };
            signedOrder = await createOrder(wallet, chainId, SignatureType.EOA, address, userOrder);
            expect(signedOrder).not.null;
            expect(signedOrder).not.undefined;

            jsonOrder = orderToJson(signedOrder, owner, OrderType.GTC);
            expect(jsonOrder).not.null;
            expect(jsonOrder).not.undefined;

            expect(jsonOrder).deep.equal({
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

            // GTC SELL POLY_PROXY
            userOrder = {
                tokenID: token,
                price: 0.5,
                side: Side.SELL,
                size: 100,
            };
            signedOrder = await createOrder(
                wallet,
                chainId,
                SignatureType.POLY_PROXY,
                address,
                userOrder,
            );
            expect(signedOrder).not.null;
            expect(signedOrder).not.undefined;

            jsonOrder = orderToJson(signedOrder, owner, OrderType.GTC);
            expect(jsonOrder).not.null;
            expect(jsonOrder).not.undefined;

            expect(jsonOrder).deep.equal({
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

            // GTC SELL POLY_GNOSIS_SAFE
            userOrder = {
                tokenID: token,
                price: 0.5,
                side: Side.SELL,
                size: 100,
            };
            signedOrder = await createOrder(
                wallet,
                chainId,
                SignatureType.POLY_GNOSIS_SAFE,
                address,
                userOrder,
            );
            expect(signedOrder).not.null;
            expect(signedOrder).not.undefined;

            jsonOrder = orderToJson(signedOrder, owner, OrderType.GTC);
            expect(jsonOrder).not.null;
            expect(jsonOrder).not.undefined;

            expect(jsonOrder).deep.equal({
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

            // FOK BUY EOA
            let userMarketOrder: UserMarketOrder = {
                tokenID: token,
                price: 0.5,
                amount: 100,
            };
            signedOrder = await createMarketBuyOrder(
                wallet,
                chainId,
                SignatureType.EOA,
                address,
                userMarketOrder,
            );
            expect(signedOrder).not.null;
            expect(signedOrder).not.undefined;

            jsonOrder = orderToJson(signedOrder, owner, OrderType.FOK);
            expect(jsonOrder).not.null;
            expect(jsonOrder).not.undefined;

            expect(jsonOrder).deep.equal({
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

            // FOK BUY POLY_PROXY
            userMarketOrder = {
                tokenID: token,
                price: 0.5,
                amount: 100,
            };
            signedOrder = await createMarketBuyOrder(
                wallet,
                chainId,
                SignatureType.POLY_PROXY,
                address,
                userMarketOrder,
            );
            expect(signedOrder).not.null;
            expect(signedOrder).not.undefined;

            jsonOrder = orderToJson(signedOrder, owner, OrderType.FOK);
            expect(jsonOrder).not.null;
            expect(jsonOrder).not.undefined;

            expect(jsonOrder).deep.equal({
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

            // FOK BUY POLY_GNOSIS_SAFE
            userMarketOrder = {
                tokenID: token,
                price: 0.5,
                amount: 100,
            };
            signedOrder = await createMarketBuyOrder(
                wallet,
                chainId,
                SignatureType.POLY_GNOSIS_SAFE,
                address,
                userMarketOrder,
            );
            expect(signedOrder).not.null;
            expect(signedOrder).not.undefined;

            jsonOrder = orderToJson(signedOrder, owner, OrderType.FOK);
            expect(jsonOrder).not.null;
            expect(jsonOrder).not.undefined;

            expect(jsonOrder).deep.equal({
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
});
