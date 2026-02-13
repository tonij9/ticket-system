# Quick Start Guide

This guide will help you get the ticket system up and running quickly.

## Prerequisites

- Python 3.10 or higher
- Node.js 18 or higher
- npm (comes with Node.js)

## Step 1: Backend Setup

Open a terminal and navigate to the backend directory:

```bash
cd C:\Users\Toni_\ticket-system\backend
```

Create and activate a virtual environment:

```bash
# Create virtual environment
python -m venv venv

# Activate it (Windows)
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the backend server:

```bash
uvicorn main:app --reload
```

The backend should now be running at `http://localhost:8000`

## Step 2: Frontend Setup

Open a NEW terminal and navigate to the frontend directory:

```bash
cd C:\Users\Toni_\ticket-system\frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The frontend should now be running at `http://localhost:5173`

## Step 3: Access the Application

1. Open your browser and go to `http://localhost:5173`
2. Click "Sign up" to create a new account
3. Fill in the registration form and submit
4. You'll be automatically logged in and redirected to the dashboard

## Step 4 (Optional): Seed Sample Data

If you want to populate the database with sample tickets and users:

1. Make sure the backend server is running
2. Open a new terminal in the backend directory
3. Run the seed script:

```bash
cd C:\Users\Toni_\ticket-system\backend
python seed_data.py
```

This will create:
- 4 sample users (admin, john_doe, jane_smith, bob_wilson)
- Multiple sample tickets with various statuses

You can then login with:
- Username: `admin` / Password: `admin123`
- Username: `john_doe` / Password: `password123`

## Troubleshooting

### Backend Issues

**Port already in use:**
```bash
# Use a different port
uvicorn main:app --reload --port 8001
```

**Database errors:**
- Delete the `tickets.db` file and restart the server
- The database will be recreated automatically

### Frontend Issues

**Port already in use:**
- The Vite dev server will automatically try the next available port
- Check the terminal output for the actual URL

**API connection errors:**
- Make sure the backend is running on port 8000
- Check the browser console for CORS errors

### General Tips

- Keep both terminal windows open (one for backend, one for frontend)
- If you see errors, check both terminal windows for error messages
- The backend API documentation is available at `http://localhost:8000/docs`

## Next Steps

- Explore the API documentation at `http://localhost:8000/docs`
- Create tickets from different user accounts
- Try filtering tickets by view (My Inbox, Unsolved, Pending)
- Customize the styling in `frontend/src/index.css`
- Add new features by modifying the code

## Stopping the Servers

To stop the servers:
1. Go to each terminal window
2. Press `Ctrl+C`
