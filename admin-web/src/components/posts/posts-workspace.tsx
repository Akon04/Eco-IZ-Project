"use client";

import { useSearchParams } from "next/navigation";
import { useDeferredValue, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { PostDetailPanel } from "@/components/posts/post-detail-panel";
import { PostMetricsCards } from "@/components/posts/post-metrics";
import { PostTable } from "@/components/posts/post-table";
import { StatePanel } from "@/components/state-panel";
import { getPostMetrics, listPosts } from "@/lib/api/posts";
import { queryKeys } from "@/lib/query-keys";
import type { CommunityPost, PostFilters, PostMetrics } from "@/lib/types";

type PostsWorkspaceProps = {
  initialPosts: CommunityPost[];
  metrics: PostMetrics;
};

export function PostsWorkspace({ initialPosts, metrics }: PostsWorkspaceProps) {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") ?? "";
  const [filters, setFilters] = useState<PostFilters>({
    search: initialSearch,
    state: "ALL",
    visibility: "ALL",
  });
  const [selectedPostId, setSelectedPostId] = useState(initialPosts[0]?.id ?? "");
  const deferredSearch = useDeferredValue(filters.search ?? "");
  const queryFilters = useMemo(
    () => ({ ...filters, search: deferredSearch }),
    [deferredSearch, filters],
  );
  const filtersKey = JSON.stringify(queryFilters);

  const postsQuery = useQuery({
    queryKey: queryKeys.posts.list(filtersKey),
    queryFn: () => listPosts(queryFilters),
    initialData: initialPosts,
    placeholderData: (previousData) => previousData,
  });

  const metricsQuery = useQuery({
    queryKey: queryKeys.posts.metrics,
    queryFn: getPostMetrics,
    initialData: metrics,
  });

  const filteredPosts = postsQuery.data;

  const selectedPost =
    filteredPosts.find((post: CommunityPost) => post.id === selectedPostId) ??
    filteredPosts[0];

  return (
    <>
      <PostMetricsCards metrics={metricsQuery.data} />

      <section className="split" style={{ marginTop: 16 }}>
        <PostTable
          posts={filteredPosts}
          selectedPostId={selectedPost?.id ?? ""}
          filters={filters}
          onSelect={setSelectedPostId}
          onFilterChange={setFilters}
        />
        {selectedPost ? (
          <PostDetailPanel post={selectedPost} />
        ) : postsQuery.isLoading || postsQuery.isFetching ? (
          <StatePanel
            title="Загружаем посты"
            description="Обновляем очередь модерации и применяем выбранные фильтры."
          />
        ) : postsQuery.isError ? (
          <StatePanel
            title="Не удалось загрузить посты"
            description="Очередь модерации сейчас недоступна. Попробуй обновить страницу."
            tone="error"
          />
        ) : (
          <StatePanel
            title="Посты не найдены"
            description="Сбрось поиск или ослабь фильтры по статусу и видимости."
            tone="warning"
          />
        )}
      </section>
    </>
  );
}
