"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { ActivityDetailPanel } from "@/components/activities/activity-detail-panel";
import { ActivityMetricsCards } from "@/components/activities/activity-metrics";
import { ActivityTable } from "@/components/activities/activity-table";
import { StatePanel } from "@/components/state-panel";
import { getActivityMetrics, listActivities } from "@/lib/api/activities";
import { queryKeys } from "@/lib/query-keys";
import type { ActivityFilters, ActivityMetrics, AdminActivity } from "@/lib/types";

type ActivitiesWorkspaceProps = {
  initialActivities: AdminActivity[];
  metrics: ActivityMetrics;
};

export function ActivitiesWorkspace({
  initialActivities,
  metrics,
}: ActivitiesWorkspaceProps) {
  const [filters, setFilters] = useState<ActivityFilters>({
    search: "",
    category: "ALL",
  });
  const [selectedActivityId, setSelectedActivityId] = useState(
    initialActivities[0]?.id ?? "",
  );
  const deferredSearch = useDeferredValue(filters.search ?? "");
  const queryFilters = useMemo(
    () => ({ ...filters, search: deferredSearch }),
    [deferredSearch, filters],
  );
  const filtersKey = JSON.stringify(queryFilters);

  const activitiesQuery = useQuery({
    queryKey: queryKeys.activities.list(filtersKey),
    queryFn: () => listActivities(queryFilters),
    initialData: initialActivities,
    placeholderData: (previousData) => previousData,
  });

  const metricsQuery = useQuery({
    queryKey: queryKeys.activities.metrics,
    queryFn: getActivityMetrics,
    initialData: metrics,
  });

  const allActivitiesQuery = useQuery({
    queryKey: queryKeys.activities.list("all-options"),
    queryFn: () => listActivities(),
    initialData: initialActivities,
    placeholderData: (previousData) => previousData,
  });

  const filteredActivities = activitiesQuery.data;

  const categoryOptions = useMemo(
    () =>
      Array.from(
        new Set(allActivitiesQuery.data.map((activity) => activity.category)),
      ).sort(),
    [allActivitiesQuery.data],
  );

  const selectedActivity =
    filteredActivities.find(
      (activity: AdminActivity) => activity.id === selectedActivityId,
    ) ?? filteredActivities[0];

  return (
    <>
      <ActivityMetricsCards metrics={metricsQuery.data} />

      <section className="split" style={{ marginTop: 16 }}>
        <ActivityTable
          activities={filteredActivities}
          selectedActivityId={selectedActivity?.id ?? ""}
          filters={filters}
          categoryOptions={categoryOptions}
          onSelect={setSelectedActivityId}
          onFilterChange={setFilters}
        />
        {selectedActivity ? (
          <ActivityDetailPanel activity={selectedActivity} />
        ) : activitiesQuery.isLoading || activitiesQuery.isFetching ? (
          <StatePanel
            title="Loading activities"
            description="Refreshing the user activity journal and applying your filters."
          />
        ) : activitiesQuery.isError ? (
          <StatePanel
            title="Failed to load activities"
            description="The activity journal could not be loaded. Try refreshing the page."
            tone="error"
          />
        ) : (
          <StatePanel
            title="No activities found"
            description="Clear the search or reset the category filter to review user actions again."
            tone="warning"
          />
        )}
      </section>
    </>
  );
}
