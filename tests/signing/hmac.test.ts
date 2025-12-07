import "mocha";
import { expect } from "chai";
import { buildPolyHmacSignature } from "../../src/signing/hmac.ts";

describe("hmac", () => {
    it("buildPolyHmacSignature", async () => {
        const signature = await buildPolyHmacSignature(
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

    it("buildPolyHmacSignature transforms base64url encoding to base64", async () => {
        const base64Signature = await buildPolyHmacSignature(
            "++/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
            1000000,
            "test-sign",
            "/orders",
            '{"hash": "0x123"}',
        );
        const base64UrlSignature = await buildPolyHmacSignature(
            "--_AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            1000000,
            "test-sign",
            "/orders",
            '{"hash": "0x123"}',
        );
        expect(base64UrlSignature).equal(base64Signature);
    });

    it("buildPolyHmacSignature ignores invalid symbols in base64, for backwards compatibility with Node.js Buffer.from()", async () => {
        const signature = await buildPolyHmacSignature(
            "AAAAAAAAA^^AAAAAAAA<>AAAAA||AAAAAAAAAAAAAAAAAAAAA=",
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
