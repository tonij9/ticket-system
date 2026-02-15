from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base, SessionLocal
from routers import tickets, auth, users
from models import User, Ticket, TicketStatus, TicketPriority
from passlib.context import CryptContext
import os

# Create database tables
Base.metadata.create_all(bind=engine)

# Seed default data
def seed_data():
    db = SessionLocal()
    try:
        # Check if admin user exists
        admin = db.query(User).filter(User.username == "admin").first()
        if not admin:
            pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

            # Create admin user
            admin = User(
                email="admin@example.com",
                username="admin",
                hashed_password=pwd_context.hash("admin123"),
                full_name="Admin User",
                is_admin=1
            )
            db.add(admin)
            db.commit()
            db.refresh(admin)

            # Create toni user
            toni = User(
                email="toni@example.com",
                username="toni",
                hashed_password=pwd_context.hash("Toni123"),
                full_name="Toni",
                is_admin=1
            )
            db.add(toni)
            db.commit()
            db.refresh(toni)

            # Create sample users
            users_data = [
                {"email": "sarah.chen@example.com", "username": "sarah.chen", "full_name": "Sarah Chen"},
                {"email": "mike.wilson@example.com", "username": "mike.wilson", "full_name": "Mike Wilson"},
                {"email": "emma.davis@example.com", "username": "emma.davis", "full_name": "Emma Davis"},
            ]

            created_users = [admin, toni]
            for u in users_data:
                user = User(
                    email=u["email"],
                    username=u["username"],
                    hashed_password=pwd_context.hash("password123"),
                    full_name=u["full_name"],
                    is_admin=0
                )
                db.add(user)
                db.commit()
                db.refresh(user)
                created_users.append(user)

            # Create sample tickets
            tickets_data = [
                {"number": "28371", "subject": "BankEx ID: 2835726/16146490 - Bankruptcy", "status": TicketStatus.OPEN, "requester": created_users[1]},
                {"number": "28372", "subject": "Payment Issue - Account Review Required", "status": TicketStatus.PENDING, "requester": created_users[2]},
                {"number": "28373", "subject": "BankEx ID: 2833871/16135965 - Consumer Proposal", "status": TicketStatus.RESOLVED, "requester": created_users[1]},
            ]

            for t in tickets_data:
                ticket = Ticket(
                    ticket_number=t["number"],
                    subject=t["subject"],
                    status=t["status"],
                    priority=TicketPriority.MEDIUM,
                    requester_id=t["requester"].id,
                    assignee_id=admin.id
                )
                db.add(ticket)

            db.commit()
            print("Database seeded successfully!")
    finally:
        db.close()

seed_data()

app = FastAPI(title="Ticket System API", version="1.0.0")

# Get allowed origins from environment variable
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
allowed_origins = [
    frontend_url,
    frontend_url.rstrip("/"),
    "http://localhost:5173",
    "http://localhost:3000",
    "https://ticket-system-lac.vercel.app",
]

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
