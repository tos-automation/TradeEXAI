import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChartPanel from './components/ChartPanel';
import AIPanel from './components/AIPanel';
import Watchlist from './components/Watchlist';
import OrderPanel from './components/OrderPanel';

function App() {
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [timeframe, setTimeframe] = useState('1d');
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [watchlist, setWatchlist] = useState([
    'AAPL', 'GOOGL', 'MSFT', 'TSLA', 'NVDA', 'BTC-USD', 'ETH-USD'
  ]);

  return (
    <div className="App">
      <Header 
        selectedSymbol={selectedSymbol}
        onSymbolChange={setSelectedSymbol}
      />
      
      <div className="main-container">
        <Sidebar 
          watchlist={watchlist}
          onSymbolSelect={setSelectedSymbol}
          selectedSymbol={selectedSymbol}
        />
        
        <div className="content-area">
          <div className="trading-view">
            <ChartPanel 
              symbol={selectedSymbol}
              timeframe={timeframe}
              onTimeframeChange={setTimeframe}
            />
            
            <OrderPanel 
              symbol={selectedSymbol}
              aiAnalysis={aiAnalysis}
            />
          </div>
          
          <AIPanel 
            symbol={selectedSymbol}
            onAnalysisUpdate={setAiAnalysis}
          />
        </div>
        
        <Watchlist 
          watchlist={watchlist}
          onWatchlistUpdate={setWatchlist}
          onSymbolSelect={setSelectedSymbol}
        />
      </div>
    </div>
  );
}

export default App;
