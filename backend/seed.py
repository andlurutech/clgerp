import argparse
import asyncio
import uuid
import random
from datetime import datetime, timedelta
from faker import Faker
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

from models import Base
# Import all other models to ensure tables are created
import models, models_admissions, models_finance, models_academics, models_lms, models_exams, models_community, models_workflows

# Database setup
DATABASE_URL = "postgresql+asyncpg://clgerp_user:clgerp_password@localhost:5432/clgerp_db"
engine = create_async_engine(DATABASE_URL, echo=False)
async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

fake = Faker()

async def reset_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    print("Database reset complete.")

async def seed_data(scale_enterprise=False):
    num_students = 5000 if scale_enterprise else 50
    num_courses = 500 if scale_enterprise else 10
    
    print(f"Starting database seed... Scale: {'ENTERPRISE' if scale_enterprise else 'STANDARD'}")
    
    async with async_session() as session:
        # Seed Roles
        student_role = models.Role(name="Student", description="Student access")
        faculty_role = models.Role(name="Faculty", description="Faculty access")
        session.add_all([student_role, faculty_role])
        await session.commit()
        
        # Seed Users
        print(f"Seeding {num_students} students...")
        for _ in range(num_students):
            user = models.User(
                username=fake.user_name(),
                email=fake.email(),
                password_hash="hashed_password", 
                role_id=student_role.id
            )
            session.add(user)
            
            # Commit in batches of 1000 to save memory
            if _ % 1000 == 0:
                await session.commit()
        
        # Seed Deterministic Demo Users
        from passlib.context import CryptContext
        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        demo_password = pwd_context.hash("password123")

        demo_student = models.User(
            username="demo_student",
            email="student@demo.com",
            password_hash=demo_password,
            role_id=student_role.id
        )
        demo_faculty = models.User(
            username="demo_faculty",
            email="faculty@demo.com",
            password_hash=demo_password,
            role_id=faculty_role.id
        )
        session.add_all([demo_student, demo_faculty])
        
        await session.commit()
        print("Seeding complete! Demo users created: 'demo_student' and 'demo_faculty' with password 'password123'")

async def main():
    parser = argparse.ArgumentParser(description="ClgERP Database Seeder")
    parser.add_argument("--scale", type=str, help="Scale of seeding (e.g., 'enterprise')", default="standard")
    args = parser.parse_args()
    
    scale_enterprise = (args.scale.lower() == "enterprise")
    
    await reset_db()
    await seed_data(scale_enterprise)

if __name__ == "__main__":
    asyncio.run(main())
