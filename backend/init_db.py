"""
Database initialization and admin account provisioning module.

Creates database schema tables if missing and seeds an admin user if ADMIN_USERNAME
and ADMIN_PASSWORD environment variables are explicitly defined.
"""

import os
import logging
from sqlalchemy import select
from database import engine, AsyncSessionLocal, Base
from models import User
from security import hash_password
from config import ENVIRONMENT

# Configure logging for database setup process
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def init_db() -> None:
    """
    Initialize database schema tables and provision admin user account if configured.

    Creates tables if they do not exist, and checks for admin credentials specified
    via ADMIN_USERNAME and ADMIN_PASSWORD environment variables.
    """
    async with engine.begin() as conn:
        # Create all tables defined in Base metadata
        await conn.run_sync(Base.metadata.create_all)
        logger.info("Database schema tables checked/created.")

    async with AsyncSessionLocal() as session:
        try:
            # Retrieve admin credentials strictly from environment variables
            primary_admin_user = os.getenv("ADMIN_USERNAME")
            primary_admin_pass = os.getenv("ADMIN_PASSWORD")

            admin_credentials = []
            if primary_admin_user and primary_admin_pass:
                admin_credentials.append((primary_admin_user.strip(), primary_admin_pass.strip()))
            else:
                logger.info("ADMIN_USERNAME or ADMIN_PASSWORD not configured. Skipping automated admin seeding.")

            for username, default_pw in admin_credentials:
                stmt = select(User).where(User.username == username)
                result = await session.execute(stmt)
                user_record = result.scalar_one_or_none()

                if not user_record:
                    logger.info(f"Admin user '{username}' not found. Creating admin account...")
                    hashed_pw = hash_password(default_pw)
                    new_admin = User(
                        username=username,
                        password_hash=hashed_pw,
                        role="admin",
                        generation_count=0,
                    )
                    session.add(new_admin)
                    await session.commit()
                    logger.info(f"Admin user '{username}' successfully seeded.")
                elif user_record.role != "admin":
                    logger.info(f"Updating user '{username}' role to 'admin'...")
                    user_record.role = "admin"
                    await session.commit()
                    logger.info(f"User '{username}' role updated to 'admin'.")
                else:
                    logger.info(f"Admin user '{username}' already configured.")
        except Exception as err:
            await session.rollback()
            logger.error(f"Error seeding database admin user: {err}")
            raise
