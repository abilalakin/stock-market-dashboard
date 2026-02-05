# Stock Market Dashboard

A multi-asset dashboard for tracking stocks and cryptocurrencies with real-time data, watchlist management, and price charts.

## Prerequisites

- Python 3.11+
- Node.js 18+
- [UV](https://docs.astral.sh/uv/)

## Project Structure

```
stock-market-dashboard/
├── backend/          # FastAPI + SQLAlchemy + yfinance
│   ├── app/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── routers/
│   │   └── services/
│   └── pyproject.toml
├── frontend/         # React + Vite + Tailwind + React Query
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types/
│   └── package.json
└── README.md
```

## Backend Setup

```bash
cd backend
uv sync
uv run alembic upgrade head
uv run uvicorn app.main:app --reload
```

Runs at http://localhost:8000 (API docs at /docs)

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Runs at http://localhost:5173

## Running Both

Open two terminals:

```bash
# Terminal 1
./scripts/start-backend.sh

# Terminal 2
./scripts/start-frontend.sh
```

## Environment Variables

Copy `.env.example` to `.env` in both `backend/` and `frontend/` directories.
