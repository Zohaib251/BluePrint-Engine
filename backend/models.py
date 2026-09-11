"""
Database ORM Models module.

Defines User and PRDHistory entities for SQLAlchemy mapping.
"""

import uuid
from datetime import datetime
from typing import List, Optional
from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import RelationshipProperty, Mapped, mapped_column, relationship
from database import Base


class User(Base):
    """
    User account model.

    Attributes:
        id (uuid.UUID): Unique primary key identifier.
        username (str): Unique username for authentication.
        password_hash (str): Bcrypt hashed account password.
        role (str): System authorization role (default: 'user', admin: 'admin').
        generation_count (int): Count of generated PRDs (default: 0).
        created_at (datetime): Timestamp of user creation.
        prd_histories (List[PRDHistory]): Linked PRD generation history records.
    """

    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    username: Mapped[str] = mapped_column(
        String(50), unique=True, index=True, nullable=False
    )
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(20), default="user", nullable=False)
    generation_count: Mapped[int] = mapped_column(
        Integer, default=0, nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    # Relationship linking User to PRDHistory records
    prd_histories: Mapped[List["PRDHistory"]] = relationship(
        "PRDHistory", back_populates="user", cascade="all, delete-orphan"
    )


class PRDHistory(Base):
    """
    PRD Generation History model.

    Attributes:
        id (uuid.UUID): Unique primary key identifier.
        user_id (uuid.UUID): Foreign key linking to owning User account.
        title (str): PRD document title or topic.
        content (str): Generated PRD content.
        created_at (datetime): Creation timestamp.
        user (User): Owner User relationship entity.
    """

    __tablename__ = "prd_histories"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    # Relationship back to parent User entity
    user: Mapped["User"] = relationship("User", back_populates="prd_histories")
