import logging
from datetime import datetime

import yfinance as yf

from app.schemas import AssetDetail, AssetType, HistoricalDataPoint, SearchResult

logger = logging.getLogger(__name__)


class StockService:
    """Service for fetching stock data using yfinance."""

    VALID_PERIODS = ("1d", "5d", "1mo", "3mo", "6mo", "1y", "5y")

    def get_stock_data(self, symbol: str) -> AssetDetail | None:
        """
        Fetch current stock data for a given symbol.

        Args:
            symbol: Stock ticker symbol (e.g., "AAPL", "GOOGL")

        Returns:
            AssetDetail with current price and market data, or None if not found
        """
        try:
            ticker = yf.Ticker(symbol)
            info = ticker.info

            if not info or info.get("regularMarketPrice") is None:
                logger.warning(f"No data found for symbol: {symbol}")
                return None

            return AssetDetail(
                id=0,
                asset_type=AssetType.STOCK,
                symbol=symbol.upper(),
                name=info.get("shortName") or info.get("longName") or symbol,
                current_price=info.get("regularMarketPrice"),
                price_change_24h=info.get("regularMarketChange"),
                price_change_percent_24h=info.get("regularMarketChangePercent"),
                market_cap=info.get("marketCap"),
                volume_24h=info.get("regularMarketVolume"),
                last_updated=datetime.now(),
                high_24h=info.get("dayHigh"),
                low_24h=info.get("dayLow"),
                description=info.get("longBusinessSummary"),
            )
        except Exception as e:
            logger.error(f"Error fetching stock data for {symbol}: {e}")
            return None

    def get_historical_data(
        self, symbol: str, period: str = "1mo"
    ) -> list[HistoricalDataPoint]:
        """
        Fetch historical price data for a given symbol.

        Args:
            symbol: Stock ticker symbol
            period: Time period - one of: 1d, 5d, 1mo, 3mo, 6mo, 1y, 5y

        Returns:
            List of HistoricalDataPoint with timestamp, price, and volume
        """
        if period not in self.VALID_PERIODS:
            logger.warning(f"Invalid period {period}, defaulting to 1mo")
            period = "1mo"

        try:
            ticker = yf.Ticker(symbol)
            history = ticker.history(period=period)

            if history.empty:
                logger.warning(f"No historical data found for {symbol}")
                return []

            return [
                HistoricalDataPoint(
                    timestamp=index.to_pydatetime(),
                    price=row["Close"],
                    volume=row["Volume"],
                )
                for index, row in history.iterrows()
            ]
        except Exception as e:
            logger.error(f"Error fetching historical data for {symbol}: {e}")
            return []

    def search_stocks(self, query: str) -> list[SearchResult]:
        """
        Search for stocks matching the query.

        Args:
            query: Search query (symbol or company name)

        Returns:
            List of SearchResult with symbol, name, and exchange
        """
        try:
            ticker = yf.Ticker(query.upper())
            info = ticker.info

            if not info or info.get("symbol") is None:
                return []

            return [
                SearchResult(
                    symbol=info.get("symbol", query.upper()),
                    name=info.get("shortName") or info.get("longName") or query,
                    asset_type=AssetType.STOCK,
                    exchange=info.get("exchange"),
                )
            ]
        except Exception as e:
            logger.error(f"Error searching for {query}: {e}")
            return []
