import numpy as np
import pandas as pd
from typing import Dict, List, Tuple
from datetime import datetime
import ta

class PatternRecognitionEngine:
    """
    Advanced AI Pattern Recognition Engine for Trading
    Analyzes candlestick patterns, technical indicators, and market structure
    """
    
    def __init__(self):
        self.patterns = [
            "bullish_engulfing",
            "bearish_engulfing",
            "hammer",
            "shooting_star",
            "doji",
            "morning_star",
            "evening_star",
            "three_white_soldiers",
            "three_black_crows"
        ]
    
    def analyze(self, df: pd.DataFrame, symbol: str) -> Dict:
        """
        Main analysis function that combines all pattern recognition techniques
        """
        if len(df) < 50:
            return {"error": "Insufficient data for analysis"}
        
        # Calculate technical indicators
        indicators = self._calculate_indicators(df)
        
        # Detect candlestick patterns
        candlestick_patterns = self._detect_candlestick_patterns(df)
        
        # Identify support and resistance
        support_resistance = self._find_support_resistance(df)
        
        # Detect trends
        trend = self._detect_trend(df, indicators)
        
        # Calculate momentum
        momentum = self._calculate_momentum(indicators)
        
        # Generate trading signal
        signal = self._generate_signal(
            df, indicators, candlestick_patterns, 
            trend, momentum, support_resistance
        )
        
        return {
            "symbol": symbol,
            "timestamp": datetime.now().isoformat(),
            "signal": signal,
            "trend": trend,
            "momentum": momentum,
            "patterns": candlestick_patterns,
            "support_resistance": support_resistance,
            "indicators": {
                "rsi": float(indicators["rsi"].iloc[-1]),
                "macd": float(indicators["macd"].iloc[-1]),
                "macd_signal": float(indicators["macd_signal"].iloc[-1]),
                "bb_upper": float(indicators["bb_upper"].iloc[-1]),
                "bb_lower": float(indicators["bb_lower"].iloc[-1]),
                "ema_20": float(indicators["ema_20"].iloc[-1]),
                "ema_50": float(indicators["ema_50"].iloc[-1]),
            },
            "current_price": float(df["close"].iloc[-1])
        }
    
    def _calculate_indicators(self, df: pd.DataFrame) -> Dict:
        """Calculate comprehensive technical indicators"""
        indicators = {}
        
        # RSI
        indicators["rsi"] = ta.momentum.RSIIndicator(df["close"], window=14).rsi()
        
        # MACD
        macd = ta.trend.MACD(df["close"])
        indicators["macd"] = macd.macd()
        indicators["macd_signal"] = macd.macd_signal()
        indicators["macd_diff"] = macd.macd_diff()
        
        # Bollinger Bands
        bb = ta.volatility.BollingerBands(df["close"], window=20, window_dev=2)
        indicators["bb_upper"] = bb.bollinger_hband()
        indicators["bb_middle"] = bb.bollinger_mavg()
        indicators["bb_lower"] = bb.bollinger_lband()
        
        # EMAs
        indicators["ema_20"] = ta.trend.EMAIndicator(df["close"], window=20).ema_indicator()
        indicators["ema_50"] = ta.trend.EMAIndicator(df["close"], window=50).ema_indicator()
        indicators["ema_200"] = ta.trend.EMAIndicator(df["close"], window=200).ema_indicator()
        
        # Volume indicators
        indicators["volume_sma"] = df["volume"].rolling(window=20).mean()
        
        # ADX for trend strength
        adx = ta.trend.ADXIndicator(df["high"], df["low"], df["close"], window=14)
        indicators["adx"] = adx.adx()
        
        # Stochastic
        stoch = ta.momentum.StochasticOscillator(df["high"], df["low"], df["close"])
        indicators["stoch_k"] = stoch.stoch()
        indicators["stoch_d"] = stoch.stoch_signal()
        
        return indicators
    
    def _detect_candlestick_patterns(self, df: pd.DataFrame) -> List[str]:
        """Detect candlestick patterns"""
        patterns_found = []
        
        if len(df) < 3:
            return patterns_found
        
        # Get last 3 candles
        c1, c2, c3 = df.iloc[-3], df.iloc[-2], df.iloc[-1]
        
        # Bullish Engulfing
        if (c2["close"] < c2["open"] and  # Previous bearish
            c3["close"] > c3["open"] and  # Current bullish
            c3["open"] < c2["close"] and  # Opens below previous close
            c3["close"] > c2["open"]):    # Closes above previous open
            patterns_found.append("bullish_engulfing")
        
        # Bearish Engulfing
        if (c2["close"] > c2["open"] and  # Previous bullish
            c3["close"] < c3["open"] and  # Current bearish
            c3["open"] > c2["close"] and  # Opens above previous close
            c3["close"] < c2["open"]):    # Closes below previous open
            patterns_found.append("bearish_engulfing")
        
        # Hammer (bullish reversal)
        body = abs(c3["close"] - c3["open"])
        lower_shadow = min(c3["open"], c3["close"]) - c3["low"]
        upper_shadow = c3["high"] - max(c3["open"], c3["close"])
        
        if lower_shadow > 2 * body and upper_shadow < body:
            patterns_found.append("hammer")
        
        # Shooting Star (bearish reversal)
        if upper_shadow > 2 * body and lower_shadow < body:
            patterns_found.append("shooting_star")
        
        # Doji
        if body < (c3["high"] - c3["low"]) * 0.1:
            patterns_found.append("doji")
        
        return patterns_found
    
    def _find_support_resistance(self, df: pd.DataFrame) -> Dict:
        """Find key support and resistance levels"""
        # Use recent highs and lows
        recent_data = df.tail(50)
        
        # Find local maxima and minima
        highs = recent_data["high"].nlargest(5).mean()
        lows = recent_data["low"].nsmallest(5).mean()
        
        current_price = df["close"].iloc[-1]
        
        return {
            "resistance": float(highs),
            "support": float(lows),
            "distance_to_resistance": float((highs - current_price) / current_price * 100),
            "distance_to_support": float((current_price - lows) / current_price * 100)
        }
    
    def _detect_trend(self, df: pd.DataFrame, indicators: Dict) -> str:
        """Detect overall market trend"""
        current_price = df["close"].iloc[-1]
        ema_20 = indicators["ema_20"].iloc[-1]
        ema_50 = indicators["ema_50"].iloc[-1]
        
        if current_price > ema_20 > ema_50:
            return "strong_uptrend"
        elif current_price > ema_20 and ema_20 < ema_50:
            return "uptrend"
        elif current_price < ema_20 < ema_50:
            return "strong_downtrend"
        elif current_price < ema_20 and ema_20 > ema_50:
            return "downtrend"
        else:
            return "sideways"
    
    def _calculate_momentum(self, indicators: Dict) -> str:
        """Calculate momentum strength"""
        rsi = indicators["rsi"].iloc[-1]
        macd_diff = indicators["macd_diff"].iloc[-1]
        
        if rsi > 70 and macd_diff > 0:
            return "strong_bullish"
        elif rsi > 50 and macd_diff > 0:
            return "bullish"
        elif rsi < 30 and macd_diff < 0:
            return "strong_bearish"
        elif rsi < 50 and macd_diff < 0:
            return "bearish"
        else:
            return "neutral"
    
    def _generate_signal(self, df: pd.DataFrame, indicators: Dict, 
                        patterns: List[str], trend: str, 
                        momentum: str, support_resistance: Dict) -> Dict:
        """Generate comprehensive trading signal"""
        score = 0
        reasons = []
        
        rsi = indicators["rsi"].iloc[-1]
        macd = indicators["macd"].iloc[-1]
        macd_signal = indicators["macd_signal"].iloc[-1]
        current_price = df["close"].iloc[-1]
        bb_upper = indicators["bb_upper"].iloc[-1]
        bb_lower = indicators["bb_lower"].iloc[-1]
        
        # RSI analysis
        if rsi < 30:
            score += 2
            reasons.append("RSI oversold - potential bounce")
        elif rsi > 70:
            score -= 2
            reasons.append("RSI overbought - potential pullback")
        
        # MACD analysis
        if macd > macd_signal:
            score += 1
            reasons.append("MACD bullish crossover")
        else:
            score -= 1
            reasons.append("MACD bearish crossover")
        
        # Trend analysis
        if "uptrend" in trend:
            score += 2
            reasons.append(f"Price in {trend}")
        elif "downtrend" in trend:
            score -= 2
            reasons.append(f"Price in {trend}")
        
        # Pattern analysis
        bullish_patterns = ["bullish_engulfing", "hammer", "morning_star", "three_white_soldiers"]
        bearish_patterns = ["bearish_engulfing", "shooting_star", "evening_star", "three_black_crows"]
        
        for pattern in patterns:
            if pattern in bullish_patterns:
                score += 1.5
                reasons.append(f"Bullish pattern: {pattern}")
            elif pattern in bearish_patterns:
                score -= 1.5
                reasons.append(f"Bearish pattern: {pattern}")
        
        # Bollinger Bands
        if current_price < bb_lower:
            score += 1
            reasons.append("Price near lower Bollinger Band - potential reversal")
        elif current_price > bb_upper:
            score -= 1
            reasons.append("Price near upper Bollinger Band - potential reversal")
        
        # Support/Resistance
        if support_resistance["distance_to_support"] < 2:
            score += 1
            reasons.append("Near support level")
        if support_resistance["distance_to_resistance"] < 2:
            score -= 1
            reasons.append("Near resistance level")
        
        # Determine action
        if score >= 4:
            action = "STRONG_BUY"
            confidence = min(95, 60 + score * 5)
        elif score >= 2:
            action = "BUY"
            confidence = min(85, 50 + score * 5)
        elif score <= -4:
            action = "STRONG_SELL"
            confidence = min(95, 60 + abs(score) * 5)
        elif score <= -2:
            action = "SELL"
            confidence = min(85, 50 + abs(score) * 5)
        else:
            action = "HOLD"
            confidence = 50
        
        # Calculate suggested entry/exit prices
        entry_price = None
        stop_loss = None
        take_profit = None
        
        if action in ["BUY", "STRONG_BUY"]:
            entry_price = float(current_price)
            stop_loss = float(current_price * 0.97)  # 3% stop loss
            take_profit = float(current_price * 1.05)  # 5% take profit
        elif action in ["SELL", "STRONG_SELL"]:
            entry_price = float(current_price)
            stop_loss = float(current_price * 1.03)  # 3% stop loss
            take_profit = float(current_price * 0.95)  # 5% take profit
        
        return {
            "action": action,
            "confidence": confidence,
            "score": score,
            "reasons": reasons,
            "entry_price": entry_price,
            "stop_loss": stop_loss,
            "take_profit": take_profit,
            "risk_reward_ratio": 1.67 if entry_price else None
        }
