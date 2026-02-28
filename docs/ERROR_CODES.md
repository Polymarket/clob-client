# Error Codes Reference

This document lists common runtime error codes and what they mean.

## Codes

- `WS_TIMEOUT` – A WebSocket request exceeded the configured timeout.
- `INVALID_MARKET_ID` – The provided market identifier failed validation.
- `RPC_UNAVAILABLE` – The RPC endpoint did not respond or returned a network error.

## Recommended handling

- Retry transient errors with backoff (`WS_TIMEOUT`, `RPC_UNAVAILABLE`).
- Treat `INVALID_MARKET_ID` as a caller error and fail fast.
