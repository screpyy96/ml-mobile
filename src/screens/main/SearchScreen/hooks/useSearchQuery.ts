import { useState, useMemo } from 'react';

export const useSearchQuery = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const applySearchFilter = (meserias: any[]) => {
    if (!searchQuery.trim()) return meserias;
    
    const query = searchQuery.toLowerCase();
    
    return meserias.filter(meserias => {
      const trades = meserias.trades?.map((trade: any) => trade.name).join(' ') || '';
      
      return (
        meserias.name?.toLowerCase().includes(query) ||
        trades.toLowerCase().includes(query) ||
        meserias.address?.toLowerCase().includes(query) ||
        meserias.bio?.toLowerCase().includes(query) ||
        meserias.phone?.toLowerCase().includes(query)
      );
    });
  };

  const normalizeSearchTerm = (query: string) => {
    return String(query || '')
      .trim()
      .replace(/^caut(\s+un|\s+o|\s+)/i, '')
      .replace(/^(găsește|gaseste|gasesc)(\s+)/i, '')
      .replace(/^vreau\s+să\s+caut\s+/i, '')
      .replace(/^vreau\s+sa\s+caut\s+/i, '')
      .replace(/\b(in|în)\b/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  return {
    searchQuery,
    setSearchQuery,
    applySearchFilter,
    normalizeSearchTerm,
  };
};
