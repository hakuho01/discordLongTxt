import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { Header } from "@/components/Header";
import { PostForm } from "@/components/PostForm";

export default async function NewPostPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  return (
    <>
      <Header session={session} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
        <h1 className="mb-6 text-2xl font-bold text-white">新規投稿</h1>
        <PostForm mode="create" />
      </main>
    </>
  );
}
