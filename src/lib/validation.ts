import {
  POST_BODY_MAX_LENGTH,
  POST_TITLE_MAX_LENGTH,
} from "@/lib/constants";

export type PostInput = {
  title: string;
  body: string;
};

export function validatePostInput(input: unknown):
  | { ok: true; data: PostInput }
  | { ok: false; error: string } {
  if (!input || typeof input !== "object") {
    return { ok: false, error: "Invalid request body" };
  }

  const { title, body } = input as Record<string, unknown>;

  if (typeof title !== "string" || title.trim().length === 0) {
    return { ok: false, error: "Title is required" };
  }

  if (title.trim().length > POST_TITLE_MAX_LENGTH) {
    return {
      ok: false,
      error: `Title must be ${POST_TITLE_MAX_LENGTH} characters or less`,
    };
  }

  if (typeof body !== "string" || body.trim().length === 0) {
    return { ok: false, error: "Body is required" };
  }

  if (body.length > POST_BODY_MAX_LENGTH) {
    return {
      ok: false,
      error: `Body must be ${POST_BODY_MAX_LENGTH} characters or less`,
    };
  }

  return {
    ok: true,
    data: { title: title.trim(), body },
  };
}
