import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { RATE_LIMIT } from "@/lib/constants";
import { getClientIp } from "@/lib/ip";
import { createPostSlug } from "@/lib/slug";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/ratelimit";
import { validatePostInput } from "@/lib/validation";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = await getClientIp();
  const ipLimit = await checkRateLimit(
    `ip:${ip}:api`,
    RATE_LIMIT.apiByIp.limit,
    RATE_LIMIT.apiByIp.windowMs,
  );
  if (!ipLimit.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(ipLimit.retryAfterSeconds) } },
    );
  }

  const createLimit = await checkRateLimit(
    `user:${session.user.id}:create`,
    RATE_LIMIT.createPost.limit,
    RATE_LIMIT.createPost.windowMs,
  );
  if (!createLimit.ok) {
    return NextResponse.json(
      { error: "Post creation limit reached. Please try again later." },
      { status: 429, headers: { "Retry-After": String(createLimit.retryAfterSeconds) } },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const validated = validatePostInput(json);
  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  const post = await prisma.post.create({
    data: {
      slug: createPostSlug(),
      title: validated.data.title,
      body: validated.data.body,
      userId: session.user.id,
    },
    select: { slug: true, title: true },
  });

  return NextResponse.json(post, { status: 201 });
}
