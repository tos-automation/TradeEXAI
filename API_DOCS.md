# ?? API Documentation

Complete REST API reference for the AI Trading Platform.

## Base URL

```
http://localhost:8000
```

## Interactive Documentation

Visit `http://localhost:8000/docs` for interactive Swagger UI documentation.

---

## ?? Market Data Endpoints

### Get Quote

Get real-time quote for a symbol.

```http
GET /api/market/quote/{symbol}
```

**Parameters:**
- `symbol` (path): Symbol to query (e.g., AAPL, BTC-USD)

**Response:**
```json
{
  "symbol": "AAPL",
  "price": 178.45,
  "change": 2.34,
  "change_percent": 1.32,
  "volume": 52847362,
  "market_cap": 2800000000000,
  "high": 179.23,
  "low": 176.89,
  "open": 177.12,
  "previous_close": 176.11,
  "timestamp": "2025-11-01T14:30:00"
}
```

### Get Historical Data

Get historical price data.

```http
GET /api/market/historical/{symbol}?period={period}&interval={interval}
```

**Parameters:**
- `symbol` (path): Symbol to query
- `period` (query): Time period (1d, 5d, 1mo, 3mo, 6mo, 1y, 5y)
- `interval` (query): Data interval (1m, 5m, 15m, 30m, 1h, 1d)

**Response:**
```json
{
  "symbol": "AAPL",
  "period": "1mo",
  "interval": "1d",
  "data": [
    {
      "timestamp": "2025-10-01T00:00:00",
      "open": 175.23,
      "high": 178.45,
      "low": 174.12,
      "close": 177.89,
      "volume": 52847362
    }
  ]
}
```

### Get Intraday Data

Get 5-minute interval data for day trading.

```http
GET /api/market/intraday/{symbol}?days={days}
```

**Parameters:**
- `symbol` (path): Symbol to query
- `days` (query): Number of days (default: 5)

**Response:**
```json
{
  "symbol": "AAPL",
  "days": 5,
  "data": [
    {
      "timestamp": "2025-11-01T09:30:00",
      "open": 177.45,
      "high": 177.89,
      "low": 177.23,
      "close": 177.67,
      "volume": 847362
    }
  ]
}
```

### Get Watchlist Quotes

Get quotes for multiple symbols.

```http
POST /api/market/watchlist
```

**Request Body:**
```json
["AAPL", "GOOGL", "MSFT", "BTC-USD"]
```

**Response:**
```json
{
  "quotes": [
    {
      "symbol": "AAPL",
      "price": 178.45,
      "change": 2.34,
      "change_percent": 1.32
    }
  ]
}
```

### Search Symbols

Search for symbols by name or ticker.

```http
GET /api/market/search?q={query}
```

**Parameters:**
- `q` (query): Search query

**Response:**
```json
{
  "results": [
    {
      "symbol": "AAPL",
      "market": "stocks",
      "price": 178.45,
      "change_percent": 1.32
    }
  ]
}
```

### Market Overview

Get overview of major market indices.

```http
GET /api/market/overview
```

**Response:**
```json
{
  "S&P 500": {
    "price": 4567.89,
    "change_percent": 0.45
  },
  "Bitcoin": {
    "price": 67823.45,
    "change_percent": 2.34
  }
}
```

---

## ?? AI Signals Endpoints

### Analyze Symbol

Get comprehensive AI analysis for a symbol.

```http
GET /api/ai/analyze/{symbol}
```

**Parameters:**
- `symbol` (path): Symbol to analyze

**Response:**
```json
{
  "symbol": "AAPL",
  "timestamp": "2025-11-01T14:30:00",
  "signal": {
    "action": "STRONG_BUY",
    "confidence": 87.5,
    "score": 5.5,
    "reasons": [
      "RSI oversold - potential bounce",
      "MACD bullish crossover",
      "Price in uptrend",
      "Bullish pattern: hammer"
    ],
    "entry_price": 177.89,
    "stop_loss": 172.55,
    "take_profit": 186.78,
    "risk_reward_ratio": 1.67
  },
  "trend": "uptrend",
  "momentum": "bullish",
  "patterns": ["hammer", "bullish_engulfing"],
  "support_resistance": {
    "resistance": 185.23,
    "support": 172.45,
    "distance_to_resistance": 4.12,
    "distance_to_support": 3.06
  },
  "indicators": {
    "rsi": 28.45,
    "macd": 1.23,
    "macd_signal": 0.89,
    "bb_upper": 182.34,
    "bb_lower": 173.45,
    "ema_20": 176.23,
    "ema_50": 174.89
  },
  "current_price": 177.89
}
```

