import "mocha";
import { expect } from "chai";
import { ApiError } from "../../src/errors.ts";
import { ClobClient } from "../../src/client.ts";
import { Chain } from "../../src/types.ts";

class TestableClient extends ClobClient {
    setNextResponse(response: any) {
        this._nextResponse = response;
    }
    private _nextResponse: any;
    protected async get() {
        return (this as any).throwIfError(this._nextResponse);
    }
    protected async post() {
        return (this as any).throwIfError(this._nextResponse);
    }
    protected async del() {
        return (this as any).throwIfError(this._nextResponse);
    }
    protected async put() {
        return (this as any).throwIfError(this._nextResponse);
    }
}

describe("throwOnError", () => {
    const host = "http://localhost";
    const chainId = Chain.AMOY;

    describe("when throwOnError is false (default)", () => {
        it("returns error objects as-is", async () => {
            const client = new TestableClient(host, chainId);
            const errorResponse = { error: "Not found", status: 404 };
            client.setNextResponse(errorResponse);
            const result = await client.getOk();
            expect(result).to.deep.equal(errorResponse);
        });
    });

    describe("when throwOnError is true", () => {
        let client: TestableClient;
        beforeEach(() => {
            client = new TestableClient(
                host, chainId,
                undefined, undefined, undefined, undefined,
                undefined, undefined, undefined, undefined,
                undefined, undefined, true,
            );
        });

        it("throws ApiError for responses with error field", async () => {
            client.setNextResponse({ error: "No orderbook exists for the requested token id", status: 404 });
            try {
                await client.getOk();
                expect.fail("should have thrown");
            } catch (e: any) {
                expect(e).to.be.instanceOf(ApiError);
                expect(e.message).to.equal("No orderbook exists for the requested token id");
                expect(e.status).to.equal(404);
                expect(e.data).to.deep.equal({ error: "No orderbook exists for the requested token id", status: 404 });
            }
        });

        it("throws ApiError with stringified message for non-string errors", async () => {
            client.setNextResponse({ error: { code: "INVALID", detail: "bad request" }, status: 400 });
            try {
                await client.getOk();
                expect.fail("should have thrown");
            } catch (e: any) {
                expect(e).to.be.instanceOf(ApiError);
                expect(e.message).to.equal(JSON.stringify({ code: "INVALID", detail: "bad request" }));
                expect(e.status).to.equal(400);
            }
        });

        it("returns successful responses unchanged", async () => {
            const successResponse = { market: "BTC", price: 50000 };
            client.setNextResponse(successResponse);
            const result = await client.getOk();
            expect(result).to.deep.equal(successResponse);
        });

        it("returns null/undefined unchanged", async () => {
            client.setNextResponse(null);
            const result = await client.getOk();
            expect(result).to.be.null;
        });

        it("works for post requests", async () => {
            client.setNextResponse({ error: "Unauthorized", status: 401 });
            try {
                await client.getServerTime();
                expect.fail("should have thrown");
            } catch (e: any) {
                expect(e).to.be.instanceOf(ApiError);
                expect(e.status).to.equal(401);
            }
        });
    });

    describe("ApiError", () => {
        it("has correct name and fields", () => {
            const err = new ApiError("test error", 500, "Internal Server Error", { error: "test" });
            expect(err.name).to.equal("ApiError");
            expect(err.message).to.equal("test error");
            expect(err.status).to.equal(500);
            expect(err.statusText).to.equal("Internal Server Error");
            expect(err.data).to.deep.equal({ error: "test" });
            expect(err).to.be.instanceOf(Error);
        });

        it("works with minimal args", () => {
            const err = new ApiError("oops");
            expect(err.message).to.equal("oops");
            expect(err.status).to.be.undefined;
            expect(err.statusText).to.be.undefined;
            expect(err.data).to.be.undefined;
        });
    });
});
