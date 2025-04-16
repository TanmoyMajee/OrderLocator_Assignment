from fastapi import APIRouter, Depends, HTTPException
from app.models import OrderModel
from app.schemas import OrderSchema, OrderResponseSchema
from app.config import orders_collection
from typing import List
from datetime import datetime
import httpx



async def geocode_address(address: str):
    
    api_key = "8ecbb7941ef941dd8e9e87705b16fcb8"  
    url = "https://api.geoapify.com/v1/geocode/search"
    params = {
        "text": address,
        "apiKey": api_key,
        "format": "json", 
        "limit": 1         # Limit the response to only the most relevant result
    }

    # hit a get request to the url with the params
    async with httpx.AsyncClient() as ac:
        try:
            response = await ac.get(url, params=params)
            response.raise_for_status()  # Raise an error for bad responses
        except httpx.HTTPError as e:
            raise HTTPException(status_code=500, detail=f"Geocoding error: {str(e)}")
        # now parse the response 
        try:
            data = response.json()   
        except ValueError:
            raise HTTPException(status_code=500, detail="Error parsing to JSON  geocoding response")   
        # now take the long lat form data and retutn it

        results = data.get("results")
        if not results or len(results) == 0:
            raise HTTPException(status_code=404, detail="Address not found")
        
        result = results[0]
        latitude = result["lat"]
        longitude = result["lon"]

        # check if both are valid 
        if latitude is None or longitude is None:
            raise HTTPException(status_code=404, detail="Address not found")

        # return the data
        return {'latitude': latitude, 'longitude': longitude}



router = APIRouter()


@router.post("/orders",response_model=OrderResponseSchema)
async def create_new_order(order: OrderSchema):

    if not order.address or order.address.strip().upper() == "NULL":
        raise HTTPException(status_code=400, detail="Address cannot be NULL")

    geo_data =await geocode_address(order.address)
    print(geo_data)
    #  validate the orderModel
    created_at = datetime.utcnow()
    order_model = OrderModel(
        name=order.name,
        phone=order.phone,
        address=order.address,
        delivery_time=order.delivery_time, 
        longitude=geo_data['longitude'],
        latitude=geo_data['latitude'],
        created_at=created_at
    )
    order_dict = order_model.dict()
    result =  orders_collection.insert_one(order_dict)
    return OrderResponseSchema(
        id=str(result.inserted_id),
        **order_dict
    )
  
@router.get("/orders", response_model=List[OrderResponseSchema])
async def get_all_orders():
    """
    Retrieve all orders from the database.
    Returns a list of all orders with their details.
    """
    try:
        # Find all documents in the orders collection
        cursor = orders_collection.find({}).sort("created_at", -1)
        
        # Convert MongoDB cursor to list of OrderResponseSchema objects
        orders = []
        for document in cursor:
            # Convert ObjectId to string for the id field
            document["id"] = str(document.pop("_id"))
            orders.append(document)
        
        # Check if orders list is empty
        if not orders:
            # You can either return an empty list
            return []
        
        return orders 
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve orders: {str(e)}")

