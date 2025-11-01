import { PriceData, WatchlistItem, MarketType } from '@/types'

// Mock data generators for simulation
export class DataService {
  private intervals: Map<string, NodeJS.Timeout> = new Map()
  private subscribers: Map<string, Set<(data: PriceData[]) => void>> = new Map()

  // Stock symbols
  private stocks = [
    { symbol: 'AAPL', name: 'Apple Inc.', basePrice: 175 },
    { symbol: 'MSFT', name: 'Microsoft Corp.', basePrice: 380 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', basePrice: 140 },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', basePrice: 150 },
    { symbol: 'TSLA', name: 'Tesla Inc.', basePrice: 250 },
    { symbol: 'META', name: 'Meta Platforms Inc.', basePrice: 480 },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', basePrice: 800 },
    { symbol: 'JPM', name: 'JPMorgan Chase', basePrice: 180 },
  ]

  // Crypto symbols
  private crypto = [
    { symbol: 'BTC/USD', name: 'Bitcoin', basePrice: 45000 },
    { symbol: 'ETH/USD', name: 'Ethereum', basePrice: 2800 },
    { symbol: 'SOL/USD', name: 'Solana', basePrice: 120 },
    { symbol: 'BNB/USD', name: 'Binance Coin', basePrice: 380 },
    { symbol: 'ADA/USD', name: 'Cardano', basePrice: 0.55 },
    { symbol: 'DOGE/USD', name: 'Dogecoin', basePrice: 0.15 },
  ]

  // Forex pairs
  private forex = [
    { symbol: 'EUR/USD', name: 'Euro/US Dollar', basePrice: 1.0850 },
    { symbol: 'GBP/USD', name: 'British Pound/US Dollar', basePrice: 1.2650 },
    { symbol: 'USD/JPY', name: 'US Dollar/Japanese Yen', basePrice: 149.50 },
    { symbol: 'AUD/USD', name: 'Australian Dollar/US Dollar', basePrice: 0.6550 },
    { symbol: 'USD/CAD', name: 'US Dollar/Canadian Dollar', basePrice: 1.3450 },
    { symbol: 'EUR/GBP', name: 'Euro/British Pound', basePrice: 0.8580 },
  ]

  generateHistoricalData(symbol: string, marketType: MarketType, days: number = 30): PriceData[] {
    const info = this.getSymbolInfo(symbol, marketType)
    if (!info) return []

    const data: PriceData[] = []
    let currentPrice = info.basePrice
    const now = Date.now()
    const dayMs = 24 * 60 * 60 * 1000
    const intervalMs = 5 * 60 * 1000 // 5-minute candles

    for (let i = days * 288; i >= 0; i--) {
      const volatility = marketType === 'crypto' ? 0.02 : marketType === 'forex' ? 0.005 : 0.01
      const change = (Math.random() - 0.5) * volatility * 2
      currentPrice = currentPrice * (1 + change)

      const open = currentPrice
      const close = open * (1 + (Math.random() - 0.5) * volatility)
      const high = Math.max(open, close) * (1 + Math.random() * volatility * 0.5)
      const low = Math.min(open, close) * (1 - Math.random() * volatility * 0.5)
      const volume = Math.random() * 1000000 + 100000

      data.push({
        time: now - (i * intervalMs),
        open,
        high,
        low,
        close,
        volume,
      })
    }

    return data
  }

  subscribeToUpdates(
    symbol: string,
    marketType: MarketType,
    callback: (data: PriceData[]) => void
  ): () => void {
    const key = `${symbol}-${marketType}`
    
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set())
    }
    this.subscribers.get(key)!.add(callback)

    // Start generating updates if not already started
    if (!this.intervals.has(key)) {
      const info = this.getSymbolInfo(symbol, marketType)
      if (!info) return () => {}

      let currentPrice = info.basePrice
      const interval = setInterval(() => {
        const volatility = marketType === 'crypto' ? 0.001 : marketType === 'forex' ? 0.0002 : 0.0005
        const change = (Math.random() - 0.5) * volatility * 2
        currentPrice = currentPrice * (1 + change)

        const open = currentPrice
        const close = open * (1 + (Math.random() - 0.5) * volatility)
        const high = Math.max(open, close) * (1 + Math.random() * volatility * 0.3)
        const low = Math.min(open, close) * (1 - Math.random() * volatility * 0.3)
        const volume = Math.random() * 1000000 + 100000

        const newCandle: PriceData = {
          time: Date.now(),
          open,
          high,
          low,
          close,
          volume,
        }

        // Notify all subscribers
        this.subscribers.get(key)?.forEach(cb => {
          // In real app, this would append to existing data
          cb([newCandle])
        })
      }, 5000) // Update every 5 seconds

      this.intervals.set(key, interval)
    }

    // Return unsubscribe function
    return () => {
      const subscribers = this.subscribers.get(key)
      if (subscribers) {
        subscribers.delete(callback)
        if (subscribers.size === 0) {
          const interval = this.intervals.get(key)
          if (interval) {
            clearInterval(interval)
            this.intervals.delete(key)
          }
          this.subscribers.delete(key)
        }
      }
    }
  }

  getWatchlist(marketType: MarketType): WatchlistItem[] {
    const symbols = marketType === 'stocks' ? this.stocks :
                   marketType === 'crypto' ? this.crypto :
                   this.forex

    return symbols.map(s => {
      const change = (Math.random() - 0.5) * 0.05
      const price = s.basePrice * (1 + change)
      return {
        symbol: s.symbol,
        name: s.name,
        price,
        change: price - s.basePrice,
        changePercent: (change * 100),
        volume: Math.random() * 10000000 + 1000000,
        marketType,
      }
    })
  }

  private getSymbolInfo(symbol: string, marketType: MarketType) {
    const list = marketType === 'stocks' ? this.stocks :
                marketType === 'crypto' ? this.crypto :
                this.forex
    return list.find(s => s.symbol === symbol)
  }
}

export const dataService = new DataService()