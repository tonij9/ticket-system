"""
Script to populate the database with test data
Run this from the backend directory: python populate_db.py
"""
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from models import User, Ticket, TicketStatus, TicketPriority
import bcrypt
from datetime import datetime, timedelta

def get_password_hash(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def populate_database():
    # Create tables
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        # Check if data already exists
        existing_users = db.query(User).count()
        if existing_users > 0:
            print(f"Database already has {existing_users} users. Skipping population.")
            return

        # Create test users
        users_data = [
            {
                "email": "bob_wilson@example.com",
                "username": "bob_wilson",
                "password": "password123",
                "full_name": "Bob Wilson"
            },
            {
                "email": "jane_smith@example.com",
                "username": "jane_smith",
                "password": "password123",
                "full_name": "Jane Smith"
            },
            {
                "email": "admin@example.com",
                "username": "admin",
                "password": "admin123",
                "full_name": "Admin User",
                "is_admin": 1
            },
            {
                "email": "john_doe@example.com",
                "username": "john_doe",
                "password": "password123",
                "full_name": "John Doe"
            }
        ]

        users = []
        for user_data in users_data:
            user = User(
                email=user_data["email"],
                username=user_data["username"],
                hashed_password=get_password_hash(user_data["password"]),
                full_name=user_data["full_name"],
                is_admin=user_data.get("is_admin", 0)
            )
            db.add(user)
            users.append(user)

        db.commit()
        print(f"Created {len(users)} users")

        # Refresh users to get their IDs
        for user in users:
            db.refresh(user)

        # Create test tickets
        tickets_data = [
            {
                "subject": "Payment Issue - Account Overdue",
                "description": "Customer needs help with overdue payment",
                "requester": users[0],  # bob_wilson
                "assignee": users[2],   # admin
                "priority": TicketPriority.HIGH,
                "status": TicketStatus.OPEN
            },
            {
                "subject": "Loan Application Question",
                "description": "Question about loan terms and conditions",
                "requester": users[1],  # jane_smith
                "assignee": users[2],   # admin
                "priority": TicketPriority.MEDIUM,
                "status": TicketStatus.IN_PROGRESS
            },
            {
                "subject": "Account Balance Inquiry",
                "description": "Need clarification on account balance",
                "requester": users[0],  # bob_wilson
                "assignee": None,
                "priority": TicketPriority.LOW,
                "status": TicketStatus.PENDING
            },
            {
                "subject": "Payment Confirmation Request",
                "description": "Requesting confirmation of recent payment",
                "requester": users[3],  # john_doe
                "assignee": users[2],   # admin
                "priority": TicketPriority.MEDIUM,
                "status": TicketStatus.RESOLVED
            },
            {
                "subject": "Final Payment - Account Closure",
                "description": "Making final payment to close account",
                "requester": users[1],  # jane_smith
                "assignee": users[2],   # admin
                "priority": TicketPriority.HIGH,
                "status": TicketStatus.OPEN
            }
        ]

        ticket_number = 933000
        for ticket_data in tickets_data:
            ticket = Ticket(
                ticket_number=f"#{ticket_number}",
                subject=ticket_data["subject"],
                description=ticket_data["description"],
                requester_id=ticket_data["requester"].id,
                assignee_id=ticket_data["assignee"].id if ticket_data["assignee"] else None,
                priority=ticket_data["priority"],
                status=ticket_data["status"],
                created_at=datetime.utcnow() - timedelta(days=5 - len([t for t in tickets_data if tickets_data.index(t) <= tickets_data.index(ticket_data)]))
            )
            db.add(ticket)
            ticket_number += 1

        db.commit()
        print(f"Created {len(tickets_data)} tickets")

        print("\nTest Users Created:")
        print("-------------------")
        for user_data in users_data:
            print(f"Email: {user_data['email']}")
            print(f"Username: {user_data['username']}")
            print(f"Password: {user_data['password']}")
            print()

        print("Database populated successfully!")

    except Exception as e:
        print(f"Error populating database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    populate_database()
