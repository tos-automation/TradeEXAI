import yfinance as yf
import pandas as pd
from typing import Dict, List
from datetime import datetime, timedelta

class MarketDataService:
    """Service for fetching real-time and historical market data"""
    
    def __init__(self):
        self.supported_markets = {
            "stocks": ["AAPL", "GOOGL", "MSFT", "AMZN", "TSLA", "NVDA", "META"],
            "forex": ["EURUSD=X", "GBPUSD=X", "USDJPY=X", "AUDUSD=X", "USDCAD=X"],
            "crypto": ["BTC-USD", "ETH-USD", "BNB-USD", "SOL-USD", "ADA-USD"]
        }
    
    def get_quote(self, symbol: str) -> Dict:
        """Get real-time quote for a symbol"""
        try:
            ticker = yf.Ticker(symbol)
            info = ticker.info
            
            # Get latest price data
            hist = ticker.history(period="1d", interval="1m")
            if hist.empty:
                hist = ticker.history(period="5d")
            
            current_price = hist["Close"].iloc[-1] if not hist.empty else info.get("currentPrice", 0)
            prev_close = info.get("previousClose", current_price)
            
            change = current_price - prev_close
            change_percent = (change / prev_close * 100) if prev_close else 0
            
            return {
                "symbol": symbol,
                "price": float(current_price),
                "change": float(change),
                "change_percent": float(change_percent),
                "volume": int(info.get("volume", 0)),
                "market_cap": info.get("marketCap"),
                "high": float(hist["High"].max() if not hist.empty else 0),
                "low": float(hist["Low"].min() if not hist.empty else 0),
                "open": float(hist["Open"].iloc[0] if not hist.empty else 0),
                "previous_close": float(prev_close),
                "timestamp": datetime.now().isoformat()
            }
        except Exception as e:
            return {"error": str(e), "symbol": symbol}
    
    def get_historical_data(self, symbol: str, period: str = "1mo", 
                           interval: str = "1d") -> pd.DataFrame:
        """Get historical data for a symbol"""
        try:
            ticker = yf.Ticker(symbol)
            df = ticker.history(period=period, interval=interval)
            
            # Clean and format data
            df = df.reset_index()
            df.columns = [col.lower() for col in df.columns]
            
            # Rename datetime column
            if 'datetime' in df.columns:
                df = df.rename(columns={'datetime': 'timestamp'})
            elif 'date' in df.columns:
                df = df.rename(columns={'date': 'timestamp'})
            
            return df
        except Exception as e:
            return pd.DataFrame()
    
    def get_intraday_data(self, symbol: str, days: int = 5) -> pd.DataFrame:
        """Get intraday data for day trading"""
        try:
            ticker = yf.Ticker(symbol)
            df = ticker.history(period=f"{days}d", interval="5m")
            
            df = df.reset_index()
            df.columns = [col.lower() for col in df.columns]
            
            if 'datetime' in df.columns:
                df = df.rename(columns={'datetime': 'timestamp'})
            
            return df
        except Exception as e:
            return pd.DataFrame()
    
    def get_watchlist_quotes(self, symbols: List[str]) -> List[Dict]:
        """Get quotes for multiple symbols"""
        quotes = []
        for symbol in symbols:
            quote = self.get_quote(symbol)
            quotes.append(quote)
        return quotes
    
    def search_symbols(self, query: str) -> List[Dict]:
        """Search for symbols by name or ticker"""
        results = []
        
        # Search in our predefined lists
        for market_type, symbols in self.supported_markets.items():
            for symbol in symbols:
                if query.upper() in symbol.upper():
                    quote = self.get_quote(symbol)
                    if "error" not in quote:
                        results.append({
                            "symbol": symbol,
                            "market": market_type,
                            "price": quote.get("price"),
                            "change_percent": quote.get("change_percent")
                        })
        
        return results[:10]  # Return top 10 results
    
    def get_market_overview(self) -> Dict:
        """Get overview of major market indices"""
        indices = {
            "S&P 500": "^GSPC",
            "Dow Jones": "^DJI",
            "NASDAQ": "^IXIC",
            "Bitcoin": "BTC-USD",
            "Ethereum": "ETH-USD",
        }
        
        overview = {}
        for name, symbol in indices.items():
            quote = self.get_quote(symbol)
            if "error" not in quote:
                overview[name] = {
                    "price": quote["price"],
                    "change_percent": quote["change_percent"]
                }
        
        return overview
