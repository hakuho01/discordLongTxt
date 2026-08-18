import { prisma } from "@/lib/prisma";

type RateLimitResult =
  | { ok: true; remaining: number }
  | { ok: false; remaining: 0; retryAfterSeconds: number };

export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult> {
  const now = new Date();
  const entry = await prisma.rateLimitEntry.findUnique({ where: { key } });

  if (!entry || entry.expiresAt <= now) {
    const expiresAt = new Date(now.getTime() + windowMs);
    await prisma.rateLimitEntry.upsert({
      where: { key },
      create: { key, count: 1, expiresAt },
      update: { count: 1, expiresAt },
    });
    return { ok: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    const retryAfterSeconds = Math.ceil(
      (entry.expiresAt.getTime() - now.getTime()) / 1000,
    );
    return { ok: false, remaining: 0, retryAfterSeconds };
  }

  await prisma.rateLimitEntry.update({
    where: { key },
    data: { count: entry.count + 1 },
  });

  return { ok: true, remaining: limit - entry.count - 1 };
}

export async function cleanupExpiredRateLimits(): Promise<void> {
  await prisma.rateLimitEntry.deleteMany({
    where: { expiresAt: { lte: new Date() } },
  });
}
