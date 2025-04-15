from pydantic import BaseModel



class OrderSchema(BaseModel):
    name: str
    phone: str
    address: str
    delivery_time: str



class OrderResponseSchema(OrderSchema): 
    id: str
    longitude:float
    latitude:float
