from fastapi import FastAPI
from app.routers import orderRoutes  


app= FastAPI()

@app.get('/')
async def root():
  return {'Message':'Api Runing' , 'Success' : 'TRU'}

# @app.post('/order')
# async def postOrder(id:int):
#   print(id)
#   return {'id_is':id}  

app.include_router(orderRoutes.router)