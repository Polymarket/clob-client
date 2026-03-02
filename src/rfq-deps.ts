import type { SignedOrder } from "./order-utils/index.ts";
import type { ClobSigner } from "./signer.ts";

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

    signer?: ClobSigner;

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

    getRfqRequesterQuotes(params?: GetRfqQuotesParams): Promise<RfqQuotesResponse>;

    getRfqQuoterQuotes(params?: GetRfqQuotesParams): Promise<RfqQuotesResponse>;

    getRfqBestQuote(params?: GetRfqBestQuoteParams): Promise<RfqQuote>;

    cancelRfqQuote(quote: CancelRfqQuoteParams): Promise<"OK">;

    rfqConfig(): Promise<any>;

    acceptRfqQuote(payload: AcceptQuoteParams): Promise<"OK">;

    approveRfqOrder(payload: ApproveOrderParams): Promise<"OK">;
}
