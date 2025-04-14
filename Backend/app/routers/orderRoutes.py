from fastapi import APIRouter, Depends, HTTPException
from app.models import OrderModel
from app.schemas import OrderSchema, OrderResponseSchema
from app.config import orders_collection



# Example geocoding function (replace with actual implementation)
def geocode_address(address: str):
    # Replace this with a real geocoding service
    if address == "123 Main St":
        return {"longitude": "40.7128", "latitude": "-74.0060"}
    raise HTTPException(status_code=400, detail="Invalid address from geo fun")

router = APIRouter()

# response_model=OrderResponseSchema
@router.post("/orders")
async def create_new_order(order: OrderSchema):
    # order_dict = order.dict()
    geo_data = geocode_address(order.address)
    #  validate the orderModel
    # order_model = OrderModel(
    #     name=order.name,
    #     phone=order.phone,
    #     address=order.address,
    #     delivery_time=order.delivery_time, 
    #     longitude=geo_data['longitude'],
    #     latitude=geo_data['latitude'],
    # )
    order_model = OrderModel(
        name=order.name,
        phone=order.phone,
        address=order.address,
        delivery_time=order.delivery_time,
        longitude=geo_data["longitude"],
        latitude=geo_data["latitude"],
    )
    order_dict = order_model.dict()
    result =  orders_collection.insert_one(order_dict)
    # return OrderResponseSchema(
    #     id=str(result.inserted_id),
    #     message="Order created successfully",
    #     **order_dict
    # )
    return {'msg':'Succesful yup '}