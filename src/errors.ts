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
```ts
// src/errors.ts
export class ApiError extends Error {
  public statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}
