from pydantic import BaseModel

# from typing import Optional, List, Dict, Any, Union

class OrderModel(BaseModel):
    name: str
    phone: str
    address: str
    delivery_time: str
    longitude: float
    latitude: float 

