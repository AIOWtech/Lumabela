from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import engine, Base
from app.auth import router as auth_router

# importing the model modules registers them on Base.metadata — needed before create_all
from models.user import User  # noqa: F401
from models.topic import Topic  # noqa: F401
from models.lesson import Lesson  # noqa: F401
from models.quiz import Quiz  # noqa: F401
from models.question import Question  # noqa: F401
from models.attempt import Attempt  # noqa: F401
from models.note import Note  # noqa: F401

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Charles's Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)


@app.on_event("startup")
async def on_startup():
    # dev convenience only — swap for Alembic migrations before this touches a real deploy
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


@app.get("/health")
async def health_check():
    return {"status": "ok"}
