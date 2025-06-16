from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("MYSQL_CONNECTION_URL")


engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,      # Check connection health before using
    pool_size=10,            # Optional: number of connections in the pool
    max_overflow=20,         # Optional: additional connections beyond pool_size
    pool_recycle=1800        # Optional: recycle connections after 30 minutes
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
