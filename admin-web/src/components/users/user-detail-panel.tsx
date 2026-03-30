"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { useToast } from "@/components/toast-provider";
import { getAdminUserDetail, updateAdminUser } from "@/lib/api/users";
import { queryKeys } from "@/lib/query-keys";
import type { AdminUser, AdminUserDetail, UpdateAdminUserPayload } from "@/lib/types";
import { userFormSchema, type UserFormValues } from "@/lib/validation";

type UserDetailPanelProps = {
  user: AdminUser;
};

export function UserDetailPanel({ user }: UserDetailPanelProps) {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const detailQuery = useQuery({
    queryKey: queryKeys.users.detail(user.id),
    queryFn: () => getAdminUserDetail(user.id),
  });
  const detail = detailQuery.data;
  const defaultAdminNote =
    detail?.adminNote ||
    "Role and status changes will later be sent to backend audit logs.";
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
        "Role and status changes will later be sent to backend audit logs.",
    },
  });
  const mutation = useMutation({
    mutationFn: (payload: UpdateAdminUserPayload) => updateAdminUser(user.id, payload),
    onSuccess: async (updated) => {
      showToast({
        tone: "success",
        title: "User updated",
        description: `${updated.username} was updated successfully.`,
      });
      await queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      await queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(user.id) });
    },
    onError: () => {
      showToast({
        tone: "error",
        title: "User update failed",
        description: "The user changes could not be saved.",
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

  function formatDate(value: string) {
    return new Intl.DateTimeFormat("ru-RU", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  }

  function renderEmpty(message: string) {
    return <p className="muted">{message}</p>;
  }

  const displayUser: AdminUser | AdminUserDetail = detail ?? user;

  return (
    <article className="card">
      <h2 className="section-title">Selected user</h2>
      <div className="detail-stack">
        {"fullName" in displayUser ? (
          <div className="detail-row">
            <span className="muted">Full name</span>
            <strong>{displayUser.fullName}</strong>
          </div>
        ) : null}
        <div className="detail-row">
          <span className="muted">Username</span>
          <strong>{displayUser.username}</strong>
        </div>
        <div className="detail-row">
          <span className="muted">Email</span>
          <strong>{displayUser.email}</strong>
        </div>
        <div className="detail-row">
          <span className="muted">Current role</span>
          <strong>{displayUser.role}</strong>
        </div>
        <div className="detail-row">
          <span className="muted">Status</span>
          <strong>{displayUser.status}</strong>
        </div>
        <div className="detail-row">
          <span className="muted">Eco points</span>
          <strong>{displayUser.ecoPoints}</strong>
        </div>
        <div className="detail-row">
          <span className="muted">Streak days</span>
          <strong>{displayUser.streakDays}</strong>
        </div>
        {"level" in displayUser ? (
          <>
            <div className="detail-row">
              <span className="muted">Level</span>
              <strong>{displayUser.level}</strong>
            </div>
            <div className="detail-row">
              <span className="muted">CO2 saved total</span>
              <strong>{displayUser.co2SavedTotal.toFixed(1)} kg</strong>
            </div>
            <div className="detail-row">
              <span className="muted">Posts created</span>
              <strong>{displayUser.postsCount}</strong>
            </div>
            <div className="detail-row">
              <span className="muted">Joined</span>
              <strong>{formatDate(displayUser.createdAt)}</strong>
            </div>
          </>
        ) : null}
      </div>

      <div className="form-shell">
        <h3 className="section-title" style={{ marginBottom: 12 }}>
          Eco stats
        </h3>
        {detailQuery.isLoading ? (
          <p className="muted">Loading user overview...</p>
        ) : (
          <div className="detail-stack">
            <div className="detail-row">
              <span className="muted">Verification</span>
              <strong>{displayUser.isEmailVerified ? "Verified" : "Pending"}</strong>
            </div>
            <div className="detail-row">
              <span className="muted">Challenge progress</span>
              <strong>
                {"challenges" in displayUser
                  ? `${displayUser.challenges.filter((item) => item.isCompleted).length}/${displayUser.challenges.length} completed`
                  : "Loading..."}
              </strong>
            </div>
          </div>
        )}
      </div>

      <div className="form-shell">
        <h3 className="section-title" style={{ marginBottom: 12 }}>
          Recent activities
        </h3>
        {detailQuery.isLoading ? (
          <p className="muted">Loading recent activities...</p>
        ) : "recentActivities" in displayUser && displayUser.recentActivities.length > 0 ? (
          <div className="detail-stack">
            {displayUser.recentActivities.map((activity) => (
              <div key={activity.id} className="detail-row" style={{ alignItems: "flex-start" }}>
                <div>
                  <strong>{activity.title}</strong>
                  <p className="muted">
                    {activity.category} · {activity.points} pts · {activity.co2Saved.toFixed(1)} kg CO2
                  </p>
                </div>
                <span className="muted">{formatDate(activity.createdAt)}</span>
              </div>
            ))}
          </div>
        ) : (
          renderEmpty("No recent activities for this user yet.")
        )}
      </div>

      <div className="form-shell">
        <h3 className="section-title" style={{ marginBottom: 12 }}>
          Challenges
        </h3>
        {detailQuery.isLoading ? (
          <p className="muted">Loading challenge progress...</p>
        ) : "challenges" in displayUser && displayUser.challenges.length > 0 ? (
          <div className="detail-stack">
            {displayUser.challenges.map((challenge) => (
              <div key={challenge.id} className="detail-row" style={{ alignItems: "flex-start" }}>
                <div>
                  <strong>{challenge.title}</strong>
                  <p className="muted">
                    {challenge.currentCount}/{challenge.targetCount} · {challenge.rewardPoints} pts
                  </p>
                </div>
                <strong>
                  {challenge.isClaimed ? "Claimed" : challenge.isCompleted ? "Completed" : "In progress"}
                </strong>
              </div>
            ))}
          </div>
        ) : (
          renderEmpty("No challenge progress yet.")
        )}
      </div>

      <div className="form-shell">
        <h3 className="section-title" style={{ marginBottom: 12 }}>
          Recent posts
        </h3>
        {detailQuery.isLoading ? (
          <p className="muted">Loading recent posts...</p>
        ) : "recentPosts" in displayUser && displayUser.recentPosts.length > 0 ? (
          <div className="detail-stack">
            {displayUser.recentPosts.map((post) => (
              <div key={post.id} className="detail-row" style={{ alignItems: "flex-start" }}>
                <div>
                  <strong>{post.content || "Media-only post"}</strong>
                  <p className="muted">
                    {post.state} · {post.visibility} · {post.reportsCount} reports
                    {post.mediaCount > 0 ? ` · ${post.mediaCount} media` : ""}
                  </p>
                </div>
                <span className="muted">{formatDate(post.createdAt)}</span>
              </div>
            ))}
          </div>
        ) : (
          renderEmpty("No posts from this user yet.")
        )}
      </div>

      <div className="form-shell">
        <label className="field">
          <span>Role</span>
          <select {...register("role")}>
            <option value="USER">USER</option>
            <option value="MODERATOR">MODERATOR</option>
            <option value="ADMIN">ADMIN</option>
          </select>
          {errors.role ? <p className="field-error">{errors.role.message}</p> : null}
        </label>

        <label className="field">
          <span>Status</span>
          <select {...register("status")}>
            <option value="ACTIVE">ACTIVE</option>
            <option value="REVIEW">REVIEW</option>
            <option value="SUSPENDED">SUSPENDED</option>
          </select>
          {errors.status ? (
            <p className="field-error">{errors.status.message}</p>
          ) : null}
        </label>

        <label className="field">
          <span>Admin note</span>
          <textarea rows={4} {...register("adminNote")} />
          {errors.adminNote ? (
            <p className="field-error">{errors.adminNote.message}</p>
          ) : null}
        </label>

        <p className="form-status muted">
          {isDirty ? "You have unsaved user changes." : "No unsaved changes."}
        </p>

        <div className="button-row">
          <button
            type="button"
            className="primary-button"
            onClick={handleSubmit(onSubmit)}
            disabled={mutation.isPending || !isDirty}
          >
            {mutation.isPending ? "Saving..." : "Save changes"}
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
            Suspend user
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
            Reset
          </button>
        </div>
      </div>
    </article>
  );
}
