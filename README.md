# TradeEXAI

AI-powered stock and forex trading platform with TradingView-like interface.

## Features

- **TradingView-like Interface**: Professional charting interface with candlestick charts
- **Day Trading Focus**: Optimized for day trading with real-time data updates
- **AI Pattern Recognition**: Advanced AI agent that analyzes patterns and suggests trades
- **Multi-Market Support**: Trade stocks, crypto, and forex all in one platform
- **Real-time Updates**: Live price updates and market data simulation
- **Order Management**: Place market and limit orders, track positions
- **Watchlist**: Monitor multiple symbols across different markets

## AI Trading Agent

The AI agent is a master of trading patterns and recognizes:

- **Double Bottom/Top**: Reversal patterns
- **Head and Shoulders**: Classic reversal patterns
- **Engulfing Patterns**: Strong momentum signals
- **Support/Resistance**: Key level analysis
- **RSI Indicators**: Overbought/oversold conditions
- **Moving Average Crossovers**: Trend identification
- **Volume Analysis**: Momentum detection

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
??? app/                  # Next.js app directory
?   ??? layout.tsx       # Root layout
?   ??? page.tsx         # Main trading interface
?   ??? globals.css      # Global styles
??? components/          # React components
?   ??? TradingChart.tsx # Main candlestick chart
?   ??? OrderPanel.tsx   # Order placement panel
?   ??? Watchlist.tsx    # Symbol watchlist
?   ??? AIPanel.tsx      # AI agent interface
?   ??? MarketSelector.tsx # Market type selector
?   ??? Header.tsx       # Top header bar
??? services/            # Business logic
?   ??? aiAgent.ts      # AI pattern recognition
?   ??? dataService.ts  # Data simulation
??? store/              # State management
?   ??? tradingStore.ts # Zustand store
??? types/              # TypeScript types
    ??? index.ts        # Type definitions
```

## Technologies

- **Next.js 14**: React framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Lightweight Charts**: Professional charting library
- **Zustand**: State management

## Trading Features

- **Market Orders**: Instant execution at current price
- **Limit Orders**: Set your desired entry price
- **Position Tracking**: Monitor open positions and P&L
- **Real-time P&L**: See unrealized gains/losses in real-time
- **Risk Management**: Built-in stop loss and take profit levels

## AI Agent Features

The AI agent continuously analyzes market data and provides:

- Pattern recognition across multiple timeframes
- Trade signals with confidence levels
- Entry, target, and stop loss recommendations
- Market analysis and technical insights
- Real-time signal generation

## Note

This is a demo application with simulated market data. For production use, integrate with real market data providers and broker APIs.

## License

ISC