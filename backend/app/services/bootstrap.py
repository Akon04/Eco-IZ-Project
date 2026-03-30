import base64

from app.models.chat import ChatMessage
from app.models.challenge import Challenge
from app.models.challenge import UserChallenge
from app.models.post import Post, PostMedia
from app.models.user import Activity, User
from app.schemas.bootstrap import (
    ActivityResponse,
    BootstrapResponse,
    ChallengeResponse,
    ChatMessageResponse,
    PostMediaResponse,
    PostResponse,
    UserProfileResponse,
)


def user_level_number(points: int) -> int:
    if points < 200:
        return 1
    if points < 400:
        return 2
    if points < 700:
        return 3
    if points < 1100:
        return 4
    if points < 1600:
        return 5
    if points < 2200:
        return 6
    if points < 3000:
        return 7
    if points < 4000:
        return 8
    if points < 5500:
        return 9
    return 10


def user_level(points: int) -> str:
    level_number = user_level_number(points)
    if level_number == 1:
        return "Эко-новичок"
    if level_number == 2:
        return "Эко-исследователь"
    if level_number == 3:
        return "Эко-помощник"
    if level_number == 4:
        return "Хранитель природы"
    if level_number == 5:
        return "Зеленый герой"
    if level_number == 6:
        return "Эко-наставник"
    if level_number == 7:
        return "Защитник планеты"
    if level_number == 8:
        return "Мастер устойчивости"
    if level_number == 9:
        return "Амбассадор Eco Iz"
    return "Хранитель Земли"


def unlocked_challenge_count(points: int) -> int:
    return user_level_number(points) * 5


def challenge_sort_key(challenge: Challenge) -> tuple[int, str]:
    return (challenge.reward_points, challenge.title)


def serialize_user(user: User) -> UserProfileResponse:
    return UserProfileResponse(
        id=str(user.id),
        fullName=user.full_name,
        email=user.email,
        points=user.points,
        streakDays=user.streak_days,
        co2SavedTotal=user.co2_saved_total,
        level=user_level(user.points),
    )


def serialize_activity(activity: Activity) -> ActivityResponse:
    return ActivityResponse(
        id=str(activity.id),
        category=activity.category,
        title=activity.title,
        co2Saved=activity.co2_saved,
        points=activity.points,
        createdAt=activity.created_at,
    )


def serialize_user_challenge(item: UserChallenge) -> ChallengeResponse:
    challenge = item.challenge
    return ChallengeResponse(
        id=str(challenge.id),
        title=challenge.title,
        description=challenge.description,
        targetCount=challenge.target_count,
        currentCount=item.current_count,
        rewardPoints=challenge.reward_points,
        badgeSymbol=challenge.badge_symbol,
        badgeTintHex=challenge.badge_tint_hex,
        badgeBackgroundHex=challenge.badge_background_hex,
        isCompleted=item.is_completed,
        isClaimed=item.claimed_at is not None,
    )


def serialize_media(item: PostMedia) -> PostMediaResponse:
    return PostMediaResponse(
        id=str(item.id),
        kind=item.kind,
        base64Data=base64.b64encode(item.data).decode("utf-8"),
    )


def serialize_post(post: Post) -> PostResponse:
    return PostResponse(
        id=str(post.id),
        author=post.author_name,
        text=post.text,
        createdAt=post.created_at,
        media=[serialize_media(media) for media in post.media],
    )


def serialize_chat_message(message: ChatMessage) -> ChatMessageResponse:
    return ChatMessageResponse(
        id=str(message.id),
        isUser=message.role == "user",
        text=message.text,
        createdAt=message.created_at,
    )


def build_bootstrap(user: User) -> BootstrapResponse:
    visible_posts = [
        item
        for item in sorted(user.posts, key=lambda value: value.created_at, reverse=True)
        if item.moderation_state != "Hidden"
    ]
    return BootstrapResponse(
        user=serialize_user(user),
        activities=[serialize_activity(item) for item in sorted(user.activities, key=lambda value: value.created_at, reverse=True)],
        challenges=[serialize_user_challenge(item) for item in user.user_challenges],
        posts=[serialize_post(item) for item in visible_posts],
        chatMessages=[serialize_chat_message(item) for item in sorted(user.chat_messages, key=lambda value: value.created_at)],
    )
