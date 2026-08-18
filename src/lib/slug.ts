import { customAlphabet } from "nanoid";

const generateSlug = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  10,
);

export function createPostSlug(): string {
  return generateSlug();
}
