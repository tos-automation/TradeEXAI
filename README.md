# ?? AI-Powered Trading Platform

A professional-grade trading platform with TradingView-like interface, powered by advanced AI pattern recognition for stocks, crypto, and forex trading. Perfect for day traders seeking intelligent, data-driven trading signals.

![Trading Platform](https://img.shields.io/badge/Platform-Trading-blue)
![AI Powered](https://img.shields.io/badge/AI-Powered-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ? Features

### ?? Professional Trading Interface
- **TradingView-inspired UI** with dark theme
- **Real-time candlestick charts** powered by Lightweight Charts
- **Multiple timeframes**: 1m, 5m, 15m, 1h, 1D
- **Interactive charting** with zoom and pan capabilities

### ?? AI Trading Engine
- **Advanced Pattern Recognition**: Detects 9+ candlestick patterns
  - Bullish/Bearish Engulfing
  - Hammer & Shooting Star
  - Doji, Morning/Evening Star
  - Three White Soldiers/Black Crows
- **Technical Indicators**:
  - RSI (Relative Strength Index)
  - MACD (Moving Average Convergence Divergence)
  - Bollinger Bands
  - EMAs (20, 50, 200)
  - Stochastic Oscillator
  - ADX (Trend Strength)
- **Intelligent Signal Generation**:
  - BUY/SELL/HOLD recommendations
  - Confidence scoring (0-100%)
  - Entry price, stop loss, and take profit targets
  - Risk/reward ratio calculations

### ?? Market Coverage
- **Stocks**: AAPL, GOOGL, MSFT, AMZN, TSLA, NVDA, META, and more
- **Cryptocurrencies**: BTC, ETH, BNB, SOL, ADA
- **Forex**: EUR/USD, GBP/USD, USD/JPY, AUD/USD, USD/CAD

### ?? Trading Features
- **Customizable Watchlist** with real-time price updates
- **Order Panel** with Market, Limit, and Stop orders
- **AI-Suggested Trade Parameters** displayed in order panel
- **Portfolio Management** (track positions and performance)
- **Support/Resistance Level Detection**

## ??? Architecture

```
??? frontend/                 # React Frontend
?   ??? src/
?   ?   ??? components/      # UI Components
?   ?   ?   ??? Header.js    # Search & Navigation
?   ?   ?   ??? Sidebar.js   # Navigation Menu
?   ?   ?   ??? ChartPanel.js # Trading Charts
?   ?   ?   ??? AIPanel.js   # AI Analysis Display
?   ?   ?   ??? Watchlist.js # Symbol Watchlist
?   ?   ?   ??? OrderPanel.js # Trade Execution
?   ?   ??? services/        # API Integration
?   ??? package.json
?
??? backend/                  # Python FastAPI Backend
    ??? app/
    ?   ??? main.py          # API Entry Point
    ?   ??? routers/         # API Routes
    ?   ?   ??? market_data.py   # Market Data Endpoints
    ?   ?   ??? ai_signals.py    # AI Analysis Endpoints
    ?   ?   ??? portfolio.py     # Portfolio Management
    ?   ??? services/        # Business Logic
    ?   ?   ??? market_service.py # Market Data Service
    ?   ??? ai_engine/       # AI/ML Components
    ?       ??? pattern_recognition.py # Pattern Recognition Engine
    ??? requirements.txt
```

## ?? Quick Start

### Prerequisites

- **Node.js** 16+ and npm
- **Python** 3.8+
- **pip** (Python package manager)

### Installation

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd workspace
```

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

#### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

### Running the Application

#### Terminal 1 - Start Backend Server

```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: **http://localhost:8000**
API Documentation: **http://localhost:8000/docs**

#### Terminal 2 - Start Frontend Server

```bash
cd frontend
npm start
```

Frontend will be available at: **http://localhost:3000**

## ?? API Endpoints

### Market Data

- `GET /api/market/quote/{symbol}` - Get real-time quote
- `GET /api/market/historical/{symbol}` - Get historical data
- `GET /api/market/intraday/{symbol}` - Get intraday data (5min intervals)
- `POST /api/market/watchlist` - Get quotes for multiple symbols
- `GET /api/market/search?q={query}` - Search for symbols
- `GET /api/market/overview` - Get market overview

### AI Signals

- `GET /api/ai/analyze/{symbol}` - Get AI analysis for symbol
- `GET /api/ai/intraday-signal/{symbol}` - Get intraday trading signal
- `POST /api/ai/batch-analyze` - Analyze multiple symbols
- `GET /api/ai/top-signals` - Get top trading signals

### Portfolio

- `POST /api/portfolio/position` - Add position
- `GET /api/portfolio/positions/{user_id}` - Get all positions
- `DELETE /api/portfolio/position/{user_id}/{symbol}` - Close position
- `POST /api/portfolio/watchlist/{user_id}` - Add to watchlist
- `GET /api/portfolio/watchlist/{user_id}` - Get watchlist

## ?? AI Pattern Recognition Engine

### How It Works

The AI engine analyzes market data through multiple layers:

1. **Technical Indicator Calculation**
   - Computes 10+ technical indicators
   - Analyzes price action and volume
   - Detects momentum and volatility

2. **Pattern Detection**
   - Scans for candlestick patterns
   - Identifies chart patterns
   - Detects trend reversals

3. **Support/Resistance Analysis**
   - Finds key price levels
   - Calculates distance from levels
   - Identifies breakout opportunities

4. **Signal Generation**
   - Combines all analysis factors
   - Calculates confidence score
   - Provides specific entry/exit prices
   - Sets risk management parameters

### Signal Interpretation

**STRONG_BUY (85-95% confidence)**
- Multiple bullish indicators aligned
- Strong uptrend with momentum
- High probability trade setup

**BUY (70-85% confidence)**
- Bullish indicators present
- Good risk/reward ratio
- Moderate probability setup

**HOLD (40-60% confidence)**
- Mixed signals
- Wait for better setup
- Monitor for changes

**SELL (70-85% confidence)**
- Bearish indicators present
- Downtrend momentum
- Consider exit or short

**STRONG_SELL (85-95% confidence)**
- Multiple bearish indicators
- Strong downtrend
- High probability reversal

## ?? User Interface

### Main Components

1. **Header**: Symbol search and navigation
2. **Sidebar**: Quick access to features
3. **Chart Panel**: Interactive price charts with timeframe selection
4. **AI Panel**: Real-time AI analysis and trading signals
5. **Order Panel**: Trade execution interface
6. **Watchlist**: Monitor favorite symbols

### Keyboard Shortcuts

- `Ctrl/Cmd + K` - Quick symbol search
- `Arrow Keys` - Navigate chart
- `+/-` - Zoom in/out
- `Space` - Reset chart zoom

## ?? Configuration

### Backend Configuration

Create `.env` file in backend directory:

```env
# API Configuration
API_HOST=0.0.0.0
API_PORT=8000

# CORS Settings
FRONTEND_URL=http://localhost:3000

# Market Data
DATA_REFRESH_INTERVAL=5
```

### Frontend Configuration

Update API endpoint in frontend if needed:

```javascript
// frontend/src/services/api.js
const API_BASE_URL = 'http://localhost:8000';
```

## ?? Data Sources

- **Market Data**: Yahoo Finance (via yfinance library)
- **Real-time Updates**: Auto-refresh every 5-10 seconds
- **Historical Data**: Up to 5 years of data available

## ??? Risk Disclaimer

**IMPORTANT**: This platform is for educational and informational purposes only.

- ?? **NOT FINANCIAL ADVICE**: Trading involves substantial risk of loss
- ?? **PAST PERFORMANCE**: Does not guarantee future results
- ?? **CAPITAL RISK**: Never trade with money you cannot afford to lose
- ?? **PAPER TRADING**: Test strategies before using real money
- ????? **PROFESSIONAL ADVICE**: Consult a licensed financial advisor

The AI signals are based on historical patterns and technical analysis. No system can predict market movements with 100% accuracy.

## ?? Advanced Features (Roadmap)

- [ ] Real-time WebSocket data streaming
- [ ] Advanced order types (OCO, trailing stops)
- [ ] Backtesting engine
- [ ] Multi-account support
- [ ] News sentiment analysis
- [ ] Social trading features
- [ ] Mobile app (React Native)
- [ ] Machine learning model improvements
- [ ] Options trading support
- [ ] Custom indicator builder

## ??? Development

### Running Tests

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

### Code Style

```bash
# Python (Black formatter)
black app/

# JavaScript (Prettier)
npm run format
```

## ?? Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## ?? License

This project is licensed under the MIT License - see the LICENSE file for details.

## ?? Acknowledgments

- **TradingView** - Inspiration for UI/UX design
- **Lightweight Charts** - High-performance charting library
- **Yahoo Finance** - Market data provider
- **FastAPI** - Modern Python web framework
- **React** - Frontend framework

## ?? Support

- ?? Email: support@example.com
- ?? Discord: [Join our community]
- ?? Docs: [Full documentation]
- ?? Issues: [GitHub Issues]

## ? Star History

If you find this project useful, please consider giving it a star! ?

---

**Built with ?? by traders, for traders**

*Happy Trading! ????*
