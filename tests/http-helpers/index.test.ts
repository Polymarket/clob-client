import {
    parseDropNotificationParams,
    parseOrdersScoringParams,
    sanitizeAxiosResponseConfig,
} from "../../src/http-helpers/index.ts";
import type { DropNotificationParams, OrdersScoringParams } from "../../src/types.ts";

describe("utilities", () => {
    describe("parseOrdersScoringParams", () => {
        it("checking params", () => {
            const params = parseOrdersScoringParams({
                orderIds: ["0x0", "0x1", "0x2"],
            } as OrdersScoringParams);
            expect(params).not.null;
            expect(params).not.undefined;
            expect(params).not.empty;
            expect(params).deep.equal({ order_ids: "0x0,0x1,0x2" });
        });
    });
    describe("parseDropNotificationParams", () => {
        it("checking params", () => {
            const params = parseDropNotificationParams({
                ids: ["0", "1", "2"],
            } as DropNotificationParams);
            expect(params).not.null;
            expect(params).not.undefined;
            expect(params).not.empty;
            expect(params).deep.equal({ ids: "0,1,2" });
        });
    });

    describe("sanitizeAxiosResponseConfig", () => {
        it("removes sensitive headers and auth details", () => {
            const sanitized = sanitizeAxiosResponseConfig({
                method: "post",
                url: "https://clob.polymarket.com/order",
                timeout: 5000,
                headers: { Authorization: "Bearer secret" },
                auth: { username: "u", password: "p" },
            });
            expect(sanitized).deep.equal({
                method: "post",
                url: "https://clob.polymarket.com/order",
                timeout: 5000,
            });
        });
    });
});
