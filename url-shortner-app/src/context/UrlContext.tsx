import { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { UrlMapping } from '../types';
import { Log } from '@your-org/logging-middleware';

interface UrlContextType {
  urlMappings: UrlMapping[];
  addUrlMapping: (mapping: UrlMapping) => void;
  trackClick: (shortCode: string, clickData: Omit<ClickData, 'timestamp'>) => UrlMapping | undefined;
}

export const UrlContext = createContext<UrlContextType | undefined>(undefined);

export const UrlProvider = ({ children }: { children: ReactNode }) => {
  const [urlMappings, setUrlMappings] = useState<UrlMapping[]>(() => {
    try {
      const localData = localStorage.getItem('urlMappings');
      if (localData) {
        Log('frontend', 'info', 'state', 'Loaded URL mappings from localStorage.');
        return JSON.parse(localData);
      }
    } catch (error) {
      Log('frontend', 'error', 'state', 'Failed to parse URL mappings from localStorage.');
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('urlMappings', JSON.stringify(urlMappings));
  }, [urlMappings]);

  const addUrlMapping = (mapping: UrlMapping) => {
    setUrlMappings(prev => [...prev, mapping]);
  };

  const trackClick = (shortCode: string, clickData: Omit<ClickData, 'timestamp'>) => {
    let targetUrl: UrlMapping | undefined;
    setUrlMappings(prev =>
      prev.map(m => {
        if (m.shortCode === shortCode) {
          const newClick = { ...clickData, timestamp: Date.now() };
          targetUrl = { ...m, clickCount: m.clickCount + 1, clicks: [...m.clicks, newClick]};
          return targetUrl;
        }
        return m;
      })
    );
    return targetUrl;
  };

  return (
    <UrlContext.Provider value={{ urlMappings, addUrlMapping, trackClick }}>
      {children}
    </UrlContext.Provider>
  );
};

export const useUrlContext = () => {
    const context = useContext(UrlContext);
    if (context === undefined) {
        throw new Error('useUrlContext must be used within a UrlProvider');
    }
    return context;
}