from fastapi import APIRouter, Depends, HTTPException
from app.models import OrderModel
from app.schemas import OrderSchema, OrderResponseSchema
from app.config import orders_collection
from typing import List
from datetime import datetime
import httpx



async def geocode_address(order: OrderSchema):
    
    api_key = "8ecbb7941ef941dd8e9e87705b16fcb8"  
    url = "https://api.geoapify.com/v1/geocode/search"

    address_text=""

    if order.address:
        address_text = order.address.strip() 

    specific_parts = []

    if order.block_no and order.block_no.strip().upper() != "NULL":
        specific_parts.append(order.block_no)
    if order.street and order.street.strip().upper() != "NULL": 
        specific_parts.append(order.street)
    if order.city and order.city.strip().upper() != "NULL":
        specific_parts.append(order.city)
    if order.state and order.state.strip().upper() != "NULL":
        specific_parts.append(order.state)
    if order.postal_code and order.postal_code.strip().upper() != "NULL":
        specific_parts.append(order.postal_code)        
    if order.country and order.country.strip().upper() != "NULL":
        specific_parts.append(order.country)

    if specific_parts:
        address_text = ", ".join(specific_parts)

    params = {
        "text": address_text,
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

    has_general_address = order.address and order.address.strip().upper() != "NULL" and order.address.strip() != "" 

    has_specific_parts = all([
        order.street and order.street.strip().upper() != "NULL" and order.street.strip() != "",
        order.city and order.city.strip().upper() != "NULL" and order.city.strip() != "",
        order.state and order.state.strip().upper() != "NULL" and order.state.strip() != "",
        order.country and order.country.strip().upper() != "NULL" and order.country.strip() != "",
        # At minimum, we need street and city for reasonable geocoding
    ])
    
    if not (has_general_address or has_specific_parts):
        raise HTTPException(
            status_code=400, 
            detail="Address cannot be NULL. Provide either a general address or specific address fields (at least street and city)."
        )

    geo_data =await geocode_address(order)
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
        created_at=created_at,
        street=order.street,
        city=order.city,
        state=order.state,
        postal_code=order.postal_code,
        country=order.country,
        block_no=order.block_no
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

# AIzaSyCLpe_G_FlZcL_ysVTvyZn9EYPTVFob3LQhttps://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=YOUR_API_KEY

# http://dev.virtualearth.net/REST/v1/Locations?countryRegion={countryRegion}&adminDistrict={adminDistrict}&locality={locality}&postalCode={postalCode}&addressLine={addressLine}&userLocation={userLocation}&userIp={userIp}&usermapView={usermapView}&includeNeighborhood={includeNeighborhood}&maxResults={maxResults}&key={BingMapsKey}