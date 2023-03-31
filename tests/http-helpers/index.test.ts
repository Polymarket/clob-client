import "mocha";
import { expect } from "chai";
import {
    buildQueryParams,
    addFilterParamsToUrl,
    addTradeParamsToUrl,
    addOpenOrderParamsToUrl,
    addTradeNotificationParamsToUrl,
    addBalanceAllowanceParamsToUrl,
    addOrderScoringParamsToUrl,
} from "../../src/http-helpers/index";
import {
    AssetType,
    BalanceAllowanceParams,
    OpenOrderParams,
    OrderScoringParams,
    Side,
    TradeNotificationParams,
    TradeParams,
} from "../../src";

describe("utilities", () => {
    describe("buildQueryParams", () => {
        it("last is ?", () => {
            const url = buildQueryParams("http://tracker?", "q1", "a");
            expect(url).not.null;
            expect(url).not.undefined;
            expect(url).not.empty;
            expect(url).equal("http://tracker?q1=a");
        });

        it("last is not ?", () => {
            const url = buildQueryParams("http://tracker?q1=a", "q2", "b");
            expect(url).not.null;
            expect(url).not.undefined;
            expect(url).not.empty;
            expect(url).equal("http://tracker?q1=a&q2=b");
        });
    });

    describe("addFilterParamsToUrl", () => {
        it("checking url + params", () => {
            const url = addFilterParamsToUrl("http://tracker", {
                owner: "owner",
                market: "10000",
                max: 250,
                side: Side.BUY,
                startTs: 1450000,
                endTs: 1460000,
                minValue: "1",
                fidelity: 15,
            });
            expect(url).not.null;
            expect(url).not.undefined;
            expect(url).not.empty;
            expect(url).equal(
                "http://tracker?owner=owner&max=250&market=10000&side=BUY&startTs=1450000&endTs=1460000&minValue=1&fidelity=15",
            );
        });
    });

    describe("addTradeParamsToUrl", () => {
        it("checking url + params", () => {
            const url = addTradeParamsToUrl("http://tracker", {
                owner: "owner",
                market: "0xaabbccdd",
                asset_id: "10000",
                taker: "0x1",
                maker: "0x2",
                id: "1",
                after: "100",
                before: "200",
                limit: 5,
            } as TradeParams);
            expect(url).not.null;
            expect(url).not.undefined;
            expect(url).not.empty;
            expect(url).equal(
                "http://tracker?owner=owner&market=0xaabbccdd&asset_id=10000&maker=0x2&taker=0x1&id=1&limit=5&before=200&after=100",
            );
        });
    });

    describe("addOpenOrderParamsToUrl", () => {
        it("checking url + params", () => {
            const url = addOpenOrderParamsToUrl("http://tracker", {
                market: "0xaabbccdd",
                asset_id: "10000",
                owner: "0x69",
                id: "1",
            } as OpenOrderParams);
            expect(url).not.null;
            expect(url).not.undefined;
            expect(url).not.empty;
            expect(url).equal("http://tracker?market=0xaabbccdd&asset_id=10000&owner=0x69&id=1");
        });
    });

    describe("addTradeNotificationParamsToUrl", () => {
        it("checking url + params", () => {
            const url = addTradeNotificationParamsToUrl("http://tracker", {
                index: 1234,
            } as TradeNotificationParams);
            expect(url).not.null;
            expect(url).not.undefined;
            expect(url).not.empty;
            expect(url).equal("http://tracker?index=1234");
        });
    });

    describe("addBalanceAllowanceParamsToUrl", () => {
        it("checking url + params - COLLATERAL", () => {
            const url = addBalanceAllowanceParamsToUrl("http://tracker", {
                asset_type: AssetType.COLLATERAL,
            } as BalanceAllowanceParams);
            expect(url).not.null;
            expect(url).not.undefined;
            expect(url).not.empty;
            expect(url).equal("http://tracker?asset_type=COLLATERAL");
        });
        it("checking url + params - CONDITIONAL", () => {
            const url = addBalanceAllowanceParamsToUrl("http://tracker", {
                asset_type: AssetType.CONDITIONAL,
                token_id: "111111",
            } as BalanceAllowanceParams);
            expect(url).not.null;
            expect(url).not.undefined;
            expect(url).not.empty;
            expect(url).equal("http://tracker?asset_type=CONDITIONAL&token_id=111111");
        });
    });

    describe("addOrderScoringParamsToUrl", () => {
        it("checking url + params", () => {
            const url = addOrderScoringParamsToUrl("http://tracker", {
                orderId: "0x0123abc",
            } as OrderScoringParams);
            expect(url).not.null;
            expect(url).not.undefined;
            expect(url).not.empty;
            expect(url).equal("http://tracker?order_id=0x0123abc");
        });
    });
});
