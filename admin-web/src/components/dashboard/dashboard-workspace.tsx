"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { EcoAnalyticsPanel } from "@/components/dashboard/eco-analytics-panel";
import { StatePanel } from "@/components/state-panel";
import { getAchievementMetrics, listAchievements } from "@/lib/api/achievements";
import { getEcoAnalytics } from "@/lib/api/dashboard";
import { getCategoryMetrics } from "@/lib/api/categories";
import { isMockMode } from "@/lib/config";
import { getHabitMetrics } from "@/lib/api/habits";
import { getPostMetrics, listPosts } from "@/lib/api/posts";
import { queryKeys } from "@/lib/query-keys";
import { postStateBadgeClass } from "@/lib/status-badges";
import { getAdminUserMetrics, listAdminUsers } from "@/lib/api/users";
import type {
  Achievement,
  AchievementMetrics,
  CommunityPost,
  EcoAnalytics,
  PostMetrics,
  UserMetrics,
} from "@/lib/types";

type DashboardWorkspaceProps = {
  initialUserMetrics: UserMetrics;
  initialHabitMetrics: {
    totalHabits: number;
    totalPoints: number;
    categoriesUsed: number;
  };
  initialAchievementMetrics: AchievementMetrics;
  initialPostMetrics: PostMetrics;
  initialCategoryMetrics: {
    totalCategories: number;
    uniqueColors: number;
    iconCount: number;
  };
  initialPosts: CommunityPost[];
  initialUsers: Array<{
    id: string;
    username: string;
    email: string;
    role: "USER" | "ADMIN" | "MODERATOR";
    isEmailVerified: boolean;
    ecoPoints: number;
    streakDays: number;
    postsCount: number;
    createdAt: string;
    status: "ACTIVE" | "REVIEW" | "SUSPENDED";
  }>;
  initialAchievements: Achievement[];
  initialEcoAnalytics: EcoAnalytics;
};

