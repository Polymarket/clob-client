import "mocha";
import { expect } from "chai";
import { UserOrder, Side } from "../src/types";
import { buildOrderCreationArgs } from "../src/order-builder/helpers";
import { OrderData, SignatureType } from "@polymarket/order-utils";

describe("helpers", () => {
    it("correctly rounds price amounts for validity buy", async () => {
        const order: UserOrder = {
            tokenID: "123",
            price: 0.56,
            size: 21.04,
            side: Side.BUY,
            feeRateBps: "100",
            nonce: 0,
        };
        const orderData: OrderData = await buildOrderCreationArgs("", "", SignatureType.EOA, order);
        expect(Number(orderData.makerAmount) / Number(orderData.takerAmount)).to.equal(0.56);
    });

    it("correctly rounds price amounts for validity sell", async () => {
        const order: UserOrder = {
            tokenID: "123",
            price: 0.56,
            size: 21.04,
            side: Side.SELL,
            feeRateBps: "100",
            nonce: 0,
        };

        const orderData: OrderData = await buildOrderCreationArgs("", "", SignatureType.EOA, order);
        expect(Number(orderData.makerAmount) / Number(orderData.takerAmount)).to.equal(0.56);
    });
});
