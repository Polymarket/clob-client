// Server Time
export const TIME = "/time";

// API Key endpoints
export const CREATE_API_KEY = "/auth/api-key";
export const GET_API_KEYS = "/auth/api-keys";
export const DELETE_API_KEY = "/auth/api-key";
export const DERIVE_API_KEY = "/auth/derive-api-key";
export const CLOSED_ONLY = "/auth/ban-status/closed-only";

// Builder API Key endpoints
export const CREATE_BUILDER_API_KEY = "/auth/builder-api-key";
export const GET_BUILDER_API_KEYS = "/auth/builder-api-key";
export const REVOKE_BUILDER_API_KEY = "/auth/builder-api-key";

// Markets
export const GET_SAMPLING_SIMPLIFIED_MARKETS = "/sampling-simplified-markets";
export const GET_SAMPLING_MARKETS = "/sampling-markets";
export const GET_SIMPLIFIED_MARKETS = "/simplified-markets";
export const GET_MARKETS = "/markets";
export const GET_MARKET = "/markets/";
export const GET_ORDER_BOOK = "/book";
export const GET_ORDER_BOOKS = "/books";
export const GET_MIDPOINT = "/midpoint";
export const GET_MIDPOINTS = "/midpoints";
export const GET_PRICE = "/price";
export const GET_PRICES = "/prices";
export const GET_SPREAD = "/spread";
export const GET_SPREADS = "/spreads";
export const GET_LAST_TRADE_PRICE = "/last-trade-price";
export const GET_LAST_TRADES_PRICES = "/last-trades-prices";
export const GET_TICK_SIZE = "/tick-size";
export const GET_NEG_RISK = "/neg-risk";
export const GET_FEE_RATE = "/fee-rate";

// Order endpoints
export const POST_ORDER = "/order";
export const POST_ORDERS = "/orders";
export const CANCEL_ORDER = "/order";
export const CANCEL_ORDERS = "/orders";
export const GET_ORDER = "/data/order/";
export const CANCEL_ALL = "/cancel-all";
export const CANCEL_MARKET_ORDERS = "/cancel-market-orders";
export const GET_OPEN_ORDERS = "/data/orders";
export const GET_TRADES = "/data/trades";
export const IS_ORDER_SCORING = "/order-scoring";
export const ARE_ORDERS_SCORING = "/orders-scoring";

// Price history
export const GET_PRICES_HISTORY = "/prices-history";

// Notifications
export const GET_NOTIFICATIONS = "/notifications";
export const DROP_NOTIFICATIONS = "/notifications";

// Balance
export const GET_BALANCE_ALLOWANCE = "/balance-allowance";
export const UPDATE_BALANCE_ALLOWANCE = "/balance-allowance/update";

// Live activity
export const GET_MARKET_TRADES_EVENTS = "/live-activity/events/";

// Rewards
export const GET_EARNINGS_FOR_USER_FOR_DAY = "/rewards/user";
export const GET_TOTAL_EARNINGS_FOR_USER_FOR_DAY = "/rewards/user/total";
export const GET_LIQUIDITY_REWARD_PERCENTAGES = "/rewards/user/percentages";
export const GET_REWARDS_MARKETS_CURRENT = "/rewards/markets/current";
export const GET_REWARDS_MARKETS = "/rewards/markets/";
export const GET_REWARDS_EARNINGS_PERCENTAGES = "/rewards/user/markets";

// Builder endpoints
export const GET_BUILDER_TRADES = "/builder/trades";
