"""post reports"""

from alembic import op
import sqlalchemy as sa


revision = "0007_post_reports"
down_revision = "0006_challenge_unlock_timestamps"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "post_reports",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("post_id", sa.Uuid(), sa.ForeignKey("posts.id", ondelete="CASCADE"), nullable=False),
        sa.Column("user_id", sa.Uuid(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("reason", sa.String(length=64), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint("post_id", "user_id", name="uq_post_reports_post_user"),
    )
    op.create_index("ix_post_reports_post_id", "post_reports", ["post_id"], unique=False)
    op.create_index("ix_post_reports_user_id", "post_reports", ["user_id"], unique=False)
    op.create_index("ix_post_reports_created_at", "post_reports", ["created_at"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_post_reports_created_at", table_name="post_reports")
    op.drop_index("ix_post_reports_user_id", table_name="post_reports")
    op.drop_index("ix_post_reports_post_id", table_name="post_reports")
    op.drop_table("post_reports")
