import "mocha";
import { expect } from "chai";
import { parseOrdersScoringParams } from "../../src/http-helpers/index";
import { OrdersScoringParams } from "../../src";

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
});
