import axios from 'axios';
import type {
  AssetDetail,
  AssetHistory,
  AssetType,
  SearchResult,
  WatchlistItem,
} from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const assetsApi = {
  getStock: (symbol: string) =>
    api.get<AssetDetail>(`/api/assets/stocks/${symbol}`).then((res) => res.data),

  getStockHistory: (symbol: string, period: string = '1mo') =>
    api
      .get<AssetHistory>(`/api/assets/stocks/${symbol}/history`, {
        params: { period },
      })
      .then((res) => res.data),

  getCrypto: (symbol: string) =>
    api.get<AssetDetail>(`/api/assets/crypto/${symbol}`).then((res) => res.data),

  getCryptoHistory: (symbol: string, days: number = 30) =>
    api
      .get<AssetHistory>(`/api/assets/crypto/${symbol}/history`, {
        params: { days },
      })
      .then((res) => res.data),

  search: (query: string, assetType: 'all' | 'stock' | 'crypto' = 'all') =>
    api
      .get<SearchResult[]>('/api/assets/search', {
        params: { query, asset_type: assetType },
      })
      .then((res) => res.data),
};

export const watchlistApi = {
  getAll: () =>
    api.get<WatchlistItem[]>('/api/watchlist/').then((res) => res.data),

  add: (assetType: AssetType, symbol: string) =>
    api
      .post<WatchlistItem>('/api/watchlist/', {
        asset_type: assetType,
        symbol,
      })
      .then((res) => res.data),

  remove: (id: number) =>
    api.delete(`/api/watchlist/${id}`).then((res) => res.data),
};
