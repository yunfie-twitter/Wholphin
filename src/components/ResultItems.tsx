import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SearchResult } from '../types';
import { ChevronDown, ExternalLink, Clock, Play, Info } from 'lucide-react';
import { cn } from '../utils';

const springConfig = { type: 'spring', stiffness: 400, damping: 30 };

// --- Web Result Item ---
export const WebResultItem: React.FC<{ result: SearchResult; index: number }> = ({ result, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const hostname = React.useMemo(() => {
    try {
      return new URL(result.url || result.link || '').hostname;
    } catch {
      return result.source || 'unknown';
    }
  }, [result.url, result.link, result.source]);

  const shouldAnimate = index < 10;

  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springConfig, delay: index * 0.03 }}
      layout
      className="group relative py-8 first:pt-0 border-b border-black/5 dark:border-white/5 last:border-0 content-visibility-auto"
      style={{ containIntrinsicSize: '0 120px' }}
    >
      <div className="flex flex-col gap-2.5">
        {/* Top: Source Info (Favicon + URL) */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-white dark:bg-white/10 flex items-center justify-center overflow-hidden shadow-sm border border-black/5 dark:border-white/10">
              <img 
                src={result.favicon || `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`}
                alt=""
                className="w-4 h-4 object-contain"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/web/64/64';
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] leading-none mb-0.5">{result.source}</span>
              <span className="text-[11px] text-[#86868B] leading-none truncate max-w-[200px]">{hostname}</span>
            </div>
          </div>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-black tracking-tight transition-all active:scale-95",
              isExpanded 
                ? "bg-[#007AFF] text-white shadow-lg shadow-[#007AFF]/20" 
                : "bg-black/5 dark:bg-white/5 text-[#86868B] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7]"
            )}
          >
            <Info size={14} strokeWidth={2.5} />
            <span>{isExpanded ? 'Hide Details' : 'Show Details'}</span>
            <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={springConfig}>
              <ChevronDown size={14} strokeWidth={2.5} />
            </motion.div>
          </button>
        </div>

        {/* Middle: Title (Clickable) */}
        <a 
          href={result.url || result.link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[20px] text-[#0066CC] dark:text-[#2997FF] hover:underline decoration-1 underline-offset-4 font-medium leading-tight inline-flex items-center gap-2 w-fit"
        >
          {result.title}
          <ExternalLink size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
        </a>

        {/* Bottom: Summary */}
        <p className="text-[15px] text-[#424245] dark:text-[#D2D2D7] leading-relaxed line-clamp-2">
          {result.summary}
        </p>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={springConfig}
              className="overflow-hidden"
            >
              <div className="pt-4 pb-2">
                <div className="p-6 rounded-[28px] bg-black/[0.03] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 space-y-5">
                  <div className="space-y-2">
                    <p className="text-[11px] font-black text-[#86868B] uppercase tracking-[0.2em]">Description</p>
                    <p className="text-[15px] text-[#1D1D1F] dark:text-[#F5F5F7] leading-relaxed font-medium">
                      {result.details?.description || result.summary}
                    </p>
                  </div>
                  
                  {result.details?.metadata && Object.keys(result.details.metadata).length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-black/5 dark:border-white/5">
                      {Object.entries(result.details.metadata).map(([key, val]) => (
                        <div key={key}>
                          <p className="text-[10px] uppercase tracking-[0.15em] font-black text-[#86868B] mb-1.5">{key}</p>
                          <p className="text-[14px] font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">{val}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4 pt-2">
                    <div className="flex-1 h-px bg-black/5 dark:bg-white/5" />
                    <a 
                      href={result.url || result.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[13px] font-black text-[#007AFF] hover:underline uppercase tracking-wider"
                    >
                      Visit Website
                    </a>
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

// --- Image Card ---
export const ImageCard: React.FC<{ result: SearchResult; index: number }> = ({ result, index }) => {
  const shouldAnimate = index < 16;

  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0, scale: 0.9 } : { opacity: 1, scale: 1 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ ...springConfig, delay: index * 0.01 }}
      className="group relative aspect-square rounded-[24px] overflow-hidden bg-black/5 dark:bg-white/5 cursor-zoom-in content-visibility-auto"
      style={{ containIntrinsicSize: '0 200px' }}
    >
      <a 
        href={result.url || result.link} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block w-full h-full"
      >
        <img 
          src={result.thumbnail || result.link || ''} 
          alt={result.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/img/400/400';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
          <p className="text-white text-[12px] font-bold line-clamp-2 leading-snug mb-2">{result.title}</p>
          <div className="flex items-center justify-between">
            <span className="text-white/70 text-[10px] font-black uppercase tracking-wider">{result.source}</span>
            <span className="text-white/50 text-[9px] font-black uppercase tracking-widest bg-white/10 px-2 py-0.5 rounded-full">{result.resolution}</span>
          </div>
        </div>
      </a>
    </motion.div>
  );
};

// --- Video Card ---
export const VideoCard: React.FC<{ result: SearchResult; index: number }> = ({ result, index }) => {
  const shouldAnimate = index < 12;

  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springConfig, delay: index * 0.03 }}
      className="group flex flex-col gap-4 content-visibility-auto"
      style={{ containIntrinsicSize: '0 300px' }}
    >
      <a 
        href={result.url || result.link} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block"
      >
        <div className="relative aspect-video rounded-[24px] overflow-hidden bg-black/5 dark:bg-white/5 shadow-sm">
          {result.thumbnail && (
            <img 
              src={result.thumbnail} 
              alt={result.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/video/480/270';
              }}
            />
          )}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors flex items-center justify-center">
            <div className="w-14 h-14 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300 shadow-2xl">
              <Play fill="currentColor" size={24} className="ml-1" />
            </div>
          </div>
          {result.duration && (
            <div className="absolute bottom-3 right-3 px-2.5 py-1 glass rounded-xl text-[10px] font-black tracking-tighter flex items-center gap-1.5 shadow-lg">
              <Clock size={12} strokeWidth={3} />
              {result.duration}
            </div>
          )}
        </div>
        
        <div className="flex gap-4 mt-4 px-1">
          {result.channelIcon ? (
            <img 
              src={result.channelIcon} 
              className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10" 
              alt="" 
              loading="lazy"
              decoding="async"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/channel/64/64';
              }}
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 flex items-center justify-center text-[11px] font-black text-[#86868B] uppercase">
              {result.source?.charAt(0)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-[16px] font-bold text-[#1D1D1F] dark:text-[#F5F5F7] line-clamp-2 leading-snug group-hover:text-[#007AFF] transition-colors">
              {result.title}
            </h3>
            <p className="text-[13px] text-[#86868B] mt-1.5 font-bold truncate uppercase tracking-tight">
              {result.source} • {result.date}
            </p>
          </div>
        </div>
      </a>
    </motion.div>
  );
};
