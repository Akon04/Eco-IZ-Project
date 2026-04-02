"use client";

type AdminIconName =
  | "dashboard"
  | "users"
  | "activities"
  | "categories"
  | "habits"
  | "achievements"
  | "posts"
  | "staff"
  | "verified"
  | "co2"
  | "points"
  | "colors"
  | "flagged"
  | "review"
  | "hidden"
  | "reports";

type AdminIconProps = {
  name: AdminIconName;
  className?: string;
};

export function AdminIcon({ name, className = "" }: AdminIconProps) {
  const commonProps = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true,
  };

  switch (name) {
    case "dashboard":
      return (
        <svg {...commonProps}>
          <path d="M4 12.5 12 5l8 7.5" />
          <path d="M6.5 10.5V19h11v-8.5" />
        </svg>
      );
    case "users":
      return (
        <svg {...commonProps}>
          <circle cx="9" cy="9" r="2.75" />
          <path d="M4.8 17.8c.7-2.3 2.5-3.8 4.2-3.8s3.5 1.5 4.2 3.8" />
          <circle cx="16.2" cy="8.2" r="2.1" />
          <path d="M14.2 14.9c1.8.2 3.2 1.2 4.1 2.9" />
        </svg>
      );
    case "activities":
      return (
        <svg {...commonProps}>
          <path d="M4 13h3l2-4 4 8 2.5-5H20" />
        </svg>
      );
    case "categories":
      return (
        <svg {...commonProps}>
          <path d="M5 7.5h14" />
          <path d="M5 12h14" />
          <path d="M5 16.5h14" />
          <circle cx="7" cy="7.5" r="1" fill="currentColor" stroke="none" />
          <circle cx="7" cy="12" r="1" fill="currentColor" stroke="none" />
          <circle cx="7" cy="16.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "habits":
      return (
        <svg {...commonProps}>
          <rect x="5" y="5" width="14" height="14" rx="3" />
          <path d="M8 12h8" />
          <path d="M8 9h5" />
          <path d="M8 15h6" />
        </svg>
      );
    case "achievements":
      return (
        <svg {...commonProps}>
          <path d="M12 4 14.3 8.6 19 9.3l-3.4 3.3.8 4.7-4.4-2.3-4.4 2.3.8-4.7L5 9.3l4.7-.7L12 4Z" />
        </svg>
      );
    case "posts":
      return (
        <svg {...commonProps}>
          <rect x="5" y="5" width="14" height="14" rx="3" />
          <path d="M8 10h8" />
          <path d="M8 13h8" />
          <path d="M8 16h5" />
        </svg>
      );
    case "staff":
      return (
        <svg {...commonProps}>
          <path d="M12 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
          <path d="M5 19a7 7 0 0 1 14 0" />
          <path d="m18.5 7.5 1 1 2-2" />
        </svg>
      );
    case "verified":
      return (
        <svg {...commonProps}>
          <path d="M12 4 6 6.5V12c0 4 2.7 6.6 6 8 3.3-1.4 6-4 6-8V6.5L12 4Z" />
          <path d="m9.5 12 1.8 1.8L15 10" />
        </svg>
      );
    case "co2":
      return (
        <svg {...commonProps}>
          <path d="M8 15c0-2.5 1.8-4.5 4-6 2.2 1.5 4 3.5 4 6a4 4 0 1 1-8 0Z" />
        </svg>
      );
    case "points":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="6.8" />
          <path d="M12 7.8v8.4" />
          <path d="M9.4 9.7c.6-.7 1.5-1.1 2.7-1.1 1.7 0 2.8.8 2.8 2.1 0 1.3-1.2 1.9-2.7 2.2-1.7.4-2.8.9-2.8 2.3 0 1 .6 1.7 1.6 2.1" />
          <path d="M10 6.3h4" />
        </svg>
      );
    case "colors":
      return (
        <svg {...commonProps}>
          <path d="M12 5a6.5 6.5 0 1 0 6.5 6.5c0-1.2-.8-2-1.9-2H15c-.8 0-1.5-.7-1.5-1.5V7.4C13.5 6 12.9 5 12 5Z" />
          <circle cx="9" cy="9" r="1" fill="currentColor" stroke="none" />
          <circle cx="8" cy="13" r="1" fill="currentColor" stroke="none" />
          <circle cx="12" cy="15" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "flagged":
      return (
        <svg {...commonProps}>
          <path d="M7 20V5" />
          <path d="M7 6h8.5l-1.7 3.1 1.7 3.1H7" />
          <path d="M7 19.8h6" />
        </svg>
      );
    case "review":
      return (
        <svg {...commonProps}>
          <circle cx="11" cy="11" r="6" />
          <path d="M20 20l-4.2-4.2" />
        </svg>
      );
    case "hidden":
      return (
        <svg {...commonProps}>
          <path d="M3.5 12s3-5 8.5-5 8.5 5 8.5 5-3 5-8.5 5-8.5-5-8.5-5Z" />
          <path d="M9 15 15 9" />
        </svg>
      );
    case "reports":
      return (
        <svg {...commonProps}>
          <path d="M12 4 4 18h16L12 4Z" />
          <path d="M12 9v4" />
          <circle cx="12" cy="16" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
  }
}
