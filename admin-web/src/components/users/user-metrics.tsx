import { MetricCards } from "@/components/metric-cards";
import type { UserMetrics } from "@/lib/types";

type UserMetricsProps = {
  metrics: UserMetrics;
};

export function UserMetricsCards({ metrics }: UserMetricsProps) {
  const cards = [
    {
      label: "Всего пользователей",
      value: metrics.totalUsers,
      note: "Текущий размер пользовательской базы",
      icon: "users",
    },
    {
      label: "Расширенный доступ",
      value: metrics.adminCount,
      note: "Админы и модераторы платформы",
      icon: "staff",
    },
    {
      label: "На проверке",
      value: metrics.needsReview,
      note: "Аккаунты, которым нужна модерация",
      icon: "review",
    },
    {
      label: "Подтвержденные email",
      value: metrics.verifiedCount,
      note: "Готовы к безопасным действиям админа",
      icon: "verified",
    },
  ];

  return <MetricCards items={cards} columns="four" />;
}
