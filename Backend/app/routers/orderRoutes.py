from fastapi import APIRouter, Depends, HTTPException
from app.models import OrderModel
from app.schemas import OrderSchema, OrderResponseSchema
from app.config import orders_collection
import httpx


# Example geocoding function (replace with actual implementation)
async def geocode_address(address: str):
    
    api_key = "8ecbb7941ef941dd8e9e87705b16fcb8"  # Replace with your actual Geoapify API key
    url = "https://api.geoapify.com/v1/geocode/search"
    params = {
        "text": address,
        "apiKey": api_key,
        "format": "json",  # Specifically request JSON format
        "limit": 1         # Limit the response to only the most relevant result
    }
    # now hit a get request to the url with the params
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

# response_model=OrderResponseSchema
@router.post("/orders",response_model=OrderResponseSchema)
async def create_new_order(order: OrderSchema):
    # order_dict = order.dict()
    geo_data =await geocode_address(order.address)
    print(geo_data)
    #  validate the orderModel
    order_model = OrderModel(
        name=order.name,
        phone=order.phone,
        address=order.address,
        delivery_time=order.delivery_time, 
        longitude=geo_data['longitude'],
        latitude=geo_data['latitude'],
    )
    # order_model = OrderModel(
    #     name=order.name,
    #     phone=order.phone,
    #     address=order.address,
    #     delivery_time=order.delivery_time,
    #     longitude=geo_data["longitude"],
    #     latitude=geo_data["latitude"],
    # )
    order_dict = order_model.dict()
    result =  orders_collection.insert_one(order_dict)
    return OrderResponseSchema(
        id=str(result.inserted_id),
        message="Order created successfully",
        **order_dict
    )
    # return geo_data
    # return {'msg':'Succesful yup '}