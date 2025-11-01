import React, { useEffect, useState } from 'react';
import './AIPanel.css';
import { Bot, TrendingUp, TrendingDown, AlertCircle, Target } from 'lucide-react';
import axios from 'axios';

function AIPanel({ symbol, onAnalysisUpdate }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAnalysis();
  }, [symbol]);

  const fetchAnalysis = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8000/api/ai/analyze/${symbol}`);
      setAnalysis(response.data);
      onAnalysisUpdate(response.data);
    } catch (error) {
      console.error('Error fetching AI analysis:', error);
    }
    setLoading(false);
  };

  const getActionIcon = (action) => {
    if (action?.includes('BUY')) return <TrendingUp size={20} />;
    if (action?.includes('SELL')) return <TrendingDown size={20} />;
    return <AlertCircle size={20} />;
  };

  const getActionClass = (action) => {
    if (action?.includes('BUY')) return 'action-buy';
    if (action?.includes('SELL')) return 'action-sell';
    return 'action-hold';
  };

  if (loading) {
    return (
      <div className="ai-panel">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  const signal = analysis.signal;

  return (
    <div className="ai-panel">
      <div className="ai-header">
        <div className="ai-title">
          <Bot size={20} />
          <span>AI Trading Signal</span>
        </div>
        <button className="btn btn-secondary" onClick={fetchAnalysis}>
          Refresh
        </button>
      </div>

      <div className="ai-content">
        {/* Main Signal */}
        <div className={`ai-signal ${getActionClass(signal.action)}`}>
          <div className="signal-action">
            {getActionIcon(signal.action)}
            <span>{signal.action.replace('_', ' ')}</span>
          </div>
          <div className="signal-confidence">
            <div className="confidence-label">Confidence</div>
            <div className="confidence-value">{signal.confidence}%</div>
            <div className="confidence-bar">
              <div 
                className="confidence-fill" 
                style={{ width: `${signal.confidence}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Price Targets */}
        {signal.entry_price && (
          <div className="price-targets">
            <div className="target-item">
              <span className="target-label">Entry Price</span>
              <span className="target-value">${signal.entry_price.toFixed(2)}</span>
            </div>
            <div className="target-item">
              <span className="target-label">Stop Loss</span>
              <span className="target-value stop-loss">${signal.stop_loss.toFixed(2)}</span>
            </div>
            <div className="target-item">
              <span className="target-label">Take Profit</span>
              <span className="target-value take-profit">${signal.take_profit.toFixed(2)}</span>
            </div>
            <div className="target-item">
              <span className="target-label">R/R Ratio</span>
              <span className="target-value">1:{signal.risk_reward_ratio.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Analysis Details */}
        <div className="analysis-section">
          <div className="section-title">Market Analysis</div>
          <div className="analysis-grid">
            <div className="analysis-item">
              <span className="item-label">Trend</span>
              <span className="item-value">{analysis.trend.replace('_', ' ')}</span>
            </div>
            <div className="analysis-item">
              <span className="item-label">Momentum</span>
              <span className="item-value">{analysis.momentum.replace('_', ' ')}</span>
            </div>
            <div className="analysis-item">
              <span className="item-label">RSI</span>
              <span className="item-value">{analysis.indicators.rsi.toFixed(2)}</span>
            </div>
            <div className="analysis-item">
              <span className="item-label">MACD</span>
              <span className="item-value">{analysis.indicators.macd.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Patterns */}
        {analysis.patterns.length > 0 && (
          <div className="analysis-section">
            <div className="section-title">Detected Patterns</div>
            <div className="patterns-list">
              {analysis.patterns.map((pattern, index) => (
                <span key={index} className="pattern-badge">
                  {pattern.replace('_', ' ')}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Reasons */}
        <div className="analysis-section">
          <div className="section-title">Analysis Reasons</div>
          <ul className="reasons-list">
            {signal.reasons.map((reason, index) => (
              <li key={index}>{reason}</li>
            ))}
          </ul>
        </div>

        {/* Support/Resistance */}
        <div className="analysis-section">
          <div className="section-title">Support & Resistance</div>
          <div className="sr-levels">
            <div className="sr-item">
              <span className="sr-label">Resistance</span>
              <span className="sr-value">${analysis.support_resistance.resistance.toFixed(2)}</span>
            </div>
            <div className="sr-item">
              <span className="sr-label">Support</span>
              <span className="sr-value">${analysis.support_resistance.support.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIPanel;
