"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { useToast } from "@/components/toast-provider";
import { deleteAdminUser, getAdminUserDetail, updateAdminUser } from "@/lib/api/users";
import { queryKeys } from "@/lib/query-keys";
import type { AdminUser, AdminUserDetail, UpdateAdminUserPayload } from "@/lib/types";
import { userFormSchema, type UserFormValues } from "@/lib/validation";

type UserDetailPanelProps = {
  user: AdminUser;
};

const roleLabels = {
  ADMIN: "Админ",
  MODERATOR: "Модератор",
  USER: "Пользователь",
} as const;

const statusLabels = {
  ACTIVE: "Активный",
  REVIEW: "На проверке",
  SUSPENDED: "Приостановлен",
} as const;

export function UserDetailPanel({ user }: UserDetailPanelProps) {
  const [activitiesExpanded, setActivitiesExpanded] = useState(false);
  const [challengesExpanded, setChallengesExpanded] = useState(false);
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const detailQuery = useQuery({
    queryKey: queryKeys.users.detail(user.id),
    queryFn: () => getAdminUserDetail(user.id),
  });
  const detail = detailQuery.data;
  const defaultAdminNote =
    detail?.adminNote ||
    "Изменения роли и статуса позже будут попадать в аудит-лог backend.";
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      role: user.role,
      status: user.status,
      adminNote:
        "Изменения роли и статуса позже будут попадать в аудит-лог backend.",
    },
  });
  const mutation = useMutation({
    mutationFn: (payload: UpdateAdminUserPayload) => updateAdminUser(user.id, payload),
    onSuccess: async (updated) => {
      showToast({
        tone: "success",
        title: "Пользователь обновлен",
        description: `Изменения для ${updated.username} сохранены.`,
      });
      await queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      await queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(user.id) });
    },
    onError: () => {
      showToast({
        tone: "error",
        title: "Не удалось сохранить",
        description: "Изменения пользователя не были сохранены.",
      });
    },
  });
  const deleteMutation = useMutation({
    mutationFn: () => deleteAdminUser(user.id),
    onSuccess: async () => {
      showToast({
        tone: "success",
        title: "Пользователь удален",
        description: `Аккаунт ${user.username} был удален.`,
      });
      await queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
    onError: () => {
      showToast({
        tone: "error",
        title: "Удаление не удалось",
        description: "Не получилось удалить пользователя.",
      });
    },
  });

  useEffect(() => {
    reset({
      role: detail?.role ?? user.role,
      status: detail?.status ?? user.status,
      adminNote: detail?.adminNote || defaultAdminNote,
    });
  }, [defaultAdminNote, detail, reset, user]);

  function onSubmit(values: UserFormValues) {
    mutation.mutate(values);
  }

  function onDelete() {
    const confirmed = window.confirm(
      `Удалить пользователя ${user.username}? Это действие нельзя отменить.`,
    );
    if (!confirmed) return;
    deleteMutation.mutate();
  }

  function formatDate(value: string) {
    return new Intl.DateTimeFormat("ru-RU", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  }

  function renderEmpty(message: string) {
    return <p className="muted">{message}</p>;
  }

  function renderSectionHeader(
    title: string,
    expanded: boolean,
    onToggle: () => void,
  ) {
    return (
      <div
        style={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <h3 className="section-title" style={{ marginBottom: 0 }}>
          {title}
        </h3>
        <button
          className="ghost-button"
          type="button"
          onClick={onToggle}
        >
          {expanded ? "Свернуть" : "Развернуть"}
        </button>
      </div>
    );
  }

  const displayUser: AdminUser | AdminUserDetail = detail ?? user;
  const sortedChallenges =
    "challenges" in displayUser
      ? [...displayUser.challenges].sort((left, right) => {
          const leftPriority =
            left.isClaimed || left.isCompleted || left.currentCount > 0 ? 0 : 1;
          const rightPriority =
            right.isClaimed || right.isCompleted || right.currentCount > 0 ? 0 : 1;
          if (leftPriority !== rightPriority) return leftPriority - rightPriority;
          if (left.isCompleted !== right.isCompleted) return left.isCompleted ? -1 : 1;
          return right.currentCount - left.currentCount;
        })
      : [];

  return (
    <article className="card">
      <h2 className="section-title">Выбранный пользователь</h2>
      <div className="detail-stack">
        {"fullName" in displayUser ? (
          <div className="detail-row">
            <span className="muted">Полное имя</span>
            <strong>{displayUser.fullName}</strong>
          </div>
        ) : null}
        <div className="detail-row">
          <span className="muted">Имя пользователя</span>
          <strong>{displayUser.username}</strong>
        </div>
        <div className="detail-row">
          <span className="muted">Email</span>
          <strong>{displayUser.email}</strong>
        </div>
        <div className="detail-row">
          <span className="muted">Текущая роль</span>
          <strong>{roleLabels[displayUser.role]}</strong>
        </div>
        <div className="detail-row">
          <span className="muted">Статус</span>
          <strong>{statusLabels[displayUser.status]}</strong>
        </div>
        <div className="detail-row">
          <span className="muted">Eco баллы</span>
          <strong>{displayUser.ecoPoints}</strong>
        </div>
        <div className="detail-row">
          <span className="muted">Серия дней</span>
          <strong>{displayUser.streakDays}</strong>
        </div>
        {"level" in displayUser ? (
          <>
            <div className="detail-row">
              <span className="muted">Уровень</span>
              <strong>{displayUser.level}</strong>
            </div>
            <div className="detail-row">
              <span className="muted">Суммарно CO2</span>
              <strong>{displayUser.co2SavedTotal.toFixed(1)} kg</strong>
            </div>
            <div className="detail-row">
              <span className="muted">Создано постов</span>
              <strong>{displayUser.postsCount}</strong>
            </div>
            <div className="detail-row">
              <span className="muted">Дата регистрации</span>
              <strong>{formatDate(displayUser.createdAt)}</strong>
            </div>
          </>
        ) : null}
      </div>

      <div className="form-shell">
        <h3 className="section-title" style={{ marginBottom: 12 }}>
          Eco статистика
        </h3>
        {detailQuery.isLoading ? (
          <p className="muted">Загружаем сводку по пользователю...</p>
        ) : (
          <div className="detail-stack">
            <div className="detail-row">
              <span className="muted">Подтверждение</span>
              <strong>{displayUser.isEmailVerified ? "Подтвержден" : "Ожидает"}</strong>
            </div>
            <div className="detail-row">
              <span className="muted">Прогресс ачивок</span>
              <strong>
                {"challenges" in displayUser
                  ? `${displayUser.challenges.filter((item) => item.isCompleted).length}/${displayUser.challenges.length} завершено`
                  : "Загрузка..."}
              </strong>
            </div>
          </div>
        )}
        <div className="button-row">
          <Link
            className="ghost-button"
            href={`/activities?search=${encodeURIComponent(displayUser.email)}`}
          >
            Активности пользователя
          </Link>
          <Link
            className="ghost-button"
            href={`/posts?search=${encodeURIComponent(
              "fullName" in displayUser ? displayUser.fullName : displayUser.username,
            )}`}
          >
            Посты пользователя
          </Link>
        </div>
      </div>

      <div className="form-shell">
        {renderSectionHeader("Последние активности", activitiesExpanded, () =>
          setActivitiesExpanded((current) => !current),
        )}
        {detailQuery.isLoading ? (
          <p className="muted">Загружаем последние активности...</p>
        ) : !activitiesExpanded ? (
          <p className="muted">
            {"recentActivities" in displayUser
              ? `${displayUser.recentActivities.length} скрыто`
              : "Разверни блок, чтобы увидеть активности."}
          </p>
        ) : "recentActivities" in displayUser && displayUser.recentActivities.length > 0 ? (
          <div className="detail-stack">
            {displayUser.recentActivities.map((activity) => (
              <div key={activity.id} className="detail-row" style={{ alignItems: "flex-start" }}>
                <div>
                  <strong>{activity.title}</strong>
                  <p className="muted">
                    {activity.category} · {activity.points} баллов · {activity.co2Saved.toFixed(1)} кг CO2
                  </p>
                </div>
                <span className="muted">{formatDate(activity.createdAt)}</span>
              </div>
            ))}
          </div>
        ) : (
          renderEmpty("У этого пользователя пока нет недавних активностей.")
        )}
      </div>

      <div className="form-shell">
        {renderSectionHeader("Ачивки", challengesExpanded, () =>
          setChallengesExpanded((current) => !current),
        )}
        {detailQuery.isLoading ? (
          <p className="muted">Загружаем прогресс по ачивкам...</p>
        ) : !challengesExpanded ? (
          <p className="muted">
            {"challenges" in displayUser
              ? `${displayUser.challenges.length} скрыто`
              : "Разверни блок, чтобы увидеть прогресс."}
          </p>
        ) : "challenges" in displayUser && sortedChallenges.length > 0 ? (
          <div className="detail-stack">
            {sortedChallenges.map((challenge) => (
              <div key={challenge.id} className="detail-row" style={{ alignItems: "flex-start" }}>
                <div>
                  <strong>{challenge.title}</strong>
                  <p className="muted">
                    {challenge.currentCount}/{challenge.targetCount} · {challenge.rewardPoints} баллов
                  </p>
                </div>
                <strong>
                  {challenge.isClaimed ? "Получено" : challenge.isCompleted ? "Завершено" : "В процессе"}
                </strong>
              </div>
            ))}
          </div>
        ) : (
          renderEmpty("Прогресс по ачивкам пока пустой.")
        )}
      </div>

      <div className="form-shell">
        <h3 className="section-title" style={{ marginBottom: 12 }}>
          Последние посты
        </h3>
        {detailQuery.isLoading ? (
          <p className="muted">Загружаем посты пользователя...</p>
        ) : "recentPosts" in displayUser && displayUser.recentPosts.length > 0 ? (
          <div className="detail-stack">
            {displayUser.recentPosts.map((post) => (
              <div key={post.id} className="detail-row" style={{ alignItems: "flex-start" }}>
                <div>
                  <strong>{post.content || "Пост только с медиа"}</strong>
                  <p className="muted">
                    {post.state} · {post.visibility} · {post.reportsCount} жалоб
                    {post.mediaCount > 0 ? ` · ${post.mediaCount} медиа` : ""}
                  </p>
                </div>
                <span className="muted">{formatDate(post.createdAt)}</span>
              </div>
            ))}
          </div>
        ) : (
          renderEmpty("У пользователя пока нет постов.")
        )}
      </div>

      <div className="form-shell">
        <label className="field">
          <span>Роль</span>
          <select {...register("role")}>
            <option value="USER">Пользователь</option>
            <option value="MODERATOR">Модератор</option>
            <option value="ADMIN">Админ</option>
          </select>
          {errors.role ? <p className="field-error">{errors.role.message}</p> : null}
        </label>

        <label className="field">
          <span>Статус</span>
          <select {...register("status")}>
            <option value="ACTIVE">Активный</option>
            <option value="REVIEW">На проверке</option>
            <option value="SUSPENDED">Приостановлен</option>
          </select>
          {errors.status ? (
            <p className="field-error">{errors.status.message}</p>
          ) : null}
        </label>

        <label className="field">
          <span>Заметка админа</span>
          <textarea rows={4} {...register("adminNote")} />
          {errors.adminNote ? (
            <p className="field-error">{errors.adminNote.message}</p>
          ) : null}
        </label>

        <p className="form-status muted">
          {isDirty ? "Есть несохраненные изменения." : "Изменений нет."}
        </p>

        <div className="button-row">
          <button
            type="button"
            className="primary-button"
            onClick={handleSubmit(onSubmit)}
            disabled={mutation.isPending || !isDirty}
          >
            {mutation.isPending ? "Сохраняем..." : "Сохранить"}
          </button>
          <button
            type="button"
            className="ghost-button"
            onClick={() =>
              setValue("status", "SUSPENDED", {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
          >
            Приостановить
          </button>
          <button
            type="button"
            className="ghost-button danger-button"
            onClick={onDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Удаляем..." : "Удалить пользователя"}
          </button>
          <button
            type="button"
            className="ghost-button"
            onClick={() =>
              reset({
                role: detail?.role ?? user.role,
                status: detail?.status ?? user.status,
                adminNote: detail?.adminNote || defaultAdminNote,
              })
            }
            disabled={!isDirty}
          >
            Сбросить
          </button>
        </div>
      </div>
    </article>
  );
}
