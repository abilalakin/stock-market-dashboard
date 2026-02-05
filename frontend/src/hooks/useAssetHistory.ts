import { useQuery } from '@tanstack/react-query';
import { assetsApi } from '../services/api';
import type { AssetType } from '../types';

export function useAssetHistory(
  type: AssetType,
  symbol: string,
  period: string = '1mo'
) {
  return useQuery({
    queryKey: ['assetHistory', type, symbol, period],
    queryFn: () =>
      type === 'stock'
        ? assetsApi.getStockHistory(symbol, period)
        : assetsApi.getCryptoHistory(symbol, periodToDays(period)),
    staleTime: 15 * 60 * 1000, // 15 minutes
    enabled: !!symbol,
  });
}

function periodToDays(period: string): number {
  const map: Record<string, number> = {
    '1d': 1,
    '5d': 5,
    '1mo': 30,
    '3mo': 90,
    '6mo': 180,
    '1y': 365,
    '5y': 1825,
  };
  return map[period] ?? 30;
}
