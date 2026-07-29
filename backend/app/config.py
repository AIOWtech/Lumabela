from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Lumabela"

    class Config:
        env_file = ".env"
        extra = "ignore"
settings = Settings()
