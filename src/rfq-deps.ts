import { Wallet } from "@ethersproject/wallet";
import { JsonRpcSigner } from "@ethersproject/providers";
import { SignedOrder } from "@polymarket/order-utils";

import {
    AcceptQuoteParams,
    ApiKeyCreds,
    ApproveOrderParams,
    CancelRfqQuoteParams,
    CancelRfqRequestParams,
    CreateOrderOptions,
    CreateRfqQuoteParams,
    GetRfqBestQuoteParams,
    GetRfqQuotesParams,
    GetRfqRequestsParams,
    ImproveRfqQuoteParams,
    RfqRequestParams,
    RfqQuote,
    RfqQuotesResponse,
    RfqRequestsResponse,
    RfqRequestResponse,
    RfqQuoteResponse,
    RfqOrderResponse,
    RfqUserOrder,
    TickSize,
    UserOrder,
} from "./types";
import { RequestOptions } from "./http-helpers";

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
    ): Promise<RfqRequestParams>;

    postRfqRequest(payload: RfqRequestParams): Promise<RfqRequestResponse>;

    cancelRfqRequest(request: CancelRfqRequestParams): Promise<any>;

    getRfqRequests(params?: GetRfqRequestsParams): Promise<RfqRequestsResponse>;

    createRfqQuote(quote: CreateRfqQuoteParams): Promise<RfqQuoteResponse>;

    getRfqQuotes(params?: GetRfqQuotesParams): Promise<RfqQuotesResponse>;

    getRfqBestQuote(params?: GetRfqBestQuoteParams): Promise<RfqQuote>;

    improveRfqQuote(quote: ImproveRfqQuoteParams): Promise<any>;

    cancelRfqQuote(quote: CancelRfqQuoteParams): Promise<void>;

    rfqConfig(): Promise<any>;

    acceptRfqQuote(payload: AcceptQuoteParams): Promise<RfqOrderResponse>;

    approveRfqOrder(payload: ApproveOrderParams): Promise<RfqOrderResponse>;
}
