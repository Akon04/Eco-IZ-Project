import { MetricCards } from "@/components/metric-cards";
import type { PostMetrics } from "@/lib/types";

type PostMetricsProps = {
  metrics: PostMetrics;
};

export function PostMetricsCards({ metrics }: PostMetricsProps) {
  const cards = [
    {
      label: "Всего постов",
      value: metrics.totalPosts ?? 0,
      note: "Текущий объем модерации",
      icon: "posts",
    },
    {
      label: "Отмеченные",
      value: metrics.flaggedPosts ?? 0,
      note: "Проблемные публикации, уже отмеченные для модерации",
      icon: "flagged",
    },
    {
      label: "Нужна проверка",
      value: metrics.needsReviewPosts ?? 0,
      note: "Посты, которые модератору нужно просмотреть вручную",
      icon: "review",
    },
    {
      label: "Скрытые",
      value: metrics.hiddenPosts ?? 0,
      note: "Уже убраны из публичного просмотра",
      icon: "hidden",
    },
    {
      label: "Жалобы",
      value: metrics.totalReports ?? 0,
      note: "Общее количество жалоб по текущим постам",
      icon: "reports",
    },
  ];

  return <MetricCards items={cards} columns="five" />;
}
