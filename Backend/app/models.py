from pydantic import BaseModel
from datetime import datetime

class OrderModel(BaseModel):
    name: str
    phone: str
    address: str
    delivery_time: str
    longitude: float
    latitude: float 
    created_at: datetime

