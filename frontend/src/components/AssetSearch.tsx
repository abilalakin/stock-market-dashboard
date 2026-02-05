import { Search, Loader2 } from 'lucide-react';
import { useAssetSearch } from '../hooks/useAssetSearch';
import type { SearchResult, AssetType } from '../types';

interface AssetSearchProps {
  onSelect: (result: SearchResult) => void;
}

export function AssetSearch({ onSelect }: AssetSearchProps) {
  const { query, setQuery, assetType, setAssetType, results, isLoading } =
    useAssetSearch();

  const filterButtons: { label: string; value: AssetType | 'all' }[] = [
    { label: 'All', value: 'all' },
    { label: 'Stocks', value: 'stock' },
    { label: 'Crypto', value: 'crypto' },
  ];

  return (
    <div className="relative w-full max-w-md">
      <div className="flex gap-2 mb-2">
        {filterButtons.map((btn) => (
          <button
            key={btn.value}
            onClick={() => setAssetType(btn.value)}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              assetType === btn.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search stocks or crypto..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
        )}
      </div>

      {query && results.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {results.map((result) => (
            <button
              key={`${result.asset_type}-${result.symbol}`}
              onClick={() => {
                onSelect(result);
                setQuery('');
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between border-b border-gray-100 last:border-b-0"
            >
              <div>
                <span className="font-medium">{result.symbol}</span>
                <span className="text-gray-500 ml-2 text-sm">{result.name}</span>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  result.asset_type === 'stock'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-orange-100 text-orange-700'
                }`}
              >
                {result.asset_type}
              </span>
            </button>
          ))}
        </div>
      )}

      {query && !isLoading && results.length === 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-gray-500">
          No results found
        </div>
      )}
    </div>
  );
}
