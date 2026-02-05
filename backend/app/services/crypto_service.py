import logging
from datetime import datetime

import requests

from app.schemas import AssetDetail, AssetType, HistoricalDataPoint, SearchResult

logger = logging.getLogger(__name__)

# CoinGecko API base URL (free tier)
COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3"

# Rate limit: 10-30 calls/minute on free tier
# Consider adding caching or rate limiting in production


class CryptoService:
    """Service for fetching cryptocurrency data using CoinGecko API."""

    # Common symbol to CoinGecko ID mappings
    SYMBOL_TO_ID = {
        "BTC": "bitcoin",
        "ETH": "ethereum",
        "USDT": "tether",
        "BNB": "binancecoin",
        "SOL": "solana",
        "XRP": "ripple",
        "ADA": "cardano",
        "DOGE": "dogecoin",
        "AVAX": "avalanche-2",
        "DOT": "polkadot",
        "TRX": "tron",
        "LINK": "chainlink",
        "MATIC": "matic-network",
        "SHIB": "shiba-inu",
        "LTC": "litecoin",
        "ATOM": "cosmos",
        "UNI": "uniswap",
        "XLM": "stellar",
        "ALGO": "algorand",
        "NEAR": "near",
    }

    def __init__(self, timeout: int = 10):
        self.timeout = timeout

    def _symbol_to_id(self, symbol: str) -> str | None:
        """
        Convert a crypto symbol to CoinGecko ID.

        Args:
            symbol: Crypto symbol (e.g., "BTC", "ETH")

        Returns:
            CoinGecko ID (e.g., "bitcoin") or None if not found
        """
        return self.SYMBOL_TO_ID.get(symbol.upper())

    def get_crypto_data(self, symbol: str) -> AssetDetail | None:
        """
        Fetch current cryptocurrency data for a given symbol.

        Args:
            symbol: Crypto symbol (e.g., "BTC", "ETH")

        Returns:
            AssetDetail with current price and market data, or None if not found
        """
        coin_id = self._symbol_to_id(symbol)
        if not coin_id:
            logger.warning(f"Unknown crypto symbol: {symbol}")
            return None

        try:
            response = requests.get(
                f"{COINGECKO_BASE_URL}/coins/{coin_id}",
                params={
                    "localization": "false",
                    "tickers": "false",
                    "community_data": "false",
                    "developer_data": "false",
                },
                timeout=self.timeout,
            )
            response.raise_for_status()
            data = response.json()

            market_data = data.get("market_data", {})

            return AssetDetail(
                id=0,
                asset_type=AssetType.CRYPTO,
                symbol=symbol.upper(),
                name=data.get("name", symbol),
                current_price=market_data.get("current_price", {}).get("usd"),
                price_change_24h=market_data.get("price_change_24h"),
                price_change_percent_24h=market_data.get("price_change_percentage_24h"),
                market_cap=market_data.get("market_cap", {}).get("usd"),
                volume_24h=market_data.get("total_volume", {}).get("usd"),
                last_updated=datetime.now(),
                high_24h=market_data.get("high_24h", {}).get("usd"),
                low_24h=market_data.get("low_24h", {}).get("usd"),
                description=data.get("description", {}).get("en"),
            )
        except requests.RequestException as e:
            logger.error(f"Error fetching crypto data for {symbol}: {e}")
            return None

    def get_historical_data(
        self, symbol: str, days: int = 30
    ) -> list[HistoricalDataPoint]:
        """
        Fetch historical price data for a given cryptocurrency.

        Args:
            symbol: Crypto symbol (e.g., "BTC", "ETH")
            days: Number of days of history (1, 7, 30, 90, 365, max)

        Returns:
            List of HistoricalDataPoint with timestamp, price, and volume
        """
        coin_id = self._symbol_to_id(symbol)
        if not coin_id:
            logger.warning(f"Unknown crypto symbol: {symbol}")
            return []

        try:
            response = requests.get(
                f"{COINGECKO_BASE_URL}/coins/{coin_id}/market_chart",
                params={"vs_currency": "usd", "days": days},
                timeout=self.timeout,
            )
            response.raise_for_status()
            data = response.json()

            prices = data.get("prices", [])
            volumes = data.get("total_volumes", [])

            # Create volume lookup by timestamp
            volume_map = {v[0]: v[1] for v in volumes}

            return [
                HistoricalDataPoint(
                    timestamp=datetime.fromtimestamp(p[0] / 1000),
                    price=p[1],
                    volume=volume_map.get(p[0]),
                )
                for p in prices
            ]
        except requests.RequestException as e:
            logger.error(f"Error fetching historical data for {symbol}: {e}")
            return []

    def search_crypto(self, query: str) -> list[SearchResult]:
        """
        Search for cryptocurrencies matching the query.

        Args:
            query: Search query (symbol or name)

        Returns:
            List of top 5 SearchResult with symbol, name, and market cap rank
        """
        try:
            response = requests.get(
                f"{COINGECKO_BASE_URL}/search",
                params={"query": query},
                timeout=self.timeout,
            )
            response.raise_for_status()
            data = response.json()

            coins = data.get("coins", [])[:5]

            return [
                SearchResult(
                    symbol=coin.get("symbol", "").upper(),
                    name=coin.get("name", ""),
                    asset_type=AssetType.CRYPTO,
                    exchange=f"Rank #{coin.get('market_cap_rank')}"
                    if coin.get("market_cap_rank")
                    else None,
                )
                for coin in coins
            ]
        except requests.RequestException as e:
            logger.error(f"Error searching for {query}: {e}")
            return []
