import { useQuery } from '@tanstack/react-query';
import { assetsApi } from '../services/api';
import type { AssetType } from '../types';

export function useAssetData(type: AssetType, symbol: string) {
  return useQuery({
    queryKey: ['asset', type, symbol],
    queryFn: () =>
      type === 'stock'
        ? assetsApi.getStock(symbol)
        : assetsApi.getCrypto(symbol),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!symbol,
  });
}
