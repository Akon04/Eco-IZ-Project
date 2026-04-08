import { apiRequest } from "@/lib/api/client";
import { wait } from "@/lib/api/helpers";
import { isMockMode } from "@/lib/config";
import { mockPosts } from "@/lib/mocks";
import type {
  CommunityPost,
  CommunityPostDetail,
  PostFilters,
  PostMetrics,
  UpdatePostPayload,
} from "@/lib/types";

export async function listPosts(
  filters: PostFilters = {},
): Promise<CommunityPost[]> {
  if (!isMockMode()) {
    const params = new URLSearchParams();
    if (filters.search?.trim()) params.set("search", filters.search.trim());
    if (filters.state && filters.state !== "ALL") {
      params.set("state", filters.state);
    }
    if (filters.reports && filters.reports !== "ALL") {
      params.set("reports", filters.reports);
    }

    return apiRequest<CommunityPost[]>(
      `/admin/posts${params.size ? `?${params.toString()}` : ""}`,
    );
  }

  await wait(70);

  const query = filters.search?.trim().toLowerCase();
  return mockPosts.filter((post) => {
    const matchesSearch =
      !query ||
      post.author.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query);
    const matchesState =
      !filters.state || filters.state === "ALL" || post.state === filters.state;
    const matchesReports =
      !filters.reports ||
      filters.reports === "ALL" ||
      (filters.reports === "REPORTED" && post.reportsCount > 0) ||
      (filters.reports === "NO_REPORTS" && post.reportsCount === 0);

    return matchesSearch && matchesState && matchesReports;
  });
}

export async function getPostMetrics(): Promise<PostMetrics> {
  if (!isMockMode()) {
    return apiRequest<PostMetrics>("/admin/posts/metrics");
  }

  await wait(40);

  return {
    totalPosts: mockPosts.length,
    needsReviewPosts: mockPosts.filter((post) => post.state === "Needs review").length,
    hiddenPosts: mockPosts.filter((post) => post.state === "Hidden").length,
    totalReports: mockPosts.reduce((sum, post) => sum + post.reportsCount, 0),
  };
}

export async function getPostDetail(postId: string): Promise<CommunityPostDetail> {
  if (!isMockMode()) {
    return apiRequest<CommunityPostDetail>(`/admin/posts/${postId}`);
  }

  await wait(50);

  const post = mockPosts.find((item) => item.id === postId);
  if (!post) {
    throw new Error("Post not found");
  }

  return post;
}

export async function updatePost(
  postId: string,
  payload: UpdatePostPayload,
): Promise<CommunityPost> {
  if (!isMockMode()) {
    return apiRequest<CommunityPost>(`/admin/posts/${postId}`, {
      method: "PATCH",
      body: payload,
    });
  }

  await wait(120);

  const post = mockPosts.find((item) => item.id === postId);
  if (!post) {
    throw new Error("Post not found");
  }

  return {
    ...post,
    state: payload.state,
  };
}

export async function deletePost(postId: string): Promise<void> {
  if (!isMockMode()) {
    await apiRequest<void>(`/admin/posts/${postId}`, {
      method: "DELETE",
    });
    return;
  }

  await wait(120);

  const index = mockPosts.findIndex((item) => item.id === postId);
  if (index === -1) {
    throw new Error("Post not found");
  }

  mockPosts.splice(index, 1);
}
