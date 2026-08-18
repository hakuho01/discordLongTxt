export const APP_NAME = "Discord LongTxt";

export const POST_BODY_MAX_LENGTH = 50_000;
export const POST_TITLE_MAX_LENGTH = 200;

export const RATE_LIMIT = {
  createPost: { limit: 10, windowMs: 60 * 60 * 1000 },
  apiByIp: { limit: 20, windowMs: 60 * 1000 },
} as const;
