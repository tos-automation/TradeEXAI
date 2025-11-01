export interface PriceData {
  time: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface TradeSignal {
  id: string
  symbol: string
  action: 'BUY' | 'SELL'
  confidence: number
  entryPrice: number
  targetPrice: number
  stopLoss: number
  reason: string
  pattern: string
  timestamp: number
}

export interface Position {
  id: string
  symbol: string
  side: 'LONG' | 'SHORT'
  quantity: number
  entryPrice: number
  currentPrice: number
  unrealizedPnL: number
  marketType: 'stocks' | 'crypto' | 'forex'
}

export interface WatchlistItem {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketType: 'stocks' | 'crypto' | 'forex'
}

export type MarketType = 'stocks' | 'crypto' | 'forex'