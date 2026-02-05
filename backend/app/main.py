from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routers import assets_router, watchlist_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Investment Dashboard API",
    description="API for stock and crypto tracking",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(assets_router)
app.include_router(watchlist_router)


@app.get("/")
def root():
    return {"message": "Investment Dashboard API", "status": "running"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}
