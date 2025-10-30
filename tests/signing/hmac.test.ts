import { expect, describe, it } from "bun:test";
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
        expect(signature).not.toBeNull();
        expect(signature).not.toBeUndefined();
        expect(signature).not.toBeEmpty();
        expect(signature).toEqual("ZwAdJKvoYRlEKDkNMwd5BuwNNtg93kNaR_oU2HrfVvc=");
    });
});
