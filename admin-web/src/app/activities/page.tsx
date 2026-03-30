import { PageHeader } from "@/components/page-header";
import { ActivitiesWorkspace } from "@/components/activities/activities-workspace";
import { getActivityMetrics, listActivities } from "@/lib/api/activities";
import { isMockMode } from "@/lib/config";

export default async function ActivitiesPage() {
  const [activities, metrics] = isMockMode()
    ? await Promise.all([listActivities(), getActivityMetrics()])
    : await Promise.all([
        Promise.resolve([]),
        Promise.resolve({
          totalActivities: 0,
          totalPoints: 0,
          totalCo2Saved: 0,
          uniqueUsers: 0,
        }),
      ]);

  return (
    <>
      <PageHeader
        title="Activities"
        description="Review user actions, eco impact values, and custom activity notes across the platform."
      />
      <ActivitiesWorkspace initialActivities={activities} metrics={metrics} />
    </>
  );
}
