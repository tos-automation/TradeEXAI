import React, { useState } from 'react';
import './Header.css';
import { Search, TrendingUp } from 'lucide-react';

function Header({ selectedSymbol, onSymbolChange }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const popularSymbols = [
    { symbol: 'AAPL', name: 'Apple' },
    { symbol: 'GOOGL', name: 'Google' },
    { symbol: 'MSFT', name: 'Microsoft' },
    { symbol: 'TSLA', name: 'Tesla' },
    { symbol: 'BTC-USD', name: 'Bitcoin' },
    { symbol: 'ETH-USD', name: 'Ethereum' },
  ];

  const handleSymbolSelect = (symbol) => {
    onSymbolChange(symbol);
    setShowSearch(false);
    setSearchQuery('');
  };

  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">
          <TrendingUp size={24} />
          <span>AI Trading Platform</span>
        </div>
        
        <div className="search-container">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search symbols..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearch(e.target.value.length > 0);
              }}
              onFocus={() => setShowSearch(true)}
            />
          </div>
          
          {showSearch && (
            <div className="search-results">
              {popularSymbols
                .filter(item => 
                  item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  item.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map(item => (
                  <div
                    key={item.symbol}
                    className="search-result-item"
                    onClick={() => handleSymbolSelect(item.symbol)}
                  >
                    <span className="symbol">{item.symbol}</span>
                    <span className="name">{item.name}</span>
                  </div>
                ))
              }
            </div>
          )}
        </div>
      </div>
      
      <div className="header-right">
        <div className="current-symbol">
          <span className="label">Trading:</span>
          <span className="symbol">{selectedSymbol}</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
