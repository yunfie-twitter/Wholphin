import React, { useState, useEffect, useTransition, useCallback } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'motion/react';
import { SearchBar } from './components/SearchBar';
import { SwipeableTabs } from './components/SwipeableTabs';
import { WebResultItem, ImageCard, VideoCard } from './components/ResultItems';
import { SkeletonCard, EmptyState } from './components/ResultCard';
import { SearchType, SearchParams, Theme } from './types';
import { useSearch } from './hooks/useSearch';
import { Settings, Moon, Sun, Monitor, ChevronLeft, ChevronRight } from 'lucide-react';
import { Drawer } from 'vaul';
import Lenis from 'lenis';
import { cn } from './utils';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('web');
  const [page, setPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [theme, setTheme] = useState<Theme>('system');
  const [safeSearch, setSafeSearch] = useState(1);
  const [language, setLanguage] = useState('ja');
  
  const [isPending, startTransition] = useTransition();

  // Initialize Lenis for smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  // Theme handling
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  const { data, isLoading, error } = useSearch({
    q: query,
    type: searchType,
    page,
    safesearch: safeSearch,
    lang: language,
  });

  const handleSearch = useCallback((q: string) => {
    setQuery(q);
    setPage(1);
    setIsSearching(true);
  }, []);

  const handleTabChange = useCallback((type: SearchType) => {
    startTransition(() => {
      setSearchType(type);
      setPage(1);
    });
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const results = data?.results || [];
  const totalResults = data?.totalResults || 0;
  const totalPages = Math.ceil(totalResults / 10);

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#000000] text-[#1D1D1F] dark:text-[#F5F5F7] transition-colors duration-500 selection:bg-[#007AFF]/20 selection:text-[#007AFF]">
      <LayoutGroup>
        <AnimatePresence mode="wait">
          {!isSearching ? (
            <motion.main
              key="hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative flex flex-col items-center justify-center min-h-screen px-6 overflow-hidden"
            >
              {/* Mesh Gradient Background */}
              <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#007AFF]/10 blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#5E5CE6]/10 blur-[120px] animate-pulse delay-700" />
              </div>

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="w-full max-w-2xl text-center space-y-12"
              >
                <div className="space-y-4">
                  <motion.h1 
                    className="text-6xl sm:text-8xl font-black tracking-tighter bg-gradient-to-b from-[#1D1D1F] to-[#434343] dark:from-[#FFFFFF] dark:to-[#86868B] bg-clip-text text-transparent"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Wholphin
                  </motion.h1>
                  <motion.p 
                    className="text-lg sm:text-xl text-[#86868B] font-medium"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    The search engine that thinks different.
                  </motion.p>
                </div>

                <SearchBar 
                  value={query}
                  onChange={setQuery}
                  onSearch={handleSearch} 
                  isHero 
                  settings={{ safesearch: safeSearch, lang: language }}
                  onSettingsChange={(s) => {
                    setSafeSearch(s.safesearch);
                    setLanguage(s.lang);
                  }}
                />

                <motion.div 
                  className="flex flex-wrap justify-center gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {['Apple Event', 'Vision Pro', 'MacBook Air M3', 'iOS 18'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleSearch(tag)}
                      className="px-5 py-2.5 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-[13px] font-bold transition-all active:scale-95 border border-black/5 dark:border-white/5"
                    >
                      {tag}
                    </button>
                  ))}
                </motion.div>
              </motion.div>

              {/* Theme Toggle Floating */}
              <div className="fixed bottom-8 right-8 flex gap-2 p-1.5 glass rounded-full shadow-2xl z-50">
                {(['light', 'dark', 'system'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={cn(
                      "p-2.5 rounded-full transition-all active:scale-90",
                      theme === t ? "bg-white dark:bg-white/20 shadow-lg text-[#007AFF]" : "text-[#86868B] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7]"
                    )}
                  >
                    {t === 'light' && <Sun size={18} />}
                    {t === 'dark' && <Moon size={18} />}
                    {t === 'system' && <Monitor size={18} />}
                  </button>
                ))}
              </div>
            </motion.main>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col min-h-screen"
            >
              {/* Sticky Header */}
              <header className="sticky top-0 z-40 glass border-b border-black/5 dark:border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <button 
                      onClick={() => setIsSearching(false)}
                      className="text-2xl font-black tracking-tighter hover:opacity-70 transition-opacity"
                    >
                      W
                    </button>
                    <div className="sm:hidden flex-1">
                      <SearchBar 
                        value={query}
                        onChange={setQuery}
                        onSearch={handleSearch} 
                        settings={{ safesearch: safeSearch, lang: language }}
                        onSettingsChange={(s) => {
                          setSafeSearch(s.safesearch);
                          setLanguage(s.lang);
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="hidden sm:block w-full max-w-2xl">
                    <SearchBar 
                      value={query}
                      onChange={setQuery}
                      onSearch={handleSearch} 
                      settings={{ safesearch: safeSearch, lang: language }}
                      onSettingsChange={(s) => {
                        setSafeSearch(s.safesearch);
                        setLanguage(s.lang);
                      }}
                    />
                  </div>

                  <div className="hidden sm:flex items-center gap-2">
                    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-[#86868B] transition-colors">
                      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                  </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-8 pb-2">
                  <SwipeableTabs 
                    activeTab={searchType} 
                    onChange={handleTabChange}
                    query={query}
                  />
                </div>
              </header>

              {/* Results Area */}
              <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-8">
                <div className={cn(
                  "transition-opacity duration-300",
                  isPending ? "opacity-50" : "opacity-100"
                )}>
                  {isLoading ? (
                    <div className={cn(
                      "grid gap-6",
                      searchType === 'web' ? "grid-cols-1" : 
                      searchType === 'image' ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" : 
                      "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    )}>
                      {[...Array(10)].map((_, i) => (
                        <SkeletonCard key={i} type={searchType} />
                      ))}
                    </div>
                  ) : error ? (
                    <EmptyState message="Something went wrong. Please try again." />
                  ) : results.length === 0 ? (
                    <EmptyState />
                  ) : (
                    <div className={cn(
                      "grid gap-x-8 gap-y-10",
                      searchType === 'web' ? "grid-cols-1 max-w-3xl" : 
                      searchType === 'image' ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" : 
                      "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    )}>
                      {results.map((result, i) => (
                        <React.Fragment key={result.id || i}>
                          {searchType === 'web' && <WebResultItem result={result} index={i} />}
                          {searchType === 'image' && <ImageCard result={result} index={i} />}
                          {searchType === 'video' && <VideoCard result={result} index={i} />}
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && !isLoading && (
                  <div className="mt-16 flex items-center justify-center gap-4">
                    <button
                      disabled={page === 1}
                      onClick={() => handlePageChange(page - 1)}
                      className="p-3 rounded-full bg-black/5 dark:bg-white/5 disabled:opacity-30 hover:bg-black/10 dark:hover:bg-white/10 transition-all active:scale-90"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <span className="text-sm font-bold text-[#86868B]">
                      Page <span className="text-[#1D1D1F] dark:text-[#F5F5F7]">{page}</span> of {totalPages}
                    </span>
                    <button
                      disabled={page === totalPages}
                      onClick={() => handlePageChange(page + 1)}
                      className="p-3 rounded-full bg-black/5 dark:bg-white/5 disabled:opacity-30 hover:bg-black/10 dark:hover:bg-white/10 transition-all active:scale-90"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}
              </main>

              {/* Footer */}
              <footer className="py-12 border-t border-black/5 dark:border-white/5 mt-auto">
                <div className="max-w-7xl mx-auto px-8 flex flex-col sm:flex-row justify-between items-center gap-6">
                  <p className="text-[13px] text-[#86868B] font-medium">© 2024 Wholphin Search. Built for the future.</p>
                  <div className="flex gap-8">
                    {['Privacy', 'Terms', 'About'].map((item) => (
                      <a key={item} href="#" className="text-[13px] text-[#86868B] hover:text-[#007AFF] font-medium transition-colors">{item}</a>
                    ))}
                  </div>
                </div>
              </footer>
            </motion.div>
          )}
        </AnimatePresence>
      </LayoutGroup>

      {/* Mobile Settings Drawer */}
      <Drawer.Root>
        <Drawer.Trigger asChild>
          <button className="sm:hidden fixed bottom-8 left-8 p-4 glass rounded-full shadow-2xl z-50 text-[#007AFF] active:scale-90 transition-transform">
            <Settings size={24} />
          </button>
        </Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]" />
          <Drawer.Content className="bg-[#F5F5F7] dark:bg-[#1C1C1E] flex flex-col rounded-t-[32px] h-[60%] mt-24 fixed bottom-0 left-0 right-0 z-[70] outline-none">
            <div className="p-4 bg-white dark:bg-[#1C1C1E] rounded-t-[32px] flex-1">
              <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-black/10 dark:bg-white/10 mb-8" />
              <div className="max-w-md mx-auto space-y-8 px-4">
                <Drawer.Title className="text-2xl font-black tracking-tight">Settings</Drawer.Title>
                
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[11px] font-bold text-[#86868B] uppercase tracking-widest">Safe Search</label>
                    <div className="flex p-1 bg-black/5 dark:bg-white/5 rounded-2xl">
                      {[1, 0].map((v) => (
                        <button
                          key={v}
                          onClick={() => setSafeSearch(v)}
                          className={cn(
                            "flex-1 py-3 text-sm font-bold rounded-xl transition-all",
                            safeSearch === v ? "bg-white dark:bg-white/10 shadow-sm text-[#007AFF]" : "text-[#86868B]"
                          )}
                        >
                          {v === 1 ? 'On' : 'Off'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[11px] font-bold text-[#86868B] uppercase tracking-widest">Language</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['ja', 'en'].map((l) => (
                        <button
                          key={l}
                          onClick={() => setLanguage(l)}
                          className={cn(
                            "py-3 text-sm font-bold rounded-2xl border transition-all",
                            language === l ? "bg-[#007AFF]/10 border-[#007AFF] text-[#007AFF]" : "bg-black/5 dark:bg-white/5 border-transparent text-[#86868B]"
                          )}
                        >
                          {l === 'ja' ? '日本語' : 'English'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  );
};

export default App;