### Get Intraday Signal

Get intraday trading signal (5-min data).

```http
GET /api/ai/intraday-signal/{symbol}
```

**Parameters:**
- `symbol` (path): Symbol to analyze

**Response:** Same format as analyze endpoint

### Batch Analyze

Analyze multiple symbols at once.

```http
POST /api/ai/batch-analyze
```

**Request Body:**
```json
["AAPL", "GOOGL", "MSFT"]
```

**Response:**
```json
{
  "analyses": [
    {
      "symbol": "AAPL",
      "signal": { /* ... */ }
    }
  ]
}
```

### Top Signals

Get top trading signals across all markets.

```http
GET /api/ai/top-signals
```

**Response:**
```json
{
  "signals": [
    {
      "symbol": "AAPL",
      "action": "STRONG_BUY",
      "confidence": 92.5,
      "price": 177.89
    }
  ]
}
```

---

## ?? Portfolio Endpoints

### Add Position

Add a new position to portfolio.

```http
POST /api/portfolio/position?user_id={user_id}
```

**Request Body:**
```json
{
  "symbol": "AAPL",
  "quantity": 10,
  "entry_price": 177.89,
  "entry_date": "2025-11-01",
  "position_type": "long"
}
```

**Response:**
```json
{
  "message": "Position added successfully",
  "position": { /* ... */ }
}
```

### Get Positions

Get all positions for a user.

```http
GET /api/portfolio/positions/{user_id}
```

**Response:**
```json
{
  "positions": [
    {
      "symbol": "AAPL",
      "quantity": 10,
      "entry_price": 177.89,
      "entry_date": "2025-11-01",
      "position_type": "long"
    }
  ]
}
```

### Close Position

Close a position.

```http
DELETE /api/portfolio/position/{user_id}/{symbol}
```

**Response:**
```json
{
  "message": "Position closed successfully"
}
```

### Add to Watchlist

Add symbol to watchlist.

```http
POST /api/portfolio/watchlist/{user_id}
```

**Request Body:**
```json
{
  "symbol": "AAPL",
  "note": "Watching for breakout"
}
```

### Get Watchlist

Get user's watchlist.

```http
GET /api/portfolio/watchlist/{user_id}
```

**Response:**
```json
{
  "watchlist": [
    {
      "symbol": "AAPL",
      "note": "Watching for breakout"
    }
  ]
}
```

### Remove from Watchlist

```http
DELETE /api/portfolio/watchlist/{user_id}/{symbol}
```

### Get Portfolio Performance

```http
GET /api/portfolio/performance/{user_id}
```

**Response:**
```json
{
  "total_positions": 5,
  "total_value": 50000.00,
  "positions": [ /* ... */ ]
}
```

---

## ?? Response Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request |
| 404 | Not Found |
| 500 | Internal Server Error |

## Rate Limiting

Currently no rate limiting is implemented. In production:
- 100 requests per minute per IP
- 1000 requests per hour per user

## Error Response Format

```json
{
  "detail": "Error message here"
}
```

## Examples

### cURL Examples

```bash
# Get quote
curl http://localhost:8000/api/market/quote/AAPL

# Get AI analysis
curl http://localhost:8000/api/ai/analyze/AAPL

# Get historical data
curl "http://localhost:8000/api/market/historical/AAPL?period=1mo&interval=1d"
```

### Python Examples

```python
import requests

# Get quote
response = requests.get('http://localhost:8000/api/market/quote/AAPL')
quote = response.json()

# Get AI analysis
response = requests.get('http://localhost:8000/api/ai/analyze/AAPL')
analysis = response.json()

# Batch analyze
symbols = ['AAPL', 'GOOGL', 'MSFT']
response = requests.post('http://localhost:8000/api/ai/batch-analyze', json=symbols)
results = response.json()
```

### JavaScript Examples

```javascript
// Get quote
fetch('http://localhost:8000/api/market/quote/AAPL')
  .then(res => res.json())
  .then(quote => console.log(quote));

// Get AI analysis
fetch('http://localhost:8000/api/ai/analyze/AAPL')
  .then(res => res.json())
  .then(analysis => console.log(analysis));

// Watchlist
fetch('http://localhost:8000/api/market/watchlist', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(['AAPL', 'GOOGL'])
})
  .then(res => res.json())
  .then(quotes => console.log(quotes));
```

---

*For interactive documentation, visit: http://localhost:8000/docs*
