import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-2 text-2xl font-bold text-white">404</h1>
      <p className="mb-6 text-zinc-400">ページが見つかりませんでした。</p>
      <Link href="/" className="text-[#5865F2] hover:underline">
        トップへ戻る
      </Link>
    </main>
  );
}
