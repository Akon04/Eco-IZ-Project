export type UserRole = "USER" | "ADMIN" | "MODERATOR";
export type UserStatus = "ACTIVE" | "REVIEW" | "SUSPENDED";
export type AdminAppRole = "ADMIN" | "MODERATOR";

export type AdminUser = {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  isEmailVerified: boolean;
  ecoPoints: number;
  streakDays: number;
  postsCount: number;
  createdAt: string;
  status: UserStatus;
};

export type AdminMedia = {
  id: string;
  kind: string;
  base64Data: string;
};

export type AdminUserActivity = {
  id: string;
  category: string;
  title: string;
  co2Saved: number;
  points: number;
  createdAt: string;
};

export type AdminUserChallenge = {
  id: string;
  title: string;
  description: string;
  targetCount: number;
  currentCount: number;
  rewardPoints: number;
  badgeSymbol: string;
  badgeTintHex: number;
  badgeBackgroundHex: number;
  isCompleted: boolean;
  isClaimed: boolean;
};

export type AdminUserPost = {
  id: string;
  author: string;
  content: string;
  state: "Published" | "Needs review" | "Hidden";
  reportsCount: number;
  createdAt: string;
  mediaCount: number;
};

export type AdminUserDetail = AdminUser & {
  fullName: string;
  level: string;
  co2SavedTotal: number;
  adminNote: string;
  recentActivities: AdminUserActivity[];
  challenges: AdminUserChallenge[];
  recentPosts: AdminUserPost[];
};

export type UserFilters = {
  role?: UserRole | "ALL";
  status?: UserStatus | "ALL";
  search?: string;
};

export type UpdateAdminUserPayload = {
  role: UserRole;
  status: UserStatus;
  adminNote: string;
};

export type UserMetrics = {
  totalUsers: number;
  adminCount: number;
  needsReview: number;
  verifiedCount: number;
};

export type AdminActivity = {
  id: string;
  userId: string;
  username: string;
  userEmail: string;
  category: string;
  title: string;
  co2Saved: number;
  points: number;
  note: string;
  createdAt: string;
};

export type AdminActivityDetail = AdminActivity & {
  media: AdminMedia[];
};

export type ActivityFilters = {
  search?: string;
  category?: string | "ALL";
};

export type ActivityMetrics = {
  totalActivities: number;
  totalPoints: number;
  totalCo2Saved: number;
  uniqueUsers: number;
};

export type EcoAnalyticsCategory = {
  category: string;
  count: number;
  co2Saved: number;
};

export type EcoAnalyticsTopUser = {
  userId: string;
  username: string;
  activitiesCount: number;
  ecoPoints: number;
  co2Saved: number;
};

export type EcoAnalytics = {
  categoryBreakdown: EcoAnalyticsCategory[];
  topCategory: string;
  customActivitiesCount: number;
  averageCo2PerActivity: number;
  topUsersByActivity: EcoAnalyticsTopUser[];
};

export type EcoCategory = {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
};

export type CategoryFilters = {
  search?: string;
};

export type UpdateCategoryPayload = {
  name: string;
  description: string;
  color: string;
  icon: string;
};

export type CategoryMetrics = {
  totalCategories: number;
  uniqueColors: number;
  iconCount: number;
};

export type Habit = {
  id: string;
  title: string;
  category: string;
  points: number;
  co2Value: number;
  waterValue: number;
  energyValue: number;
};

export type HabitFilters = {
  search?: string;
  category?: string | "ALL";
};

export type UpdateHabitPayload = {
  title: string;
  category: string;
  points: number;
  co2Value: number;
  waterValue: number;
  energyValue: number;
};

export type HabitMetrics = {
  totalHabits: number;
  totalPoints: number;
  categoriesUsed: number;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  targetValue: number;
  rewardPoints: number;
};

export type AchievementFilters = {
  search?: string;
};

export type UpdateAchievementPayload = {
  title: string;
  description: string;
  icon: string;
  targetValue: number;
  rewardPoints: number;
};

export type AchievementMetrics = {
  totalAchievements: number;
  totalRewardPoints: number;
  maxTargetValue: number;
};

export type CommunityPost = {
  id: string;
  author: string;
  content: string;
  state: "Published" | "Needs review" | "Hidden";
  reportsCount: number;
  createdAt: string;
};

export type CommunityPostDetail = CommunityPost & {
  media: AdminMedia[];
};

export type PostFilters = {
  search?: string;
  state?: CommunityPost["state"] | "ALL";
};

export type UpdatePostPayload = {
  state: CommunityPost["state"];
  moderatorNote: string;
};

export type PostMetrics = {
  totalPosts: number;
  needsReviewPosts: number;
  hiddenPosts: number;
  totalReports: number;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type AuthAdmin = {
  id: string;
  email: string;
  username: string;
  role: AdminAppRole;
};

export type AuthSession = {
  token: string;
  user: AuthAdmin;
};
