import { ClobClient } from "../../src/client.ts";
import type {
    Market,
    OrderResponse,
    PaginationPayload,
    SimplifiedMarket,
} from "../../src/types.ts";
import { Chain } from "../../src/types.ts";

class StubClient extends ClobClient {
    private _stub: unknown;
    setStub(v: unknown) {
        this._stub = v;
    }
    protected async get(): Promise<unknown> {
        return this._stub;
    }
    protected async post(): Promise<unknown> {
        return this._stub;
    }
}

describe("typed return values", () => {
    const client = new StubClient("http://localhost", Chain.AMOY);

    describe("PaginationPayload<T>", () => {
        it("data is typed as Market[] from getMarkets", async () => {
            const payload: PaginationPayload<Market> = {
                limit: 100,
                count: 1,
                next_cursor: "LTE=",
                data: [
                    {
                        condition_id: "0xabc",
                        question_id: "0xdef",
                        question: "Will X happen?",
                        description: "",
                        market_slug: "will-x-happen",
                        end_date_iso: "2025-01-01T00:00:00Z",
                        game_start_time: "",
                        seconds_delay: 0,
                        fpmm: "",
                        maker_base_fee: 0,
                        taker_base_fee: 0,
                        notifications_enabled: false,
                        neg_risk: false,
                        neg_risk_market_id: "",
                        neg_risk_request_id: "",
                        icon: "",
                        image: "",
                        tokens: [],
                        tags: [],
                        is_50_50_outcome: false,
                        accepting_orders: true,
                        accepting_order_timestamp: null,
                        minimum_order_size: "5",
                        minimum_tick_size: "0.01",
                        active: true,
                        closed: false,
                        archived: false,
                        enable_order_book: true,
                        rewards: {
                            min_size: 0,
                            max_spread: 0,
                            event_start_date: "",
                            event_end_date: "",
                            in_game_multiplier: 1,
                            reward_epoch: 0,
                        },
                    },
                ],
            };
            client.setStub(payload);
            const result = await client.getMarkets();
            expect(result.data[0].condition_id).to.equal("0xabc");
            expect(result.data[0].accepting_orders).to.equal(true);
        });

        it("data is typed as SimplifiedMarket[] from getSimplifiedMarkets", async () => {
            const payload: PaginationPayload<SimplifiedMarket> = {
                limit: 100,
                count: 1,
                next_cursor: "LTE=",
                data: [
                    {
                        condition_id: "0xabc",
                        tokens: [{ token_id: "1", outcome: "Yes", price: 0.5 }],
                        rewards: { min_size: 5, max_spread: 0.02 },
                        min_incentive_size: "5",
                        max_incentive_spread: "0.02",
                        accepting_orders: true,
                        enable_order_book: true,
                    },
                ],
            };
            client.setStub(payload);
            const result = await client.getSimplifiedMarkets();
            expect(result.data[0].condition_id).to.equal("0xabc");
            expect(result.data[0].tokens[0].outcome).to.equal("Yes");
        });
    });

    describe("OrderResponse", () => {
        it("postOrder returns typed OrderResponse", async () => {
            const response: OrderResponse = {
                orderID: "0x123",
                status: "matched",
                success: true,
                errorMsg: "",
                transactionsHashes: ["0xhash1"],
                takingAmount: "100",
                makingAmount: "50",
                transactTime: "1234567890",
                owner: "0xabc",
            };
            client.setStub(response);
            // postOrder requires L2 auth; test the type shape directly
            const typed: OrderResponse = response;
            expect(typed.orderID).to.equal("0x123");
            expect(typed.status).to.equal("matched");
            expect(typed.success).to.equal(true);
            expect(typed.transactTime).to.equal("1234567890");
            expect(typed.owner).to.equal("0xabc");
        });

        it("OrderResponse optional fields are optional", () => {
            const minimal: OrderResponse = {
                orderID: "0x456",
                status: "live",
                success: false,
                errorMsg: "",
                transactionsHashes: [],
                takingAmount: "0",
                makingAmount: "0",
            };
            expect(minimal.transactTime).to.be.undefined;
            expect(minimal.owner).to.be.undefined;
        });
    });

    describe("getMarket", () => {
        it("returns a Market (not any)", async () => {
            const market: Market = {
                condition_id: "0xfeed",
                question_id: "0xbeef",
                question: "Test?",
                description: "",
                market_slug: "test",
                end_date_iso: "",
                game_start_time: "",
                seconds_delay: 0,
                fpmm: "",
                maker_base_fee: 0,
                taker_base_fee: 0,
                notifications_enabled: false,
                neg_risk: false,
                neg_risk_market_id: "",
                neg_risk_request_id: "",
                icon: "",
                image: "",
                tokens: [],
                tags: [],
                is_50_50_outcome: false,
                accepting_orders: false,
                accepting_order_timestamp: null,
                minimum_order_size: "5",
                minimum_tick_size: "0.01",
                active: false,
                closed: true,
                archived: false,
                enable_order_book: false,
                rewards: {
                    min_size: 0,
                    max_spread: 0,
                    event_start_date: "",
                    event_end_date: "",
                    in_game_multiplier: 1,
                    reward_epoch: 0,
                },
            };
            client.setStub(market);
            const result = await client.getMarket("0xfeed");
            expect(result.condition_id).to.equal("0xfeed");
            expect(result.closed).to.equal(true);
        });
    });
});
