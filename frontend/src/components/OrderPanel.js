import React, { useState } from 'react';
import './OrderPanel.css';
import { TrendingUp, TrendingDown } from 'lucide-react';

function OrderPanel({ symbol, aiAnalysis }) {
  const [orderType, setOrderType] = useState('market');
  const [side, setSide] = useState('buy');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');

  const handlePlaceOrder = () => {
    alert(`Order placed: ${side.toUpperCase()} ${quantity} ${symbol} at ${orderType} price`);
    // In production, this would call your backend API to place the order
  };

  return (
    <div className="order-panel">
      <div className="order-header">
        <div className="order-tabs">
          <button
            className={`order-tab ${side === 'buy' ? 'active buy' : ''}`}
            onClick={() => setSide('buy')}
          >
            <TrendingUp size={16} />
            Buy
          </button>
          <button
            className={`order-tab ${side === 'sell' ? 'active sell' : ''}`}
            onClick={() => setSide('sell')}
          >
            <TrendingDown size={16} />
            Sell
          </button>
        </div>
      </div>

      <div className="order-content">
        <div className="order-type-selector">
          <button
            className={`type-btn ${orderType === 'market' ? 'active' : ''}`}
            onClick={() => setOrderType('market')}
          >
            Market
          </button>
          <button
            className={`type-btn ${orderType === 'limit' ? 'active' : ''}`}
            onClick={() => setOrderType('limit')}
          >
            Limit
          </button>
          <button
            className={`type-btn ${orderType === 'stop' ? 'active' : ''}`}
            onClick={() => setOrderType('stop')}
          >
            Stop
          </button>
        </div>

        <div className="order-form">
          <div className="form-group">
            <label>Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0.00"
              className="form-input"
            />
          </div>

          {orderType !== 'market' && (
            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="form-input"
              />
            </div>
          )}

          {aiAnalysis?.signal && (
            <div className="ai-suggestion">
              <div className="suggestion-title">AI Suggestion</div>
              <div className="suggestion-details">
                <div className="detail-row">
                  <span>Entry:</span>
                  <span>${aiAnalysis.signal.entry_price?.toFixed(2) || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <span>Stop Loss:</span>
                  <span className="stop-loss">
                    ${aiAnalysis.signal.stop_loss?.toFixed(2) || 'N/A'}
                  </span>
                </div>
                <div className="detail-row">
                  <span>Take Profit:</span>
                  <span className="take-profit">
                    ${aiAnalysis.signal.take_profit?.toFixed(2) || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          )}

          <button
            className={`btn btn-order ${side === 'buy' ? 'btn-buy' : 'btn-sell'}`}
            onClick={handlePlaceOrder}
            disabled={!quantity}
          >
            {side === 'buy' ? 'Place Buy Order' : 'Place Sell Order'}
          </button>
        </div>

        <div className="quick-amounts">
          <button onClick={() => setQuantity('1')}>1</button>
          <button onClick={() => setQuantity('5')}>5</button>
          <button onClick={() => setQuantity('10')}>10</button>
          <button onClick={() => setQuantity('25')}>25</button>
        </div>
      </div>
    </div>
  );
}

export default OrderPanel;
