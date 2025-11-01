# ?? Quick Start Guide

Get your AI Trading Platform running in 5 minutes!

## Method 1: Automated Startup (Recommended)

### On Linux/Mac:
```bash
./start.sh
```

### On Windows:
```bash
start.bat
```

That's it! The script will:
- ? Create virtual environments
- ? Install all dependencies
- ? Start both backend and frontend servers
- ? Open your browser automatically

## Method 2: Manual Startup

### Step 1: Start Backend (Terminal 1)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Step 2: Start Frontend (Terminal 2)

```bash
cd frontend
npm install
npm start
```

## Access Your Platform

- **Trading Platform**: http://localhost:3000
- **API Documentation**: http://localhost:8000/docs
- **Backend API**: http://localhost:8000

## First Steps

1. **Search for a symbol** - Use the search bar at the top
2. **View AI analysis** - Automatically loads for selected symbol
3. **Check trading signals** - See BUY/SELL recommendations
4. **Add to watchlist** - Monitor multiple symbols
5. **Place orders** - Use the order panel on the right

## Popular Symbols to Try

### Stocks
- AAPL (Apple)
- TSLA (Tesla)
- GOOGL (Google)
- MSFT (Microsoft)

### Crypto
- BTC-USD (Bitcoin)
- ETH-USD (Ethereum)

### Forex
- EURUSD=X (Euro/Dollar)
- GBPUSD=X (Pound/Dollar)

## Troubleshooting

### Backend won't start?
```bash
# Make sure Python 3.8+ is installed
python --version

# Reinstall dependencies
pip install -r requirements.txt --upgrade
```

### Frontend won't start?
```bash
# Make sure Node.js 16+ is installed
node --version

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Charts not loading?
- Check if backend is running on port 8000
- Check browser console for errors
- Try refreshing the page

## Need Help?

- ?? Read the full [README.md](README.md)
- ?? Check [Issues](https://github.com/your-repo/issues)
- ?? Join our community

---

Happy Trading! ??
