import React, { useEffect, useState } from 'react';
import './Watchlist.css';
import { Eye, Plus, X, Star } from 'lucide-react';
import axios from 'axios';

function Watchlist({ watchlist, onWatchlistUpdate, onSymbolSelect }) {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWatchlistQuotes();
    const interval = setInterval(fetchWatchlistQuotes, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, [watchlist]);

  const fetchWatchlistQuotes = async () => {
    if (watchlist.length === 0) return;
    
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/market/watchlist', watchlist);
      setQuotes(response.data.quotes);
    } catch (error) {
      console.error('Error fetching watchlist:', error);
    }
    setLoading(false);
  };

  const removeFromWatchlist = (symbol) => {
    const newWatchlist = watchlist.filter(s => s !== symbol);
    onWatchlistUpdate(newWatchlist);
  };

  return (
    <div className="watchlist">
      <div className="watchlist-header">
        <div className="watchlist-title">
          <Star size={18} />
          <span>Watchlist</span>
        </div>
        <button className="btn-icon" title="Add Symbol">
          <Plus size={18} />
        </button>
      </div>

      <div className="watchlist-content">
        {loading && quotes.length === 0 ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : (
          <div className="watchlist-items">
            {quotes.map((quote, index) => (
              <div
                key={quote.symbol}
                className="watchlist-item"
                onClick={() => onSymbolSelect(quote.symbol)}
              >
                <div className="item-header">
                  <span className="item-symbol">{quote.symbol}</span>
                  <button
                    className="btn-remove"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromWatchlist(quote.symbol);
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
                
                {!quote.error ? (
                  <>
                    <div className="item-price">${quote.price?.toFixed(2) || '0.00'}</div>
                    <div className={`item-change ${quote.change >= 0 ? 'price-up' : 'price-down'}`}>
                      {quote.change >= 0 ? '+' : ''}{quote.change?.toFixed(2) || '0.00'}
                      <span className="change-percent">
                        ({quote.change_percent?.toFixed(2) || '0.00'}%)
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="item-error">Unable to load</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Watchlist;
