"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { EvidenceGallery } from "@/components/media/evidence-gallery";
import { StatePanel } from "@/components/state-panel";
import { useToast } from "@/components/toast-provider";
import { deletePost, getPostDetail, updatePost } from "@/lib/api/posts";
import { queryKeys } from "@/lib/query-keys";
import type { CommunityPost, UpdatePostPayload } from "@/lib/types";
import { postFormSchema, type PostFormValues } from "@/lib/validation";

type PostDetailPanelProps = {
  post: CommunityPost;
};

export function PostDetailPanel({ post }: PostDetailPanelProps) {
  const moderatorPlaceholder =
    "Оставь пустым, чтобы использовать стандартный текст модерации.";
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const detailQuery = useQuery({
    queryKey: queryKeys.posts.detail(post.id),
    queryFn: () => getPostDetail(post.id),
    enabled: Boolean(post.id),
  });
  const detailedPost = detailQuery.data ?? post;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      state: post.state,
      moderatorNote: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (payload: UpdatePostPayload) => updatePost(post.id, payload),
    onSuccess: async (updated) => {
      showToast({
        tone: "success",
        title: "Модерация сохранена",
        description: `Изменения для поста ${updated.author} сохранены.`,
      });
      await queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
      await queryClient.invalidateQueries({ queryKey: queryKeys.posts.metrics });
      await queryClient.invalidateQueries({ queryKey: queryKeys.posts.detail(post.id) });
    },
    onError: () => {
      showToast({
        tone: "error",
        title: "Не удалось сохранить",
        description: "Изменения модерации не были сохранены.",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deletePost(post.id),
    onSuccess: async () => {
      showToast({
        tone: "success",
        title: "Пост удален",
        description: `Пост от ${post.author} был удален.`,
      });
      await queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
      await queryClient.invalidateQueries({ queryKey: queryKeys.posts.metrics });
      await queryClient.removeQueries({ queryKey: queryKeys.posts.detail(post.id) });
    },
    onError: () => {
      showToast({
        tone: "error",
        title: "Удаление не удалось",
        description: "Не получилось удалить пост.",
      });
    },
  });

  useEffect(() => {
    reset({
      state: detailedPost.state,
      moderatorNote: detailQuery.data?.moderatorNote ?? "",
    });
  }, [detailQuery.data?.moderatorNote, detailedPost.state, post.id, reset]);

  function onSubmit(values: PostFormValues) {
    mutation.mutate(values);
  }

  function onDelete() {
    const confirmed = window.confirm(
      `Удалить пост от ${post.author}? Это действие нельзя отменить.`,
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

  if (detailQuery.isError) {
    return (
      <StatePanel
        title="Не удалось загрузить пост"
        description="Подробности поста сейчас недоступны. Попробуй выбрать запись еще раз."
        tone="error"
      />
    );
  }

  return (
    <article className="card">
      <h2 className="section-title">Выбранный пост</h2>
      {detailQuery.isFetching && !detailQuery.data ? (
        <StatePanel
          title="Загружаем подробности"
          description="Подтягиваем текст поста и фото-доказательства."
        />
      ) : null}

      <div className="detail-stack">
        <div className="detail-row">
          <span className="muted">Автор</span>
          <strong>{detailedPost.author}</strong>
        </div>
        <div className="detail-row">
          <span className="muted">Жалобы</span>
          <strong>{detailedPost.reportsCount}</strong>
        </div>
        <div className="detail-row">
          <span className="muted">Создан</span>
          <strong>{formatDate(detailedPost.createdAt)}</strong>
        </div>
      </div>

      {(detailQuery.data?.reportReasons?.length ?? 0) > 0 ? (
        <div className="card inset-card">
          <p className="muted">Причины жалоб</p>
          <p>{detailQuery.data?.reportReasons.join(" • ")}</p>
        </div>
      ) : null}

      <div className="card inset-card">
        <p className="muted">Содержимое поста</p>
        <p>{detailedPost.content || "У этого поста нет текста, только медиа."}</p>
      </div>

      <EvidenceGallery
        media={detailQuery.data?.media ?? []}
        title="Фото в посте"
      />

      <div className="form-shell" style={{ marginTop: 16 }}>
        <label className="field">
          <span>Статус модерации</span>
          <select {...register("state")}>
            <option value="Published">Опубликован</option>
            <option value="Needs review">Нужна проверка</option>
            <option value="Hidden">Скрыт</option>
          </select>
          {errors.state ? (
            <p className="field-error">{errors.state.message}</p>
          ) : null}
        </label>

        <label className="field">
          <span>Заметка модератора</span>
          <textarea
            rows={4}
            placeholder={moderatorPlaceholder}
            {...register("moderatorNote")}
          />
          {errors.moderatorNote ? (
            <p className="field-error">{errors.moderatorNote.message}</p>
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
              setValue("state", "Hidden", {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
          >
            Скрыть пост
          </button>
          <button
            type="button"
            className="ghost-button danger-button"
            onClick={onDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Удаляем..." : "Удалить пост"}
          </button>
          <button
            type="button"
            className="ghost-button"
            onClick={() =>
              reset({
                state: detailedPost.state,
                moderatorNote: detailQuery.data?.moderatorNote ?? "",
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
