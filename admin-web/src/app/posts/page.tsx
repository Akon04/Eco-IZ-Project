import { PageHeader } from "@/components/page-header";
import { PostsWorkspace } from "@/components/posts/posts-workspace";
import { getPostMetrics, listPosts } from "@/lib/api/posts";
import { isMockMode } from "@/lib/config";

export default async function PostsPage() {
  const [posts, metrics] = isMockMode()
    ? await Promise.all([listPosts(), getPostMetrics()])
    : await Promise.all([
        Promise.resolve([]),
        Promise.resolve({
          totalPosts: 0,
          flaggedPosts: 0,
          hiddenPosts: 0,
          totalReports: 0,
        }),
      ]);

  return (
    <>
      <PageHeader
        title="Посты"
        description="Модерация пользовательского контента и управление видимостью постов."
      />
      <PostsWorkspace initialPosts={posts} metrics={metrics} />
    </>
  );
}
