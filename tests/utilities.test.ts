import "mocha";
import { expect } from "chai";
import { orderToJson } from "../src/utilities";
import { Side, SignatureType } from "@polymarket/order-utils";

describe("utilities", () => {
    describe("orderToJson", () => {
        it("buy", () => {
            const jsonOrder = orderToJson({
                salt: "1000",
                maker: "0x0000000000000000000000000000000000000001",
                signer: "0x0000000000000000000000000000000000000002",
                taker: "0x0000000000000000000000000000000000000003",
                tokenId: "1",
                makerAmount: "100000000",
                takerAmount: "50000000",
                side: Side.BUY,
                expiration: "0",
                nonce: "1",
                feeRateBps: "100",
                signatureType: SignatureType.POLY_GNOSIS_SAFE,
                signature: "0x",
            });
            expect(jsonOrder).not.null;
            expect(jsonOrder).not.undefined;

            expect(jsonOrder).deep.equal({
                salt: 1000,
                maker: "0x0000000000000000000000000000000000000001",
                signer: "0x0000000000000000000000000000000000000002",
                taker: "0x0000000000000000000000000000000000000003",
                tokenId: "1",
                makerAmount: "100000000",
                takerAmount: "50000000",
                side: "buy",
                expiration: "0",
                nonce: "1",
                feeRateBps: "100",
                signatureType: 2,
                signature: "0x",
            });
        });

        it("sell", () => {
            const jsonOrder = orderToJson({
                salt: "1000",
                maker: "0x0000000000000000000000000000000000000001",
                signer: "0x0000000000000000000000000000000000000002",
                taker: "0x0000000000000000000000000000000000000003",
                tokenId: "1",
                makerAmount: "50000000",
                takerAmount: "100000000",
                side: Side.SELL,
                expiration: "0",
                nonce: "1",
                feeRateBps: "100",
                signatureType: SignatureType.POLY_PROXY,
                signature: "0x",
            });
            expect(jsonOrder).not.null;
            expect(jsonOrder).not.undefined;

            expect(jsonOrder).deep.equal({
                salt: 1000,
                maker: "0x0000000000000000000000000000000000000001",
                signer: "0x0000000000000000000000000000000000000002",
                taker: "0x0000000000000000000000000000000000000003",
                tokenId: "1",
                makerAmount: "50000000",
                takerAmount: "100000000",
                side: "sell",
                expiration: "0",
                nonce: "1",
                feeRateBps: "100",
                signatureType: 1,
                signature: "0x",
            });
        });
    });
});
