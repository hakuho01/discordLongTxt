import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { auth } from "@/lib/auth";
import { CopyUrlButton } from "@/components/CopyUrlButton";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { APP_NAME } from "@/lib/constants";
import { getPostUrl, getPublicPost, stripMarkdownForPreview } from "@/lib/posts";

type PublicPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PublicPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublicPost(slug);

  if (!post) {
    return { title: "Not Found" };
  }

  const description = stripMarkdownForPreview(post.body);
  const url = getPostUrl(slug);

  return {
    title: post.title,
    description,
    openGraph: {
      title: post.title,
      description,
      url,
      type: "article",
      siteName: APP_NAME,
    },
    twitter: {
      card: "summary",
      title: post.title,
      description,
    },
  };
}

export default async function PublicPostPage({ params }: PublicPostPageProps) {
  const { slug } = await params;
  const post = await getPublicPost(slug);

  if (!post) {
    notFound();
  }

  const session = await auth();
  const isOwner = session?.user?.id === post.userId;
  const url = getPostUrl(slug);

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-4 py-10">
      <article>
        <header className="mb-8 border-b border-zinc-800 pb-6">
          <h1 className="mb-3 text-3xl font-bold text-white">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-500">
            {post.user.name && <span>{post.user.name}</span>}
            <span>{post.createdAt.toLocaleString("ja-JP")}</span>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <CopyUrlButton url={url} />
            {isOwner && (
              <Link
                href={`/posts/${post.slug}/edit`}
                className="text-sm text-[#5865F2] hover:underline"
              >
                編集
              </Link>
            )}
          </div>
        </header>

        <div className="markdown-body">
          <MarkdownRenderer content={post.body} />
        </div>
      </article>
    </main>
  );
}
