import React from 'react';
import { motion } from 'motion/react';
import { SearchType } from '../types';
import { cn } from '../utils';
import { prefetchSearch } from '../hooks/useSearch';

interface SwipeableTabsProps {
  activeTab: SearchType;
  onChange: (tab: SearchType) => void;
  query: string;
}

const tabs: { id: SearchType; label: string }[] = [
  { id: 'web', label: 'Web' },
  { id: 'image', label: 'Images' },
  { id: 'video', label: 'Videos' },
];

export const SwipeableTabs: React.FC<SwipeableTabsProps> = ({ activeTab, onChange, query }) => {
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight') {
      const nextIndex = (index + 1) % tabs.length;
      onChange(tabs[nextIndex].id);
    } else if (e.key === 'ArrowLeft') {
      const prevIndex = (index - 1 + tabs.length) % tabs.length;
      onChange(tabs[prevIndex].id);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onChange(tabs[index].id);
    }
  };

  const handlePrefetch = (tab: SearchType) => {
    if (tab !== activeTab && query) {
      prefetchSearch({ q: query, type: tab });
    }
  };

  return (
    <div className="flex items-center gap-1 p-1 bg-black/5 dark:bg-white/5 rounded-[14px] w-fit mx-auto sm:mx-0">
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onMouseEnter={() => handlePrefetch(tab.id)}
            onTouchStart={() => handlePrefetch(tab.id)}
            className={cn(
              "relative px-5 py-2 text-[13px] font-bold transition-colors rounded-[10px] outline-none",
              "focus-visible:ring-2 focus-visible:ring-[#007AFF] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#1C1C1E]",
              isActive ? "text-[#1D1D1F] dark:text-[#F5F5F7]" : "text-[#86868B] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7]"
            )}
            aria-selected={isActive}
            role="tab"
            tabIndex={isActive ? 0 : -1}
          >
            {isActive && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute inset-0 bg-white dark:bg-white/10 rounded-[10px] shadow-sm"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
