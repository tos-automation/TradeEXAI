import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TradeEXAI - AI-Powered Trading Platform',
  description: 'Professional day trading platform with AI pattern recognition for stocks, crypto, and forex',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}