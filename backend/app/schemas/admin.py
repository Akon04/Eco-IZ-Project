from datetime import datetime

from pydantic import BaseModel, EmailStr


class AdminLoginRequest(BaseModel):
    email: EmailStr
    password: str


class AdminUserResponse(BaseModel):
    id: str
    username: str
    email: str
    role: str
    isEmailVerified: bool
    ecoPoints: int
    streakDays: int
    postsCount: int
    createdAt: datetime
    status: str


class AdminUserActivityResponse(BaseModel):
    id: str
    userId: str
    username: str
    userEmail: str
    category: str
    title: str
    co2Saved: float
    points: int
    note: str
    createdAt: datetime


class AdminActivityDetailResponse(AdminUserActivityResponse):
    media: list["AdminMediaResponse"]


class AdminUserChallengeResponse(BaseModel):
    id: str
    title: str
    description: str
    targetCount: int
    currentCount: int
    rewardPoints: int
    badgeSymbol: str
    badgeTintHex: int
    badgeBackgroundHex: int
    isCompleted: bool
    isClaimed: bool


class AdminUserPostResponse(BaseModel):
    id: str
    author: str
    content: str
    state: str
    reportsCount: int
    createdAt: datetime
    mediaCount: int


class AdminMediaResponse(BaseModel):
    id: str
    kind: str
    base64Data: str


class AdminUserDetailResponse(AdminUserResponse):
    fullName: str
    level: str
    co2SavedTotal: float
    adminNote: str
    recentActivities: list[AdminUserActivityResponse]
    challenges: list[AdminUserChallengeResponse]
    recentPosts: list[AdminUserPostResponse]


class AdminUserMetrics(BaseModel):
    totalUsers: int
    adminCount: int
    needsReview: int
    verifiedCount: int


class AdminActivityMetrics(BaseModel):
    totalActivities: int
    totalPoints: int
    totalCo2Saved: float
    uniqueUsers: int


class EcoAnalyticsCategoryResponse(BaseModel):
    category: str
    count: int
    co2Saved: float


class EcoAnalyticsTopUserResponse(BaseModel):
    userId: str
    username: str
    activitiesCount: int
    ecoPoints: int
    co2Saved: float


class EcoAnalyticsResponse(BaseModel):
    categoryBreakdown: list[EcoAnalyticsCategoryResponse]
    topCategory: str
    customActivitiesCount: int
    averageCo2PerActivity: float
    topUsersByActivity: list[EcoAnalyticsTopUserResponse]


class UpdateAdminUserRequest(BaseModel):
    role: str
    status: str
    adminNote: str = ""


class EcoCategoryResponse(BaseModel):
    id: str
    name: str
    description: str
    color: str
    icon: str


class CategoryMetricsResponse(BaseModel):
    totalCategories: int
    uniqueColors: int
    iconCount: int


class UpdateCategoryRequest(BaseModel):
    name: str
    description: str
    color: str
    icon: str


class CreateCategoryRequest(UpdateCategoryRequest):
    pass


class HabitResponse(BaseModel):
    id: str
    title: str
    category: str
    points: int
    co2Value: float
    waterValue: float
    energyValue: float


class HabitMetricsResponse(BaseModel):
    totalHabits: int
    totalPoints: int
    categoriesUsed: int


class UpdateHabitRequest(BaseModel):
    title: str
    category: str
    points: int
    co2Value: float
    waterValue: float
    energyValue: float


class CreateHabitRequest(UpdateHabitRequest):
    description: str = ""


class AchievementResponse(BaseModel):
    id: str
    title: str
    description: str
    icon: str
    targetValue: int
    rewardPoints: int


class AchievementMetricsResponse(BaseModel):
    totalAchievements: int
    totalRewardPoints: int
    maxTargetValue: int


class UpdateAchievementRequest(BaseModel):
    title: str
    description: str
    icon: str
    targetValue: int
    rewardPoints: int


class CreateAchievementRequest(UpdateAchievementRequest):
    badgeTintHex: int = 0x43B244
    badgeBackgroundHex: int = 0xEAF8DF


class CommunityPostResponse(BaseModel):
    id: str
    author: str
    content: str
    state: str
    reportsCount: int
    createdAt: datetime


class CommunityPostDetailResponse(CommunityPostResponse):
    media: list[AdminMediaResponse]


class PostMetricsResponse(BaseModel):
    totalPosts: int
    needsReviewPosts: int
    hiddenPosts: int
    totalReports: int


class UpdatePostRequest(BaseModel):
    state: str
    moderatorNote: str = ""


class CreateAdminPostRequest(BaseModel):
    author: str
    content: str
    state: str = "Published"
    reportsCount: int = 0


class AdminIdentityResponse(BaseModel):
    id: str
    email: str
    username: str
    role: str


class AdminSessionResponse(BaseModel):
    token: str
    user: AdminIdentityResponse
