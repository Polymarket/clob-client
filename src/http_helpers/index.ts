import axios, { Method } from "axios";

export const request = async (endpoint: string, method: Method, headers?: any, data?: any): Promise<any> => {
    return axios({
        method,
        url: endpoint,
        headers,
        data,
    });
};

export const post = async (endpoint: string, headers: any, data?: any): Promise<any> => {
    return request(endpoint, "POST", headers, data);
};

export const get = async (endpoint: string, headers?: any, data?: any): Promise<any> => {
    return request(endpoint, "GET", headers, data);
};
