import useSWR, { mutate } from 'swr';
import { SearchParams, SearchResponse } from '../types';
import { useState, useEffect } from 'react';

const BASE_URL = 'https://api.wholphin.net';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch data');
  return res.json();
};

export function useSearch(params: SearchParams) {
  const { q = '', type, page = 1, safesearch = 1, lang = 'ja' } = params;
  
  const shouldFetch = q && q.trim().length > 0 && type !== 'suggest';
  
  const queryParams = new URLSearchParams({
    q: q.trim(),
    type,
    page: page.toString(),
    safesearch: safesearch.toString(),
    lang,
  });

  const url = shouldFetch ? `${BASE_URL}/search?${queryParams.toString()}` : null;

  const { data, error, isLoading, isValidating } = useSWR<SearchResponse>(
    url,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      keepPreviousData: true,
      dedupingInterval: 5000,
    }
  );

  return {
    data,
    isLoading: isLoading || (isValidating && !data),
    error,
  };
}

export function prefetchSearch(params: SearchParams) {
  const { q = '', type, page = 1, safesearch = 1, lang = 'ja' } = params;
  if (!q || !q.trim()) return;

  const queryParams = new URLSearchParams({
    q: q.trim(),
    type,
    page: page.toString(),
    safesearch: safesearch.toString(),
    lang,
  });

  const url = `${BASE_URL}/search?${queryParams.toString()}`;
  mutate(url, fetcher(url), { revalidate: false });
}

export function useSuggest(q: string = '') {
  const [debouncedQuery, setDebouncedQuery] = useState(q);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(q);
    }, 200);
    return () => clearTimeout(handler);
  }, [q]);

  const shouldFetch = debouncedQuery && debouncedQuery.trim().length > 0;
  
  const queryParams = new URLSearchParams({
    q: debouncedQuery.trim(),
    type: 'suggest',
  });

  const { data, isLoading } = useSWR<SearchResponse>(
    shouldFetch ? `${BASE_URL}/search?${queryParams.toString()}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 1000,
    }
  );

  return {
    suggestions: data?.suggestions || [],
    isLoading,
  };
}
