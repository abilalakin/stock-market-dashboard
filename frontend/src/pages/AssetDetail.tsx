import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { useAssetData } from '../hooks/useAssetData';
import { PriceChart } from '../components/PriceChart';
import type { AssetType } from '../types';

function formatPrice(price: number | null): string {
  if (price === null) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: price < 1 ? 6 : 2,
  }).format(price);
}

function formatLargeNumber(num: number | null): string {
  if (num === null) return 'N/A';
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  return `$${num.toLocaleString()}`;
}

export function AssetDetail() {
  const { type, symbol } = useParams<{ type: AssetType; symbol: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error } = useAssetData(type as AssetType, symbol ?? '');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-gray-400 animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">Asset not found</p>
            <p className="text-gray-400 mt-2">
              Unable to load data for {symbol}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isPositive = (data.price_change_percent_24h ?? 0) >= 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{data.symbol}</h1>
                <span
                  className={`text-sm px-3 py-1 rounded-full ${
                    data.asset_type === 'stock'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-orange-100 text-orange-700'
                  }`}
                >
                  {data.asset_type}
                </span>
              </div>
              <p className="text-gray-500 text-lg">{data.name}</p>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-4xl font-bold">
                {formatPrice(data.current_price)}
              </p>
              <div
                className={`flex items-center gap-1 text-lg sm:justify-end ${
                  isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="w-5 h-5" />
                ) : (
                  <TrendingDown className="w-5 h-5" />
                )}
                <span>
                  {formatPrice(data.price_change_24h)} (
                  {isPositive ? '+' : ''}
                  {data.price_change_percent_24h?.toFixed(2) ?? '0.00'}%)
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">24h High</p>
              <p className="text-lg font-semibold">
                {formatPrice(data.high_24h)}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">24h Low</p>
              <p className="text-lg font-semibold">
                {formatPrice(data.low_24h)}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Market Cap</p>
              <p className="text-lg font-semibold">
                {formatLargeNumber(data.market_cap)}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">24h Volume</p>
              <p className="text-lg font-semibold">
                {formatLargeNumber(data.volume_24h)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
          <h2 className="text-xl font-semibold mb-4">Price Chart</h2>
          <PriceChart type={type as AssetType} symbol={symbol ?? ''} />
        </div>

        {data.description && (
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">About {data.name}</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {data.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
