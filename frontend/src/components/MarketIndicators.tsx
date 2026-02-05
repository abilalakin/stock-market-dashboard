import { TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { useAssetData } from '../hooks/useAssetData';

function formatPrice(price: number | null): string {
  if (price === null) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: price < 1 ? 6 : 2,
  }).format(price);
}

interface IndicatorProps {
  label: string;
  type: 'stock' | 'crypto';
  symbol: string;
}

function Indicator({ label, type, symbol }: IndicatorProps) {
  const { data, isLoading, error } = useAssetData(type, symbol);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <p className="text-sm text-gray-500 mb-1">{label}</p>
        <div className="flex items-center justify-center py-2">
          <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <p className="text-sm text-gray-500 mb-1">{label}</p>
        <p className="text-gray-400">Failed to load</p>
      </div>
    );
  }

  const isPositive = (data.price_change_percent_24h ?? 0) >= 0;

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-xl font-semibold">{formatPrice(data.current_price)}</p>
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
          {data.price_change_percent_24h?.toFixed(2) ?? '0.00'}%
        </span>
      </div>
    </div>
  );
}

export function MarketIndicators() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Indicator label="S&P 500 (SPY)" type="stock" symbol="SPY" />
      <Indicator label="Bitcoin (BTC)" type="crypto" symbol="BTC" />
    </div>
  );
}
