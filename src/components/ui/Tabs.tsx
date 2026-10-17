import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange, className = '' }) => {
  return (
    <div className={`flex flex-wrap gap-2 p-1 border-[3px] border-[#111111] bg-[#111111]/10 ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`
              flex items-center gap-2 px-3 py-1.5 font-heading text-xs font-bold uppercase tracking-wider
              border-[2px] border-[#111111] transition-all cursor-pointer
              ${
                isActive
                  ? 'bg-[#FFD93D] shadow-[3px_3px_0_#111111] -translate-y-0.5'
                  : 'bg-[#FFF8E7] opacity-80 hover:opacity-100 hover:bg-white'
              }
            `}
          >
            {tab.icon && <span>{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className="px-1.5 py-0.2 bg-[#111111] text-[#FFF8E7] text-[10px] rounded-none">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
