import axios, { Method } from "axios";

export const GET = "GET";
export const POST = "POST";
export const DELETE = "DELETE";
export const PUT = "PUT";

export const request = async (
    endpoint: string,
    method: Method,
    headers?: any,
    data?: any,
    params?: any,
): Promise<any> => {
    try {
        const response = await axios({ method, url: endpoint, headers, data, params });
        return response;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            console.error(err);
            console.error(err.response?.status);
            console.error(err.response?.statusText);
            console.error(err.response?.data);
            return { error: err.response?.data };
        }
        console.error(err);
        return { error: err };
    }
};

export const post = async (endpoint: string, headers: any, data?: any, params?: any): Promise<any> => {
    const resp = await request(endpoint, POST, headers, data, params);
    return "error" in resp ? resp : resp.data;
};

export const get = async (endpoint: string, headers?: any, data?: any, params?: any): Promise<any> => {
    const resp = await request(endpoint, GET, headers, data, params);
    return "error" in resp ? resp : resp.data;
};

export const del = async (endpoint: string, headers?: any, data?: any, params?: any): Promise<any> => {
    const resp = await request(endpoint, DELETE, headers, data, params);
    return "error" in resp ? resp : resp.data;
};
