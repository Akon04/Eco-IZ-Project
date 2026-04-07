import { MetricCards } from "@/components/metric-cards";
import type { AchievementMetrics } from "@/lib/types";
import type { MetricCardItem } from "@/components/metric-cards";

type AchievementMetricsProps = {
  metrics: AchievementMetrics;
};

export function AchievementMetricsCards({
  metrics,
}: AchievementMetricsProps) {
  const cards: MetricCardItem[] = [
    {
      label: "Всего ачивок",
      value: metrics.totalAchievements,
      note: "Текущий каталог ачивок",
      icon: "achievements",
    },
    {
      label: "Баллы наград",
      value: metrics.totalRewardPoints,
      note: "Суммарные награды по всем ачивкам",
      icon: "points",
    },
    {
      label: "Максимальная цель",
      value: metrics.maxTargetValue,
      note: "Наибольшее пороговое значение",
      icon: "review",
    },
  ];

  return <MetricCards items={cards} columns="three" />;
}
