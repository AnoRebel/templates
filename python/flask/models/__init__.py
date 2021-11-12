from pydantic import BaseModel

class User(BaseModel):
    id: int
    is_active: bool

    class Config:
        orm_mode = True
