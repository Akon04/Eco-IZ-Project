import { MetricCards } from "@/components/metric-cards";
import type { MetricCardItem } from "@/components/metric-cards";
import type { HabitMetrics } from "@/lib/types";

type HabitMetricsProps = {
  metrics: HabitMetrics;
};

export function HabitMetricsCards({ metrics }: HabitMetricsProps) {
  const cards: MetricCardItem[] = [
    {
      label: "Всего активностей",
      value: metrics.totalHabits,
      note: "Размер текущего каталога",
      icon: "habits",
    },
    {
      label: "Всего баллов",
      value: metrics.totalPoints,
      note: "Сумма баллов по всему каталогу",
      icon: "points",
    },
    {
      label: "Категорий",
      value: metrics.categoriesUsed,
      note: "Распределение активностей по эко-направлениям",
      icon: "categories",
    },
  ];

  return <MetricCards items={cards} columns="three" />;
}
