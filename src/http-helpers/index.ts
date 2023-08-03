import axios, { AxiosRequestHeaders, Method } from "axios";
import { OrdersScoringParams } from "src/types";
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
    try {
        overloadHeaders(method, headers);
        const response = await axios({ method, url: endpoint, headers, data, params });
        return response;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            if (err.response) {
                console.error("request error", {
                    status: err.response?.status,
                    statusText: err.response?.statusText,
                    data: err.response?.data,
                });
                return err.response?.data;
            } else {
                return { error: "connection error" };
            }
        }

        return { error: err };
    }
};

export type QueryParams = Record<string, any>;

export interface RequestOptions {
    headers?: AxiosRequestHeaders;
    data?: any;
    params?: QueryParams;
}

export const post = async (endpoint: string, options?: RequestOptions): Promise<any> => {
    const resp = await request(endpoint, POST, options?.headers, options?.data, options?.params);
    return "error" in resp ? resp : resp.data;
};

export const get = async (endpoint: string, options?: RequestOptions): Promise<any> => {
    const resp = await request(endpoint, GET, options?.headers, options?.data, options?.params);
    return "error" in resp ? resp : resp.data;
};

export const del = async (endpoint: string, options?: RequestOptions): Promise<any> => {
    const resp = await request(endpoint, DELETE, options?.headers, options?.data, options?.params);
    return "error" in resp ? resp : resp.data;
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
