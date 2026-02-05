from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field


class AssetType(str, Enum):
    STOCK = "stock"
    CRYPTO = "crypto"


class AssetBase(BaseModel):
    asset_type: AssetType
    symbol: str = Field(max_length=20)
    name: str = Field(max_length=100)


class AssetResponse(AssetBase):
    id: int
    current_price: float | None = None
    price_change_24h: float | None = None
    price_change_percent_24h: float | None = None
    market_cap: float | None = None
    volume_24h: float | None = None
    last_updated: datetime | None = None

    model_config = {"from_attributes": True}


class AssetDetail(AssetResponse):
    high_24h: float | None = None
    low_24h: float | None = None
    description: str | None = None


class HistoricalDataPoint(BaseModel):
    timestamp: datetime
    price: float
    volume: float | None = None


class AssetHistory(BaseModel):
    symbol: str
    asset_type: AssetType
    data: list[HistoricalDataPoint]


class WatchlistItemCreate(BaseModel):
    asset_type: AssetType
    symbol: str = Field(max_length=20)


class WatchlistItemResponse(BaseModel):
    id: int
    asset_type: AssetType
    symbol: str
    added_at: datetime
    asset_info: AssetResponse | None = None

    model_config = {"from_attributes": True}


class SearchResult(BaseModel):
    symbol: str
    name: str
    asset_type: AssetType
    exchange: str | None = None
