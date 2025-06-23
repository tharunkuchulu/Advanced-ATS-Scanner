import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")

client = AsyncIOMotorClient(MONGO_URL)
db = client.resume_analyzer

import asyncio

async def test_connection():
    try:
        await db.command("ping")
        print("✅ MongoDB connection successful.")
    except Exception as e:
        print("❌ MongoDB connection failed:", str(e))

asyncio.create_task(test_connection())
