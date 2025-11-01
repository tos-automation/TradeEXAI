from fastapi import APIRouter, HTTPException
from app.ai_engine.pattern_recognition import PatternRecognitionEngine
from app.services.market_service import MarketDataService

router = APIRouter()
ai_engine = PatternRecognitionEngine()
market_service = MarketDataService()

@router.get("/analyze/{symbol}")
async def analyze_symbol(symbol: str):
    """Get AI analysis and trading signals for a symbol"""
    try:
        # Fetch historical data
        df = market_service.get_historical_data(symbol, period="6mo", interval="1d")
        
        if df.empty:
            raise HTTPException(status_code=404, detail="No data available for analysis")
        
        # Run AI analysis
        analysis = ai_engine.analyze(df, symbol)
        
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/intraday-signal/{symbol}")
async def get_intraday_signal(symbol: str):
    """Get intraday trading signal for day trading"""
    try:
        # Fetch intraday data
        df = market_service.get_intraday_data(symbol, days=5)
        
        if df.empty:
            raise HTTPException(status_code=404, detail="No intraday data available")
        
        # Run AI analysis on intraday data
        analysis = ai_engine.analyze(df, symbol)
        
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/batch-analyze")
async def batch_analyze(symbols: list[str]):
    """Analyze multiple symbols at once"""
    results = []
    
    for symbol in symbols:
        try:
            df = market_service.get_historical_data(symbol, period="3mo", interval="1d")
            if not df.empty:
                analysis = ai_engine.analyze(df, symbol)
                results.append(analysis)
        except Exception as e:
            results.append({
                "symbol": symbol,
                "error": str(e)
            })
    
    return {"analyses": results}

@router.get("/top-signals")
async def get_top_signals():
    """Get top trading signals across all markets"""
    all_symbols = []
    
    # Combine all supported symbols
    all_symbols.extend(market_service.supported_markets["stocks"])
    all_symbols.extend(market_service.supported_markets["crypto"])
    
    signals = []
    
    for symbol in all_symbols[:15]:  # Limit to 15 symbols for performance
        try:
            df = market_service.get_historical_data(symbol, period="3mo", interval="1d")
            if not df.empty:
                analysis = ai_engine.analyze(df, symbol)
                if analysis.get("signal", {}).get("action") in ["STRONG_BUY", "STRONG_SELL"]:
                    signals.append({
                        "symbol": symbol,
                        "action": analysis["signal"]["action"],
                        "confidence": analysis["signal"]["confidence"],
                        "price": analysis["current_price"]
                    })
        except:
            continue
    
    # Sort by confidence
    signals.sort(key=lambda x: x["confidence"], reverse=True)
    
    return {"signals": signals[:10]}
