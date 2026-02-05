from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Watchlist, AssetType
from app.schemas import WatchlistItemCreate, WatchlistItemResponse
from app.services import StockService, CryptoService

router = APIRouter(prefix="/api/watchlist", tags=["watchlist"])

stock_service = StockService()
crypto_service = CryptoService()


def get_asset_info(asset_type: AssetType, symbol: str):
    """Fetch current asset data based on type."""
    if asset_type == AssetType.STOCK:
        return stock_service.get_stock_data(symbol)
    return crypto_service.get_crypto_data(symbol)


@router.get("/", response_model=list[WatchlistItemResponse])
def get_watchlist(db: Session = Depends(get_db)):
    """Get all watchlist items with current asset data."""
    items = db.query(Watchlist).all()

    result = []
    for item in items:
        asset_info = get_asset_info(item.asset_type, item.symbol)
        result.append(
            WatchlistItemResponse(
                id=item.id,
                asset_type=item.asset_type,
                symbol=item.symbol,
                added_at=item.added_at,
                asset_info=asset_info,
            )
        )

    return result


@router.post("/", response_model=WatchlistItemResponse, status_code=201)
def add_to_watchlist(item: WatchlistItemCreate, db: Session = Depends(get_db)):
    """Add a new asset to the watchlist."""
    # Check if asset exists
    asset_info = get_asset_info(item.asset_type, item.symbol)
    if not asset_info:
        raise HTTPException(
            status_code=404,
            detail=f"{item.asset_type.value.capitalize()} {item.symbol} not found",
        )

    # Check for duplicate
    existing = (
        db.query(Watchlist)
        .filter(Watchlist.symbol == item.symbol.upper())
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=400,
            detail=f"{item.symbol} is already in your watchlist",
        )

    # Create watchlist item
    watchlist_item = Watchlist(
        asset_type=item.asset_type,
        symbol=item.symbol.upper(),
    )
    db.add(watchlist_item)
    db.commit()
    db.refresh(watchlist_item)

    return WatchlistItemResponse(
        id=watchlist_item.id,
        asset_type=watchlist_item.asset_type,
        symbol=watchlist_item.symbol,
        added_at=watchlist_item.added_at,
        asset_info=asset_info,
    )


@router.delete("/{item_id}")
def remove_from_watchlist(item_id: int, db: Session = Depends(get_db)):
    """Remove an item from the watchlist."""
    item = db.query(Watchlist).filter(Watchlist.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Watchlist item not found")

    db.delete(item)
    db.commit()

    return {"message": f"Removed {item.symbol} from watchlist"}
