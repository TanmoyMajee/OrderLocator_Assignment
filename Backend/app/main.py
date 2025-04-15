from fastapi import FastAPI
from app.routers import orderRoutes  
from fastapi.middleware.cors import CORSMiddleware

app= FastAPI()

origins = [
    "http://localhost:5173",  # Example: React frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows requests from these origins
    allow_credentials=True,  # Allows cookies and authentication headers
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allows all headers
)



@app.get('/')
async def root():
  return {'Message':'Api Runing' , 'Success' : 'TRU'}

# @app.post('/order')
# async def postOrder(id:int):
#   print(id)
#   return {'id_is':id}  

app.include_router(orderRoutes.router)