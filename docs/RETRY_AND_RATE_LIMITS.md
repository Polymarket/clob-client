Retry and rate limit guidance

When interacting with the CLOB API, clients should implement sensible retry logic.

Defaults

- Max retries: 3

- Initial backoff: 250ms

- Backoff strategy: exponential

Retry on

- HTTP 429 (rate limit)

- 502, 503, 504 responses

- Network timeouts

Do not retry on invalid request errors or auth failures.

Use client-side throttling to avoid hitting limits.
