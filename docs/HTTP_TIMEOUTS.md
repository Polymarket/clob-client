# HTTP Timeouts

Recommended defaults for clients calling CLOB endpoints:

- Connect timeout: 3s
- Read timeout: 10s
- Total timeout: 15s (if supported)

Retry guidance:
- Retry only idempotent requests
- Use exponential backoff with jitter
- Cap retries (e.g., 3 attempts)
