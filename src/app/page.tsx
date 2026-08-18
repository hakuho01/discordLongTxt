import Link from "next/link";

import { auth } from "@/lib/auth";
import { Header } from "@/components/Header";
import { getUserPosts } from "@/lib/posts";

export default async function HomePage() {
  const session = await auth();
  const posts = session?.user?.id ? await getUserPosts(session.user.id) : [];

  return (
    <>
      <Header session={session} />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-10">
        <section className="mb-10">
          <h1 className="mb-3 text-3xl font-bold text-white">
            Discord向け長文共有
          </h1>
          <p className="leading-7 text-zinc-400">
            長文を保存して公開URLをDiscordに貼るだけ。プレビューにはタイトルと冒頭が表示され、
            クリックするとMarkdown付きの全文を読めます。
          </p>
        </section>

        {session?.user ? (
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">あなたの投稿</h2>
              <Link
                href="/posts/new"
                className="text-sm text-[#5865F2] hover:underline"
              >
                新規作成
              </Link>
            </div>
            {posts.length === 0 ? (
              <p className="rounded-lg border border-dashed border-zinc-700 px-4 py-8 text-center text-zinc-500">
                まだ投稿がありません
              </p>
            ) : (
              <ul className="divide-y divide-zinc-800 rounded-lg border border-zinc-800">
                {posts.map((post) => (
                  <li key={post.slug} className="flex items-center justify-between px-4 py-3">
                    <div>
                      <Link
                        href={`/p/${post.slug}`}
                        className="font-medium text-zinc-100 hover:text-white"
                      >
                        {post.title}
                      </Link>
                      <p className="text-xs text-zinc-500">
                        更新: {post.updatedAt.toLocaleString("ja-JP")}
                      </p>
                    </div>
                    <Link
                      href={`/posts/${post.slug}/edit`}
                      className="text-sm text-zinc-400 hover:text-zinc-200"
                    >
                      編集
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ) : (
          <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
            <p className="mb-4 text-zinc-300">
              投稿の作成・編集・削除にはDiscordログインが必要です。
            </p>
            <form action={async () => {
              "use server";
              const { signIn } = await import("@/lib/auth");
              await signIn("discord");
            }}>
              <button
                type="submit"
                className="rounded-lg bg-[#5865F2] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#4752C4]"
              >
                Discordでログイン
              </button>
            </form>
          </section>
        )}
      </main>
    </>
  );
}
