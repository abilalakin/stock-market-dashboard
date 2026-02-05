from sqlalchemy import Column, Integer, String, Float, DateTime, Enum
from sqlalchemy.sql import func
import enum

from app.database import Base


class AssetType(str, enum.Enum):
    STOCK = "stock"
    CRYPTO = "crypto"


class Asset(Base):
    __tablename__ = "assets"

    id = Column(Integer, primary_key=True, index=True)
    asset_type = Column(Enum(AssetType), nullable=False)
    symbol = Column(String(20), unique=True, nullable=False, index=True)
    name = Column(String(100), nullable=False)
    current_price = Column(Float)
    price_change_24h = Column(Float)
    price_change_percent_24h = Column(Float)
    market_cap = Column(Float)
    volume_24h = Column(Float)
    last_updated = Column(DateTime, server_default=func.now(), onupdate=func.now())


class Watchlist(Base):
    __tablename__ = "watchlist"

    id = Column(Integer, primary_key=True, index=True)
    asset_type = Column(Enum(AssetType), nullable=False)
    symbol = Column(String(20), nullable=False, index=True)
    added_at = Column(DateTime, server_default=func.now())
