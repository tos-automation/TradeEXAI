from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

router = APIRouter()

# In-memory storage (in production, use a database)
portfolios = {}
watchlists = {}

class Position(BaseModel):
    symbol: str
    quantity: float
    entry_price: float
    entry_date: str
    position_type: str  # "long" or "short"

class WatchlistItem(BaseModel):
    symbol: str
    note: Optional[str] = None

@router.post("/position")
async def add_position(user_id: str, position: Position):
    """Add a new position to portfolio"""
    if user_id not in portfolios:
        portfolios[user_id] = []
    
    portfolios[user_id].append(position.dict())
    return {"message": "Position added successfully", "position": position}

@router.get("/positions/{user_id}")
async def get_positions(user_id: str):
    """Get all positions for a user"""
    return {"positions": portfolios.get(user_id, [])}

@router.delete("/position/{user_id}/{symbol}")
async def close_position(user_id: str, symbol: str):
    """Close a position"""
    if user_id in portfolios:
        portfolios[user_id] = [p for p in portfolios[user_id] if p["symbol"] != symbol]
        return {"message": "Position closed successfully"}
    
    raise HTTPException(status_code=404, detail="Portfolio not found")

@router.post("/watchlist/{user_id}")
async def add_to_watchlist(user_id: str, item: WatchlistItem):
    """Add symbol to watchlist"""
    if user_id not in watchlists:
        watchlists[user_id] = []
    
    # Check if already in watchlist
    if not any(w["symbol"] == item.symbol for w in watchlists[user_id]):
        watchlists[user_id].append(item.dict())
    
    return {"message": "Added to watchlist", "item": item}

@router.get("/watchlist/{user_id}")
async def get_watchlist(user_id: str):
    """Get user's watchlist"""
    return {"watchlist": watchlists.get(user_id, [])}

@router.delete("/watchlist/{user_id}/{symbol}")
async def remove_from_watchlist(user_id: str, symbol: str):
    """Remove symbol from watchlist"""
    if user_id in watchlists:
        watchlists[user_id] = [w for w in watchlists[user_id] if w["symbol"] != symbol]
        return {"message": "Removed from watchlist"}
    
    raise HTTPException(status_code=404, detail="Watchlist not found")

@router.get("/performance/{user_id}")
async def get_portfolio_performance(user_id: str):
    """Calculate portfolio performance"""
    positions = portfolios.get(user_id, [])
    
    total_value = sum(p["quantity"] * p["entry_price"] for p in positions)
    
    return {
        "total_positions": len(positions),
        "total_value": total_value,
        "positions": positions
    }
