import { PriceData, TradeSignal, MarketType } from '@/types'

// Pattern recognition patterns
const PATTERNS = {
  'Double Bottom': {
    description: 'Bullish reversal pattern indicating potential upward movement',
    confidence: 0.85,
  },
  'Double Top': {
    description: 'Bearish reversal pattern indicating potential downward movement',
    confidence: 0.85,
  },
  'Head and Shoulders': {
    description: 'Bearish reversal pattern',
    confidence: 0.88,
  },
  'Inverse Head and Shoulders': {
    description: 'Bullish reversal pattern',
    confidence: 0.88,
  },
  'Bullish Engulfing': {
    description: 'Strong bullish candle pattern',
    confidence: 0.75,
  },
  'Bearish Engulfing': {
    description: 'Strong bearish candle pattern',
    confidence: 0.75,
  },
  'Support Bounce': {
    description: 'Price bouncing off support level',
    confidence: 0.70,
  },
  'Resistance Breakout': {
    description: 'Price breaking above resistance',
    confidence: 0.80,
  },
  'RSI Oversold': {
    description: 'RSI indicating oversold conditions',
    confidence: 0.65,
  },
  'RSI Overbought': {
    description: 'RSI indicating overbought conditions',
    confidence: 0.65,
  },
  'Moving Average Crossover': {
    description: 'Bullish MA crossover signal',
    confidence: 0.72,
  },
  'Volume Spike': {
    description: 'Unusual volume indicating strong momentum',
    confidence: 0.78,
  },
}

class AITradingAgent {
  private signals: Map<string, TradeSignal[]> = new Map()

  analyzePatterns(data: PriceData[]): TradeSignal[] {
    const signals: TradeSignal[] = []
    if (data.length < 20) return signals

    const latest = data[data.length - 1]
    const previous = data[data.length - 2]
    const recent = data.slice(-20)

    // Calculate technical indicators
    const sma20 = this.calculateSMA(recent, 20)
    const sma50 = data.length >= 50 ? this.calculateSMA(data.slice(-50), 50) : sma20
    const rsi = this.calculateRSI(recent.slice(-14))
    const volumeAvg = this.calculateVolumeAverage(recent)

    // Pattern 1: Double Bottom
    if (this.detectDoubleBottom(recent)) {
      signals.push(this.createSignal('BUY', latest.close, 'Double Bottom', 0.85))
    }

    // Pattern 2: Double Top
    if (this.detectDoubleTop(recent)) {
      signals.push(this.createSignal('SELL', latest.close, 'Double Top', 0.85))
    }

    // Pattern 3: Bullish Engulfing
    if (previous.close < previous.open && latest.close > latest.open && 
        latest.open < previous.close && latest.close > previous.open) {
      signals.push(this.createSignal('BUY', latest.close, 'Bullish Engulfing', 0.75))
    }

    // Pattern 4: Bearish Engulfing
    if (previous.close > previous.open && latest.close < latest.open &&
        latest.open > previous.close && latest.close < previous.open) {
      signals.push(this.createSignal('SELL', latest.close, 'Bearish Engulfing', 0.75))
    }

    // Pattern 5: Moving Average Crossover
    if (sma20 > sma50 && previous.close <= sma20 && latest.close > sma20) {
      signals.push(this.createSignal('BUY', latest.close, 'Moving Average Crossover', 0.72))
    }

    // Pattern 6: RSI Oversold/Overbought
    if (rsi < 30) {
      signals.push(this.createSignal('BUY', latest.close, 'RSI Oversold', 0.65))
    } else if (rsi > 70) {
      signals.push(this.createSignal('SELL', latest.close, 'RSI Overbought', 0.65))
    }

    // Pattern 7: Volume Spike
    if (latest.volume > volumeAvg * 1.5) {
      const direction = latest.close > previous.close ? 'BUY' : 'SELL'
      signals.push(this.createSignal(direction, latest.close, 'Volume Spike', 0.78))
    }

    // Pattern 8: Support/Resistance
    const support = Math.min(...recent.map(d => d.low))
    const resistance = Math.max(...recent.map(d => d.high))
    
    if (latest.low <= support * 1.01 && latest.close > support) {
      signals.push(this.createSignal('BUY', latest.close, 'Support Bounce', 0.70))
    }
    
    if (latest.high >= resistance * 0.99 && latest.close > resistance) {
      signals.push(this.createSignal('BUY', latest.close, 'Resistance Breakout', 0.80))
    }

    return signals
  }

