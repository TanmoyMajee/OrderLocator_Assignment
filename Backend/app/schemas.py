from pydantic import BaseModel

# from typing import Optional, List, Dict, Any, Union

class OrderSchema(BaseModel):
    name: str
    phone: str
    address: str
    delivery_time: str



class OrderResponseSchema(OrderSchema): 
    id: str
    # message: str
    longitude:float
    latitude:float
