import type { ActivityFilters, AdminActivity } from "@/lib/types";

type ActivityTableProps = {
  activities: AdminActivity[];
  selectedActivityId: string;
  filters: ActivityFilters;
  categoryOptions: string[];
  onSelect: (activityId: string) => void;
  onFilterChange: (filters: ActivityFilters) => void;
};

export function ActivityTable({
  activities,
  selectedActivityId,
  filters,
  categoryOptions,
  onSelect,
  onFilterChange,
}: ActivityTableProps) {
  return (
    <article className="card">
      <div className="section-head">
        <div>
          <h2 className="section-title">Activity log</h2>
          <p className="muted">
            Prepared for `GET /admin/activities` to review user actions and eco impact.
          </p>
        </div>
        <div className="toolbar">
          <label className="inline-field">
            <span className="sr-only">Search activities</span>
            <input
              value={filters.search ?? ""}
              onChange={(event) =>
                onFilterChange({ ...filters, search: event.target.value })
              }
              placeholder="Search user, title, note, or category"
            />
          </label>
          <label className="inline-field">
            <span className="sr-only">Category filter</span>
            <select
              value={filters.category ?? "ALL"}
              onChange={(event) =>
                onFilterChange({
                  ...filters,
                  category: event.target.value,
                })
              }
            >
              <option value="ALL">ALL</option>
              {categoryOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Category</th>
              <th>Activity</th>
              <th>Points</th>
              <th>CO2</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr
                key={activity.id}
                className={selectedActivityId === activity.id ? "table-row-active" : ""}
                onClick={() => onSelect(activity.id)}
              >
                <td>{activity.username}</td>
                <td>{activity.category}</td>
                <td>{activity.title}</td>
                <td>{activity.points}</td>
                <td>{activity.co2Saved.toFixed(1)} kg</td>
                <td>{activity.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}
