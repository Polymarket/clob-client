/* eslint-disable max-depth */
import axios, { AxiosRequestHeaders, Method } from "axios";
import { DropNotificationParams, OrdersScoringParams } from "src/types";
import { isBrowser } from "browser-or-node";

export const GET = "GET";
export const POST = "POST";
export const DELETE = "DELETE";
export const PUT = "PUT";

const overloadHeaders = (method: Method, headers?: Record<string, string | number | boolean>) => {
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

export const request = async (
    endpoint: string,
    method: Method,
    headers?: any,
    data?: any,
    params?: any,
): Promise<any> => {
    overloadHeaders(method, headers);
    return await axios({ method, url: endpoint, headers, data, params });
};

export type QueryParams = Record<string, any>;

export interface RequestOptions {
    headers?: AxiosRequestHeaders;
    data?: any;
    params?: QueryParams;
}

export const post = async (endpoint: string, options?: RequestOptions): Promise<any> => {
    try {
        const resp = await request(
            endpoint,
            POST,
            options?.headers,
            options?.data,
            options?.params,
        );
        return resp.data;
    } catch (err: unknown) {
        return errorHandling(err);
    }
};

export const get = async (endpoint: string, options?: RequestOptions): Promise<any> => {
    try {
        const resp = await request(endpoint, GET, options?.headers, options?.data, options?.params);
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
        );
        return resp.data;
    } catch (err: unknown) {
        return errorHandling(err);
    }
};

const errorHandling = (err: unknown) => {
    if (axios.isAxiosError(err)) {
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
