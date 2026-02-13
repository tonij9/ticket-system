"""
Script to check what's in the database
"""
from database import SessionLocal
from models import User, Ticket

db = SessionLocal()

try:
    # Get all users
    users = db.query(User).all()
    print(f"Total Users: {len(users)}\n")
    print("Users in database:")
    print("-" * 80)
    for user in users:
        print(f"ID: {user.id}")
        print(f"Email: {user.email}")
        print(f"Username: {user.username}")
        print(f"Full Name: {user.full_name}")
        print("-" * 80)

    # Get all tickets
    tickets = db.query(Ticket).all()
    print(f"\nTotal Tickets: {len(tickets)}\n")
    print("Tickets in database:")
    print("-" * 80)
    for ticket in tickets:
        print(f"ID: {ticket.id}")
        print(f"Ticket #: {ticket.ticket_number}")
        print(f"Subject: {ticket.subject}")
        print(f"Requester: {ticket.requester.username} ({ticket.requester.email})")
        print(f"Assignee: {ticket.assignee.username if ticket.assignee else 'None'}")
        print(f"Status: {ticket.status}")
        print(f"Priority: {ticket.priority}")
        print("-" * 80)

finally:
    db.close()
