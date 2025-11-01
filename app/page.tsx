'use client'

import { useState } from 'react'
import TradingChart from '@/components/TradingChart'
import OrderPanel from '@/components/OrderPanel'
import Watchlist from '@/components/Watchlist'
import AIPanel from '@/components/AIPanel'
import MarketSelector from '@/components/MarketSelector'
import Header from '@/components/Header'

export default function Home() {
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL')
  const [marketType, setMarketType] = useState<'stocks' | 'crypto' | 'forex'>('stocks')

  return (
    <div className="flex flex-col h-screen bg-tv-bg text-tv-text overflow-hidden">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Watchlist */}
        <div className="w-64 border-r border-tv-border overflow-y-auto">
          <Watchlist 
            selectedSymbol={selectedSymbol}
            onSelectSymbol={setSelectedSymbol}
            marketType={marketType}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Market Selector */}
          <div className="border-b border-tv-border p-2">
            <MarketSelector 
              marketType={marketType}
              onMarketChange={setMarketType}
            />
          </div>

          {/* Chart Area */}
          <div className="flex-1 overflow-hidden">
            <TradingChart 
              symbol={selectedSymbol}
              marketType={marketType}
            />
          </div>

          {/* Bottom Panel - AI Agent */}
          <div className="h-80 border-t border-tv-border overflow-hidden">
            <AIPanel 
              symbol={selectedSymbol}
              marketType={marketType}
            />
          </div>
        </div>

        {/* Right Sidebar - Order Panel */}
        <div className="w-80 border-l border-tv-border overflow-y-auto">
          <OrderPanel 
            symbol={selectedSymbol}
            marketType={marketType}
          />
        </div>
      </div>
    </div>
  )
}