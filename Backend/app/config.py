from pydantic_settings import BaseSettings
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseSettings):
    MONGO_URI: str 
    MONGO_DB: str = "order_locator" 

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()

client = MongoClient(settings.MONGO_URI)

db = client[settings.MONGO_DB]
orders_collection = db["orders"]