from pydantic import BaseModel

# from typing import Optional, List, Dict, Any, Union

class OrderModel(BaseModel):
    name: str
    phone: int
    address: str
    delivery_time: int
    longitude: float
    latitude: float
