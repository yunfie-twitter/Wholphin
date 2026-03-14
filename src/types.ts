export type SearchType = 'web' | 'image' | 'video' | 'suggest';
export type Theme = 'light' | 'dark' | 'system';
export type SafeSearch = 0 | 1 | 2; // Off, Moderate, Strict
export type Language = 'ja' | 'en';

export interface SearchParams {
  q: string;
  type: SearchType;
  page?: number;
  safesearch?: SafeSearch;
  lang?: Language;
}

export interface SearchResult {
  id: string;
  title: string;
  url: string;
  link?: string; // Optional fallback
  summary: string; // Renamed from snippet to match sample
  source: string;
  date?: string;
  thumbnail?: string;
  favicon?: string;
  page: number;
  breadcrumbs?: string[];
  resolution?: string;
  duration?: string;
  channelIcon?: string;
  details?: {
    description?: string;
    metadata?: Record<string, string>;
  };
}

export interface SearchResponse {
  results: SearchResult[];
  totalResults: number;
  totalPages: number;
  currentPage: number;
  suggestions?: { title: string }[];
}
