import { Side } from "./types.ts";
import type {
    ApiKeyCreds,
    CreateOrderOptions,
    RfqUserOrder,
    CreateRfqRequestParams,
    CreateRfqQuoteParams,
    ImproveRfqQuoteParams,
    CancelRfqQuoteParams,
    GetRfqQuotesParams,
    GetRfqBestQuoteParams,
    CancelRfqRequestParams,
    AcceptQuoteParams,
    ApproveOrderParams,
    GetRfqRequestsParams,
    RfqRequestsResponse,
    RfqQuotesResponse,
    RfqRequestResponse,
    RfqQuoteResponse,
    RfqQuote,
} from "./types.ts";
import { createL2Headers } from "./headers/index.ts";
import {
    DELETE,
    GET,
    POST,
    PUT,
    parseRfqQuotesParams,
    parseRfqRequestsParams,
} from "./http-helpers/index.ts";
import {
    CANCEL_RFQ_REQUEST,
    CREATE_RFQ_QUOTE,
    GET_RFQ_QUOTES,
    GET_RFQ_BEST_QUOTE,
    IMPROVE_RFQ_QUOTE,
    CANCEL_RFQ_QUOTE,
    CREATE_RFQ_REQUEST,
    RFQ_CONFIG,
    GET_RFQ_REQUESTS,
    RFQ_REQUESTS_ACCEPT,
    RFQ_QUOTE_APPROVE,
} from "./endpoints.ts";
import { ROUNDING_CONFIG } from "./order-builder/helpers.ts";
import { roundDown, roundNormal } from "./utilities.ts";
import { parseUnits } from "@ethersproject/units";
import { COLLATERAL_TOKEN_DECIMALS } from "./config.ts";
import type { IRfqClient, RfqDeps } from "./rfq-deps.ts";
import type { JsonRpcSigner } from "@ethersproject/providers";
import type { Wallet } from "@ethersproject/wallet";
import { L1_AUTH_UNAVAILABLE_ERROR, L2_AUTH_NOT_AVAILABLE } from "./errors.ts";

/**
 * RfqClient provides RFQ (Request for Quote) functionality on top of a CLOB client.
 */
export class RfqClient implements IRfqClient {
    constructor(private readonly deps: RfqDeps) {}

    /**
     * Creates an RFQ request from user order parameters
     * Converts the order into the proper RFQ request format with asset amounts
     */
    public async createRfqRequest(
        userOrder: RfqUserOrder,
        options?: Partial<CreateOrderOptions>,
    ): Promise<CreateRfqRequestParams> {
        const { tokenID, price, side, size } = userOrder;

        const tickSize = await this.deps.resolveTickSize(tokenID, options?.tickSize);

        const roundConfig = ROUNDING_CONFIG[tickSize];

        const roundedPrice = roundNormal(price, roundConfig.price).toFixed(roundConfig.price);
        const roundedSize = roundDown(size, roundConfig.size).toFixed(roundConfig.size);

        // Calculate amounts based on side
        const sizeNum = parseFloat(roundedSize);
        const priceNum = parseFloat(roundedPrice);

        let amountIn: string;
        let amountOut: string;
        let assetIn: string;
        let assetOut: string;

        if (side === Side.BUY) {
            // Buying: pay USDC (asset 0), receive tokens (tokenID)
            amountIn = parseUnits(roundedSize, COLLATERAL_TOKEN_DECIMALS).toString();
            amountOut = parseUnits((sizeNum * priceNum).toFixed(roundConfig.amount), COLLATERAL_TOKEN_DECIMALS).toString();
            assetIn = tokenID;
            assetOut = "0"; // USDC
        } else {
            // Selling: pay tokens (tokenID), receive USDC (asset 0)
            amountIn = parseUnits((sizeNum * priceNum).toFixed(roundConfig.amount), COLLATERAL_TOKEN_DECIMALS).toString();
            amountOut = parseUnits(roundedSize, COLLATERAL_TOKEN_DECIMALS).toString();
            assetIn = "0"; // USDC
            assetOut = tokenID;
        }

        return {
            assetIn,
            assetOut,
            amountIn,
            amountOut,
            userType: this.deps.userType,
        };
    }

