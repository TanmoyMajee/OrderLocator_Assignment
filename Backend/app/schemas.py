from pydantic import BaseModel

# from typing import Optional, List, Dict, Any, Union

class OrderSchema(BaseModel):
    name: str
    phone: int
    address: str
    delivery_time: int



class OrderResponseSchema(OrderSchema):
    id: str
    message: str
    
