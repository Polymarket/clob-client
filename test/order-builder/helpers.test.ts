import "mocha";
import { expect } from "chai";
import { UserOrder, Side } from "../../src/types";
import {
    buildOrderCreationArgs,
    buildOrder,
    createOrder,
    getSigner,
} from "../../src/order-builder/helpers";
import {
    OrderData,
    SignatureType,
    Side as UtilsSide,
    Contracts,
    getContracts,
} from "@polymarket/order-utils";
import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { Wallet } from "@ethersproject/wallet";

describe("helpers", () => {
    const chainId = 80001;
    let wallet: Wallet;
    let contracts: Contracts;
    beforeEach(() => {
        const provider = new StaticJsonRpcProvider("https://rpc-mumbai.maticvigil.com");

        // publicly known private key
        const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
        wallet = new Wallet(privateKey).connect(provider);

        contracts = getContracts(chainId);
    });

    describe("buildOrderCreationArgs", () => {
        it("buy order", async () => {
            const order: UserOrder = {
                tokenID: "123",
                price: 0.56,
                size: 21.04,
                side: Side.BUY,
                feeRateBps: "111",
                nonce: 123,
                expiration: 50000,
            };
            const orderData: OrderData = await buildOrderCreationArgs(
                "0x0000000000000000000000000000000000000001",
                "0x0000000000000000000000000000000000000002",
                SignatureType.EOA,
                order,
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

        it("sell order", async () => {
            const order: UserOrder = {
                tokenID: "5",
                price: 0.56,
                size: 21.04,
                side: Side.SELL,
                feeRateBps: "0",
                nonce: 0,
                taker: "0x000000000000000000000000000000000000000A",
            };
            const orderData: OrderData = await buildOrderCreationArgs(
                "0x0000000000000000000000000000000000000001",
                "0x0000000000000000000000000000000000000002",
                SignatureType.POLY_PROXY,
                order,
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

        it("correctly rounds price amounts for validity buy", async () => {
            const order: UserOrder = {
                tokenID: "123",
                price: 0.56,
                size: 21.04,
                side: Side.BUY,
                feeRateBps: "100",
                nonce: 0,
            };
            const orderData: OrderData = await buildOrderCreationArgs(
                "",
                "",
                SignatureType.EOA,
                order,
            );
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

            const orderData: OrderData = await buildOrderCreationArgs(
                "",
                "",
                SignatureType.EOA,
                order,
            );
            expect(Number(orderData.takerAmount) / Number(orderData.makerAmount)).to.equal(0.56);
        });
    });

    describe("buildOrder", () => {
        it("buy order", async () => {
            const order: UserOrder = {
                tokenID: "123",
                price: 0.56,
                size: 21.04,
                side: Side.BUY,
                feeRateBps: "111",
                nonce: 123,
                expiration: 50000,
                taker: "0x0000000000000000000000000000000000000003",
            };
            const orderData: OrderData = await buildOrderCreationArgs(
                "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                SignatureType.EOA,
                order,
            );
            expect(orderData).not.null;
            expect(orderData).not.undefined;

            const signedOrder = await buildOrder(wallet, contracts.Exchange, chainId, orderData);
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

        it("sell order", async () => {
            const order: UserOrder = {
                tokenID: "5",
                price: 0.56,
                size: 21.04,
                side: Side.SELL,
                feeRateBps: "0",
                nonce: 0,
                taker: "0x0000000000000000000000000000000000000003",
            };
            const orderData: OrderData = await buildOrderCreationArgs(
                "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                SignatureType.POLY_PROXY,
                order,
            );
            expect(orderData).not.null;
            expect(orderData).not.undefined;

            const signedOrder = await buildOrder(wallet, contracts.Exchange, chainId, orderData);
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
    });

    describe("createOrder", () => {
        it("buy order", async () => {
            const order: UserOrder = {
                tokenID: "123",
                price: 0.56,
                size: 21.04,
                side: Side.BUY,
                feeRateBps: "111",
                nonce: 123,
                expiration: 50000,
            };

            const signedOrder = await createOrder(
                wallet,
                SignatureType.EOA,
                "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                order,
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

        it("sell order", async () => {
            const order: UserOrder = {
                tokenID: "5",
                price: 0.56,
                size: 21.04,
                side: Side.SELL,
                feeRateBps: "0",
                nonce: 0,
            };

            const signedOrder = await createOrder(
                wallet,
                SignatureType.POLY_GNOSIS_SAFE,
                "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                order,
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
    });

    describe("getSigner", () => {
        const eoa = "0x00000ab000023000000aa000000ff00000000001";
        it("EOA", () => {
            const signer = getSigner(eoa, SignatureType.EOA);
            expect(signer).not.null;
            expect(signer).not.undefined;
            expect(signer).not.empty;
            expect(signer).equal(eoa);
        });

        it("POLY_PROXY", () => {
            const signer = getSigner(eoa, SignatureType.POLY_PROXY);
            expect(signer).not.null;
            expect(signer).not.undefined;
            expect(signer).not.empty;
            expect(signer).equal(eoa);
        });

        it("POLY_GNOSIS_SAFE", () => {
            const signer = getSigner(eoa, SignatureType.POLY_GNOSIS_SAFE);
            expect(signer).not.null;
            expect(signer).not.undefined;
            expect(signer).not.empty;
            expect(signer).equal(eoa);
        });

        it("invalid", () => {
            try {
                getSigner(eoa, 555);
            } catch (e: any) {
                expect(e).not.null;
                expect(e).not.undefined;
                expect(e.toString()).equal("Error: invalid signature type");
            }
        });
    });
});
