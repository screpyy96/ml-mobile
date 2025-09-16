import { useState, useMemo } from 'react';

export interface SearchFilters {
  verifiedOnly: boolean;
  minRating: number | null;
  selectedCategories: Set<string>;
}

export const useSearchFilters = () => {
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());

  const resetFilters = () => {
    setVerifiedOnly(false);
    setMinRating(null);
    setSelectedCategories(new Set());
  };

  const hasActiveFilters = useMemo(() => {
    return verifiedOnly || minRating !== null || selectedCategories.size > 0;
  }, [verifiedOnly, minRating, selectedCategories]);

  const applyFilters = (meserias: any[]) => {
    return meserias.filter(meserias => {
      // Verified filter
      if (verifiedOnly && !meserias.is_verified) return false;
      
      // Rating filter
      if (minRating != null && Number(meserias.rating || 0) < minRating) return false;
      
      // Category filter - use consistent category names
      if (selectedCategories.size > 0) {
        if (!meserias.trades || meserias.trades.length === 0) return false;
        const hasMatchingCategory = meserias.trades.some((t: any) => {
          const category = t.category || 'Altele';
          return selectedCategories.has(String(category));
        });
        if (!hasMatchingCategory) return false;
      }
      
      return true;
    });
  };

  return {
    // State
    verifiedOnly,
    minRating,
    selectedCategories,
    hasActiveFilters,
    
    // Actions
    setVerifiedOnly,
    setMinRating,
    setSelectedCategories,
    resetFilters,
    applyFilters,
  };
};
