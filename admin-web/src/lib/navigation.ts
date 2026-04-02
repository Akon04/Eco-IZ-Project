import type { AdminAppRole } from "@/lib/types";

const navigation = [
  { href: "/", label: "Панель", icon: "dashboard" },
  { href: "/users", label: "Пользователи", icon: "users" },
  { href: "/activities", label: "Активности", icon: "activities" },
  { href: "/categories", label: "Категории", icon: "categories" },
  { href: "/habits", label: "Каталог активностей", icon: "habits" },
  { href: "/achievements", label: "Ачивки", icon: "achievements" },
  { href: "/posts", label: "Посты", icon: "posts" },
] as const;

export function getNavigation(role?: AdminAppRole | null) {
  if (role === "MODERATOR") {
    return navigation.filter((item) =>
      ["/", "/users", "/activities", "/posts"].includes(item.href),
    );
  }

  return navigation;
}
