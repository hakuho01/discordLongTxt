"use client";

import Link from "next/link";
import { signIn, signOut } from "next-auth/react";
import type { Session } from "next-auth";

type HeaderProps = {
  session: Session | null;
};

export function Header({ session }: HeaderProps) {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold text-white">
          LongTxt
        </Link>
        <nav className="flex items-center gap-3">
          {session?.user ? (
            <>
              <Link
                href="/posts/new"
                className="rounded-lg bg-[#5865F2] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#4752C4]"
              >
                新規作成
              </Link>
              <div className="flex items-center gap-2 text-sm text-zinc-300">
                {session.user.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={session.user.image}
                    alt=""
                    className="h-7 w-7 rounded-full"
                  />
                )}
                <span>{session.user.name ?? "User"}</span>
              </div>
              <button
                type="button"
                onClick={() => signOut()}
                className="text-sm text-zinc-400 hover:text-zinc-200"
              >
                ログアウト
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => signIn("discord")}
              className="rounded-lg bg-[#5865F2] px-4 py-2 text-sm font-medium text-white hover:bg-[#4752C4]"
            >
              Discordでログイン
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
