from datetime import datetime, timedelta
from typing import Any


class SimpleCache:
    """Simple in-memory cache with TTL support."""

    DEFAULT_TTL = timedelta(minutes=5)

    def __init__(self):
        self._cache: dict[str, tuple[Any, datetime]] = {}

    def get(self, key: str) -> Any | None:
        """
        Get value from cache if not expired.

        Args:
            key: Cache key

        Returns:
            Cached value or None if not found/expired
        """
        entry = self._cache.get(key)
        if entry is None:
            return None

        value, expiry = entry
        if datetime.now() > expiry:
            del self._cache[key]
            return None

        return value

    def set(self, key: str, value: Any, ttl: timedelta | None = None) -> None:
        """
        Set value in cache with TTL.

        Args:
            key: Cache key
            value: Value to cache
            ttl: Time to live (defaults to 5 minutes)
        """
        if ttl is None:
            ttl = self.DEFAULT_TTL
        expiry = datetime.now() + ttl
        self._cache[key] = (value, expiry)

    def clear(self) -> None:
        """Clear all cache entries."""
        self._cache.clear()


cache = SimpleCache()