    /**
     * Posts an RFQ request to the server
     */
    public async postRfqRequest(payload: CreateRfqRequestParams): Promise<RfqRequestResponse> {
        this.ensureL2Auth();
        const endpoint = CREATE_RFQ_REQUEST;

        const l2HeaderArgs = {
            method: POST,
            requestPath: endpoint,
            body: JSON.stringify(payload),
        };

        const headers = await createL2Headers(
            this.deps.signer as Wallet | JsonRpcSigner,
            this.deps.creds as ApiKeyCreds,
            l2HeaderArgs,
            this.deps.useServerTime ? await this.deps.getServerTime() : undefined,
        );

        return this.deps.post(`${this.deps.host}${endpoint}`, { headers, data: payload });
    }

    /**
     * Cancels an existing RFQ request
     */
    public async cancelRfqRequest(request: CancelRfqRequestParams): Promise<"OK"> {
        this.ensureL2Auth();
        const endpoint = CANCEL_RFQ_REQUEST;

        const l2HeaderArgs = {
            method: DELETE,
            requestPath: endpoint,
            body: JSON.stringify(request),
        };

        const headers = await createL2Headers(
            this.deps.signer as Wallet | JsonRpcSigner,
            this.deps.creds as ApiKeyCreds,
            l2HeaderArgs,
            this.deps.useServerTime ? await this.deps.getServerTime() : undefined,
        );

        return this.deps.del(`${this.deps.host}${endpoint}`, { headers, data: request });
    }

    /**
     * Gets RFQ requests with optional filtering parameters
     */
    public async getRfqRequests(params?: GetRfqRequestsParams): Promise<RfqRequestsResponse> {
        this.ensureL2Auth();
        const endpoint = GET_RFQ_REQUESTS;

        const l2HeaderArgs = {
            method: GET,
            requestPath: endpoint,
        };

        const headers = await createL2Headers(
            this.deps.signer as Wallet | JsonRpcSigner,
            this.deps.creds as ApiKeyCreds,
            l2HeaderArgs,
            this.deps.useServerTime ? await this.deps.getServerTime() : undefined,
        );

        return this.deps.get(`${this.deps.host}${endpoint}`, 
            { headers, params: parseRfqRequestsParams(params) }) as Promise<RfqRequestsResponse>;
    }

    /**
     * Creates a quote in response to an RFQ request
     */
    public async createRfqQuote(quote: CreateRfqQuoteParams): Promise<RfqQuoteResponse> {
        this.ensureL2Auth();
        const endpoint = CREATE_RFQ_QUOTE;

        // Auto-fill userType from client's signatureType
        const quoteWithUserType = {
            ...quote,
            userType: this.deps.userType,
        };

        const l2HeaderArgs = {
            method: POST,
            requestPath: endpoint,
            body: JSON.stringify(quoteWithUserType),
        };

        const headers = await createL2Headers(
            this.deps.signer as Wallet | JsonRpcSigner,
            this.deps.creds as ApiKeyCreds,
            l2HeaderArgs,
            this.deps.useServerTime ? await this.deps.getServerTime() : undefined,
        );

        return this.deps.post(`${this.deps.host}${endpoint}`, { headers, data: quoteWithUserType });
    }

