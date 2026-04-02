import type { CommunityPost, UserStatus } from "@/lib/types";

export function userStatusBadgeClass(status: UserStatus) {
  switch (status) {
    case "ACTIVE":
      return "pill pill-status pill-status-active";
    case "REVIEW":
      return "pill pill-status pill-status-review";
    case "SUSPENDED":
      return "pill pill-status pill-status-suspended";
  }
}

export function userRoleBadgeClass(role: "USER" | "ADMIN" | "MODERATOR") {
  switch (role) {
    case "ADMIN":
      return "pill pill-role pill-role-admin";
    case "MODERATOR":
      return "pill pill-role pill-role-moderator";
    case "USER":
      return "pill pill-role pill-role-user";
  }
}

export function postStateBadgeClass(state: CommunityPost["state"]) {
  switch (state) {
    case "Published":
      return "pill pill-status pill-status-published";
    case "Flagged":
      return "pill pill-status pill-status-flagged";
    case "Needs review":
      return "pill pill-status pill-status-review";
    case "Hidden":
      return "pill pill-status pill-status-hidden";
  }
}
