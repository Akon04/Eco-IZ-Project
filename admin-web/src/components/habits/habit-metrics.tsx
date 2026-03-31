import { MetricCards } from "@/components/metric-cards";
import type { HabitMetrics } from "@/lib/types";

type HabitMetricsProps = {
  metrics: HabitMetrics;
};

export function HabitMetricsCards({ metrics }: HabitMetricsProps) {
  const cards = [
    {
      label: "Всего активностей",
      value: metrics.totalHabits,
      note: "Размер текущего каталога",
    },
    {
      label: "Всего баллов",
      value: metrics.totalPoints,
      note: "Сумма баллов по всему каталогу",
    },
    {
      label: "Категорий",
      value: metrics.categoriesUsed,
      note: "Распределение активностей по eco-направлениям",
    },
  ];

  return <MetricCards items={cards} columns="three" />;
}