    /**
     * Gets RFQ quotes with optional filtering parameters
     */
    public async getRfqQuotes(
        params?: GetRfqQuotesParams
    ): Promise<RfqQuotesResponse> {
        this.ensureL2Auth();
        const endpoint = GET_RFQ_QUOTES;

        const l2HeaderArgs = {
            method: GET,
            requestPath: endpoint,
        };

        const headers = await createL2Headers(
            this.deps.signer as Wallet | JsonRpcSigner,
            this.deps.creds as ApiKeyCreds,
            l2HeaderArgs,
            this.deps.useServerTime ? await this.deps.getServerTime() : undefined,
        );

        return this.deps.get(`${this.deps.host}${endpoint}`, 
            { headers, params: parseRfqQuotesParams(params) }) as Promise<RfqQuotesResponse>;
    }

    /**
     * Gets the best quote for a given request ID
     */
    public async getRfqBestQuote(
        params?: GetRfqBestQuoteParams
    ): Promise<RfqQuote> {
        this.ensureL2Auth();
        const endpoint = GET_RFQ_BEST_QUOTE;
        const l2HeaderArgs = {
            method: GET,
            requestPath: endpoint,
        };

        const headers = await createL2Headers(
            this.deps.signer as Wallet | JsonRpcSigner,
            this.deps.creds as ApiKeyCreds,
            l2HeaderArgs,
            this.deps.useServerTime ? await this.deps.getServerTime() : undefined,
        );

        return this.deps.get(`${this.deps.host}${endpoint}`, { headers, params });
    }

    /**
     * Improves an existing quote with a better amountOut
     */
    public async improveRfqQuote(quote: ImproveRfqQuoteParams): Promise<"OK"> {
        this.ensureL2Auth();
        const endpoint = IMPROVE_RFQ_QUOTE;

        const l2HeaderArgs = {
            method: PUT,
            requestPath: endpoint,
            body: JSON.stringify(quote),
        };

        const headers = await createL2Headers(
            this.deps.signer as Wallet | JsonRpcSigner,
            this.deps.creds as ApiKeyCreds,
            l2HeaderArgs,
            this.deps.useServerTime ? await this.deps.getServerTime() : undefined,
        );

        return this.deps.put(`${this.deps.host}${endpoint}`, { headers, data: quote });
    }

    /**
     * Cancels an existing quote
     */
    public async cancelRfqQuote(quote: CancelRfqQuoteParams): Promise<"OK"> {
        this.ensureL2Auth();
        const endpoint = CANCEL_RFQ_QUOTE;

        const l2HeaderArgs = {
            method: DELETE,
            requestPath: endpoint,
            body: JSON.stringify(quote),
        };

        const headers = await createL2Headers(
            this.deps.signer as Wallet | JsonRpcSigner,
            this.deps.creds as ApiKeyCreds,
            l2HeaderArgs,
            this.deps.useServerTime ? await this.deps.getServerTime() : undefined,
        );

        return this.deps.del(`${this.deps.host}${endpoint}`, { headers, data: quote });
    }

    /**
     * Gets the RFQ configuration from the server
     */
    public async rfqConfig(): Promise<any> {
        this.ensureL2Auth();
        const endpoint = RFQ_CONFIG;

        const l2HeaderArgs = {
            method: GET,
            requestPath: endpoint,
        };

        const headers = await createL2Headers(
            this.deps.signer as Wallet | JsonRpcSigner,
            this.deps.creds as ApiKeyCreds,
            l2HeaderArgs,
            this.deps.useServerTime ? await this.deps.getServerTime() : undefined,
        );

        return this.deps.get(`${this.deps.host}${endpoint}`, { headers });
    }

    /**
     * Accepts a quote and creates an order (taker side)
     * This fetches the request details, creates an order, and submits the acceptance
     */
    public async acceptRfqQuote(payload: AcceptQuoteParams): Promise<"OK"> {
        this.ensureL2Auth();
        let rfqQuotes: RfqQuotesResponse;
        try {
            rfqQuotes = await this.getRfqQuotes({
                quoteIds: [payload.quoteId],
            });
            if (!rfqQuotes?.data || rfqQuotes.data.length === 0) {
                throw new Error("RFQ quote not found");
            }
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : "Error fetching RFQ quote");
        }
        const rfqQuote = rfqQuotes.data[0];
        
