import "mocha";
import { expect } from "chai";
import { Wallet } from "@ethersproject/wallet";
import {
    ExchangeOrderBuilder,
    SignatureType,
    Side as OrderSide,
} from "../../src/order-utils/index.ts";
import type { Order, OrderData } from "../../src/order-utils/index.ts";

const CHAIN_ID = 137;
const EXCHANGE_ADDRESS = "0x0000000000000000000000000000000000000001";
const EOA_PRIVATE_KEY =
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const EXPECTED_HASH = "0xeb162c6cc7aa28ad096a7c40fb9556d41fa1730d71103ba7103589ae1f18d942";

const createOrderData = (signer: string): OrderData => ({
    maker: signer,
    taker: "0x0000000000000000000000000000000000000000",
    tokenId: "101",
    makerAmount: "1000000",
    takerAmount: "2000000",
    side: OrderSide.BUY,
    feeRateBps: "0",
    nonce: "2",
    signer,
    expiration: "0",
    signatureType: SignatureType.EOA,
});

describe("ExchangeOrderBuilder", () => {
    it("signs orders with a providerless ethers wallet", async () => {
        const wallet = new Wallet(EOA_PRIVATE_KEY);
        const address = await wallet.getAddress();
        const builder = new ExchangeOrderBuilder(
            EXCHANGE_ADDRESS,
            CHAIN_ID,
            wallet,
            () => "123",
        );

        const signedOrder = await builder.buildSignedOrder(createOrderData(address));

        expect(signedOrder.signer).to.equal(address);
        expect(signedOrder.salt).to.equal("123");
        expect(signedOrder.signature).to.match(/^0x[0-9a-f]+$/i);
    });

    it("signs orders with a WalletClient-compatible signer and forwards primaryType", async () => {
        const walletClientAddress = "0x00000000000000000000000000000000000000a1";
        let receivedPrimaryType = "";
        const walletClientMock = {
            chain: { id: CHAIN_ID },
            account: { address: walletClientAddress },
            transport: {
                config: {},
                name: "mock-transport",
                request: async (_args: { method: string; params?: unknown[] }) => null,
                type: "custom",
                value: {},
            },
            requestAddresses: async (): Promise<string[]> => [walletClientAddress],
            signMessage: async (_args: unknown): Promise<string> => "0x01",
            signTypedData: async (args: { primaryType: string }): Promise<string> => {
                receivedPrimaryType = args.primaryType;
                return "0xdeadbeef";
            },
            sendTransaction: async (_args: unknown): Promise<string> => "0xabc",
        };
        const builder = new ExchangeOrderBuilder(
            EXCHANGE_ADDRESS,
            CHAIN_ID,
            walletClientMock as any,
            () => "456",
        );

        const signedOrder = await builder.buildSignedOrder(createOrderData(walletClientAddress));

        expect(signedOrder.signature).to.equal("0xdeadbeef");
        expect(receivedPrimaryType).to.equal("Order");
    });

    it("throws when order signer does not match the signer address", async () => {
        const wallet = new Wallet(EOA_PRIVATE_KEY);
        const builder = new ExchangeOrderBuilder(EXCHANGE_ADDRESS, CHAIN_ID, wallet, () => "789");
        const badOrderData = createOrderData("0x00000000000000000000000000000000000000b2");

        let thrownError: unknown;
        try {
            await builder.buildOrder(badOrderData);
        } catch (err) {
            thrownError = err;
        }

        expect(thrownError).to.be.instanceOf(Error);
        expect((thrownError as Error).message).to.equal("signer does not match");
    });

    it("builds a deterministic order hash", () => {
        const wallet = new Wallet(EOA_PRIVATE_KEY);
        const builder = new ExchangeOrderBuilder(EXCHANGE_ADDRESS, CHAIN_ID, wallet);
        const order: Order = {
            salt: "1",
            maker: "0x1111111111111111111111111111111111111111",
            signer: "0x1111111111111111111111111111111111111111",
            taker: "0x0000000000000000000000000000000000000000",
            tokenId: "101",
            makerAmount: "1000000",
            takerAmount: "2000000",
            expiration: "0",
            nonce: "2",
            feeRateBps: "0",
            side: OrderSide.BUY,
            signatureType: SignatureType.EOA,
        };

        const typedData = builder.buildOrderTypedData(order);
        const orderHash = builder.buildOrderHash(typedData);

        expect(orderHash).to.equal(EXPECTED_HASH);
    });
});
