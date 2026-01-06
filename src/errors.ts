export type ClobApiErrorCode =
  | "UNAUTHORIZED"
  | "INVALID_ORDER"
  | "INSUFFICIENT_BALANCE"
  | "MARKET_CLOSED"
  | "RATE_LIMITED"
  | "UNKNOWN_ERROR";

export class ClobApiError extends Error {
  public readonly code: ClobApiErrorCode;
  public readonly status?: number;
  public readonly details?: unknown;

  constructor(
    message: string,
    code: ClobApiErrorCode,
    status?: number,
    details?: unknown,
  ) {
    super(message);
    this.name = "ClobApiError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export function mapApiError(response: any, status?: number): ClobApiError {
  const code = response?.errorCode ?? "UNKNOWN_ERROR";
  const message =
    response?.message ??
    response?.error ??
    "Unexpected error returned by CLOB API";

  return new ClobApiError(
    message,
    code as ClobApiErrorCode,
    status,
    response,
  );
}