        // Create an order, matching the quote
        const side = rfqQuote.side === "BUY" ? Side.SELL : Side.BUY;
        const size = rfqQuote.side === "BUY" ? 
            rfqQuote.sizeIn : rfqQuote.sizeOut;

        const order = await this.deps.createOrder({
            tokenID: rfqQuote.token,
            price: rfqQuote.price,
            size: parseFloat(size),
            side: side,
            expiration: payload.expiration,
        });

        if (!order) {
            throw new Error("Error creating order");
        }
        
        const acceptPayload = {
            requestId: payload.requestId,
            quoteId: payload.quoteId,
            owner: (this.deps.creds as ApiKeyCreds).key,
            ...order,
            expiration: parseInt(order.expiration),
            side: side,
            salt: parseInt(order.salt.toString())
        };
        
        const endpoint = RFQ_REQUESTS_ACCEPT;

        const l2HeaderArgs = {
            method: POST,
            requestPath: endpoint,
            body: JSON.stringify(acceptPayload),
        };

        const headers = await createL2Headers(
            this.deps.signer as Wallet | JsonRpcSigner,
            this.deps.creds as ApiKeyCreds,
            l2HeaderArgs,
            this.deps.useServerTime ? await this.deps.getServerTime() : undefined,
        );
        
        return this.deps.post(`${this.deps.host}${endpoint}`, { headers, data: acceptPayload });
    }

    /**
     * Approves a quote and creates an order (maker side)
     * This fetches the quote details, creates an order, and submits the approval
     */
    public async approveRfqOrder(payload: ApproveOrderParams): Promise<"OK"> {
        this.ensureL2Auth();
        let rfqQuotes: RfqQuotesResponse;
        try {
            rfqQuotes = await this.getRfqQuotes({
                quoteIds: [payload.quoteId],
            });
            if (!rfqQuotes?.data || rfqQuotes.data.length === 0) {
                throw new Error("RFQ quote not found");
            }
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : "Error fetching RFQ quote");
        }
        const rfqQuote = rfqQuotes.data[0];
        
        // Create an order based on the quote details
        const side = rfqQuote.side === "BUY" ? Side.BUY : Side.SELL;
        const size = rfqQuote.side === "BUY" ? 
            rfqQuote.sizeIn : rfqQuote.sizeOut;

        const order = await this.deps.createOrder({
            tokenID: rfqQuote.token,
            price: rfqQuote.price,
            size: parseFloat(size),
            side: side,
            expiration: payload.expiration,
        });
        
        if (!order) {
            throw new Error("Error creating order");
        }
        
        const approvePayload = {
            requestId: payload.requestId,
            quoteId: payload.quoteId,
            owner: (this.deps.creds as ApiKeyCreds).key,
            ...order,
            expiration: parseInt(order.expiration),
            side: side,
            salt: parseInt(order.salt.toString())
        };
        
        const endpoint = RFQ_QUOTE_APPROVE;

        const l2HeaderArgs = {
            method: POST,
            requestPath: endpoint,
            body: JSON.stringify(approvePayload),
        };

        const headers = await createL2Headers(
            this.deps.signer as Wallet | JsonRpcSigner,
            this.deps.creds as ApiKeyCreds,
            l2HeaderArgs,
            this.deps.useServerTime ? await this.deps.getServerTime() : undefined,
        );

        return this.deps.post(`${this.deps.host}${endpoint}`, { headers, data: approvePayload });
    }

    /**
     * Ensures L2 authentication is available for RFQ endpoints.
     */
    protected ensureL2Auth(): void {
        if (this.deps.signer === undefined) {
            throw L1_AUTH_UNAVAILABLE_ERROR;
        }

        if (this.deps.creds === undefined) {
            throw L2_AUTH_NOT_AVAILABLE;
        }
    }
}
