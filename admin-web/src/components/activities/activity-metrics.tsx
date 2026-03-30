import { MetricCards } from "@/components/metric-cards";
import type { ActivityMetrics } from "@/lib/types";

type ActivityMetricsCardsProps = {
  metrics: ActivityMetrics;
};

export function ActivityMetricsCards({
  metrics,
}: ActivityMetricsCardsProps) {
  const cards = [
    {
      label: "Total activities",
      value: metrics.totalActivities,
      note: "Current user action log size",
    },
    {
      label: "Total points",
      value: metrics.totalPoints,
      note: "Points granted across all activities",
    },
    {
      label: "CO2 saved",
      value: `${metrics.totalCo2Saved.toFixed(1)} kg`,
      note: "Combined eco impact from logged actions",
    },
    {
      label: "Active users",
      value: metrics.uniqueUsers,
      note: "Users represented in current activity data",
    },
  ];

  return <MetricCards items={cards} columns="four" />;
}
