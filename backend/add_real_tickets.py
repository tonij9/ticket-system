"""
Script to add real tickets from Zendesk screenshot
"""
from database import SessionLocal
from models import User, Ticket, TicketStatus, TicketPriority
import bcrypt
from datetime import datetime, timedelta

def get_password_hash(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

db = SessionLocal()

try:
    # Create or get users (requesters from the screenshot)
    users_data = [
        {"username": "kapcharge", "email": "kapcharge@example.com", "full_name": "Kapcharge Notifications"},
        {"username": "dariia", "email": "dariia@example.com", "full_name": "Dariia Vislohuzova"},
        {"username": "ashley", "email": "ashley@example.com", "full_name": "Ashley Dawn Brenton"},
        {"username": "ede", "email": "ede@example.com", "full_name": "Ede"},
        {"username": "rimerpaw", "email": "rimerpaw@example.com", "full_name": "Rimerpaw"},
        {"username": "ontarioinsolvency", "email": "ontarioinsolvency@example.com", "full_name": "Ontarioinsolvency"},
        {"username": "lisa_marie", "email": "lisa.marie@example.com", "full_name": "Lisa Marie Allen"},
        {"username": "peggy", "email": "peggy@example.com", "full_name": "Peggy Taillon"},
        {"username": "dawn", "email": "dawn@example.com", "full_name": "Dawn Pavlik"},
        {"username": "noreply", "email": "noreply@example.com", "full_name": "No-reply"},
    ]

    print("Creating/fetching users...")
    users = {}
    for user_data in users_data:
        existing_user = db.query(User).filter(User.email == user_data["email"]).first()
        if existing_user:
            users[user_data["username"]] = existing_user
            print(f"Found existing user: {user_data['username']}")
        else:
            new_user = User(
                email=user_data["email"],
                username=user_data["username"],
                hashed_password=get_password_hash("password123"),
                full_name=user_data["full_name"]
            )
            db.add(new_user)
            db.flush()
            users[user_data["username"]] = new_user
            print(f"Created new user: {user_data['username']}")

    db.commit()
    print("\nAdding tickets...")
    print("-" * 80)

    # Tickets data from the screenshot
    tickets_data = [
        {
            "ticket_number": "#933452",
            "subject": "Kapcharge Notification - Interac ADR Transaction Received",
            "description": "Interac ADR transaction notification",
            "requester": "kapcharge",
            "status": TicketStatus.OPEN,
            "priority": TicketPriority.MEDIUM
        },
        {
            "ticket_number": "#933446",
            "subject": "Kapcharge Notification - Interac ADR Transaction Received",
            "description": "Interac ADR transaction notification",
            "requester": "kapcharge",
            "status": TicketStatus.OPEN,
            "priority": TicketPriority.MEDIUM
        },
        {
            "ticket_number": "#933442",
            "subject": "Kapcharge Notification - Interac ADR Transaction Received",
            "description": "Interac ADR transaction notification",
            "requester": "kapcharge",
            "status": TicketStatus.OPEN,
            "priority": TicketPriority.MEDIUM
        },
        {
            "ticket_number": "#933434",
            "subject": "Kapcharge Notification - Interac ADR Transaction Received",
            "description": "Interac ADR transaction notification",
            "requester": "kapcharge",
            "status": TicketStatus.OPEN,
            "priority": TicketPriority.MEDIUM
        },
        {
            "ticket_number": "#933433",
            "subject": "Kapcharge Notification - Interac ADR Transaction Received",
            "description": "Interac ADR transaction notification",
            "requester": "kapcharge",
            "status": TicketStatus.OPEN,
            "priority": TicketPriority.MEDIUM
        },
        {
            "ticket_number": "#933431",
            "subject": "Interac e-Transfer: You've received $100.00 from DARIIA VISLOHUZOVA",
            "description": "Interac e-Transfer payment received",
            "requester": "dariia",
            "status": TicketStatus.OPEN,
            "priority": TicketPriority.MEDIUM
        },
        {
            "ticket_number": "#933394",
            "subject": "Interac e-Transfer: You've received $100.00 from ASHLEY BRENTON",
            "description": "Interac e-Transfer payment received",
            "requester": "ashley",
            "status": TicketStatus.OPEN,
            "priority": TicketPriority.MEDIUM
        },
        {
            "ticket_number": "#933387",
            "subject": "Domingo, Hazelyn dans l'affaire de la proposition consommateur",
            "description": "Consumer proposal matter",
            "requester": "ede",
            "status": TicketStatus.OPEN,
            "priority": TicketPriority.MEDIUM
        },
        {
            "ticket_number": "#933360",
            "subject": "YASON, KATHERINE dans l'affaire de la proposition consommateur",
            "description": "Consumer proposal matter",
            "requester": "ede",
            "status": TicketStatus.OPEN,
            "priority": TicketPriority.MEDIUM
        },
        {
            "ticket_number": "#933345",
            "subject": "Batstone, Tyrone dans l'affaire de la faillite in the matter of bankruptcy",
            "description": "Bankruptcy matter",
            "requester": "ede",
            "status": TicketStatus.OPEN,
            "priority": TicketPriority.MEDIUM
        },
        {
            "ticket_number": "#933329",
            "subject": "BankEx ID: 2827641/16096477 - Bankruptcy/Consumer Proposal",
            "description": "Bankruptcy/Consumer Proposal case",
            "requester": "rimerpaw",
            "status": TicketStatus.OPEN,
            "priority": TicketPriority.MEDIUM
        },
        {
            "ticket_number": "#933216",
            "subject": "BankEx ID: 2827087/16093087 - Bankruptcy/Consumer Proposal",
            "description": "Bankruptcy/Consumer Proposal case",
            "requester": "ontarioinsolvency",
            "status": TicketStatus.OPEN,
            "priority": TicketPriority.MEDIUM
        },
        {
            "ticket_number": "#933161",
            "subject": "Re: FINAL DEMAND FOR PAYMENT: Legal Transfer Scheduled",
            "description": "Final payment demand notice",
            "requester": "lisa_marie",
            "status": TicketStatus.OPEN,
            "priority": TicketPriority.HIGH
        },
        {
            "ticket_number": "#933107",
            "subject": "INSUFFICIENT PAYMENT RECEIVED",
            "description": "Payment received was insufficient",
            "requester": "peggy",
            "status": TicketStatus.OPEN,
            "priority": TicketPriority.HIGH
        },
        {
            "ticket_number": "#933066",
            "subject": "Re: Defaulted Loan - Collection Process being started",
            "description": "Defaulted loan collection notice",
            "requester": "dawn",
            "status": TicketStatus.OPEN,
            "priority": TicketPriority.HIGH
        },
        {
            "ticket_number": "#932937",
            "subject": "CCS PIF Confirmation",
            "description": "CCS Paid in Full confirmation",
            "requester": "noreply",
            "status": TicketStatus.OPEN,
            "priority": TicketPriority.LOW
        },
    ]

    # Check if tickets already exist and add them
    for i, ticket_data in enumerate(tickets_data):
        existing_ticket = db.query(Ticket).filter(
            Ticket.ticket_number == ticket_data["ticket_number"]
        ).first()

        if existing_ticket:
            print(f"Ticket {ticket_data['ticket_number']} already exists, skipping...")
            continue

        ticket = Ticket(
            ticket_number=ticket_data["ticket_number"],
            subject=ticket_data["subject"],
            description=ticket_data["description"],
            requester_id=users[ticket_data["requester"]].id,
            assignee_id=None,
            status=ticket_data["status"],
            priority=ticket_data["priority"],
            created_at=datetime.utcnow() - timedelta(days=len(tickets_data) - i)
        )
        db.add(ticket)
        print(f"Added ticket: {ticket_data['ticket_number']} - {ticket_data['subject']}")

    db.commit()
    print("-" * 80)
    print(f"\nSuccessfully added {len(tickets_data)} tickets!")

    # Show summary
    total_tickets = db.query(Ticket).count()
    total_users = db.query(User).count()
    print(f"\nDatabase Summary:")
    print(f"Total Users: {total_users}")
    print(f"Total Tickets: {total_tickets}")

except Exception as e:
    print(f"Error adding tickets: {e}")
    db.rollback()
    raise
finally:
    db.close()
