from datetime import timedelta
from typing import Literal

from fastapi import APIRouter, HTTPException, Query

from app.schemas import AssetDetail, AssetHistory, AssetType, SearchResult
from app.services import StockService, CryptoService, cache

router = APIRouter(prefix="/api/assets", tags=["assets"])

stock_service = StockService()
crypto_service = CryptoService()

CACHE_TTL = timedelta(minutes=5)
HISTORY_CACHE_TTL = timedelta(minutes=15)


@router.get("/stocks/{symbol}", response_model=AssetDetail)
def get_stock(symbol: str):
    """Get current stock data for a symbol."""
    cache_key = f"stock:{symbol.upper()}"
    cached = cache.get(cache_key)
    if cached:
        return cached

    data = stock_service.get_stock_data(symbol)
    if not data:
        raise HTTPException(status_code=404, detail=f"Stock {symbol} not found")

    cache.set(cache_key, data, CACHE_TTL)
    return data


@router.get("/stocks/{symbol}/history", response_model=AssetHistory)
def get_stock_history(
    symbol: str,
    period: Literal["1d", "5d", "1mo", "3mo", "6mo", "1y", "5y"] = Query(default="1mo"),
):
    """Get historical stock data for a symbol."""
    cache_key = f"stock_history:{symbol.upper()}:{period}"
    cached = cache.get(cache_key)
    if cached:
        return cached

    data = stock_service.get_historical_data(symbol, period)
    if not data:
        raise HTTPException(
            status_code=404, detail=f"No historical data found for {symbol}"
        )

    result = AssetHistory(symbol=symbol.upper(), asset_type=AssetType.STOCK, data=data)
    cache.set(cache_key, result, HISTORY_CACHE_TTL)
    return result


@router.get("/crypto/{symbol}", response_model=AssetDetail)
def get_crypto(symbol: str):
    """Get current cryptocurrency data for a symbol."""
    cache_key = f"crypto:{symbol.upper()}"
    cached = cache.get(cache_key)
    if cached:
        return cached

    data = crypto_service.get_crypto_data(symbol)
    if not data:
        raise HTTPException(status_code=404, detail=f"Crypto {symbol} not found")

    cache.set(cache_key, data, CACHE_TTL)
    return data


@router.get("/crypto/{symbol}/history", response_model=AssetHistory)
def get_crypto_history(
    symbol: str,
    days: int = Query(default=30, ge=1, le=365),
):
    """Get historical cryptocurrency data for a symbol."""
    cache_key = f"crypto_history:{symbol.upper()}:{days}"
    cached = cache.get(cache_key)
    if cached:
        return cached

    data = crypto_service.get_historical_data(symbol, days)
    if not data:
        raise HTTPException(
            status_code=404, detail=f"No historical data found for {symbol}"
        )

    result = AssetHistory(symbol=symbol.upper(), asset_type=AssetType.CRYPTO, data=data)
    cache.set(cache_key, result, HISTORY_CACHE_TTL)
    return result


@router.get("/search", response_model=list[SearchResult])
def search_assets(
    query: str = Query(min_length=1),
    asset_type: Literal["all", "stock", "crypto"] = Query(default="all"),
):
    """Search for stocks and/or cryptocurrencies."""
    results: list[SearchResult] = []

    if asset_type in ("all", "stock"):
        results.extend(stock_service.search_stocks(query))

    if asset_type in ("all", "crypto"):
        results.extend(crypto_service.search_crypto(query))

    return results
