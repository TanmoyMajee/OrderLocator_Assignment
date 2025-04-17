from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class OrderSchema(BaseModel):
    name: str
    phone: str
    address: Optional[str] = None
    delivery_time: str
    street: Optional[str] = None   
    city: Optional[str] = None     
    state: Optional[str] = None    
    postal_code: Optional[str] = None 
    country: Optional[str] = None 
    block_no: Optional[str] = None 



class OrderResponseSchema(OrderSchema): 
    id: str
    longitude:float
    latitude:float
    created_at: datetime
