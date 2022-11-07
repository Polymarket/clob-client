import "mocha";
import { expect } from "chai";
import {
    buildQueryParams,
    addFilterParamsToUrl,
    addTradeParamsToUrl,
    addOpenOrderParamsToUrl,
} from "../../src/http-helpers/index";
import { OpenOrdersParams, TradeParams } from "../../src";

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
                market: "10000",
                max: 250,
                startTs: 1450000,
                endTs: 1460000,
            });
            expect(url).not.null;
            expect(url).not.undefined;
            expect(url).not.empty;
            expect(url).equal("http://tracker?market=10000&max=250&startTs=1450000&endTs=1460000");
        });
    });

    describe("addTradeParamsToUrl", () => {
        it("checking url + params", () => {
            const url = addTradeParamsToUrl("http://tracker", {
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
                "http://tracker?market=0xaabbccdd&asset_id=10000&maker=0x2&taker=0x1&id=1&limit=5&before=200&after=100",
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
            } as OpenOrdersParams);
            expect(url).not.null;
            expect(url).not.undefined;
            expect(url).not.empty;
            expect(url).equal("http://tracker?market=0xaabbccdd&asset_id=10000&owner=0x69&id=1");
        });
    });
});
