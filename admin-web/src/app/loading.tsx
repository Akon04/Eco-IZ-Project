import { StatePanel } from "@/components/state-panel";

export default function Loading() {
  return (
    <div className="auth-shell">
      <StatePanel
        title="Загружаем админку"
        description="Подготавливаем данные панели и восстанавливаем текущую сессию."
      />
    </div>
  );
}
