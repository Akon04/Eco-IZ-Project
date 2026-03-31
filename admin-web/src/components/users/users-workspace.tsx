"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { StatePanel } from "@/components/state-panel";
import { UserDetailPanel } from "@/components/users/user-detail-panel";
import { UserMetricsCards } from "@/components/users/user-metrics";
import { UserTable } from "@/components/users/user-table";
import { getAdminUserMetrics, listAdminUsers } from "@/lib/api/users";
import { queryKeys } from "@/lib/query-keys";
import type { AdminUser, UserFilters, UserMetrics } from "@/lib/types";

type UsersWorkspaceProps = {
  initialUsers: AdminUser[];
  metrics: UserMetrics;
};

export function UsersWorkspace({
  initialUsers,
  metrics,
}: UsersWorkspaceProps) {
  const [filters, setFilters] = useState<UserFilters>({
    role: "ALL",
    status: "ALL",
    search: "",
  });
  const [selectedUserId, setSelectedUserId] = useState(initialUsers[0]?.id ?? "");
  const deferredSearch = useDeferredValue(filters.search ?? "");
  const queryFilters = useMemo(
    () => ({ ...filters, search: deferredSearch }),
    [deferredSearch, filters],
  );
  const filtersKey = JSON.stringify(queryFilters);

  const usersQuery = useQuery({
    queryKey: queryKeys.users.list(filtersKey),
    queryFn: () => listAdminUsers(queryFilters),
    initialData: initialUsers,
    placeholderData: (previousData) => previousData,
  });

  const metricsQuery = useQuery({
    queryKey: queryKeys.users.metrics,
    queryFn: getAdminUserMetrics,
    initialData: metrics,
  });

  const filteredUsers = usersQuery.data;

  const selectedUser =
    filteredUsers.find((user: AdminUser) => user.id === selectedUserId) ??
    filteredUsers[0];

  return (
    <>
      <UserMetricsCards metrics={metricsQuery.data} />

      <section className="split" style={{ marginTop: 16 }}>
        <UserTable
          users={filteredUsers}
          selectedUserId={selectedUser?.id ?? ""}
          filters={filters}
          onSelect={setSelectedUserId}
          onFilterChange={setFilters}
        />
        {selectedUser ? (
          <UserDetailPanel user={selectedUser} />
        ) : usersQuery.isLoading || usersQuery.isFetching ? (
          <StatePanel
            title="Загружаем пользователей"
            description="Обновляем список пользователей и применяем выбранные фильтры."
          />
        ) : usersQuery.isError ? (
          <StatePanel
            title="Не удалось загрузить пользователей"
            description="Список пользователей сейчас недоступен. Попробуй обновить страницу."
            tone="error"
          />
        ) : (
          <StatePanel
            title="Пользователи не найдены"
            description="Сбрось поиск или измени фильтры по роли и статусу, чтобы снова увидеть пользователей."
            tone="warning"
          />
        )}
      </section>
    </>
  );
}
