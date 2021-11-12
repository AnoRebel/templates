from typing import Optional, List

import strawberry
from strawberry.fastapi import GraphQLRouter
from strawberry.types import Info
from strawberry.asgi import GraphQL
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
#from fastapi.staticfiles import StaticFiles
#from fastapi.templating import Jinja2Templates

from config import database

app = FastAPI()

origins = [
    "http://localhost",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#app.mount("/static", StaticFiles(directory="static"), name="static")
#templates = Jinja2Templates(directory="templates")

async def notify_new_flavour(name: str):
    print(name)

@strawberry.type
class Query:
    @strawberry.field
    def hello(self) -> str:
        return "Hello World"
        
schema = strawberry.Schema(Query, Mutation)
graphql_app = GraphQLRouter(schema)
#graphql_app = GraphQL(schema)

@app.on_event("startup")
async def startup():
    await database.connect()


@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()
    
@app.get("/")
async def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
async def read_item(item_id: int, q: Optional[str] = None):
    return {"item_id": item_id, "q": q}

#app.add_route("/graphql", graphql_app)
#app.add_websocket_route("/graphql", graphql_app)
app.include_router(graphql_app, prefix="/graphql")
