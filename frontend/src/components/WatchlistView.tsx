import { Loader2 } from 'lucide-react';
import { useWatchlist } from '../hooks/useWatchlist';
import { AssetCard } from './AssetCard';

interface WatchlistViewProps {
  onAssetClick?: (type: string, symbol: string) => void;
}

export function WatchlistView({ onAssetClick }: WatchlistViewProps) {
  const { watchlist, isLoading, removeFromWatchlist, isRemoving } = useWatchlist();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
      </div>
    );
  }

  if (watchlist.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Your watchlist is empty</p>
        <p className="text-gray-400 text-sm mt-1">
          Search for assets to add them to your watchlist
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {watchlist.map((item) => (
        <AssetCard
          key={item.id}
          asset={item.asset_info ?? {
            id: item.id,
            asset_type: item.asset_type,
            symbol: item.symbol,
            name: item.symbol,
            current_price: null,
            price_change_24h: null,
            price_change_percent_24h: null,
            market_cap: null,
            volume_24h: null,
            last_updated: null,
          }}
          onClick={() => onAssetClick?.(item.asset_type, item.symbol)}
          onRemove={() => !isRemoving && removeFromWatchlist(item.id)}
        />
      ))}
    </div>
  );
}
