import axios, { Method } from "axios";

export const request = async (endpoint: string, method: Method, headers?: any, data?: any): Promise<any> => {
    try {
        const response = await axios({ method, url: endpoint, headers, data });
        return response;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            console.error(err.response?.status);
            console.error(err.response?.statusText);
            console.error(err.response?.data);
        } else {
            console.error(err);
        }
        return null;
    }
};

export const post = async (endpoint: string, headers: any, data?: any): Promise<any> => {
    const resp = await request(endpoint, "POST", headers, data);
    return resp !== null ? resp.data : null;
};

export const get = async (endpoint: string, headers?: any, data?: any): Promise<any> => {
    const resp = await request(endpoint, "GET", headers, data);
    return resp !== null ? resp.data : null;
};
