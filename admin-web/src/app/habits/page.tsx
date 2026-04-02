import { PageHeader } from "@/components/page-header";
import { HabitsWorkspace } from "@/components/habits/habits-workspace";
import { getHabitMetrics, listHabits } from "@/lib/api/habits";
import { isMockMode } from "@/lib/config";

export default async function HabitsPage() {
  const [habits, metrics] = isMockMode()
    ? await Promise.all([listHabits(), getHabitMetrics()])
    : await Promise.all([
        Promise.resolve([]),
        Promise.resolve({
          totalHabits: 0,
          totalPoints: 0,
          categoriesUsed: 0,
        }),
      ]);

  return (
    <>
      <PageHeader
        title="Каталог активностей"
        description="Просмотр фиксированного каталога активностей, баллов и эко-показателей."
      />
      <HabitsWorkspace initialHabits={habits} metrics={metrics} />
    </>
  );
}
