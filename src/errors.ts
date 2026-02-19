export class ApiError extends Error {
    status: number | undefined;
    data: any;
    constructor(message: string, status?: number, data?: any) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.data = data;
    }
}

export const L1_AUTH_UNAVAILABLE_ERROR = new Error(
    "Signer is needed to interact with this endpoint!",
);

export const L2_AUTH_NOT_AVAILABLE = new Error(
    "API Credentials are needed to interact with this endpoint!",
);

export const BUILDER_AUTH_NOT_AVAILABLE = new Error(
    "Builder API Credentials needed to interact with this endpoint!",
);

export const BUILDER_AUTH_FAILED = new Error(
    "Builder key auth failed!",
);
