'use client'

import { useEffect, useRef, useState } from 'react'
import { createChart, IChartApi, ISeriesApi, CandlestickData, Time } from 'lightweight-charts'
import { PriceData } from '@/types'
import { dataService } from '@/services/dataService'

interface TradingChartProps {
  symbol: string
  marketType: 'stocks' | 'crypto' | 'forex'
}

export default function TradingChart({ symbol, marketType }: TradingChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)
  const [priceData, setPriceData] = useState<PriceData[]>([])

  useEffect(() => {
    if (!chartContainerRef.current) return

    // Initialize chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: '#131722' },
        textColor: '#d1d4dc',
      },
      grid: {
        vertLines: { color: '#2a2e39' },
        horzLines: { color: '#2a2e39' },
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: '#2a2e39',
      },
      rightPriceScale: {
        borderColor: '#2a2e39',
      },
    })

    chartRef.current = chart

    // Create candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    })

    candlestickSeriesRef.current = candlestickSeries

    // Load initial data
    const initialData = dataService.generateHistoricalData(symbol, marketType, 7)
    setPriceData(initialData)

    const formattedData: CandlestickData<Time>[] = initialData.map(d => ({
      time: (d.time / 1000) as Time,
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
    }))

    candlestickSeries.setData(formattedData)

    // Subscribe to updates
    const unsubscribe = dataService.subscribeToUpdates(symbol, marketType, (newCandles) => {
      if (candlestickSeriesRef.current && newCandles.length > 0) {
        const newCandle = newCandles[0]
        const formatted: CandlestickData<Time> = {
          time: (newCandle.time / 1000) as Time,
          open: newCandle.open,
          high: newCandle.high,
          low: newCandle.low,
          close: newCandle.close,
        }
        candlestickSeriesRef.current.update(formatted)
        setPriceData(prev => [...prev.slice(-500), newCandle]) // Keep last 500 candles
      }
    })

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        })
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      unsubscribe()
      window.removeEventListener('resize', handleResize)
      chart.remove()
    }
  }, [symbol, marketType])

  // Update chart when symbol changes
  useEffect(() => {
    if (!chartRef.current || !candlestickSeriesRef.current) return

    const newData = dataService.generateHistoricalData(symbol, marketType, 7)
    setPriceData(newData)

    const formattedData: CandlestickData<Time>[] = newData.map(d => ({
      time: (d.time / 1000) as Time,
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
    }))

    candlestickSeriesRef.current.setData(formattedData)
  }, [symbol, marketType])

  const currentPrice = priceData.length > 0 ? priceData[priceData.length - 1].close : 0
  const previousPrice = priceData.length > 1 ? priceData[priceData.length - 2].close : currentPrice
  const change = currentPrice - previousPrice
  const changePercent = previousPrice > 0 ? (change / previousPrice) * 100 : 0

  return (
    <div className="flex flex-col h-full">
      {/* Price Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-tv-border">
        <div>
          <h2 className="text-xl font-bold">{symbol}</h2>
          <p className="text-sm text-tv-text-dim">{marketType.toUpperCase()}</p>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-bold ${change >= 0 ? 'text-tv-green' : 'text-tv-red'}`}>
            ${currentPrice.toFixed(marketType === 'forex' ? 4 : 2)}
          </div>
          <div className={`text-sm ${change >= 0 ? 'text-tv-green' : 'text-tv-red'}`}>
            {change >= 0 ? '+' : ''}{change.toFixed(marketType === 'forex' ? 4 : 2)} ({changePercent >= 0 ? '+' : ''}{changePercent.toFixed(2)}%)
          </div>
        </div>
      </div>

      {/* Chart */}
      <div ref={chartContainerRef} className="flex-1 min-h-0" />
    </div>
  )
}