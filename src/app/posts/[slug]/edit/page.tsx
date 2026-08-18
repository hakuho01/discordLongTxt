import { notFound, redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { Header } from "@/components/Header";
import { PostForm } from "@/components/PostForm";
import { getOwnedPost } from "@/lib/posts";

type EditPostPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function EditPostPage({ params }: EditPostPageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/");
  }

  const { slug } = await params;
  const post = await getOwnedPost(slug, session.user.id);
  if (!post) {
    notFound();
  }

  return (
    <>
      <Header session={session} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
        <h1 className="mb-6 text-2xl font-bold text-white">投稿を編集</h1>
        <PostForm
          mode="edit"
          slug={post.slug}
          initialTitle={post.title}
          initialBody={post.body}
        />
      </main>
    </>
  );
}
