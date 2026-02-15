# Retry and Rate Limit Guidance

This document describes recommended retry behavior when interacting with the CLOB API.

## Rate limits

Clients may be rate limited during high traffic periods.
Rate limiting typically returns HTTP 429 responses.

## Retry strategy

Recommended defaults:

- Max retries: 3
- Initial delay: 250 ms
- Backoff: exponential
- Retry on:
  - 429
  - 502, 503, 504
  - network timeouts

Do not retry on:
- invalid requests
- authentication failures
- order validation errors

## Client responsibility

- Avoid retrying non-idempotent operations blindly.
- Log retry attempts with request context.
- Consider client-side throttling for bursty workloads.

Following these guidelines helps avoid cascading failures and unnecessary load.
