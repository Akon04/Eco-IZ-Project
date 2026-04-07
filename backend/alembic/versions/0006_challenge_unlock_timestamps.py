"""challenge unlock timestamps"""

from alembic import op
import sqlalchemy as sa


revision = "0006_challenge_unlock_timestamps"
down_revision = "0005_activity_media"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("user_challenges", sa.Column("unlocked_at", sa.DateTime(timezone=True), nullable=True))


def downgrade() -> None:
    op.drop_column("user_challenges", "unlocked_at")
