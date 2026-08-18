"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  POST_BODY_MAX_LENGTH,
  POST_TITLE_MAX_LENGTH,
} from "@/lib/constants";

type PostFormProps = {
  mode: "create" | "edit";
  initialTitle?: string;
  initialBody?: string;
  slug?: string;
};

export function PostForm({
  mode,
  initialTitle = "",
  initialBody = "",
  slug,
}: PostFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [body, setBody] = useState(initialBody);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const url = mode === "create" ? "/api/posts" : `/api/posts/${slug}`;
    const method = mode === "create" ? "POST" : "PATCH";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body }),
      });

      const data = (await response.json()) as { slug?: string; error?: string };

      if (!response.ok) {
        setError(data.error ?? "保存に失敗しました");
        return;
      }

      router.push(`/p/${data.slug ?? slug}`);
      router.refresh();
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!slug || !confirm("この投稿を削除しますか？")) {
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`/api/posts/${slug}`, { method: "DELETE" });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(data.error ?? "削除に失敗しました");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="mb-2 block text-sm font-medium text-zinc-300">
          タイトル
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={POST_TITLE_MAX_LENGTH}
          required
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-white outline-none focus:border-[#5865F2]"
          placeholder="Discordに表示されるタイトル"
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label htmlFor="body" className="text-sm font-medium text-zinc-300">
            本文（Markdown対応・Enterで改行）
          </label>
          <span className="text-xs text-zinc-500">
            {body.length.toLocaleString()} / {POST_BODY_MAX_LENGTH.toLocaleString()}
          </span>
        </div>
        <textarea
          id="body"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          maxLength={POST_BODY_MAX_LENGTH}
          required
          rows={20}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 font-mono text-sm text-white outline-none focus:border-[#5865F2]"
          placeholder="# 見出し&#10;&#10;長文をここに書いてください..."
        />
      </div>

      {error && (
        <p className="rounded-lg border border-red-800 bg-red-950/50 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-[#5865F2] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#4752C4] disabled:opacity-50"
        >
          {loading ? "保存中..." : mode === "create" ? "公開する" : "更新する"}
        </button>
        {mode === "edit" && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="rounded-lg border border-red-800 px-5 py-2.5 text-sm text-red-300 hover:bg-red-950/40 disabled:opacity-50"
          >
            削除
          </button>
        )}
      </div>
    </form>
  );
}
