'use client'

import { useEffect, useState } from 'react'
import { WatchlistItem, MarketType } from '@/types'
import { dataService } from '@/services/dataService'

interface WatchlistProps {
  selectedSymbol: string
  onSelectSymbol: (symbol: string) => void
  marketType: MarketType
}

export default function Watchlist({ selectedSymbol, onSelectSymbol, marketType }: WatchlistProps) {
  const [items, setItems] = useState<WatchlistItem[]>([])

  useEffect(() => {
    const loadWatchlist = () => {
      const watchlist = dataService.getWatchlist(marketType)
      setItems(watchlist)
    }

    loadWatchlist()
    const interval = setInterval(loadWatchlist, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [marketType])

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-tv-border">
        <h2 className="text-lg font-semibold">Watchlist</h2>
        <p className="text-xs text-tv-text-dim mt-1">{marketType.toUpperCase()}</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-tv-border">
          {items.map((item) => (
            <button
              key={item.symbol}
              onClick={() => onSelectSymbol(item.symbol)}
              className={`w-full p-3 text-left hover:bg-tv-panel transition-colors ${
                selectedSymbol === item.symbol ? 'bg-tv-panel border-l-2 border-tv-green' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <div>
                  <div className="font-semibold text-sm">{item.symbol}</div>
                  <div className="text-xs text-tv-text-dim">{item.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">
                    ${item.price.toFixed(marketType === 'forex' ? 4 : 2)}
                  </div>
                  <div
                    className={`text-xs ${
                      item.change >= 0 ? 'text-tv-green' : 'text-tv-red'
                    }`}
                  >
                    {item.change >= 0 ? '+' : ''}
                    {item.change.toFixed(marketType === 'forex' ? 4 : 2)} (
                    {item.changePercent >= 0 ? '+' : ''}
                    {item.changePercent.toFixed(2)}%)
                  </div>
                </div>
              </div>
              <div className="text-xs text-tv-text-dim">
                Vol: {(item.volume / 1000000).toFixed(2)}M
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}