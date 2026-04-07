import { MetricCards } from "@/components/metric-cards";
import type { MetricCardItem } from "@/components/metric-cards";
import type { ActivityMetrics } from "@/lib/types";

type ActivityMetricsCardsProps = {
  metrics: ActivityMetrics;
};

export function ActivityMetricsCards({
  metrics,
}: ActivityMetricsCardsProps) {
  const cards: MetricCardItem[] = [
    {
      label: "Всего активностей",
      value: metrics.totalActivities,
      note: "Размер общего журнала действий",
      icon: "activities",
    },
    {
      label: "Всего баллов",
      value: metrics.totalPoints,
      note: "Баллы, начисленные по всем активностям",
      icon: "points",
    },
    {
      label: "Сэкономлено CO2",
      value: `${metrics.totalCo2Saved.toFixed(1)} кг`,
      note: "Суммарный эко-эффект по зафиксированным действиям",
      icon: "co2",
    },
    {
      label: "Активные пользователи",
      value: metrics.uniqueUsers,
      note: "Пользователи, у которых уже есть активности",
      icon: "users",
    },
  ];

  return <MetricCards items={cards} columns="four" />;
}
