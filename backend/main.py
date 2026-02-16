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
                {"email": "john.smith@example.com", "username": "john.smith", "full_name": "John Smith"},
                {"email": "lisa.johnson@example.com", "username": "lisa.johnson", "full_name": "Lisa Johnson"},
                {"email": "david.brown@example.com", "username": "david.brown", "full_name": "David Brown"},
                {"email": "jennifer.lee@example.com", "username": "jennifer.lee", "full_name": "Jennifer Lee"},
                {"email": "robert.taylor@example.com", "username": "robert.taylor", "full_name": "Robert Taylor"},
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

            # Create sample tickets with variety
            tickets_data = [
                {"number": "28371", "subject": "BankEx ID: 2835726/16146490 - Bankruptcy", "status": TicketStatus.OPEN, "priority": TicketPriority.HIGH, "requester_idx": 1, "assignee_idx": 0},
                {"number": "28372", "subject": "Payment Issue - Account Review Required", "status": TicketStatus.PENDING, "priority": TicketPriority.MEDIUM, "requester_idx": 2, "assignee_idx": 0},
                {"number": "28373", "subject": "BankEx ID: 2833871/16135965 - Consumer Proposal", "status": TicketStatus.RESOLVED, "priority": TicketPriority.LOW, "requester_idx": 1, "assignee_idx": 0},
                {"number": "28374", "subject": "Login Authentication Error - Unable to Access Dashboard", "status": TicketStatus.OPEN, "priority": TicketPriority.HIGH, "requester_idx": 3, "assignee_idx": 1},
                {"number": "28375", "subject": "Data Export Feature Request - CSV Format", "status": TicketStatus.PENDING, "priority": TicketPriority.LOW, "requester_idx": 4, "assignee_idx": 0},
                {"number": "28376", "subject": "BankEx ID: 2839012/16152334 - Account Closure", "status": TicketStatus.OPEN, "priority": TicketPriority.MEDIUM, "requester_idx": 5, "assignee_idx": 1},
                {"number": "28377", "subject": "Password Reset Not Working - Email Not Received", "status": TicketStatus.RESOLVED, "priority": TicketPriority.HIGH, "requester_idx": 6, "assignee_idx": 0},
                {"number": "28378", "subject": "Report Generation Timeout - Large Dataset", "status": TicketStatus.PENDING, "priority": TicketPriority.MEDIUM, "requester_idx": 7, "assignee_idx": 1},
                {"number": "28379", "subject": "BankEx ID: 2841567/16158901 - Debt Consolidation", "status": TicketStatus.OPEN, "priority": TicketPriority.HIGH, "requester_idx": 2, "assignee_idx": 0},
                {"number": "28380", "subject": "User Permission Issue - Cannot View Reports", "status": TicketStatus.PENDING, "priority": TicketPriority.MEDIUM, "requester_idx": 8, "assignee_idx": 1},
                {"number": "28381", "subject": "API Integration Error - Third Party Service", "status": TicketStatus.OPEN, "priority": TicketPriority.HIGH, "requester_idx": 3, "assignee_idx": 0},
                {"number": "28382", "subject": "BankEx ID: 2843298/16163445 - Payment Plan Setup", "status": TicketStatus.RESOLVED, "priority": TicketPriority.LOW, "requester_idx": 4, "assignee_idx": 1},
            ]

            for t in tickets_data:
                ticket = Ticket(
                    ticket_number=t["number"],
                    subject=t["subject"],
                    status=t["status"],
                    priority=t["priority"],
                    requester_id=created_users[t["requester_idx"]].id,
                    assignee_id=created_users[t["assignee_idx"]].id
                )
                db.add(ticket)

            db.commit()
            print("Database seeded successfully!")
    finally:
        db.close()

seed_data()

app = FastAPI(title="Ticket System API", version="1.0.0")

# Configure CORS - allow all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
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
