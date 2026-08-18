import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { RATE_LIMIT } from "@/lib/constants";
import { getClientIp } from "@/lib/ip";
import { getOwnedPost } from "@/lib/posts";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/ratelimit";
import { validatePostInput } from "@/lib/validation";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

async function enforceApiRateLimit() {
  const ip = await getClientIp();
  return checkRateLimit(
    `ip:${ip}:api`,
    RATE_LIMIT.apiByIp.limit,
    RATE_LIMIT.apiByIp.windowMs,
  );
}

export async function PATCH(request: Request, context: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ipLimit = await enforceApiRateLimit();
  if (!ipLimit.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(ipLimit.retryAfterSeconds) } },
    );
  }

  const { slug } = await context.params;
  const post = await getOwnedPost(slug, session.user.id);
  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
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

  const updated = await prisma.post.update({
    where: { id: post.id },
    data: {
      title: validated.data.title,
      body: validated.data.body,
    },
    select: { slug: true, title: true },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ipLimit = await enforceApiRateLimit();
  if (!ipLimit.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(ipLimit.retryAfterSeconds) } },
    );
  }

  const { slug } = await context.params;
  const post = await getOwnedPost(slug, session.user.id);
  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.post.update({
    where: { id: post.id },
    data: { deletedAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}
