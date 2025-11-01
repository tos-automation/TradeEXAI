'use client'

import { useEffect, useState } from 'react'
import { PriceData, TradeSignal, MarketType } from '@/types'
import { aiAgent } from '@/services/aiAgent'
import { dataService } from '@/services/dataService'
import { useTradingStore } from '@/store/tradingStore'
import { TrendingUp, TrendingDown, Brain, AlertCircle } from 'lucide-react'

interface AIPanelProps {
  symbol: string
  marketType: MarketType
}

export default function AIPanel({ symbol, marketType }: AIPanelProps) {
  const { signals, addSignal } = useTradingStore()
  const [analysis, setAnalysis] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [priceData, setPriceData] = useState<PriceData[]>([])

  useEffect(() => {
    // Load initial data
    const initialData = dataService.generateHistoricalData(symbol, marketType, 7)
    setPriceData(initialData)

    // Subscribe to updates
    const unsubscribe = dataService.subscribeToUpdates(symbol, marketType, (newCandles) => {
      if (newCandles.length > 0) {
        setPriceData(prev => [...prev.slice(-100), ...newCandles])
      }
    })

    return unsubscribe
  }, [symbol, marketType])

  useEffect(() => {
    if (priceData.length < 20) return

    setIsAnalyzing(true)
    
    // Analyze patterns
    const detectedSignals = aiAgent.analyzePatterns(priceData)
    
    // Add new signals to store
    detectedSignals.forEach(signal => {
      const signalWithSymbol = { ...signal, symbol }
      const exists = signals.some(s => 
        s.symbol === symbol && 
        s.pattern === signal.pattern && 
        Date.now() - s.timestamp < 60000 // Same pattern within 1 minute
      )
      
      if (!exists) {
        addSignal(signalWithSymbol)
      }
    })

    // Get expert analysis
    const expertAnalysis = aiAgent.getExpertAnalysis(symbol, marketType, priceData)
    setAnalysis(expertAnalysis)

    setIsAnalyzing(false)
  }, [priceData, symbol, marketType, signals, addSignal])

  const symbolSignals = signals.filter(s => s.symbol === symbol).slice(0, 5)

  return (
    <div className="h-full flex flex-col bg-tv-panel">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-tv-border">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-tv-green" />
          <h2 className="text-lg font-semibold">AI Trading Agent</h2>
        </div>
        {isAnalyzing && (
          <div className="text-sm text-tv-text-dim">Analyzing patterns...</div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Latest Signals */}
        {symbolSignals.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-2 text-tv-text-dim">Recent Signals</h3>
            <div className="space-y-2">
              {symbolSignals.map((signal) => (
                <div
                  key={signal.id}
                  className={`panel p-3 border-l-4 ${
                    signal.action === 'BUY' ? 'border-tv-green' : 'border-tv-red'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {signal.action === 'BUY' ? (
                        <TrendingUp className="w-4 h-4 text-tv-green" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-tv-red" />
                      )}
                      <span
                        className={`font-semibold ${
                          signal.action === 'BUY' ? 'text-tv-green' : 'text-tv-red'
                        }`}
                      >
                        {signal.action}
                      </span>
                      <span className="text-xs text-tv-text-dim">
                        {signal.confidence.toFixed(0)}% confidence
                      </span>
                    </div>
                  </div>
                  <div className="text-sm mb-1">
                    <strong>Pattern:</strong> {signal.pattern}
                  </div>
                  <div className="text-xs text-tv-text-dim mb-2">{signal.reason}</div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <div className="text-tv-text-dim">Entry</div>
                      <div className="text-tv-text">
                        ${signal.entryPrice.toFixed(marketType === 'forex' ? 4 : 2)}
                      </div>
                    </div>
                    <div>
                      <div className="text-tv-text-dim">Target</div>
                      <div className="text-tv-green">
                        ${signal.targetPrice.toFixed(marketType === 'forex' ? 4 : 2)}
                      </div>
                    </div>
                    <div>
                      <div className="text-tv-text-dim">Stop Loss</div>
                      <div className="text-tv-red">
                        ${signal.stopLoss.toFixed(marketType === 'forex' ? 4 : 2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Expert Analysis */}
        {analysis && (
          <div>
            <h3 className="text-sm font-semibold mb-2 text-tv-text-dim flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Market Analysis
            </h3>
            <div className="panel p-3 text-sm whitespace-pre-wrap font-mono text-xs">
              {analysis}
            </div>
          </div>
        )}

        {symbolSignals.length === 0 && !analysis && (
          <div className="flex items-center justify-center h-full text-tv-text-dim">
            <div className="text-center">
              <Brain className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Collecting market data...</p>
              <p className="text-xs mt-1">AI agent is analyzing patterns</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}