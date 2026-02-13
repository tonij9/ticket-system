# Ticket System Backend

FastAPI-based backend for the ticket management system.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
```

2. Activate the virtual environment:
```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file from `.env.example`:
```bash
copy .env.example .env
```

5. Update the `.env` file with your configuration.

## Running the Server

```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

## API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get access token

### Users
- `GET /api/users/me` - Get current user info
- `GET /api/users/` - Get all users

### Tickets
- `POST /api/tickets/` - Create a new ticket
- `GET /api/tickets/` - Get all tickets (with filters)
- `GET /api/tickets/{id}` - Get a specific ticket
- `PATCH /api/tickets/{id}` - Update a ticket
- `DELETE /api/tickets/{id}` - Delete a ticket
- `GET /api/tickets/stats/counts` - Get ticket counts for views

## Database

By default, the application uses SQLite. The database file will be created as `tickets.db` in the backend directory.

To use PostgreSQL, update the `DATABASE_URL` in your `.env` file:
```
DATABASE_URL=postgresql://user:password@localhost/dbname
```
