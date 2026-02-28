# RFQ Case Matrix

A small checklist of RFQ scenarios to ensure coverage stays intentional.

## Happy paths

- Quote request -> quote response -> fill
- Partial fill (if supported)
- Multiple quotes, best-price chosen

## Failure paths

- Expired quote rejected
- Invalid signature rejected
- Insufficient balance
- Market closed / halted

## Network issues

- Timeout on quote fetch
- Retry succeeds
- Retry exhausted -> clear error surfaced
