import removeMarkdown from "remove-markdown";

import { prisma } from "@/lib/prisma";

export function stripMarkdownForPreview(body: string, maxLength = 200): string {
  const plain = removeMarkdown(body).replace(/\s+/g, " ").trim();
  if (plain.length <= maxLength) {
    return plain;
  }
  return `${plain.slice(0, maxLength)}…`;
}

export async function getPublicPost(slug: string) {
  return prisma.post.findFirst({
    where: { slug, deletedAt: null },
    include: {
      user: {
        select: { name: true, image: true },
      },
    },
  });
}

export async function getOwnedPost(slug: string, userId: string) {
  return prisma.post.findFirst({
    where: { slug, userId, deletedAt: null },
  });
}

export async function getUserPosts(userId: string) {
  return prisma.post.findMany({
    where: { userId, deletedAt: null },
    orderBy: { updatedAt: "desc" },
    select: {
      slug: true,
      title: true,
      updatedAt: true,
      createdAt: true,
    },
  });
}

export function getPostUrl(slug: string): string {
  const baseUrl = process.env.AUTH_URL ?? "http://localhost:3000";
  return `${baseUrl.replace(/\/$/, "")}/p/${slug}`;
}