  private detectDoubleBottom(data: PriceData[]): boolean {
    if (data.length < 10) return false
    const lows = data.map(d => d.low)
    const minLow = Math.min(...lows)
    const tolerance = minLow * 0.02

    let found = 0
    for (let i = 0; i < lows.length - 1; i++) {
      if (Math.abs(lows[i] - minLow) < tolerance) {
        found++
      }
    }
    return found >= 2 && data[data.length - 1].close > data[data.length - 1].open
  }

  private detectDoubleTop(data: PriceData[]): boolean {
    if (data.length < 10) return false
    const highs = data.map(d => d.high)
    const maxHigh = Math.max(...highs)
    const tolerance = maxHigh * 0.02

    let found = 0
    for (let i = 0; i < highs.length - 1; i++) {
      if (Math.abs(highs[i] - maxHigh) < tolerance) {
        found++
      }
    }
    return found >= 2 && data[data.length - 1].close < data[data.length - 1].open
  }

  private calculateSMA(data: PriceData[], period: number): number {
    const closes = data.slice(-period).map(d => d.close)
    return closes.reduce((a, b) => a + b, 0) / closes.length
  }

  private calculateRSI(data: PriceData[]): number {
    if (data.length < 2) return 50
    
    const changes = []
    for (let i = 1; i < data.length; i++) {
      changes.push(data[i].close - data[i - 1].close)
    }

    const gains = changes.filter(c => c > 0)
    const losses = changes.filter(c => c < 0).map(c => Math.abs(c))

    const avgGain = gains.length > 0 ? gains.reduce((a, b) => a + b, 0) / gains.length : 0
    const avgLoss = losses.length > 0 ? losses.reduce((a, b) => a + b, 0) / losses.length : 0

    if (avgLoss === 0) return 100
    const rs = avgGain / avgLoss
    return 100 - (100 / (1 + rs))
  }

  private calculateVolumeAverage(data: PriceData[]): number {
    const volumes = data.map(d => d.volume)
    return volumes.reduce((a, b) => a + b, 0) / volumes.length
  }

  private createSignal(
    action: 'BUY' | 'SELL',
    price: number,
    pattern: string,
    confidence: number
  ): TradeSignal {
    const riskReward = 2 // 2:1 risk/reward ratio
    const stopLossPercent = action === 'BUY' ? 0.02 : 0.02
    const targetPercent = stopLossPercent * riskReward

    const stopLoss = action === 'BUY' 
      ? price * (1 - stopLossPercent)
      : price * (1 + stopLossPercent)
    
    const targetPrice = action === 'BUY'
      ? price * (1 + targetPercent)
      : price * (1 - targetPercent)

    const patternInfo = PATTERNS[pattern as keyof typeof PATTERNS] || {
      description: 'Pattern detected',
      confidence: confidence,
    }

    return {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      symbol: '', // Will be set by caller
      action,
      confidence: confidence * 100,
      entryPrice: price,
      targetPrice,
      stopLoss,
      reason: patternInfo.description,
      pattern,
      timestamp: Date.now(),
    }
  }

  getExpertAnalysis(symbol: string, marketType: MarketType, data: PriceData[]): string {
    const signals = this.analyzePatterns(data)
    const latest = data[data.length - 1]
    const sma20 = this.calculateSMA(data.slice(-20), 20)
    const rsi = this.calculateRSI(data.slice(-14))

    let analysis = `\n**Market Analysis for ${symbol} (${marketType.toUpperCase()})**\n\n`
    analysis += `Current Price: $${latest.close.toFixed(2)}\n`
    analysis += `20 SMA: $${sma20.toFixed(2)}\n`
    analysis += `RSI: ${rsi.toFixed(2)}\n\n`

    if (signals.length > 0) {
      analysis += `**Detected Patterns:**\n`
      signals.forEach(signal => {
        analysis += `- ${signal.pattern}: ${signal.action} signal (${signal.confidence.toFixed(0)}% confidence)\n`
        analysis += `  Entry: $${signal.entryPrice.toFixed(2)}, Target: $${signal.targetPrice.toFixed(2)}, Stop: $${signal.stopLoss.toFixed(2)}\n`
      })
    } else {
      analysis += `**Status:** No strong patterns detected. Current market conditions suggest consolidation.\n`
    }

    analysis += `\n**Technical Outlook:**\n`
    if (latest.close > sma20) {
      analysis += `- Price is above 20 SMA, indicating bullish momentum\n`
    } else {
      analysis += `- Price is below 20 SMA, indicating bearish momentum\n`
    }

    if (rsi < 30) {
      analysis += `- RSI indicates oversold conditions, potential bounce opportunity\n`
    } else if (rsi > 70) {
      analysis += `- RSI indicates overbought conditions, potential pullback expected\n`
    } else {
      analysis += `- RSI is neutral, no extreme conditions detected\n`
    }

    return analysis
  }
}

export const aiAgent = new AITradingAgent()