import React from 'react';
import './Sidebar.css';
import { BarChart3, Bot, Wallet, Settings } from 'lucide-react';

function Sidebar({ watchlist, onSymbolSelect, selectedSymbol }) {
  const menuItems = [
    { icon: BarChart3, label: 'Markets', active: true },
    { icon: Bot, label: 'AI Signals', active: false },
    { icon: Wallet, label: 'Portfolio', active: false },
    { icon: Settings, label: 'Settings', active: false },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-menu">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className={`menu-item ${item.active ? 'active' : ''}`}
            title={item.label}
          >
            <item.icon size={20} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
