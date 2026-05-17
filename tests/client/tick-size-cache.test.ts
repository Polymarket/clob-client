import { ClobClient } from "../../src/client.ts";
import { Chain } from "../../src/types.ts";

class TestableClient extends ClobClient {
    public getCallCount = 0;
    public nextTickSize = "0.01";

    protected async get(_endpoint: string, _options?: any): Promise<any> {
        this.getCallCount++;
        return { minimum_tick_size: this.nextTickSize };
    }
}

describe("tick size cache TTL", () => {
    const host = "http://localhost";
    const chainId = Chain.AMOY;
    const tokenID = "token-abc";

    it("returns cached value within TTL without refetching", async () => {
        const client = new TestableClient(host, chainId);
        await client.getTickSize(tokenID);
        await client.getTickSize(tokenID);
        expect(client.getCallCount).to.equal(1);
    });

    it("refetches after TTL expires", async () => {
        // TTL of 1ms so any await causes expiry
        const client = new TestableClient(
            host,
            chainId,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            1,
        );
        await client.getTickSize(tokenID);
        await new Promise(r => setTimeout(r, 5));
        await client.getTickSize(tokenID);
        expect(client.getCallCount).to.equal(2);
    });

    it("picks up updated tick size after TTL expires", async () => {
        const client = new TestableClient(
            host,
            chainId,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            1,
        );
        client.nextTickSize = "0.01";
        await client.getTickSize(tokenID);
        await new Promise(r => setTimeout(r, 5));
        client.nextTickSize = "0.001";
        const result = await client.getTickSize(tokenID);
        expect(result).to.equal("0.001");
    });

    it("clearTickSizeCache forces refetch for specific token", async () => {
        const client = new TestableClient(host, chainId);
        await client.getTickSize(tokenID);
        client.clearTickSizeCache(tokenID);
        await client.getTickSize(tokenID);
        expect(client.getCallCount).to.equal(2);
    });

    it("clearTickSizeCache with no arg clears all tokens", async () => {
        const client = new TestableClient(host, chainId);
        await client.getTickSize("token-1");
        await client.getTickSize("token-2");
        client.clearTickSizeCache();
        await client.getTickSize("token-1");
        await client.getTickSize("token-2");
        expect(client.getCallCount).to.equal(4);
    });
});
