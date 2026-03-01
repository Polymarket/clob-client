const MARKET_ID_RE = /^[a-zA-Z0-9_-]{6,128}$/

export function validateMarketId(value: string): void {
  if (!MARKET_ID_RE.test(value)) {
    throw new Error('Invalid market id format')
  }
}
