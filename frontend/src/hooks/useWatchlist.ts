import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { watchlistApi } from '../services/api';
import type { AssetType } from '../types';

export function useWatchlist() {
  const queryClient = useQueryClient();

  const {
    data: watchlist,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['watchlist'],
    queryFn: watchlistApi.getAll,
    refetchInterval: 60 * 1000, // Refetch every minute
  });

  const addMutation = useMutation({
    mutationFn: ({ assetType, symbol }: { assetType: AssetType; symbol: string }) =>
      watchlistApi.add(assetType, symbol),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (id: number) => watchlistApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
    },
  });

  return {
    watchlist: watchlist ?? [],
    isLoading,
    error,
    addToWatchlist: (assetType: AssetType, symbol: string) =>
      addMutation.mutate({ assetType, symbol }),
    removeFromWatchlist: (id: number) => removeMutation.mutate(id),
    isAdding: addMutation.isPending,
    isRemoving: removeMutation.isPending,
  };
}
