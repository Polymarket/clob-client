# RFQ Test Fixtures

This branch includes RFQ-related behavior. To keep tests robust:

## Do

- Use deterministic fixtures (no time-based IDs unless mocked).
- Keep fixtures small and composable.
- Prefer explicit assertions over snapshot-only checks.

## Don't

- Commit secrets or real API keys.
- Depend on live endpoints in unit tests.

## Naming

- `rfq_<scenario>_<expected>`
