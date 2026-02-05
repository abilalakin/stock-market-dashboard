import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { assetsApi } from '../services/api';
import type { AssetType } from '../types';

export function useAssetSearch(
  initialQuery: string = '',
  initialType: AssetType | 'all' = 'all'
) {
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [assetType, setAssetType] = useState<AssetType | 'all'>(initialType);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const { data: results, isLoading } = useQuery({
    queryKey: ['search', debouncedQuery, assetType],
    queryFn: () => assetsApi.search(debouncedQuery, assetType),
    enabled: debouncedQuery.length > 0,
  });

  return {
    query,
    setQuery,
    assetType,
    setAssetType,
    results: results ?? [],
    isLoading,
  };
}
