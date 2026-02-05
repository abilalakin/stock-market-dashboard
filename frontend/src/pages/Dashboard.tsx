import { AssetSearch } from '../components/AssetSearch';
import { MarketIndicators } from '../components/MarketIndicators';
import { WatchlistView } from '../components/WatchlistView';
import { useWatchlist } from '../hooks/useWatchlist';
import { useNavigate } from 'react-router-dom';
import type { SearchResult } from '../types';

export function Dashboard() {
  const navigate = useNavigate();
  const { addToWatchlist, isAdding } = useWatchlist();

  const handleSelect = (result: SearchResult) => {
    addToWatchlist(result.asset_type, result.symbol);
  };

  const handleAssetClick = (type: string, symbol: string) => {
    navigate(`/asset/${type}/${symbol}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Investment Dashboard
        </h1>

        <section className="mb-8">
          <MarketIndicators />
        </section>

        <section className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Add to Watchlist
            </h2>
            {isAdding && (
              <span className="text-sm text-gray-500">Adding...</span>
            )}
          </div>
          <AssetSearch onSelect={handleSelect} />
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Your Watchlist
          </h2>
          <WatchlistView onAssetClick={handleAssetClick} />
        </section>
      </div>
    </div>
  );
}
