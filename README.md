# Ticket Management System

A modern ticket management system similar to Zendesk, built with FastAPI and React.

## Features

- 🎫 Complete ticket management (create, view, update, close)
- 👥 User profiles with ticket history
- 🔍 Advanced search (tickets and users)
- 📝 Pre-built email macros
- 🏷️ Ticket categorization and priority
- 👤 User authentication (JWT)
- 📊 Dashboard with multiple views

## Tech Stack

**Backend:**
- FastAPI (Python web framework)
- SQLAlchemy (ORM)
- SQLite/PostgreSQL (Database)
- JWT Authentication
- Bcrypt (Password hashing)

**Frontend:**
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios

## Local Development

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend will run on http://localhost:8000

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on http://localhost:5173

### Default Login

- Username: `admin`
- Password: `admin123`

## Deployment

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

## Project Structure

```
ticket-system/
├── backend/
│   ├── routers/          # API endpoints
│   ├── models.py         # Database models
│   ├── database.py       # Database configuration
│   └── main.py           # FastAPI app
│
└── frontend/
    ├── src/
    │   ├── pages/        # React pages
    │   ├── components/   # Reusable components
    │   ├── lib/          # Utilities
    │   └── types/        # TypeScript types
    └── public/
```

## License

MIT

