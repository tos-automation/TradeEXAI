'use client'

import { MarketType } from '@/types'

interface MarketSelectorProps {
  marketType: MarketType
  onMarketChange: (market: MarketType) => void
}

export default function MarketSelector({ marketType, onMarketChange }: MarketSelectorProps) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onMarketChange('stocks')}
        className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
          marketType === 'stocks'
            ? 'bg-tv-green text-white'
            : 'bg-tv-panel text-tv-text hover:bg-tv-border border border-tv-border'
        }`}
      >
        Stocks
      </button>
      <button
        onClick={() => onMarketChange('crypto')}
        className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
          marketType === 'crypto'
            ? 'bg-tv-green text-white'
            : 'bg-tv-panel text-tv-text hover:bg-tv-border border border-tv-border'
        }`}
      >
        Crypto
      </button>
      <button
        onClick={() => onMarketChange('forex')}
        className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
          marketType === 'forex'
            ? 'bg-tv-green text-white'
            : 'bg-tv-panel text-tv-text hover:bg-tv-border border border-tv-border'
        }`}
      >
        Forex
      </button>
    </div>
  )
}