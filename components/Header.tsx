'use client'

import { useTradingStore } from '@/store/tradingStore'
import { TrendingUp, DollarSign, Activity } from 'lucide-react'

export default function Header() {
  const { balance, positions } = useTradingStore()
  
  const totalPnL = positions.reduce((sum, p) => sum + p.unrealizedPnL, 0)
  const totalValue = balance + positions.reduce((sum, p) => sum + (p.currentPrice * p.quantity), 0)

  return (
    <header className="h-12 border-b border-tv-border bg-tv-panel flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-tv-green" />
          <h1 className="text-xl font-bold">TradeEXAI</h1>
        </div>
        <div className="text-sm text-tv-text-dim">AI-Powered Trading Platform</div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-tv-text-dim" />
          <div>
            <div className="text-xs text-tv-text-dim">Balance</div>
            <div className="text-sm font-semibold">${balance.toFixed(2)}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-tv-text-dim" />
          <div>
            <div className="text-xs text-tv-text-dim">Total P&L</div>
            <div className={`text-sm font-semibold ${totalPnL >= 0 ? 'text-tv-green' : 'text-tv-red'}`}>
              {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)}
            </div>
          </div>
        </div>

        <div>
          <div className="text-xs text-tv-text-dim">Portfolio Value</div>
          <div className="text-sm font-semibold">${totalValue.toFixed(2)}</div>
        </div>

        <div className="text-xs text-tv-text-dim">
          {positions.length} {positions.length === 1 ? 'Position' : 'Positions'}
        </div>
      </div>
    </header>
  )
}