export function DashboardWorkspace({
  initialUserMetrics,
  initialHabitMetrics,
  initialAchievementMetrics,
  initialPostMetrics,
  initialCategoryMetrics,
  initialPosts,
  initialUsers,
  initialAchievements,
  initialEcoAnalytics,
}: DashboardWorkspaceProps) {
  const [focusExpanded, setFocusExpanded] = useState(false);
  const postStateLabels: Record<CommunityPost["state"], string> = {
    Published: "Опубликован",
    "Needs review": "Нужна проверка",
    Hidden: "Скрыт",
  };

  const userMetricsQuery = useQuery({
    queryKey: queryKeys.users.metrics,
    queryFn: getAdminUserMetrics,
    initialData: initialUserMetrics,
  });

  const habitMetricsQuery = useQuery({
    queryKey: queryKeys.habits.metrics,
    queryFn: getHabitMetrics,
    initialData: initialHabitMetrics,
  });

  const achievementMetricsQuery = useQuery({
    queryKey: queryKeys.achievements.metrics,
    queryFn: getAchievementMetrics,
    initialData: initialAchievementMetrics,
  });

  const postMetricsQuery = useQuery({
    queryKey: queryKeys.posts.metrics,
    queryFn: getPostMetrics,
    initialData: initialPostMetrics,
  });

  const categoryMetricsQuery = useQuery({
    queryKey: queryKeys.categories.metrics,
    queryFn: getCategoryMetrics,
    initialData: initialCategoryMetrics,
  });

  const postsQuery = useQuery({
    queryKey: queryKeys.posts.list("dashboard"),
    queryFn: () => listPosts(),
    initialData: initialPosts,
    placeholderData: (previousData) => previousData,
  });

  const usersQuery = useQuery({
    queryKey: queryKeys.users.list("dashboard"),
    queryFn: () => listAdminUsers(),
    initialData: initialUsers,
    placeholderData: (previousData) => previousData,
  });

  const achievementsQuery = useQuery({
    queryKey: queryKeys.achievements.list("dashboard"),
    queryFn: () => listAchievements(),
    initialData: initialAchievements,
    placeholderData: (previousData) => previousData,
  });

  const ecoAnalyticsQuery = useQuery({
    queryKey: queryKeys.dashboard.ecoAnalytics,
    queryFn: getEcoAnalytics,
    initialData: initialEcoAnalytics,
  });

  const hasAnyError =
    userMetricsQuery.isError ||
    habitMetricsQuery.isError ||
    achievementMetricsQuery.isError ||
    postMetricsQuery.isError ||
    categoryMetricsQuery.isError ||
    postsQuery.isError ||
    usersQuery.isError ||
    achievementsQuery.isError ||
    ecoAnalyticsQuery.isError;

  const userMetrics = userMetricsQuery.data ?? initialUserMetrics;
  const habitMetrics = habitMetricsQuery.data ?? initialHabitMetrics;
  const achievementMetrics =
    achievementMetricsQuery.data ?? initialAchievementMetrics;
  const postMetrics = postMetricsQuery.data ?? initialPostMetrics;
  const categoryMetrics = categoryMetricsQuery.data ?? initialCategoryMetrics;
  const posts = postsQuery.data ?? initialPosts;
  const users = usersQuery.data ?? initialUsers;
  const achievements = achievementsQuery.data ?? initialAchievements;
  const ecoAnalytics = ecoAnalyticsQuery.data ?? initialEcoAnalytics;

  const isBootstrappingLiveDashboard =
    !isMockMode() &&
    (userMetricsQuery.isFetching ||
      habitMetricsQuery.isFetching ||
      achievementMetricsQuery.isFetching ||
      postMetricsQuery.isFetching ||
      categoryMetricsQuery.isFetching ||
      postsQuery.isFetching ||
      usersQuery.isFetching ||
      achievementsQuery.isFetching ||
      ecoAnalyticsQuery.isFetching) &&
    userMetrics.totalUsers === 0 &&
    habitMetrics.totalHabits === 0 &&
    achievementMetrics.totalAchievements === 0 &&
    postMetrics.totalPosts === 0 &&
    categoryMetrics.totalCategories === 0 &&
    posts.length === 0 &&
    users.length === 0 &&
    achievements.length === 0 &&
    ecoAnalytics.categoryBreakdown.length === 0;

  if (isBootstrappingLiveDashboard) {
    return (
      <StatePanel
        title="Загружаем панель"
        description="Получаем live-метрики, каталоги и текущее состояние модерации."
      />
    );
  }

  const moderationQueue = posts
    .filter((post) => post.state === "Needs review")
    .map((post) => ({
      label: `Пост от ${post.author}`,
      status: postStateLabels[post.state],
      statusClass: postStateBadgeClass(post.state),
      owner: "Модератор",
    }));

  const operationsQueue = [
    {
      label: "Пользователи на проверке",
      status: `${userMetrics.needsReview} ожидают`,
      statusClass: "pill pill-status pill-status-review",
      owner: "Админ",
    },
    {
      label: "Состояние категорий",
      status: `${categoryMetrics.totalCategories} активно`,
      statusClass: "pill pill-status pill-status-active",
      owner: "Контент",
    },
    {
      label: "Состояние ачивок",
      status: `${achievements.length} настроено`,
      statusClass: "pill pill-status pill-status-published",
      owner: "Продукт",
    },
  ];

  const recentItems = [
    `${postMetrics.needsReviewPosts} постов сейчас ждут модерации`,
    `${userMetrics.adminCount} пользователей имеют расширенный доступ`,
    `${habitMetrics.totalHabits} активностей доступны в каталоге`,
    `${achievementMetrics.maxTargetValue} — текущий максимальный порог у ачивок`,
  ];

  const focusItems = [...moderationQueue, ...operationsQueue];
  const visibleFocusItems = focusExpanded ? focusItems : focusItems.slice(0, 5);

  return (
    <>
      {hasAnyError ? (
        <StatePanel
          title="Часть данных панели недоступна"
          description="Мы показываем то, что уже удалось загрузить. Остальные блоки можно обновить позже без потери всей панели."
          tone="warning"
        />
      ) : null}

      <section className="split" style={{ marginTop: 16 }}>
        <article className="card">
          <div className="section-head">
            <h2 className="section-title" style={{ marginBottom: 0 }}>Фокус на сегодня</h2>
            {focusItems.length > 5 ? (
              <button
                type="button"
                className="ghost-button"
                onClick={() => setFocusExpanded((value) => !value)}
              >
                {focusExpanded ? "Свернуть" : "Показать все"}
              </button>
            ) : null}
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Очередь</th>
                  <th>Статус</th>
                  <th>Ответственный</th>
                </tr>
              </thead>
              <tbody>
                {visibleFocusItems.map((item) => (
                  <tr key={`${item.label}-${item.status}`}>
                    <td>{item.label}</td>
                    <td>
                      <span className={item.statusClass}>{item.status}</span>
                    </td>
                    <td>{item.owner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="card">
          <h2 className="section-title">Сводка по системе</h2>
          <div className="grid">
            {recentItems.map((item) => (
              <div key={item} className="card" style={{ padding: 14 }}>
                {item}
              </div>
            ))}
          </div>
        </article>
      </section>

      {ecoAnalyticsQuery.isError &&
      ecoAnalytics.categoryBreakdown.length === 0 &&
      ecoAnalytics.topUsersByActivity.length === 0 ? (
        <section style={{ marginTop: 16 }}>
          <StatePanel
            title="Эко-аналитика временно недоступна"
            description="Остальные разделы панели работают, а eco-аналитику можно обновить позже."
            tone="warning"
          />
        </section>
      ) : (
        <EcoAnalyticsPanel analytics={ecoAnalytics} />
      )}
    </>
  );
}
