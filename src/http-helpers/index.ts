/* eslint-disable max-depth */
import axios from "axios";
import type { Method } from "axios";
import type { DropNotificationParams, OrdersScoringParams, SimpleHeaders } from "../types.ts";
import { isBrowser } from "browser-or-node";

export const GET = "GET";
export const POST = "POST";
export const DELETE = "DELETE";
export const PUT = "PUT";

const overloadHeaders = (method: Method, headers?: SimpleHeaders) => {
    if (isBrowser) {
        return;
    }

    if (!headers || typeof headers === undefined) {
        headers = {};
    }

    if (headers) {
        headers["User-Agent"] = `@polymarket/clob-client`;
        headers["Accept"] = "*/*";
        headers["Connection"] = "keep-alive";
        headers["Content-Type"] = "application/json";

        if (method === GET) {
            headers["Accept-Encoding"] = "gzip";
        }
    }
};

// Create axios instance with timeout
const axiosInstance = axios.create({
    timeout: 8000, // 8 seconds for trading systems
});

// Simple retry logic without external dependency
const requestWithRetry = async (config: any, shouldRetry: boolean = false, maxRetries = 2): Promise<any> => {
    if (!shouldRetry) {
        // If retry is disabled, just make a single request
        return await axiosInstance(config);
    }

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await axiosInstance(config);
        } catch (error) {
            const isLastAttempt = attempt === maxRetries;
            const shouldRetryError = axios.isAxiosError(error) && (
                error.code === 'ECONNABORTED' ||
                error.message === 'Network Error' ||
                error.response?.status === 0 ||
                (error.response?.status !== undefined && error.response.status >= 500 && error.response.status <= 599)
            );

            if (isLastAttempt || !shouldRetryError) {
                throw error;
            }

            // Wait before retry: 500ms * attempt (0ms, 500ms, 1000ms)
            await new Promise(resolve => setTimeout(resolve, 500 * attempt));
        }
    }
};

export const request = async (
    endpoint: string,
    method: Method,
    headers?: SimpleHeaders,
    data?: any,
    params?: any,
    retryOnError?: boolean,
): Promise<any> => {
    overloadHeaders(method, headers);
    return await requestWithRetry({ method, url: endpoint, headers, data, params }, retryOnError);
};

export type QueryParams = Record<string, any>;

export interface RequestOptions {
    headers?: SimpleHeaders;
    data?: any;
    params?: QueryParams;
    retryOnError?: boolean;
}

export const post = async (endpoint: string, options?: RequestOptions): Promise<any> => {
    try {
        const resp = await request(
            endpoint,
            POST,
            options?.headers,
            options?.data,
            options?.params,
            options?.retryOnError,
        );
        return resp.data;
    } catch (err: unknown) {
        return errorHandling(err);
    }
};

export const get = async (endpoint: string, options?: RequestOptions): Promise<any> => {
    try {
        const resp = await request(endpoint, GET, options?.headers, options?.data, options?.params, options?.retryOnError);
        return resp.data;
    } catch (err: unknown) {
        return errorHandling(err);
    }
};

export const del = async (endpoint: string, options?: RequestOptions): Promise<any> => {
    try {
        const resp = await request(
            endpoint,
            DELETE,
            options?.headers,
            options?.data,
            options?.params,
            options?.retryOnError,
        );
        return resp.data;
    } catch (err: unknown) {
        return errorHandling(err);
    }
};

const errorHandling = (err: unknown) => {
    if (axios.isAxiosError(err)) {
        // Enhanced logging for network errors and timeouts
        if (err.code === 'ECONNABORTED') {
            console.error(
                "[CLOB Client] request timeout",
                JSON.stringify({
                    error: "Request timeout",
                    url: err.config?.url,
                    timeout: err.config?.timeout,
                }),
            );
            return { error: "Request timeout", retryable: true };
        }

        if (err.message === 'Network Error' || err.response?.status === 0) {
            console.error(
                "[CLOB Client] network error",
                JSON.stringify({
                    error: "Network error",
                    url: err.config?.url,
                    message: err.message,
                }),
            );
            return { error: "Network error", retryable: true };
        }

        if (err.response) {
            console.error(
                "[CLOB Client] request error",
                JSON.stringify({
                    status: err.response?.status,
                    statusText: err.response?.statusText,
                    data: err.response?.data,
                    config: err.response?.config,
                }),
            );
            if (err.response?.data) {
                if (
                    typeof err.response?.data === "string" ||
                    err.response?.data instanceof String
                ) {
                    return { error: err.response?.data, status: err.response?.status };
                }
                if (!Object.prototype.hasOwnProperty.call(err.response?.data, "error")) {
                    return { error: err.response?.data, status: err.response?.status };
                }
                // in this case the field 'error' is included
                return { ...err.response?.data, status: err.response?.status };
            }
        }

        if (err.message) {
            console.error(
                "[CLOB Client] request error",
                JSON.stringify({
                    error: err.message,
                }),
            );
            return { error: err.message };
        }
    }

    console.error("[CLOB Client] request error", err);
    return { error: err };
};

export const parseOrdersScoringParams = (orderScoringParams?: OrdersScoringParams): QueryParams => {
    const params: QueryParams = {};
    if (orderScoringParams !== undefined) {
        if (orderScoringParams.orderIds !== undefined) {
            params["order_ids"] = orderScoringParams?.orderIds.join(",");
        }
    }
    return params;
};

export const parseDropNotificationParams = (
    dropNotificationParams?: DropNotificationParams,
): QueryParams => {
    const params: QueryParams = {};
    if (dropNotificationParams !== undefined) {
        if (dropNotificationParams.ids !== undefined) {
            params["ids"] = dropNotificationParams?.ids.join(",");
        }
    }
    return params;
};
