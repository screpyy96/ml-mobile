import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert, Text, FlatList, TouchableOpacity, Animated, Easing } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors } from '../../constants/colors';
import { supabase } from '../../config/supabase';
import { useTheme, Button, Input, SkeletonList } from '../../design-system';
import { SearchStackParamList } from '../../navigation/MainNavigator';
import { useAuth } from '../../context/AuthContext';
import { Screen } from '../../design-system/components/Layout/Screen';
import { useSearchFilters } from './SearchScreen/hooks/useSearchFilters';
import { useSearchQuery } from './SearchScreen/hooks/useSearchQuery';
import { FilterSheet } from './SearchScreen/components/FilterSheet';
import { MeseriasCard } from './SearchScreen/components/MeseriasCard';

type SearchScreenNavigationProp = StackNavigationProp<SearchStackParamList, 'SearchIndex'>;

interface SearchScreenProps {
  route?: {
    params?: {
      hideSearch?: boolean;
    };
  };
}

const SearchScreen: React.FC<SearchScreenProps> = ({ route }) => {
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const { theme } = useTheme();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  // Custom hooks
  const { searchQuery, setSearchQuery, applySearchFilter, normalizeSearchTerm } = useSearchQuery();
  const {
    verifiedOnly,
    minRating,
    selectedCategories,
    hasActiveFilters,
    setVerifiedOnly,
    setMinRating,
    setSelectedCategories,
    resetFilters,
    applyFilters,
  } = useSearchFilters();
  
  // State
  const [meserias, setMeserias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  // Constants
  const PAGE_SIZE = 10;
  
  // Animations
  const fadeAnimation = useState(new Animated.Value(0))[0];
  const slideAnimation = useState(new Animated.Value(50))[0];
  const sheetAnim = useState(new Animated.Value(0))[0];
  
  // Check if search should be hidden (when accessed from drawer)
  // For now, always show search - we'll handle drawer navigation differently
  const hideSearch = false;
  
  // Initialize animations
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Fetch meseriași from database using web platform approach
  const fetchMeserias = async (pageParam = 0, isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);
      const endLoading = () => {
        if (isLoadMore) setLoadingMore(false); else setLoading(false);
      };

      // Base query using profiles table (like web platform)
      let query = supabase
        .from('profiles')
        .select('id, name, email, bio, address, avatar_url, rating, is_verified, is_pro, phone', { count: 'exact' })
        .eq('role', 'worker')
        .eq('is_verified', true);

      // Apply search term filter if provided
      if (searchQuery.trim()) {
        const raw = normalizeSearchTerm(searchQuery);
        const tokens = raw.split(/\s+/).filter(Boolean);
        
        // Check for phone number search
        const phoneDigits = raw.replace(/\D+/g, '');
        if (phoneDigits.length >= 4) {
          query = query.or(`phone.ilike.%${phoneDigits}%`);
        }

        // Apply token-based search across multiple fields
        for (const token of tokens) {
          const safeToken = token.replace(/[,()]/g, '');
          query = query.or(
            `name.ilike.%${safeToken}%,bio.ilike.%${safeToken}%,address.ilike.%${safeToken}%,phone.ilike.%${safeToken}%,email.ilike.%${safeToken}%`
          );
        }
      }

      // Add consistent ordering and pagination
      query = query.order('created_at', { ascending: false });
      const from = pageParam * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      query = query.range(from, to);

      const { data, error: fetchError, count } = await query;

      if (fetchError) {
        if (fetchError.code === 'PGRST103') {
          setMeserias(isLoadMore ? prev => prev : []);
          setHasNextPage(false);
          setPage(pageParam);
          endLoading();
          return;
        }
        throw fetchError;
      }

      if (!data || data.length === 0) {
        setMeserias(isLoadMore ? prev => prev : []);
        setHasNextPage(false);
        setPage(pageParam);
        endLoading();
        return;
      }

      // --- Enrich with trades from worker_trades (web platform approach) ---
      const workerIdsOnPage = data.map((d: any) => d.id);
      const { data: tradesOnPage } = await supabase
        .from('worker_trades')
        .select('profile_id, trade_ids')
        .in('profile_id', workerIdsOnPage);

      // Gather all trade IDs from worker_trades
      const allTradeIds = new Set<number>();
      tradesOnPage?.forEach((wt: any) => {
        if (wt.trade_ids && Array.isArray(wt.trade_ids)) {
          wt.trade_ids.forEach((id: number) => allTradeIds.add(id));
        }
      });

      // Fetch trade details
      const { data: tradeDetails } = await supabase
        .from('trades')
        .select('id, name, slug, category')
        .in('id', Array.from(allTradeIds));

      // Create a map of trade details
      const tradeMap = new Map();
      tradeDetails?.forEach((trade: any) => {
        tradeMap.set(trade.id, trade);
      });

      // Add trades to each worker
      const workersWithTrades = data.map((worker: any) => {
        const workerTrades = tradesOnPage?.find((wt: any) => wt.profile_id === worker.id);
        
        const trades = workerTrades?.trade_ids?.map((tradeId: number) => {
          const trade = tradeMap.get(tradeId);
          if (!trade) return null;
          return trade;
        }).filter(Boolean) || [];
        
        // Fallback: if no trades attached, infer up to 3 keywords from bio
        let enrichedTrades = trades;
        if (enrichedTrades.length === 0 && worker.bio) {
          const bio = String(worker.bio).toLowerCase();
          const inferred: { id: number; name: string; slug: string; category?: string }[] = [];
          const candidates = [
            { name: 'electrician', slug: 'electrician', category: 'Instalații' },
            { name: 'instalator', slug: 'instalator', category: 'Instalații' },
            { name: 'zugrav', slug: 'zugrav', category: 'Finisaje' },
            { name: 'parchet', slug: 'parchet', category: 'Finisaje' },
            { name: 'glet', slug: 'glet', category: 'Finisaje' },
            { name: 'faianță', slug: 'faianta', category: 'Finisaje' },
            { name: 'faianta', slug: 'faianta', category: 'Finisaje' },
            { name: 'gresie', slug: 'gresie', category: 'Finisaje' },
            { name: 'tâmplar', slug: 'tamplar', category: 'Tâmplărie' },
            { name: 'tamplar', slug: 'tamplar', category: 'Tâmplărie' },
            { name: 'zugrăvit', slug: 'zugravit', category: 'Finisaje' },
            { name: 'zugravit', slug: 'zugravit', category: 'Finisaje' },
          ];
          for (const c of candidates) {
            if (bio.includes(c.name) && inferred.length < 3) {
              inferred.push({ id: -1, name: c.name, slug: c.slug, category: c.category });
            }
          }
          enrichedTrades = inferred.length > 0 ? inferred : enrichedTrades;
        }
        
        return { ...worker, trades: enrichedTrades };
      });

      // 3. Sort the fetched data based on the desired criteria.
      workersWithTrades.sort((a, b) => {
        const aHasTrades = a.trades && a.trades.length > 0;
        const bHasTrades = b.trades && b.trades.length > 0;
        const aHasAvatar = a.avatar_url && !a.avatar_url.includes('logo.svg');
        const bHasAvatar = b.avatar_url && !b.avatar_url.includes('logo.svg');

        // Priority 1: Has trades vs No trades
        if (aHasTrades !== bHasTrades) {
          return aHasTrades ? -1 : 1;
        }
        // Priority 2: Has custom avatar vs No custom avatar
        if (aHasAvatar !== bHasAvatar) {
          return aHasAvatar ? -1 : 1;
        }
        // Fallback: Higher rating first
        return (b.rating || 0) - (a.rating || 0);
      });

      // 4. Apply client-side filtering for better multi-token relevance
      let filteredResults = workersWithTrades;
      
      if (searchQuery.trim()) {
        const tokens = normalizeSearchTerm(searchQuery).split(/\s+/).filter(Boolean);
        const phoneDigits = searchQuery.replace(/\D+/g, '');

        const tokenMatchesWorker = (w: any, token: string) => {
          const inBasic = (
            (w.name && w.name.toLowerCase().includes(token)) ||
            (w.bio && w.bio.toLowerCase().includes(token)) ||
            (w.address && w.address.toLowerCase().includes(token))
          );
          const inTrades = Array.isArray(w.trades) && w.trades.some((t: any) => {
            const name = typeof t === 'string' ? t : t?.name;
            return name && String(name).toLowerCase().includes(token);
          });
          return inBasic || inTrades;
        };

        const matchesPhone = (w: any, digits: string) => {
          if (!digits || digits.length < 4) return false;
          const wDigits = String(w.phone || '').replace(/\D+/g, '');
          return wDigits.includes(digits);
        };

        const searchFiltered = filteredResults.filter(w => {
          const allTokensMatch = tokens.every(t => tokenMatchesWorker(w, t));
          const phoneOk = phoneDigits.length >= 4 ? matchesPhone(w, phoneDigits) : true;
          return allTokensMatch && phoneOk;
        });

        // If filtering removed all results, keep original to avoid empty pages
        if (searchFiltered.length > 0) {
          filteredResults = searchFiltered;
        }
      }
      
      // Apply additional filters (these are applied after search to maintain consistency)
      if (verifiedOnly) {
        filteredResults = filteredResults.filter((w: any) => w.is_verified);
      }
      if (minRating != null) {
        filteredResults = filteredResults.filter((w: any) => Number(w.rating || 0) >= minRating);
      }
      if (selectedCategories.size > 0) {
        filteredResults = filteredResults.filter((worker: any) => {
          if (!worker.trades || worker.trades.length === 0) return false;
          return worker.trades.some((t: any) => {
            const category = t.category || 'Altele';
            return selectedCategories.has(String(category));
          });
        });
      }

      // Update meseriași based on if it's load more or initial load
      if (isLoadMore) {
        setMeserias(prev => {
          const existingIds = new Set(prev.map(m => m.id));
          const uniqueNewMeserias = filteredResults.filter(m => !existingIds.has(m.id));
          return [...prev, ...uniqueNewMeserias];
        });
      } else {
        setMeserias(filteredResults);
      }

      // Update pagination state
      const hasNextPage = (count || 0) > from + data.length;
      setHasNextPage(hasNextPage);
      setPage(pageParam);
    } catch (err) {
      console.error('Error fetching meseriași:', err);
      setError('Eroare la încărcarea meseriașilor');
      Alert.alert('Eroare', 'Nu s-au putut încărca meseriașii');
    } finally {
      if (isLoadMore) {
        setLoadingMore(false);
      } else {
        setLoading(false);
      }
    }
  };

  // Load available categories from trades table (unique list)
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('trades')
          .select('category')
          .not('category', 'is', null);
        if (!error && data) {
          const set = new Set<string>();
          data.forEach((row: any) => { if (row.category) set.add(row.category); });
          setAllCategories(Array.from(set).sort());
        }
      } catch (e) {
        // ignore
      }
    };
    loadCategories();
  }, []);

  // Fetch meseriași on component mount and when search changes
  useEffect(() => {
    setPage(0);
    setHasNextPage(true);
    fetchMeserias(0, false);
  }, [searchQuery]);
  
  // Reset pagination when filters change
  useEffect(() => {
    if (meserias.length > 0) {
      setPage(0);
    }
  }, [verifiedOnly, minRating, selectedCategories]);

  // Load more function
  const loadMore = () => {
    if (!loadingMore && hasNextPage && filteredMeserias.length > 0) {
      fetchMeserias(page + 1, true);
    }
  };

  // Filter meseriași based on search query and filters
  const filteredMeserias = useMemo(() => {
    let filtered = applySearchFilter(meserias);
    filtered = applyFilters(filtered);
    return filtered;
  }, [meserias, searchQuery, verifiedOnly, minRating, selectedCategories, applySearchFilter, applyFilters]);

  const renderWorkerCard = useCallback(({ item: meserias }: { item: any }) => (
    <MeseriasCard 
      key={meserias.id}
      meserias={meserias}
      onPress={() => navigation.navigate('MeseriasProfile', { meseriasId: meserias.id, meseriasData: meserias })}
    />
  ), [navigation]);

  const keyExtractor = useCallback((item: any) => item.id, []);

  const ListHeader = useMemo(() => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {user?.userType === 'meserias' ? 'Meseriași în zona ta' : 'Meșteșugari în zona ta'}
      </Text>
    </View>
  ), [user?.userType]);

  return (
    // Apply bottom safe area globally; handle top safe area on the header itself
    <Screen edges={['bottom']} backgroundColor={theme.colors.background.secondary}>
      <Animated.View 
        style={[
          styles.header,
          { 
            backgroundColor: theme.colors.primary[500], 
            paddingTop: insets.top + 24,
            opacity: fadeAnimation,
            transform: [{ translateY: slideAnimation }]
          }
        ]}
      >
        <Text style={[styles.title, { color: theme.colors.text.inverse }]}>
          {user?.userType === 'meserias' ? 'Alți meseriași' : 'Căutare meșteșugari'}
        </Text>
        {!hideSearch && (
          <Animated.View 
            style={{ 
              flexDirection: 'row', 
              alignItems: 'center', 
              gap: 16,
              opacity: fadeAnimation,
              transform: [{ translateY: slideAnimation }]
            }}
          >
            <View style={{ flex: 1 }}>
              <Input
                variant="search"
                placeholder="Căutați după nume sau serviciu..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                containerStyle={styles.searchbar}
              />
            </View>
            <TouchableOpacity
              style={[styles.filterButton, { backgroundColor: 'rgba(255, 255, 255, 0.15)', borderColor: 'rgba(255, 255, 255, 0.3)' }]}
              activeOpacity={0.8}
              onPress={() => {
                setFiltersOpen(true);
                Animated.timing(sheetAnim, { toValue: 1, duration: 250, easing: Easing.out(Easing.ease), useNativeDriver: true }).start();
              }}
            >
              <Text style={[styles.filterIcon, { color: theme.colors.text.inverse }]}>⚙️</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </Animated.View>
      {loading ? (
        <View style={styles.section}>
          <SkeletonList itemCount={5} itemHeight={120} showAvatar showTitle showSubtitle />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button title="Încearcă din nou" onPress={() => fetchMeserias(0, false)} style={styles.retryButton} />
        </View>
      ) : (
        <FlatList
          data={filteredMeserias}
          keyExtractor={keyExtractor}
          renderItem={renderWorkerCard}
          ListHeaderComponent={ListHeader}
          contentContainerStyle={{ paddingBottom: 24 }}
          onEndReached={loadMore}
          onEndReachedThreshold={0.2}
          ListFooterComponent={loadingMore ? (
            <View style={styles.loadingMoreContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.loadingMoreText}>Se încarcă mai mulți meseriași...</Text>
            </View>
          ) : null}
        />
      )}

      <FilterSheet
        visible={filtersOpen}
        onClose={() => {
          Animated.timing(sheetAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => setFiltersOpen(false));
        }}
        sheetAnim={sheetAnim}
        verifiedOnly={verifiedOnly}
        setVerifiedOnly={setVerifiedOnly}
        minRating={minRating}
        setMinRating={setMinRating}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        allCategories={allCategories}
        onApplyFilters={() => {
          Animated.timing(sheetAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => setFiltersOpen(false));
        }}
        onResetFilters={resetFilters}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
    backgroundColor: '#fff', // Added for shadow optimization
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 24,
    letterSpacing: -0.5,
  },
  searchbar: {
    marginTop: 8,
  },
  filterButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: '#fff', // Added for shadow optimization
  },
  filterIcon: { fontSize: 20 },
  searchInput: {
    fontSize: 16,
    padding: 0,
    margin: 0,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
    marginLeft: 4,
  },
  // categories section removed; using filter sheet instead
  meseriasCard: {
    marginBottom: 20,
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 6,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  avatarLarge: { width: 76, height: 76, borderRadius: 20 },
  avatarLargeFallback: { justifyContent: 'center', alignItems: 'center' },
  avatarLargeText: { color: '#fff', fontSize: 30, fontWeight: '800' },
  meseriasNameLarge: { fontSize: 24, fontWeight: '800' },
  verifiedPill: {
    marginTop: 8,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  verifiedIcon: { color: '#059669', fontSize: 14 },
  verifiedText: { color: '#065F46', fontWeight: '700', fontSize: 12, letterSpacing: 0.3 },
  addressPill: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  addressIcon: { fontSize: 12, marginRight: 6 },
  addressText: { fontSize: 13, color: '#0f172a', fontWeight: '600' },
  bioBubble: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  bioText: { fontSize: 14, color: '#0f172a' },
  meseriasHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  meseriasFooter: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  meseriasMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  meseriasInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  meseriasAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
  },
  avatarFallback: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  meseriasDetails: {
    flex: 1,
  },
  meseriasNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  meseriasName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginRight: 8,
  },
  verifiedDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#10B981' },
  tradeChipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 6 },
  tradeChip: { backgroundColor: '#EEF2FF', borderWidth: 1, borderColor: '#C7D2FE', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  tradeChipText: { fontSize: 13, color: '#1e293b', fontWeight: '600' },
  tradeChipExtra: { backgroundColor: '#E2E8F0', borderColor: '#CBD5E1' },
  ctaColumn: { marginTop: 16, gap: 14 },
  meseriasCategory: {
    fontSize: 14,
    color: colors.primary,
    marginBottom: 4,
  },
  meseriasBio: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
    lineHeight: 16,
  },
  meseriasRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 14,
    color: colors.text,
    marginRight: 4,
  },
  reviewCount: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  meseriasLocation: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  viewProfileButton: {
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 100,
  },
  viewProfileText: {
    fontSize: 14,
    fontWeight: '700',
  },
  loadingMoreContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  loadingMoreText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.25)' },
  sheet: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 16 },
  sheetHandle: { width: 40, height: 4, backgroundColor: '#CBD5E1', borderRadius: 2, alignSelf: 'center', marginBottom: 12 },
  sheetTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a', marginBottom: 8 },
  sheetLabel: { fontSize: 14, fontWeight: '700', color: '#0f172a' },
  sheetRowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  toggle: { width: 46, height: 28, borderRadius: 14, backgroundColor: '#E2E8F0', padding: 2, justifyContent: 'center' },
  toggleOn: { backgroundColor: '#A7F3D0' },
  knob: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#fff', transform: [{ translateX: 0 }] },
  knobOn: { transform: [{ translateX: 18 }] },
  segmentRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  segment: { flexGrow: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: '#F1F5F9', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  segmentActive: { backgroundColor: '#EEF2FF', borderColor: '#C7D2FE' },
  segmentText: { fontSize: 14, fontWeight: '700', color: '#0f172a' },
  segmentTextActive: { color: '#1d4ed8' },
  sheetChipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  sheetChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0' },
  sheetChipActive: { backgroundColor: '#EEF2FF', borderColor: '#C7D2FE' },
  sheetChipText: { fontSize: 13, color: '#0f172a', fontWeight: '600' },
  sheetChipTextActive: { color: '#1d4ed8' },
});

export default SearchScreen;
