// Server Time
export const TIME = "/time";

// API Key endpoints
export const CREATE_API_KEY = "/auth/api-key";
export const GET_API_KEYS = "/auth/api-keys";
export const DELETE_API_KEY = "/auth/api-key";
export const DERIVE_API_KEY = "/auth/derive-api-key";

// Markets
export const GET_SAMPLING_SIMPLIFIED_MARKETS = "/sampling-simplified-markets";
export const GET_SAMPLING_MARKETS = "/sampling-markets";
export const GET_SIMPLIFIED_MARKETS = "/simplified-markets";
export const GET_MARKETS = "/markets";
export const GET_MARKET = "/markets/";
export const GET_ORDER_BOOK = "/book";
export const GET_MIDPOINT = "/midpoint";
export const GET_PRICE = "/price";
export const GET_LAST_TRADE_PRICE = "/last-trade-price";
export const GET_TICK_SIZE = "/tick-size";

// Order endpoints
export const POST_ORDER = "/order";
export const CANCEL_ORDER = "/order";
export const CANCEL_ORDERS = "/orders";
export const GET_ORDER = "/order/";
export const CANCEL_ALL = "/cancel-all";
export const CANCEL_MARKET_ORDERS = "/cancel-market-orders";
export const GET_LARGE_ORDERS = "/large-orders";
export const GET_OPEN_ORDERS = "/orders";
export const GET_TRADES = "/trades";
export const IS_ORDER_SCORING = "/order-scoring";
export const ARE_ORDERS_SCORING = "/orders-scoring";

// Price history
export const GET_PRICES_HISTORY = "/prices-history";

// Notifications
export const GET_TRADE_NOTIFICATIONS = "/trade-notifications";
export const DROP_TRADE_NOTIFICATIONS = "/drop-trade-notifications";

// Balance
export const GET_BALANCE_ALLOWANCE = "/balance-allowance";

// Live activity
export const GET_MARKET_TRADES_EVENTS = "/live-activity/events/";
