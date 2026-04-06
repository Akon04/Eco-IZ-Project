"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { EvidenceGallery } from "@/components/media/evidence-gallery";
import { StatePanel } from "@/components/state-panel";
import { useToast } from "@/components/toast-provider";
import { deleteActivity, getActivityDetail } from "@/lib/api/activities";
import { queryKeys } from "@/lib/query-keys";
import type { AdminActivity } from "@/lib/types";

type ActivityDetailPanelProps = {
  activity: AdminActivity;
};

export function ActivityDetailPanel({ activity }: ActivityDetailPanelProps) {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const detailQuery = useQuery({
    queryKey: queryKeys.activities.detail(activity.id),
    queryFn: () => getActivityDetail(activity.id),
    enabled: Boolean(activity.id),
  });
  const detailedActivity = detailQuery.data ?? activity;

  const deleteMutation = useMutation({
    mutationFn: () => deleteActivity(activity.id),
    onSuccess: async () => {
      showToast({
        tone: "success",
        title: "Активность удалена",
        description: `Запись "${activity.title}" была удалена.`,
      });
      await queryClient.invalidateQueries({ queryKey: queryKeys.activities.all });
      await queryClient.invalidateQueries({ queryKey: queryKeys.activities.metrics });
      await queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.users.detail(activity.userId),
      });
      await queryClient.invalidateQueries({ queryKey: queryKeys.users.metrics });
    },
    onError: () => {
      showToast({
        tone: "error",
        title: "Удаление не удалось",
        description: "Не получилось удалить активность.",
      });
    },
  });

  function formatDate(value: string) {
    return new Intl.DateTimeFormat("ru-RU", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  }

  function onDelete() {
    const confirmed = window.confirm(
      `Удалить активность "${activity.title}"? Это действие нельзя отменить.`,
    );
    if (!confirmed) return;
    deleteMutation.mutate();
  }

  if (detailQuery.isError) {
    return (
      <StatePanel
        title="Не удалось загрузить активность"
        description="Подробности активности сейчас недоступны. Попробуй выбрать запись еще раз."
        tone="error"
      />
    );
  }

  return (
    <article className="card">
      <h2 className="section-title">Выбранная активность</h2>
      {detailQuery.isFetching && !detailQuery.data ? (
        <StatePanel
          title="Загружаем подробности"
          description="Подтягиваем заметку пользователя и фото-отчет."
        />
      ) : null}

      <div className="detail-stack">
        <div className="detail-row">
          <span className="muted">Пользователь</span>
          <strong>{detailedActivity.username}</strong>
        </div>
        <div className="detail-row">
          <span className="muted">Email</span>
          <strong>{detailedActivity.userEmail}</strong>
        </div>
        <div className="detail-row">
          <span className="muted">Категория</span>
          <strong>{detailedActivity.category}</strong>
        </div>
        <div className="detail-row">
          <span className="muted">Название</span>
          <strong>{detailedActivity.title}</strong>
        </div>
        <div className="detail-row">
          <span className="muted">Баллы</span>
          <strong>{detailedActivity.points}</strong>
        </div>
        <div className="detail-row">
          <span className="muted">Сэкономлено CO2</span>
          <strong>{detailedActivity.co2Saved.toFixed(1)} кг</strong>
        </div>
        <div className="detail-row">
          <span className="muted">Создано</span>
          <strong>{formatDate(detailedActivity.createdAt)}</strong>
        </div>
      </div>

      <div className="form-shell">
        <label className="field">
          <span>Заметка пользователя</span>
          <textarea
            rows={5}
            value={
              detailedActivity.note ||
              "Для этой активности заметка не указана."
            }
            readOnly
          />
        </label>
        <EvidenceGallery
          media={detailQuery.data?.media ?? []}
          title="Фото-отчет активности"
        />
        <p className="form-status muted">
          Активности пока редактируются только частично. Этот блок нужен для просмотра, поддержки и удаления.
        </p>
        <div className="button-row">
          <button
            type="button"
            className="ghost-button danger-button"
            onClick={onDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Удаляем..." : "Удалить активность"}
          </button>
        </div>
      </div>
    </article>
  );
}
