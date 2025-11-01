'use client'

import { useState, useEffect } from 'react'
import { useTradingStore } from '@/store/tradingStore'
import { Position, MarketType, PriceData } from '@/types'
import { dataService } from '@/services/dataService'

interface OrderPanelProps {
  symbol: string
  marketType: MarketType
}

export default function OrderPanel({ symbol, marketType }: OrderPanelProps) {
  const { positions, addPosition, updatePosition, removePosition, balance } = useTradingStore()
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT'>('MARKET')
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY')
  const [quantity, setQuantity] = useState('')
  const [limitPrice, setLimitPrice] = useState('')
  const [currentPrice, setCurrentPrice] = useState(() => {
    const data = dataService.generateHistoricalData(symbol, marketType, 1)
    return data.length > 0 ? data[data.length - 1].close : 0
  })

  // Update current price and positions
  useEffect(() => {
    const unsubscribe = dataService.subscribeToUpdates(symbol, marketType, (newCandles: PriceData[]) => {
      if (newCandles.length > 0) {
        const latestPrice = newCandles[newCandles.length - 1].close
        setCurrentPrice(latestPrice)

        // Update positions - use store's current positions
        const currentPositions = useTradingStore.getState().positions
        const symbolPositions = currentPositions.filter(p => p.symbol === symbol)
        symbolPositions.forEach(pos => {
          const unrealizedPnL = pos.side === 'LONG'
            ? (latestPrice - pos.entryPrice) * pos.quantity
            : (pos.entryPrice - latestPrice) * pos.quantity

          updatePosition(pos.id, {
            currentPrice: latestPrice,
            unrealizedPnL,
          })
        })
      }
    })

    return unsubscribe
  }, [symbol, marketType, updatePosition])

  const symbolPositions = positions.filter(p => p.symbol === symbol)

  const handlePlaceOrder = () => {
    const qty = parseFloat(quantity)
    if (!qty || qty <= 0) return

    const entryPrice = orderType === 'MARKET' ? currentPrice : parseFloat(limitPrice)
    if (!entryPrice || entryPrice <= 0) return

    const totalCost = qty * entryPrice
    if (side === 'BUY' && totalCost > balance) {
      alert('Insufficient balance')
      return
    }

    const position: Position = {
      id: `pos-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      symbol,
      side: side === 'BUY' ? 'LONG' : 'SHORT',
      quantity: qty,
      entryPrice,
      currentPrice: entryPrice,
      unrealizedPnL: 0,
      marketType,
    }

    addPosition(position)
    setQuantity('')
    setLimitPrice('')
  }

  const totalPnL = symbolPositions.reduce((sum, p) => sum + p.unrealizedPnL, 0)

  return (
    <div className="h-full flex flex-col p-4 space-y-4">
      <h2 className="text-lg font-semibold border-b border-tv-border pb-2">Order Panel</h2>

      {/* Order Type Selection */}
      <div className="flex gap-2">
        <button
          onClick={() => setOrderType('MARKET')}
          className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
            orderType === 'MARKET'
              ? 'bg-tv-green text-white'
              : 'bg-tv-panel text-tv-text border border-tv-border'
          }`}
        >
          Market
        </button>
        <button
          onClick={() => setOrderType('LIMIT')}
          className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
            orderType === 'LIMIT'
              ? 'bg-tv-green text-white'
              : 'bg-tv-panel text-tv-text border border-tv-border'
          }`}
        >
          Limit
        </button>
      </div>

      {/* Buy/Sell Selection */}
      <div className="flex gap-2">
        <button
          onClick={() => setSide('BUY')}
          className={`flex-1 py-3 px-4 rounded font-semibold transition-colors ${
            side === 'BUY'
              ? 'bg-tv-green text-white'
              : 'bg-tv-panel text-tv-text border border-tv-border'
          }`}
        >
          BUY
        </button>
        <button
          onClick={() => setSide('SELL')}
          className={`flex-1 py-3 px-4 rounded font-semibold transition-colors ${
            side === 'SELL'
              ? 'bg-tv-red text-white'
              : 'bg-tv-panel text-tv-text border border-tv-border'
          }`}
        >
          SELL
        </button>
      </div>

      {/* Quantity Input */}
      <div>
        <label className="block text-sm text-tv-text-dim mb-1">Quantity</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="0.00"
          className="input w-full"
          step="0.01"
        />
      </div>

      {/* Limit Price Input */}
      {orderType === 'LIMIT' && (
        <div>
          <label className="block text-sm text-tv-text-dim mb-1">Limit Price</label>
          <input
            type="number"
            value={limitPrice}
            onChange={(e) => setLimitPrice(e.target.value)}
            placeholder={`$${currentPrice.toFixed(marketType === 'forex' ? 4 : 2)}`}
            className="input w-full"
            step={marketType === 'forex' ? 0.0001 : 0.01}
          />
        </div>
      )}

      {/* Current Price Display */}
      <div className="text-sm">
        <div className="flex justify-between text-tv-text-dim">
          <span>Current Price:</span>
          <span className="text-tv-text">${currentPrice.toFixed(marketType === 'forex' ? 4 : 2)}</span>
        </div>
        {orderType === 'MARKET' && quantity && (
          <div className="flex justify-between text-tv-text-dim mt-1">
            <span>Estimated Cost:</span>
            <span className="text-tv-text">
              ${(parseFloat(quantity) * currentPrice).toFixed(2)}
            </span>
          </div>
        )}
      </div>

      {/* Place Order Button */}
      <button
        onClick={handlePlaceOrder}
        className={`w-full py-3 rounded font-semibold transition-colors ${
          side === 'BUY' ? 'btn-primary' : 'btn-danger'
        }`}
      >
        Place {side} Order
      </button>

      {/* Positions */}
      {symbolPositions.length > 0 && (
        <div className="mt-6 border-t border-tv-border pt-4">
          <h3 className="text-sm font-semibold mb-2">Open Positions</h3>
          <div className="space-y-2">
            {symbolPositions.map((pos) => (
              <div key={pos.id} className="panel p-2 text-sm">
                <div className="flex justify-between mb-1">
                  <span className={pos.side === 'LONG' ? 'text-tv-green' : 'text-tv-red'}>
                    {pos.side} {pos.quantity.toFixed(2)}
                  </span>
                  <span className={pos.unrealizedPnL >= 0 ? 'text-tv-green' : 'text-tv-red'}>
                    {pos.unrealizedPnL >= 0 ? '+' : ''}${pos.unrealizedPnL.toFixed(2)}
                  </span>
                </div>
                <div className="text-xs text-tv-text-dim mb-2">
                  Entry: ${pos.entryPrice.toFixed(marketType === 'forex' ? 4 : 2)} | 
                  Current: ${pos.currentPrice.toFixed(marketType === 'forex' ? 4 : 2)}
                </div>
                <button
                  onClick={() => removePosition(pos.id)}
                  className="w-full py-1 px-2 text-xs btn-secondary"
                >
                  Close Position
                </button>
              </div>
            ))}
          </div>
          <div className="mt-2 pt-2 border-t border-tv-border">
            <div className="flex justify-between text-sm font-semibold">
              <span>Total P&L:</span>
              <span className={totalPnL >= 0 ? 'text-tv-green' : 'text-tv-red'}>
                {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Balance */}
      <div className="mt-auto pt-4 border-t border-tv-border">
        <div className="flex justify-between text-sm">
          <span className="text-tv-text-dim">Available Balance:</span>
          <span className="font-semibold">${balance.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}