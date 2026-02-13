from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import tickets, auth, users
import os

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Ticket System API", version="1.0.0")

# Get allowed origins from environment variable
allowed_origins = os.getenv("FRONTEND_URL", "http://localhost:5173").split(",")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(tickets.router, prefix="/api/tickets", tags=["tickets"])

@app.get("/")
def read_root():
    return {"message": "Ticket System API", "version": "1.0.0"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
