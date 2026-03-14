import React, { useState, useRef, useEffect } from 'react';
import { Search, Settings, X, Shield, Languages, Command } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils';
import { SafeSearch, Language } from '../types';
import { useSuggest } from '../hooks/useSearch';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (value: string) => void;
  isHeader?: boolean;
  isHero?: boolean;
  settings: {
    safesearch: SafeSearch;
    lang: Language;
  };
  onSettingsChange: (settings: { safesearch: SafeSearch; lang: Language }) => void;
}

const springConfig = { type: 'spring', stiffness: 400, damping: 30 };

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSearch,
  isHeader = false,
  isHero = false,
  settings,
  onSettingsChange,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showSuggest, setShowSuggest] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { suggestions, isLoading: isSuggestLoading } = useSuggest(value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggest(false);
        setShowSettings(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const finalValue = selectedIndex >= 0 ? suggestions[selectedIndex]?.title : value;
    if (finalValue && finalValue.trim()) {
      onSearch(finalValue.trim());
      onChange(finalValue.trim());
      setShowSuggest(false);
      inputRef.current?.blur();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > -1 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      setShowSuggest(false);
      inputRef.current?.blur();
    }
  };

  return (
    <motion.div 
      ref={containerRef}
      layoutId="search-container"
      transition={springConfig}
      className={cn(
        "relative w-full z-50 transition-all duration-500",
        isHeader ? "max-w-2xl" : isHero ? "max-w-3xl mx-auto" : "max-w-2xl mx-auto"
      )}
    >
      <div className="relative group">
        <motion.div 
          layout
          className={cn(
            "relative flex items-center w-full transition-all duration-500",
            "glass rounded-full overflow-hidden border",
            "focus-within:ring-2 focus-within:ring-[#007AFF]/50 focus-within:border-[#007AFF]/50",
            isFocused 
              ? "shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] scale-[1.01]" 
              : "shadow-[0_10px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.1)] border-black/5 dark:border-white/10",
            isHeader ? "h-12" : isHero ? "h-20" : "h-16"
          )}
        >
          <div className="pl-6 text-[#86868B] dark:text-[#86868B]">
            <Search size={isHeader ? 18 : isHero ? 24 : 22} strokeWidth={2} />
          </div>
          
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setShowSuggest(true);
              setSelectedIndex(-1);
            }}
            onFocus={() => {
              setIsFocused(true);
              setShowSuggest(true);
            }}
            onBlur={() => {
              // Delay blur to allow suggestion clicks
              setTimeout(() => setIsFocused(false), 200);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search the web, images, videos..."
            className={cn(
              "flex-1 h-full bg-transparent border-none outline-none px-4 font-medium placeholder:text-[#86868B]/50 dark:placeholder:text-[#86868B]/40 text-[#1D1D1F] dark:text-[#F5F5F7]",
              isHero ? "text-[20px]" : "text-[17px]"
            )}
          />

          <div className="flex items-center pr-3 gap-1">
            <AnimatePresence>
              {value && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => {
                    onChange('');
                    inputRef.current?.focus();
                  }}
                  className="p-2.5 text-[#86868B] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] transition-colors"
                >
                  <X size={isHero ? 20 : 18} />
                </motion.button>
              )}
            </AnimatePresence>
            <div className="w-px h-6 bg-black/5 dark:bg-white/10 mx-1" />
            <motion.button
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={() => setShowSettings(!showSettings)}
              className={cn(
                "p-2.5 rounded-full transition-all",
                showSettings ? "bg-[#007AFF] text-white" : "text-[#86868B] hover:bg-black/5 dark:hover:bg-white/5"
              )}
            >
              <Settings size={isHeader ? 18 : isHero ? 22 : 20} />
            </motion.button>
          </div>
        </motion.div>

        {/* Suggestions Dropdown */}
        <AnimatePresence>
          {showSuggest && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={springConfig}
              className="absolute left-0 right-0 top-[calc(100%+8px)] glass rounded-[28px] shadow-[0_30px_60px_rgba(0,0,0,0.2)] dark:shadow-[0_30px_60px_rgba(0,0,0,0.4)] overflow-hidden py-3 z-50 border border-black/5 dark:border-white/10"
            >
              {suggestions.map((item, index) => (
                <motion.button
                  key={index}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onSearch(item.title);
                    onChange(item.title);
                    setShowSuggest(false);
                    inputRef.current?.blur();
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  initial={false}
                  animate={{
                    backgroundColor: selectedIndex === index ? '#007AFF' : 'transparent',
                  }}
                  className={cn(
                    "w-full flex items-center gap-4 px-6 py-3.5 text-left transition-colors duration-200",
                    selectedIndex === index ? "text-white" : "text-[#1D1D1F] dark:text-[#D2D2D7]"
                  )}
                >
                  <Search size={16} className={cn("transition-opacity", selectedIndex === index ? "opacity-100" : "opacity-40")} />
                  <span className="font-semibold text-[15px]">{item.title}</span>
                  <div className="ml-auto opacity-0 group-hover:opacity-100">
                    <Command size={14} className="opacity-40" />
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Settings Popover (Desktop) */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={springConfig}
              className="absolute right-0 top-full mt-4 w-80 glass rounded-[32px] shadow-[0_30px_60px_rgba(0,0,0,0.2)] dark:shadow-[0_30px_60px_rgba(0,0,0,0.4)] p-6 z-50 border border-black/5 dark:border-white/10 hidden sm:block"
            >
              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-2 text-[11px] font-black text-[#86868B] uppercase tracking-[0.2em] mb-4">
                    <Shield size={12} strokeWidth={3} />
                    <span>Safe Search</span>
                  </div>
                  <div className="flex bg-black/5 dark:bg-white/5 p-1 rounded-2xl">
                    {[0, 1, 2].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => onSettingsChange({ ...settings, safesearch: level as SafeSearch })}
                        className={cn(
                          "flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-300",
                          settings.safesearch === level 
                            ? "bg-white dark:bg-white/10 shadow-lg text-[#007AFF] dark:text-white" 
                            : "text-[#86868B] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7]"
                        )}
                      >
                        {level === 0 ? 'Off' : level === 1 ? 'Mid' : 'Strict'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-[11px] font-black text-[#86868B] uppercase tracking-[0.2em] mb-4">
                    <Languages size={12} strokeWidth={3} />
                    <span>Language</span>
                  </div>
                  <div className="flex bg-black/5 dark:bg-white/5 p-1 rounded-2xl">
                    {(['ja', 'en'] as Language[]).map((l) => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => onSettingsChange({ ...settings, lang: l })}
                        className={cn(
                          "flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-300",
                          settings.lang === l 
                            ? "bg-white dark:bg-white/10 shadow-lg text-[#007AFF] dark:text-white" 
                            : "text-[#86868B] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7]"
                        )}
                      >
                        {l === 'ja' ? '日本語' : 'English'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
