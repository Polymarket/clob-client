import "mocha";
import { expect } from "chai";
import { buildQueryParams, addQueryParamsToUrl } from "../../src/http-helpers/index";

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

    describe("addQueryParamsToUrl", () => {
        it("checking url + params", () => {
            const url = addQueryParamsToUrl("http://tracker", {
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
});
