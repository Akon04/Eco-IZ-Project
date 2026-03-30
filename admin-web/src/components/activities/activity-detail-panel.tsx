import type { AdminActivity } from "@/lib/types";

type ActivityDetailPanelProps = {
  activity: AdminActivity;
};

export function ActivityDetailPanel({ activity }: ActivityDetailPanelProps) {
  function formatDate(value: string) {
    return new Intl.DateTimeFormat("ru-RU", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  }

  return (
    <article className="card">
      <h2 className="section-title">Selected activity</h2>
      <div className="detail-stack">
        <div className="detail-row">
          <span className="muted">User</span>
          <strong>{activity.username}</strong>
        </div>
        <div className="detail-row">
          <span className="muted">Email</span>
          <strong>{activity.userEmail}</strong>
        </div>
        <div className="detail-row">
          <span className="muted">Category</span>
          <strong>{activity.category}</strong>
        </div>
        <div className="detail-row">
          <span className="muted">Title</span>
          <strong>{activity.title}</strong>
        </div>
        <div className="detail-row">
          <span className="muted">Points</span>
          <strong>{activity.points}</strong>
        </div>
        <div className="detail-row">
          <span className="muted">CO2 saved</span>
          <strong>{activity.co2Saved.toFixed(1)} kg</strong>
        </div>
        <div className="detail-row">
          <span className="muted">Created</span>
          <strong>{formatDate(activity.createdAt)}</strong>
        </div>
      </div>

      <div className="form-shell">
        <label className="field">
          <span>User note</span>
          <textarea
            rows={5}
            value={activity.note || "No note provided for this activity."}
            readOnly
          />
        </label>
        <p className="form-status muted">
          Activities are currently read-only in admin. This panel is for review and support.
        </p>
      </div>
    </article>
  );
}
