export type AssetType = 'stock' | 'crypto';

export interface Asset {
  id: number;
  asset_type: AssetType;
  symbol: string;
  name: string;
  current_price: number | null;
  price_change_24h: number | null;
  price_change_percent_24h: number | null;
  market_cap: number | null;
  volume_24h: number | null;
  last_updated: string | null;
}

export interface AssetDetail extends Asset {
  high_24h: number | null;
  low_24h: number | null;
  description: string | null;
}

export interface HistoricalDataPoint {
  timestamp: string;
  price: number;
  volume: number | null;
}

export interface AssetHistory {
  symbol: string;
  asset_type: AssetType;
  data: HistoricalDataPoint[];
}

export interface WatchlistItem {
  id: number;
  asset_type: AssetType;
  symbol: string;
  added_at: string;
  asset_info: Asset | null;
}

export interface WatchlistItemCreate {
  asset_type: AssetType;
  symbol: string;
}

export interface SearchResult {
  symbol: string;
  name: string;
  asset_type: AssetType;
  exchange: string | null;
}
