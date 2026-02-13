"""
Script to update user emails to match username format
"""
from database import SessionLocal
from models import User

db = SessionLocal()

try:
    # Get all users
    users = db.query(User).all()

    print("Updating user emails...")
    print("-" * 80)

    for user in users:
        old_email = user.email
        # Update email to match username@example.com format
        if user.username != 'admin' and not user.email.startswith(user.username):
            new_email = f"{user.username}@example.com"
            user.email = new_email
            print(f"User: {user.username}")
            print(f"  Old email: {old_email}")
            print(f"  New email: {new_email}")
            print("-" * 80)

    db.commit()
    print("\nEmails updated successfully!")

    # Display updated users
    print("\nUpdated user list:")
    print("-" * 80)
    users = db.query(User).all()
    for user in users:
        print(f"Username: {user.username}")
        print(f"Email: {user.email}")
        print(f"Full Name: {user.full_name}")
        print("-" * 80)

except Exception as e:
    print(f"Error updating emails: {e}")
    db.rollback()
finally:
    db.close()
