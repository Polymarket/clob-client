import "mocha";
import { expect } from "chai";
import { buildLimitOrderCreationArgs } from "../src/order-builder/helpers"
import { UserLimitOrder, Side, SignatureType, OrderCreationArgs } from "../src/types"

describe("helpers", () => {
  it("correctly rounds price amounts for validity buy", async () => {
    const limitOrder: UserLimitOrder = {
      tokenID: "123",
      price: 0.56,
      size: 21.04,
      side: Side.BUY
    }
    const limitOrderCreationArgs: OrderCreationArgs = await buildLimitOrderCreationArgs("", "", 0, "", "", "", "", SignatureType.EOA, limitOrder)
    expect(Number(limitOrderCreationArgs.makerAmount) / Number(limitOrderCreationArgs.takerAmount)).to.equal(0.56)
  });

  it("correctly rounds price amounts for validity sell", async () => {
    const limitOrder: UserLimitOrder = {
      tokenID: "123",
      price: 0.56,
      size: 21.04,
      side: Side.SELL
    }
    const limitOrderCreationArgs: OrderCreationArgs = await buildLimitOrderCreationArgs("", "", 0, "", "", "", "",SignatureType.EOA, limitOrder)
    expect(Number(limitOrderCreationArgs.takerAmount)/Number(limitOrderCreationArgs.makerAmount)).to.equal(0.56)
  })
})