"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/components/auth-provider";
import { AdminIcon } from "@/components/ui/admin-icon";
import { getNavigation } from "@/lib/navigation";
import brandText from "../../../logo/text.PNG";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  const roleLabels = {
    ADMIN: "Админ",
    MODERATOR: "Модератор",
    USER: "Пользователь",
  } as const;
  const navigation = getNavigation(user?.role ?? null);

  return (
    <aside className="sidebar">
      <div className="brand" aria-label="ECOIZ">
        <Image
          src={brandText}
          alt="ECOIZ"
          className="brand-image"
          priority
        />
      </div>
      <p className="sidebar-note">
        Единая админ-панель для модерации, эко-каталога и контроля данных
        платформы.
      </p>
      <nav className="nav-list" aria-label="Навигация админки">
        {navigation.map((item) => {
          const isActive =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link${isActive ? " active" : ""}`}
            >
              <span className="nav-icon">
                <AdminIcon name={item.icon} className="nav-icon-svg" />
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <strong>{user?.username}</strong>
          <span className="muted">
            {user?.role ? roleLabels[user.role] : ""} · {user?.email}
          </span>
        </div>
        <button
          type="button"
          className="ghost-button danger-button sidebar-button"
          onClick={handleLogout}
        >
          Выйти
        </button>
      </div>
    </aside>
  );
}
