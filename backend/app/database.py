from motor.motor_asyncio import AsyncIOMotorClient
import certifi
from .config import settings

class Database:
    client: AsyncIOMotorClient = None
    db = None

db = Database()


async def connect_to_mongo():
    """Connect to MongoDB Atlas with Windows SSL fix"""
    try:
        # Windows SSL workaround - use tlsAllowInvalidCertificates only
        db.client = AsyncIOMotorClient(
            settings.MONGODB_URL,
            tlsAllowInvalidCertificates=True,
            serverSelectionTimeoutMS=10000
        )
        # Test connection
        await db.client.admin.command('ping')
        db.db = db.client[settings.DB_NAME]
        print(f"✅ Connected to MongoDB: {settings.DB_NAME}")
        print("⚠️  WARNING: SSL certificate validation is disabled (development only)")
    except Exception as e:
        print(f"❌ MongoDB connection failed: {str(e)}")
        print("   Troubleshooting:")
        print("   1. Check MongoDB Atlas Network Access has your IP whitelisted")
        print("   2. Verify your network allows outbound connections on port 27017")
        print("   3. Confirm MongoDB credentials in .env are correct")
        raise


async def close_mongo_connection():
    """Close MongoDB connection"""
    db.client.close()
    print("Closed MongoDB connection")


def get_database():
    """Get database instance"""
    return db.db
