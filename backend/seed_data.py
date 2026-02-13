"""
Seed script to populate the database with sample data
Run this after starting the server for the first time
"""
import requests
import random
from datetime import datetime, timedelta

API_URL = "http://localhost:8000/api"

# Sample data
USERS = [
    {"username": "admin", "email": "admin@example.com", "password": "admin123", "full_name": "Admin User"},
    {"username": "john_doe", "email": "john@example.com", "password": "password123", "full_name": "John Doe"},
    {"username": "jane_smith", "email": "jane@example.com", "password": "password123", "full_name": "Jane Smith"},
    {"username": "bob_wilson", "email": "bob@example.com", "password": "password123", "full_name": "Bob Wilson"},
]

TICKET_SUBJECTS = [
    "Payment not received",
    "Account access issue",
    "Billing inquiry",
    "Service interruption",
    "Feature request",
    "Technical support needed",
    "Password reset request",
    "Refund request",
    "Subscription cancellation",
    "Data export request",
]

TICKET_DESCRIPTIONS = [
    "I need assistance with this issue as soon as possible.",
    "This has been ongoing for the past week.",
    "Can you please look into this matter?",
    "I've tried the troubleshooting steps but nothing works.",
    "This is affecting my business operations.",
    "I would appreciate a prompt response.",
    "Thank you for your help.",
]

def create_users():
    """Create sample users"""
    print("Creating users...")
    tokens = []

    for user in USERS:
        try:
            response = requests.post(f"{API_URL}/auth/register", json=user)
            if response.status_code == 200:
                data = response.json()
                tokens.append((user['username'], data['access_token']))
                print(f"✓ Created user: {user['username']}")
            else:
                print(f"✗ Failed to create user {user['username']}: {response.text}")
        except Exception as e:
            print(f"✗ Error creating user {user['username']}: {str(e)}")

    return tokens

def create_tickets(tokens):
    """Create sample tickets"""
    print("\nCreating tickets...")

    statuses = ["open", "in_progress", "pending", "resolved"]
    priorities = ["low", "medium", "high", "urgent"]

    for i, (username, token) in enumerate(tokens):
        # Each user creates 3-5 tickets
        num_tickets = random.randint(3, 5)

        for j in range(num_tickets):
            ticket_data = {
                "subject": random.choice(TICKET_SUBJECTS),
                "description": random.choice(TICKET_DESCRIPTIONS),
                "priority": random.choice(priorities),
            }

            headers = {"Authorization": f"Bearer {token}"}

            try:
                response = requests.post(f"{API_URL}/tickets/", json=ticket_data, headers=headers)
                if response.status_code == 200:
                    ticket = response.json()

                    # Randomly update some tickets to different statuses
                    if random.random() > 0.5:
                        update_data = {"status": random.choice(statuses)}
                        requests.patch(
                            f"{API_URL}/tickets/{ticket['id']}",
                            json=update_data,
                            headers=headers
                        )

                    print(f"✓ Created ticket #{ticket['ticket_number']} by {username}")
                else:
                    print(f"✗ Failed to create ticket for {username}: {response.text}")
            except Exception as e:
                print(f"✗ Error creating ticket for {username}: {str(e)}")

def main():
    print("=" * 50)
    print("Seeding Database with Sample Data")
    print("=" * 50)
    print("\nMake sure the API server is running at http://localhost:8000\n")

    try:
        # Test connection
        response = requests.get(f"{API_URL.replace('/api', '')}/health")
        if response.status_code != 200:
            print("✗ Cannot connect to API server. Is it running?")
            return
    except Exception as e:
        print(f"✗ Cannot connect to API server: {str(e)}")
        return

    tokens = create_users()

    if tokens:
        create_tickets(tokens)
        print("\n" + "=" * 50)
        print("✓ Database seeded successfully!")
        print("=" * 50)
        print("\nYou can now login with:")
        print("Username: admin / Password: admin123")
        print("Username: john_doe / Password: password123")
    else:
        print("\n✗ Failed to seed database")

if __name__ == "__main__":
    main()
