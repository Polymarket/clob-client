import axios, { Method } from "axios";
import { FilterParams, TradeNotificationParams, TradeParams } from "src/types";
import { OpenOrderParams } from "../types";
import { name, version } from "./../../package.json";

export const GET = "GET";
export const POST = "POST";
export const DELETE = "DELETE";
export const PUT = "PUT";

const overloadHeaders = (method: Method, headers: Record<string, string | number | boolean>) => {
    headers["User-Agent"] = `${name}@${version}`;
    headers["Accept"] = "*/*";
    headers["Connection"] = "keep-alive";
    headers["Content-Type"] = "application/json";

    if (method === GET) {
        headers["Accept-Encoding"] = "gzip";
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
            console.error("request error", {
                status: err.response?.status,
                statusText: err.response?.statusText,
                data: err.response?.data,
            });
            return err.response?.data;
        }
        console.error(err);

        return { error: err };
    }
};

export const post = async (
    endpoint: string,
    headers: any,
    data?: any,
    params?: any,
): Promise<any> => {
    const resp = await request(endpoint, POST, headers, data, params);
    return "error" in resp ? resp : resp.data;
};

export const get = async (
    endpoint: string,
    headers?: any,
    data?: any,
    params?: any,
): Promise<any> => {
    const resp = await request(endpoint, GET, headers, data, params);
    return "error" in resp ? resp : resp.data;
};

export const del = async (
    endpoint: string,
    headers?: any,
    data?: any,
    params?: any,
): Promise<any> => {
    const resp = await request(endpoint, DELETE, headers, data, params);
    return "error" in resp ? resp : resp.data;
};

export const buildQueryParams = (url: string, param: string, value: string): string => {
    let urlWithParams = url;
    const last = url.charAt(url.length - 1);
    // Check the last char in the url string
    // if ?, append the param directly: api.com?param=value
    if (last === "?") {
        urlWithParams = `${urlWithParams}${param}=${value}`;
    } else {
        // else append "&" then the param: api.com?param1=value1&param2=value2
        urlWithParams = `${urlWithParams}&${param}=${value}`;
    }
    return urlWithParams;
};

export const addFilterParamsToUrl = (baseUrl: string, params?: FilterParams): string => {
    let url = baseUrl;
    if (params !== undefined) {
        url = `${url}?`;
        if (params.owner !== undefined) {
            url = buildQueryParams(url, "owner", params.owner as string);
        }
        if (params.max !== undefined) {
            url = buildQueryParams(url, "max", `${params.max}`);
        }
        if (params.market !== undefined) {
            url = buildQueryParams(url, "market", params.market as string);
        }
        if (params.side !== undefined) {
            url = buildQueryParams(url, "side", params.side as string);
        }
        if (params.startTs !== undefined) {
            url = buildQueryParams(url, "startTs", `${params.startTs}`);
        }
        if (params.endTs !== undefined) {
            url = buildQueryParams(url, "endTs", `${params.endTs}`);
        }
        if (params.minValue !== undefined) {
            url = buildQueryParams(url, "minValue", `${params.minValue}`);
        }
        if (params.fidelity !== undefined) {
            url = buildQueryParams(url, "fidelity", `${params.fidelity}`);
        }
    }
    return url;
};

export const addOpenOrderParamsToUrl = (baseUrl: string, params?: OpenOrderParams): string => {
    let url = baseUrl;
    if (params !== undefined) {
        url = `${url}?`;
        if (params.market !== undefined) {
            url = buildQueryParams(url, "market", params.market);
        }
        if (params.asset_id !== undefined) {
            url = buildQueryParams(url, "asset_id", params.asset_id);
        }
        if (params.owner !== undefined) {
            url = buildQueryParams(url, "owner", params.owner);
        }
        if (params.id !== undefined) {
            url = buildQueryParams(url, "id", params.id as string);
        }
    }
    return url;
};

export const addTradeParamsToUrl = (baseUrl: string, params?: TradeParams): string => {
    let url = baseUrl;
    if (params !== undefined) {
        url = `${url}?`;
        if (params.owner !== undefined) {
            url = buildQueryParams(url, "owner", params.owner as string);
        }
        if (params.market !== undefined) {
            url = buildQueryParams(url, "market", params.market as string);
        }
        if (params.asset_id !== undefined) {
            url = buildQueryParams(url, "asset_id", params.asset_id as string);
        }
        if (params.maker !== undefined) {
            url = buildQueryParams(url, "maker", `${params.maker}`);
        }
        if (params.taker !== undefined) {
            url = buildQueryParams(url, "taker", `${params.taker}`);
        }
        if (params.id !== undefined) {
            url = buildQueryParams(url, "id", `${params.id}`);
        }
        if (params.limit !== undefined) {
            url = buildQueryParams(url, "limit", `${params.limit}`);
        }
        if (params.before !== undefined) {
            url = buildQueryParams(url, "before", `${params.before}`);
        }
        if (params.after !== undefined) {
            url = buildQueryParams(url, "after", `${params.after}`);
        }
    }
    return url;
};

export const addTradeNotificationParamsToUrl = (
    baseUrl: string,
    params?: TradeNotificationParams,
): string => {
    let url = baseUrl;
    if (params !== undefined) {
        url = `${url}?`;
        if (params.index !== undefined) {
            url = buildQueryParams(url, "index", params.index.toString());
        }
    }
    return url;
};
