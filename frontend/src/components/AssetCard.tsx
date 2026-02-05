import { TrendingUp, TrendingDown, X } from 'lucide-react';
import type { Asset } from '../types';

interface AssetCardProps {
  asset: Asset;
  onClick?: () => void;
  onRemove?: () => void;
}

function formatPrice(price: number | null): string {
  if (price === null) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: price < 1 ? 6 : 2,
  }).format(price);
}

function formatMarketCap(cap: number | null): string {
  if (cap === null) return 'N/A';
  if (cap >= 1e12) return `$${(cap / 1e12).toFixed(2)}T`;
  if (cap >= 1e9) return `$${(cap / 1e9).toFixed(2)}B`;
  if (cap >= 1e6) return `$${(cap / 1e6).toFixed(2)}M`;
  return `$${cap.toFixed(0)}`;
}

export function AssetCard({ asset, onClick, onRemove }: AssetCardProps) {
  const isPositive = (asset.price_change_percent_24h ?? 0) >= 0;

  return (
    <div
      onClick={onClick}
      className={`relative bg-white rounded-xl p-4 border border-gray-200 transition-all ${
        onClick ? 'cursor-pointer hover:shadow-lg hover:border-gray-300' : ''
      }`}
    >
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg">{asset.symbol}</h3>
            <span
              className={`text-xs px-2 py-0.5 rounded ${
                asset.asset_type === 'stock'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-orange-100 text-orange-700'
              }`}
            >
              {asset.asset_type}
            </span>
          </div>
          <p className="text-gray-500 text-sm truncate max-w-[150px]">
            {asset.name}
          </p>
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-semibold">
            {formatPrice(asset.current_price)}
          </p>
          <div
            className={`flex items-center gap-1 text-sm ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>
              {isPositive ? '+' : ''}
              {asset.price_change_percent_24h?.toFixed(2) ?? '0.00'}%
            </span>
          </div>
        </div>

        {asset.market_cap && (
          <div className="text-right">
            <p className="text-xs text-gray-400">Market Cap</p>
            <p className="text-sm font-medium text-gray-600">
              {formatMarketCap(asset.market_cap)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
