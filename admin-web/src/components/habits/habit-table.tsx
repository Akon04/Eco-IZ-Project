import type { Habit, HabitFilters } from "@/lib/types";

type HabitTableProps = {
  habits: Habit[];
  selectedHabitId: string;
  filters: HabitFilters;
  categoryOptions: string[];
  onSelect: (habitId: string) => void;
  onFilterChange: (filters: HabitFilters) => void;
};

function habitCategoryRowClass(category: string) {
  switch (category) {
    case "Транспорт":
      return "habit-row-transport";
    case "Вода":
      return "habit-row-water";
    case "Пластик":
      return "habit-row-plastic";
    case "Отходы":
      return "habit-row-waste";
    case "Энергия":
      return "habit-row-energy";
    default:
      return "";
  }
}

export function HabitTable({
  habits,
  selectedHabitId,
  filters,
  categoryOptions,
  onSelect,
  onFilterChange,
}: HabitTableProps) {
  return (
    <article className="card">
      <div className="section-head">
        <div>
          <h2 className="section-title">Каталог активностей</h2>
        </div>
        <div className="toolbar">
          <label className="inline-field inline-field-wide">
            <span className="sr-only">Поиск активностей</span>
            <input
              value={filters.search ?? ""}
              onChange={(event) =>
                onFilterChange({ ...filters, search: event.target.value })
              }
              placeholder="Поиск по названию или категории"
            />
          </label>
          <label className="inline-field">
            <span className="sr-only">Фильтр по категории</span>
            <select
              value={filters.category ?? "ALL"}
              onChange={(event) =>
                onFilterChange({
                  ...filters,
                  category: event.target.value,
                })
              }
            >
              <option value="ALL">Все</option>
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
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
              <th>Активность</th>
              <th>Категория</th>
              <th>Баллы</th>
              <th>CO2</th>
              <th>Вода</th>
              <th>Энергия</th>
            </tr>
          </thead>
          <tbody>
            {habits.map((habit) => (
              <tr
                key={habit.id}
                className={`${selectedHabitId === habit.id ? "table-row-active " : ""}${habitCategoryRowClass(habit.category)}`.trim()}
                onClick={() => onSelect(habit.id)}
              >
                <td>{habit.title}</td>
                <td>{habit.category}</td>
                <td>{habit.points}</td>
                <td>{habit.co2Value}</td>
                <td>{habit.waterValue}</td>
                <td>{habit.energyValue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}
