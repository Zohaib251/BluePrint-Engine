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
            # Query for existence of admin user 'ZohaibAli'
            stmt = select(User).where(User.username == "ZohaibAli")
            result = await session.execute(stmt)
            admin_user = result.scalar_one_or_none()

            if not admin_user:
                logger.info("Admin user 'ZohaibAli' not found. Creating auto-admin account...")
                hashed_pw = hash_password("hellfire123")
                new_admin = User(
                    username="ZohaibAli",
                    password_hash=hashed_pw,
                    role="admin",
                    generation_count=0,
                )
                session.add(new_admin)
                await session.commit()
                logger.info("Admin user 'ZohaibAli' successfully seeded.")
            else:
                logger.info("Admin user 'ZohaibAli' already exists. Skipping seed.")
        except Exception as err:
            await session.rollback()
            logger.error(f"Error seeding database admin user: {err}")
            raise
