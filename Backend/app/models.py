from pydantic import BaseModel


class OrderModel(BaseModel):
    name: str
    phone: str
    address: str
    delivery_time: str
    longitude: float
    latitude: float 

