from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import market_data, ai_signals, portfolio

app = FastAPI(title="AI Trading Platform API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(market_data.router, prefix="/api/market", tags=["Market Data"])
app.include_router(ai_signals.router, prefix="/api/ai", tags=["AI Signals"])
app.include_router(portfolio.router, prefix="/api/portfolio", tags=["Portfolio"])

@app.get("/")
async def root():
    return {
        "message": "AI Trading Platform API",
        "version": "1.0.0",
        "status": "active"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
