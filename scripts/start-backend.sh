#!/bin/bash
cd "$(dirname "$0")/../backend"
uv run uvicorn app.main:app --reload
