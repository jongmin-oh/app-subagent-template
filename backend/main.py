from fastapi import FastAPI
from mangum import Mangum

from app.routers import get_routers

app = FastAPI()
for router in get_routers():
    app.include_router(router)


lambda_handler = Mangum(app)
