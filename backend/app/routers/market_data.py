from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.services.market_service import MarketDataService

router = APIRouter()
market_service = MarketDataService()

@router.get("/quote/{symbol}")
async def get_quote(symbol: str):
    """Get real-time quote for a symbol"""
    quote = market_service.get_quote(symbol)
    if "error" in quote:
        raise HTTPException(status_code=404, detail=quote["error"])
    return quote

@router.get("/historical/{symbol}")
async def get_historical_data(
    symbol: str,
    period: str = Query("1mo", description="Period: 1d, 5d, 1mo, 3mo, 6mo, 1y, 5y"),
    interval: str = Query("1d", description="Interval: 1m, 5m, 15m, 30m, 1h, 1d")
):
    """Get historical data for a symbol"""
    df = market_service.get_historical_data(symbol, period, interval)
    
    if df.empty:
        raise HTTPException(status_code=404, detail="No data found")
    
    # Convert to JSON-serializable format
    data = df.to_dict(orient="records")
    
    # Convert timestamps to strings
    for record in data:
        if "timestamp" in record:
            record["timestamp"] = str(record["timestamp"])
    
    return {
        "symbol": symbol,
        "period": period,
        "interval": interval,
        "data": data
    }

@router.get("/intraday/{symbol}")
async def get_intraday_data(symbol: str, days: int = 5):
    """Get intraday data for day trading (5-minute intervals)"""
    df = market_service.get_intraday_data(symbol, days)
    
    if df.empty:
        raise HTTPException(status_code=404, detail="No data found")
    
    data = df.to_dict(orient="records")
    
    for record in data:
        if "timestamp" in record:
            record["timestamp"] = str(record["timestamp"])
    
    return {
        "symbol": symbol,
        "days": days,
        "data": data
    }

@router.post("/watchlist")
async def get_watchlist_quotes(symbols: List[str]):
    """Get quotes for multiple symbols"""
    quotes = market_service.get_watchlist_quotes(symbols)
    return {"quotes": quotes}

@router.get("/search")
async def search_symbols(q: str = Query(..., min_length=1)):
    """Search for symbols"""
    results = market_service.search_symbols(q)
    return {"results": results}

@router.get("/overview")
async def market_overview():
    """Get market overview with major indices"""
    overview = market_service.get_market_overview()
    return overview
