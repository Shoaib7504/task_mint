/**
 * App-wide Constants
 * 
 * Centralizing these values prevents typos and magic strings
 * across components and pages.
 */

// User roles in TaskMint
export const ROLES = {
  WORKER: "WORKER",
  BUYER: "BUYER",
  ADMIN: "ADMIN",
};

// Task and submission statuses
export const STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  COMPLETED: "COMPLETED",
};

// Default coin exchange and pagination values
export const DEFAULTS = {
  ITEMS_PER_PAGE: 10,
  COIN_TO_USD_RATIO: 0.05, // e.g. 20 coins = $1 USD
  MIN_WITHDRAWAL_COINS: 200,
};

// Common navigation paths
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  DASHBOARD_WORKER: "/dashboard/worker",
  DASHBOARD_BUYER: "/dashboard/buyer",
  DASHBOARD_ADMIN: "/dashboard/admin",
};

const constants = {
  ROLES,
  STATUS,
  DEFAULTS,
  ROUTES,
};

export default constants;
