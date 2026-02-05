# Stock Market Dashboard

A full-stack stock market dashboard application with real-time data visualization.

## Project Structure

```
stock-market-dashboard/
├── backend/          # FastAPI backend
│   ├── app/
│   │   ├── models/   # SQLAlchemy models
│   │   ├── schemas/  # Pydantic schemas
│   │   ├── routers/  # API routes
│   │   └── services/ # Business logic
│   └── pyproject.toml
├── frontend/         # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── pages/
│   └── package.json
└── README.md
```

## Backend Setup

```bash
cd backend
uv sync
uv run uvicorn app.main:app --reload
```

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Copy the `.env.example` files in both `backend/` and `frontend/` directories and rename them to `.env`, then fill in the required values.
