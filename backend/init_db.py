"""
Database initialization and default admin seeder module.

Creates database schema tables if missing and seeds default admin user ('ZohaibAli').
"""

import logging
from sqlalchemy import select
from database import engine, AsyncSessionLocal, Base
from models import User
from security import hash_password

# Configure logging for database setup process
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def init_db() -> None:
    """
    Initialize database schema and seed default admin user account.

    Creates tables if they do not exist, and checks for admin user 'ZohaibAli'.
    If 'ZohaibAli' does not exist, creates the account with role='admin'
    and hashed password 'hellfire123'.
    """
    async with engine.begin() as conn:
        # Create all tables defined in Base metadata
        await conn.run_sync(Base.metadata.create_all)
        logger.info("Database schema tables checked/created.")

    async with AsyncSessionLocal() as session:
        try:
            # Retrieve admin credentials from environment or secure defaults
            import os
            from config import ENVIRONMENT

            primary_admin_user = os.getenv("ADMIN_USERNAME", "ZohaibAli")
            primary_admin_pass = os.getenv("ADMIN_PASSWORD", "hellfire123")

            admin_credentials = [(primary_admin_user, primary_admin_pass)]

            # In development only, allow optional secondary dev admin if explicitly configured
            if ENVIRONMENT.lower() != "production":
                dev_admin_user = os.getenv("DEV_ADMIN_USERNAME")
                dev_admin_pass = os.getenv("DEV_ADMIN_PASSWORD")
                if dev_admin_user and dev_admin_pass:
                    admin_credentials.append((dev_admin_user, dev_admin_pass))

            for username, default_pw in admin_credentials:
                stmt = select(User).where(User.username == username)
                result = await session.execute(stmt)
                user_record = result.scalar_one_or_none()

                if not user_record:
                    logger.info(f"Admin user '{username}' not found. Creating auto-admin account...")
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


