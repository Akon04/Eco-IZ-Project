import { AdminIcon } from "@/components/ui/admin-icon";

type MetricCardItem = {
  label: string;
  value: string | number;
  note: string;
  icon?:
    | "posts"
    | "flagged"
    | "review"
    | "hidden"
    | "reports"
    | "users"
    | "staff"
    | "verified"
    | "activities"
    | "points"
    | "co2"
    | "categories"
    | "colors"
    | "habits"
    | "achievements";
};

type MetricCardsProps = {
  items: MetricCardItem[];
  columns?: "three" | "four" | "five";
};

export function MetricCards({
  items,
  columns = "four",
}: MetricCardsProps) {
  return (
    <section
      className={`grid ${
        columns === "three" ? "grid-three" : columns === "five" ? "grid-five" : "cards"
      }`}
    >
      {items.map((item) => (
        <article key={item.label} className="card metric-card">
          {item.icon ? (
            <span className={`metric-icon metric-icon-${item.icon}`}>
              <AdminIcon name={item.icon} className="metric-icon-svg" />
            </span>
          ) : null}
          <p className="muted">{item.label}</p>
          <p className="metric">{item.value}</p>
          <p className="muted">{item.note}</p>
        </article>
      ))}
    </section>
  );
}
