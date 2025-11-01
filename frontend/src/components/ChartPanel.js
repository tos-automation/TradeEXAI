import React, { useEffect, useRef, useState } from 'react';
import './ChartPanel.css';
import { createChart } from 'lightweight-charts';
import axios from 'axios';

function ChartPanel({ symbol, timeframe, onTimeframeChange }) {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const candlestickSeriesRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [quote, setQuote] = useState(null);

  const timeframes = [
    { label: '1m', value: '1m', period: '1d' },
    { label: '5m', value: '5m', period: '5d' },
    { label: '15m', value: '15m', period: '5d' },
    { label: '1h', value: '1h', period: '1mo' },
    { label: '1D', value: '1d', period: '6mo' },
  ];

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: '#131722' },
        textColor: '#d1d4dc',
      },
      grid: {
        vertLines: { color: '#1e222d' },
        horzLines: { color: '#1e222d' },
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    chartRef.current = chart;

    // Create candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    candlestickSeriesRef.current = candlestickSeries;

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    fetchChartData();
    fetchQuote();
    
    // Auto-refresh quote every 5 seconds
    const interval = setInterval(fetchQuote, 5000);
    return () => clearInterval(interval);
  }, [symbol, timeframe]);

  const fetchQuote = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/market/quote/${symbol}`);
      setQuote(response.data);
    } catch (error) {
      console.error('Error fetching quote:', error);
    }
  };

  const fetchChartData = async () => {
    setLoading(true);
    try {
      const selectedTimeframe = timeframes.find(tf => tf.value === timeframe) || timeframes[4];
      const response = await axios.get(
        `http://localhost:8000/api/market/historical/${symbol}?period=${selectedTimeframe.period}&interval=${timeframe}`
      );

      const data = response.data.data.map(item => ({
        time: new Date(item.timestamp).getTime() / 1000,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
      }));

      if (candlestickSeriesRef.current) {
        candlestickSeriesRef.current.setData(data);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching chart data:', error);
      setLoading(false);
    }
  };

  return (
    <div className="chart-panel">
      <div className="chart-header">
        <div className="chart-info">
          {quote && (
            <>
              <span className="chart-symbol">{symbol}</span>
              <span className={`chart-price ${quote.change >= 0 ? 'price-up' : 'price-down'}`}>
                ${quote.price.toFixed(2)}
              </span>
              <span className={`chart-change ${quote.change >= 0 ? 'price-up' : 'price-down'}`}>
                {quote.change >= 0 ? '+' : ''}{quote.change.toFixed(2)} ({quote.change_percent.toFixed(2)}%)
              </span>
            </>
          )}
        </div>
        
        <div className="timeframe-selector">
          {timeframes.map(tf => (
            <button
              key={tf.value}
              className={`timeframe-btn ${timeframe === tf.value ? 'active' : ''}`}
              onClick={() => onTimeframeChange(tf.value)}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      <div className="chart-container" ref={chartContainerRef}>
        {loading && (
          <div className="chart-loading">
            <div className="spinner"></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChartPanel;
