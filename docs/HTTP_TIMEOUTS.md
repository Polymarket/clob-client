# HTTP Timeouts

This note documents recommended timeout defaults for clients calling CLOB endpoints.

## Recommended defaults

- Connect timeout: 3s
- Read timeout: 10s
- Total request timeout (if supported): 15s

## Rationale

- Keeps UI responsive on bad networks.
- Prevents long-hanging requests from piling up.
- Encourages explicit retries with backoff.

## Retry guidance

- Retry only idempotent requests.
- Use exponential backoff with jitter.
- Cap retries (e.g., 3 attempts).
