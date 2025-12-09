import type { Wallet } from "@ethersproject/wallet";
import type { JsonRpcSigner } from "@ethersproject/providers";
import type { SignedOrder } from "@polymarket/order-utils";

import type {
    AcceptQuoteParams,
    ApiKeyCreds,
    ApproveOrderParams,
    CancelRfqQuoteParams,
    CancelRfqRequestParams,
    CreateOrderOptions,
    GetRfqBestQuoteParams,
    GetRfqQuotesParams,
    GetRfqRequestsParams,
    ImproveRfqQuoteParams,
    RfqQuote,
    RfqQuotesResponse,
    RfqRequestsResponse,
    RfqRequestResponse,
    RfqQuoteResponse,
    RfqUserOrder,
    RfqUserQuote,
    TickSize,
    UserOrder,
} from "./types.ts";
import type { RequestOptions } from "./http-helpers/index.ts";

/**
 * Minimal surface from the core CLOB client that RFQ functionality depends on.
 */
export interface RfqDeps {
    host: string;

    signer?: Wallet | JsonRpcSigner;

    creds?: ApiKeyCreds;

    useServerTime?: boolean;

    geoBlockToken?: string;

    /**
     * Numeric user type (backed by SignatureType in the order builder).
     */
    userType: number;

    getServerTime(): Promise<number>;

    getTickSize(tokenID: string): Promise<TickSize>;

    resolveTickSize(tokenID: string, tickSize?: TickSize): Promise<TickSize>;

    createOrder(
        userOrder: UserOrder,
        options?: Partial<CreateOrderOptions>,
    ): Promise<SignedOrder>;

    // HTTP methods that include geo_block_token injection
    get(endpoint: string, options?: RequestOptions): Promise<any>;
    post(endpoint: string, options?: RequestOptions): Promise<any>;
    put(endpoint: string, options?: RequestOptions): Promise<any>;
    del(endpoint: string, options?: RequestOptions): Promise<any>;
}

/**
 * Public RFQ surface exposed from a CLOB client.
 *
 * This is what `ClobClient.rfq` is typed as, and what `RfqClient` implements.
 */
export interface IRfqClient {
    createRfqRequest(
        userOrder: RfqUserOrder,
        options?: Partial<CreateOrderOptions>,
    ): Promise<RfqRequestResponse>;

    cancelRfqRequest(request: CancelRfqRequestParams): Promise<"OK">;

    getRfqRequests(params?: GetRfqRequestsParams): Promise<RfqRequestsResponse>;

    createRfqQuote(
        userQuote: RfqUserQuote,
        options?: Partial<CreateOrderOptions>,
    ): Promise<RfqQuoteResponse>;

    getRfqQuotes(params?: GetRfqQuotesParams): Promise<RfqQuotesResponse>;

    getRfqBestQuote(params?: GetRfqBestQuoteParams): Promise<RfqQuote>;

    improveRfqQuote(quote: ImproveRfqQuoteParams): Promise<"OK">;

    cancelRfqQuote(quote: CancelRfqQuoteParams): Promise<"OK">;

    rfqConfig(): Promise<any>;

    acceptRfqQuote(payload: AcceptQuoteParams): Promise<"OK">;

    approveRfqOrder(payload: ApproveOrderParams): Promise<"OK">;
}
