import "mocha";
import { expect } from "chai";
import { buildPolyHmacSignature } from "../../src/signing/hmac";

describe("hmac", () => {
    it("buildPolyHmacSignature", () => {
        const signature = buildPolyHmacSignature(
            "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
            1000000,
            "test-sign",
            "/orders",
            '{"hash": "0x123"}',
        );
        expect(signature).not.null;
        expect(signature).not.undefined;
        expect(signature).not.empty;
        expect(signature).equal("ZwAdJKvoYRlEKDkNMwd5BuwNNtg93kNaR_oU2HrfVvc=");
    });
});
