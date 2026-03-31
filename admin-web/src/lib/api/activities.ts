import { apiRequest } from "@/lib/api/client";
import { wait } from "@/lib/api/helpers";
import { isMockMode } from "@/lib/config";
import { mockActivities, mockActivityMetrics } from "@/lib/mocks";
import type { ActivityFilters, ActivityMetrics, AdminActivity } from "@/lib/types";

export async function listActivities(
  filters: ActivityFilters = {},
): Promise<AdminActivity[]> {
  if (!isMockMode()) {
    const params = new URLSearchParams();
    if (filters.search?.trim()) params.set("search", filters.search.trim());
    if (filters.category && filters.category !== "ALL") {
      params.set("category", filters.category.trim());
    }

    return apiRequest<AdminActivity[]>(
      `/admin/activities${params.size ? `?${params.toString()}` : ""}`,
    );
  }

  await wait(80);

  return mockActivities.filter((activity) => {
    const query = filters.search?.trim().toLowerCase();
    const matchesSearch =
      !query ||
      activity.title.toLowerCase().includes(query) ||
      activity.category.toLowerCase().includes(query) ||
      activity.username.toLowerCase().includes(query) ||
      activity.userEmail.toLowerCase().includes(query) ||
      activity.note.toLowerCase().includes(query);
    const matchesCategory =
      !filters.category ||
      filters.category === "ALL" ||
      activity.category === filters.category;

    return matchesSearch && matchesCategory;
  });
}

export async function getActivityMetrics(): Promise<ActivityMetrics> {
  if (!isMockMode()) {
    return apiRequest<ActivityMetrics>("/admin/activities/metrics");
  }

  await wait(40);
  return mockActivityMetrics;
}

export async function deleteActivity(activityId: string): Promise<void> {
  if (!isMockMode()) {
    return apiRequest<void>(`/admin/activities/${activityId}`, {
      method: "DELETE",
    });
  }

  await wait(120);

  const index = mockActivities.findIndex((item) => item.id === activityId);
  if (index === -1) {
    throw new Error("Activity not found");
  }

  mockActivities.splice(index, 1);
}
