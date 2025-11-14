import { Wallet } from "@ethersproject/wallet";
import { JsonRpcSigner } from "@ethersproject/providers";
import {
    ApiKeyCreds,
    CreateOrderOptions,
    RfqUserOrder,
    RfqQuoteParams,
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
    Side,
} from "./types";
import { ClobClient } from "./client";
import { createL2Headers } from "./headers";
import {
    DELETE,
    GET,
    POST,
    PUT,
    parseRfqQuotesParams,
    parseRfqRequestsParams,
} from "./http-helpers";
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
} from "./endpoints";
import { ROUNDING_CONFIG } from "./order-builder/helpers";
import { roundDown, roundNormal } from "./utilities";
import { parseUnits } from "@ethersproject/units";
import { COLLATERAL_TOKEN_DECIMALS } from "./config";

/**
 * RfqClient extends ClobClient with RFQ (Request for Quote) functionality
 * 
 * RFQ enables users to request quotes from market makers and accept/approve quotes
 * in a bilateral trading flow, separate from the standard order book.
 */
export class RfqClient extends ClobClient {
    /**
     * Creates an RFQ request from user order parameters
     * Converts the order into the proper RFQ request format with asset amounts
     */
    public async createRfqRequest(
        userOrder: RfqUserOrder,
        options?: Partial<CreateOrderOptions>,
    ): Promise<RfqQuoteParams> {
        const { tokenID, price, side, size } = userOrder;
        const tickSize = await this._resolveTickSize(tokenID, options?.tickSize);
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
            requestId: "", // Server will generate this
            assetIn,
            assetOut,
            amountIn,
            amountOut,
            userType: this.orderBuilder.signatureType,
        };
    }

    /**
     * Posts an RFQ request to the server
     */
    public async postRfqRequest(payload: RfqQuoteParams): Promise<any> {
        this.canL2Auth();
        const endpoint = CREATE_RFQ_REQUEST;

        const l2HeaderArgs = {
            method: POST,
            requestPath: endpoint,
            body: JSON.stringify(payload),
        };

        const headers = await createL2Headers(
            this.signer as Wallet | JsonRpcSigner,
            this.creds as ApiKeyCreds,
            l2HeaderArgs,
            this.useServerTime ? await this.getServerTime() : undefined,
        );

        return this.post(`${this.host}${endpoint}`, { headers, data: payload });
    }

    /**
     * Cancels an existing RFQ request
     */
    public async cancelRfqRequest(request: CancelRfqRequestParams): Promise<void> {
        this.canL2Auth();
        const endpoint = CANCEL_RFQ_REQUEST;
        const payload = JSON.stringify(request);

        const l2HeaderArgs = {
            method: DELETE,
            requestPath: endpoint,
            body: payload,
        };

        const headers = await createL2Headers(
            this.signer as Wallet | JsonRpcSigner,
            this.creds as ApiKeyCreds,
            l2HeaderArgs,
            this.useServerTime ? await this.getServerTime() : undefined,
        );

        return this.del(`${this.host}${endpoint}`, { headers, data: payload });
    }

    /**
     * Gets RFQ requests with optional filtering parameters
     */
    public async getRfqRequests(params?: GetRfqRequestsParams): Promise<RfqRequestsResponse> {
        this.canL2Auth();
        const endpoint = GET_RFQ_REQUESTS;

        const l2HeaderArgs = {
            method: GET,
            requestPath: endpoint,
        };

        const headers = await createL2Headers(
            this.signer as Wallet | JsonRpcSigner,
            this.creds as ApiKeyCreds,
            l2HeaderArgs,
            this.useServerTime ? await this.getServerTime() : undefined,
        );

        return this.get(`${this.host}${endpoint}`, 
            { headers, params: parseRfqRequestsParams(params) }) as Promise<RfqRequestsResponse>;
    }

    /**
     * Creates a quote in response to an RFQ request
     */
    public async createRfqQuote(quote: CreateRfqQuoteParams): Promise<any> {
        this.canL2Auth();
        const endpoint = CREATE_RFQ_QUOTE;

        // Auto-fill userType from client's signatureType
        const quoteWithUserType = {
            ...quote,
            userType: this.orderBuilder.signatureType,
        };

        const payload = JSON.stringify(quoteWithUserType);

        const l2HeaderArgs = {
            method: POST,
            requestPath: endpoint,
            body: payload,
        };

        const headers = await createL2Headers(
            this.signer as Wallet | JsonRpcSigner,
            this.creds as ApiKeyCreds,
            l2HeaderArgs,
            this.useServerTime ? await this.getServerTime() : undefined,
        );

        return this.post(`${this.host}${endpoint}`, { headers, data: payload });
    }

    /**
     * Gets RFQ quotes with optional filtering parameters
     */
    public async getRfqQuotes(
        params?: GetRfqQuotesParams
    ): Promise<RfqQuotesResponse> {
        this.canL2Auth();
        const endpoint = GET_RFQ_QUOTES;

        const l2HeaderArgs = {
            method: GET,
            requestPath: endpoint,
        };

        const headers = await createL2Headers(
            this.signer as Wallet | JsonRpcSigner,
            this.creds as ApiKeyCreds,
            l2HeaderArgs,
            this.useServerTime ? await this.getServerTime() : undefined,
        );

        return this.get(`${this.host}${endpoint}`, 
            { headers, params: parseRfqQuotesParams(params) }) as Promise<RfqQuotesResponse>;
    }

    /**
     * Gets the best quote for a given request ID
     */
    public async getRfqBestQuote(
        params?: GetRfqBestQuoteParams
    ): Promise<any> {
        this.canL2Auth();
        const endpoint = GET_RFQ_BEST_QUOTE;
        const l2HeaderArgs = {
            method: GET,
            requestPath: endpoint,
        };

        const headers = await createL2Headers(
            this.signer as Wallet | JsonRpcSigner,
            this.creds as ApiKeyCreds,
            l2HeaderArgs,
            this.useServerTime ? await this.getServerTime() : undefined,
        );

        return this.get(`${this.host}${endpoint}`, { headers, params });
    }

    /**
     * Improves an existing quote with a better amountOut
     */
    public async improveRfqQuote(quote: ImproveRfqQuoteParams): Promise<any> {
        this.canL2Auth();
        const endpoint = IMPROVE_RFQ_QUOTE;
        const payload = JSON.stringify(quote);

        const l2HeaderArgs = {
            method: PUT,
            requestPath: endpoint,
            body: payload,
        };

        const headers = await createL2Headers(
            this.signer as Wallet | JsonRpcSigner,
            this.creds as ApiKeyCreds,
            l2HeaderArgs,
            this.useServerTime ? await this.getServerTime() : undefined,
        );

        return this.put(`${this.host}${endpoint}`, { headers, data: payload });
    }

    /**
     * Cancels an existing quote
     */
    public async cancelRfqQuote(quote: CancelRfqQuoteParams): Promise<any> {
        this.canL2Auth();
        const endpoint = CANCEL_RFQ_QUOTE;
        const payload = JSON.stringify(quote);

        const l2HeaderArgs = {
            method: DELETE,
            requestPath: endpoint,
            body: payload,
        };

        const headers = await createL2Headers(
            this.signer as Wallet | JsonRpcSigner,
            this.creds as ApiKeyCreds,
            l2HeaderArgs,
            this.useServerTime ? await this.getServerTime() : undefined,
        );

        return this.del(`${this.host}${endpoint}`, { headers, data: payload });
    }

    /**
     * Gets the RFQ configuration from the server
     */
    public async rfqConfig(): Promise<any> {
        this.canL2Auth();
        const endpoint = RFQ_CONFIG;

        const l2HeaderArgs = {
            method: GET,
            requestPath: endpoint,
        };

        const headers = await createL2Headers(
            this.signer as Wallet | JsonRpcSigner,
            this.creds as ApiKeyCreds,
            l2HeaderArgs,
            this.useServerTime ? await this.getServerTime() : undefined,
        );

        return this.get(`${this.host}${endpoint}`, { headers });
    }

    /**
     * Accepts a quote and creates an order (taker side)
     * This fetches the request details, creates an order, and submits the acceptance
     */
    public async acceptRfqQuote(payload: AcceptQuoteParams): Promise<any> {
        this.canL2Auth();
        let rfqRequests: RfqRequestsResponse;
        try {
            rfqRequests = await this.getRfqRequests({
                requestIds: [payload.requestId],
            });
            if (!rfqRequests?.data || rfqRequests.data.length === 0) {
                return { error: "RFQ request not found" };
            }
        } catch (error) {
            return { error: error instanceof Error ? error.message : "Error fetching RFQ request" };
        }
        const rfqRequest = rfqRequests.data[0];
        
        // Create an order based on the request details
        const side = rfqRequest.side === "BUY" ? Side.BUY : Side.SELL;
        const size = rfqRequest.side === "BUY" ? 
            rfqRequest.sizeIn : rfqRequest.sizeOut;

        const order = await this.createOrder({
            tokenID: rfqRequest.token,
            price: rfqRequest.price,
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
            owner: this.creds?.key,
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
            this.signer as Wallet | JsonRpcSigner,
            this.creds as ApiKeyCreds,
            l2HeaderArgs,
            this.useServerTime ? await this.getServerTime() : undefined,
        );
        
        return this.post(`${this.host}${endpoint}`, { headers, data: acceptPayload });
    }

    /**
     * Approves a quote and creates an order (maker side)
     * This fetches the quote details, creates an order, and submits the approval
     */
    public async approveRfqOrder(payload: ApproveOrderParams): Promise<any> {
        this.canL2Auth();
        let rfqQuotes: RfqQuotesResponse;
        try {
            rfqQuotes = await this.getRfqQuotes({
                quoteIds: [payload.quoteId],
            });
            if (!rfqQuotes?.data || rfqQuotes.data.length === 0) {
                return { error: "RFQ quote not found" };
            }
        } catch (error) {
            return { error: error instanceof Error ? error.message : "Error fetching RFQ quote" };
        }
        const rfqQuote = rfqQuotes.data[0];
        
        // Create an order on the opposite side of the quote
        const side = rfqQuote.side === "BUY" ? Side.SELL : Side.BUY;
        const size = rfqQuote.side === "BUY" ? 
            rfqQuote.sizeIn : rfqQuote.sizeOut;

        const order = await this.createOrder({
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
            owner: this.creds?.key,
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
            this.signer as Wallet | JsonRpcSigner,
            this.creds as ApiKeyCreds,
            l2HeaderArgs,
            this.useServerTime ? await this.getServerTime() : undefined,
        );

        return this.post(`${this.host}${endpoint}`, { headers, data: approvePayload });
    }

    /**
     * Protected method to support PUT requests
     */
    protected async put(endpoint: string, options?: any) {
        return this.post(endpoint, options); // Reuse base post with PUT method
    }
}
