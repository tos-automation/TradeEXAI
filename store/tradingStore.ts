import { create } from 'zustand'
import { Position, TradeSignal } from '@/types'

interface TradingStore {
  positions: Position[]
  signals: TradeSignal[]
  balance: number
  addPosition: (position: Position) => void
  removePosition: (id: string) => void
  updatePosition: (id: string, updates: Partial<Position>) => void
  addSignal: (signal: TradeSignal) => void
  clearSignal: (id: string) => void
  updateBalance: (amount: number) => void
}

export const useTradingStore = create<TradingStore>((set) => ({
  positions: [],
  signals: [],
  balance: 100000, // Starting balance

  addPosition: (position) =>
    set((state) => {
      // Deduct cost for LONG positions, add for SHORT
      const cost = position.side === 'LONG' 
        ? position.quantity * position.entryPrice
        : 0 // For shorts, we're borrowing, so no immediate cost
      
      return {
        positions: [...state.positions, position],
        balance: state.balance - cost,
      }
    }),

  removePosition: (id) =>
    set((state) => {
      const position = state.positions.find((p) => p.id === id)
      if (!position) return state

      // Add back proceeds when closing position
      const proceeds = position.side === 'LONG'
        ? position.quantity * position.currentPrice
        : position.quantity * (position.entryPrice * 2 - position.currentPrice) // Simplified short closing

      return {
        positions: state.positions.filter((p) => p.id !== id),
        balance: state.balance + proceeds,
      }
    }),

  updateBalance: (amount) =>
    set((state) => ({
      balance: state.balance + amount,
    })),

  updatePosition: (id, updates) =>
    set((state) => ({
      positions: state.positions.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    })),

  addSignal: (signal) =>
    set((state) => ({
      signals: [signal, ...state.signals].slice(0, 50), // Keep last 50 signals
    })),

  clearSignal: (id) =>
    set((state) => ({
      signals: state.signals.filter((s) => s.id !== id),
    })),
}))