import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    # LLM API Keys
    ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    DEEPSEEK_API_KEY: str = os.getenv("DEEPSEEK_API_KEY", "")
    DASHSCOPE_API_KEY: str = os.getenv("DASHSCOPE_API_KEY", "")

    # Supabase
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_ANON_KEY: str = os.getenv("SUPABASE_ANON_KEY", "")
    SUPABASE_SERVICE_KEY: str = os.getenv("SUPABASE_SERVICE_KEY", "")

    # GitHub
    GITHUB_TOKEN: str = os.getenv("GITHUB_TOKEN", "")
    GITHUB_OWNER: str = os.getenv("GITHUB_OWNER", "ganeshmamidipalli")

    # App
    APP_ENV: str = os.getenv("APP_ENV", "development")
    CORS_ORIGINS: list = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

    # Defaults
    DEFAULT_LLM: str = "anthropic/claude-sonnet-4-20250514"
    CHEAP_LLM: str = "openai/gpt-4o-mini"
    CODE_LLM: str = "deepseek/deepseek-chat"


settings = Settings()
