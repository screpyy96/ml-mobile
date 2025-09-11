import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Alert, Image, TouchableOpacity, TextInput, Text, FlatList, Linking, Modal, Pressable, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors } from '../../constants/colors';
import { categories } from '../../constants/categories';
import { supabase } from '../../config/supabase';
import { useTheme, Button, Input, SkeletonList, Avatar } from '../../design-system';
import { SearchStackParamList } from '../../navigation/MainNavigator';
import { useAuth } from '../../context/AuthContext';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [meserias, setMeserias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(true);
  const PAGE_SIZE = 10;
  
  // Filter sheet state
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [selectedCats, setSelectedCats] = useState<Set<string>>(new Set());
  const sheetAnim = useState(new Animated.Value(0))[0];
  
  // Check if search should be hidden (when accessed from drawer)
  // For now, always show search - we'll handle drawer navigation differently
  const hideSearch = false;

  // Fetch meseriași from database
  const fetchMeserias = async (pageParam = 0, isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);

      // Base query - similar cu website-ul
      let query = supabase
        .from('profiles')
        .select('id, name, email, bio, address, avatar_url, rating, is_verified, is_pro, phone', { count: 'exact' })
        .eq('role', 'worker')
        .eq('is_verified', true);

      // Apply search term filter (tokenized across multiple fields)
      if (searchQuery.trim()) {
        // Normalize natural phrases like "caut zugrav in suceava" → "zugrav suceava"
        const raw = String(searchQuery)
          .trim()
          .replace(/^caut(\s+un|\s+o|\s+)/i, '')
          .replace(/^(găsește|gaseste|gasesc)(\s+)/i, '')
          .replace(/^vreau\s+să\s+caut\s+/i, '')
          .replace(/^vreau\s+sa\s+caut\s+/i, '')
          .replace(/\b(in|în)\b/gi, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        const tokens = raw.split(/\s+/).filter(Boolean);

        // If numeric-ish, also try direct phone match
        const phoneDigits = raw.replace(/\D+/g, '');
        if (phoneDigits.length >= 4) {
          query = query.or(`phone.ilike.%${phoneDigits}%`);
        }

        for (const token of tokens) {
          const safeToken = token.replace(/[,()]/g, '');
          query = query.or(
            `name.ilike.%${safeToken}%,bio.ilike.%${safeToken}%,address.ilike.%${safeToken}%,phone.ilike.%${safeToken}%,email.ilike.%${safeToken}%`
          );
        }
      }

      // Apply category filter if selected
      if (selectedCategory) {
        // We'll filter by trades after fetching
      }

      // Add order for consistent results
      query = query.order('created_at', { ascending: false });

      // Apply pagination
      const from = pageParam * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      query = query.range(from, to);

      const { data, error: fetchError, count } = await query;

      if (fetchError) {
        throw fetchError;
      }

      if (!data || data.length === 0) {
        setMeserias([]);
        return;
      }

      // --- Advanced Sorting Logic ---
      // 1. Get the IDs of workers on the current page who have trades.
      const workerIdsOnPage = data.map(d => d.id);
      
      const { data: tradesOnPage } = await supabase
        .from('worker_trades')
        .select('profile_id, trade_ids')
        .in('profile_id', workerIdsOnPage);
      
      // 2. Fetch trade details for all workers
      const allTradeIds = new Set();
      tradesOnPage?.forEach(wt => {
        if (wt.trade_ids && Array.isArray(wt.trade_ids)) {
          wt.trade_ids.forEach((id: number) => allTradeIds.add(id));
        }
      });

      const { data: tradeDetails } = await supabase
        .from('trades')
        .select('id, name, slug')
        .in('id', Array.from(allTradeIds));

      // Create a map of trade details
      const tradeMap = new Map();
      tradeDetails?.forEach(trade => {
        tradeMap.set(trade.id, trade);
      });

      // Add trades to each worker
      const workersWithTrades = data.map(worker => {
        const workerTrades = tradesOnPage?.find(wt => wt.profile_id === worker.id);
        
        const trades = workerTrades?.trade_ids?.map((tradeId: number) => {
          const trade = tradeMap.get(tradeId);
          if (!trade) {
            return null;
          }
          return trade;
        }).filter(Boolean) || [];
        
        // Fallback: if no trades attached, infer up to 3 keywords from bio
        let enrichedTrades = trades;
        if (enrichedTrades.length === 0 && worker.bio) {
          const bio = String(worker.bio).toLowerCase();
          const inferred: { id: number; name: string; slug: string }[] = [];
          const candidates = [
            { name: 'electrician', slug: 'electrician' },
            { name: 'instalator', slug: 'instalator' },
            { name: 'zugrav', slug: 'zugrav' },
            { name: 'parchet', slug: 'parchet' },
            { name: 'glet', slug: 'glet' },
            { name: 'faianță', slug: 'faianta' },
            { name: 'faianta', slug: 'faianta' },
            { name: 'gresie', slug: 'gresie' },
            { name: 'tâmplar', slug: 'tamplar' },
            { name: 'tamplar', slug: 'tamplar' },
            { name: 'zugrăvit', slug: 'zugravit' },
            { name: 'zugravit', slug: 'zugravit' },
          ];
          for (const c of candidates) {
            if (bio.includes(c.name) && inferred.length < 3) {
              inferred.push({ id: -1, name: c.name, slug: c.slug });
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

      // 4. Apply category filter if selected
      let filteredResults = workersWithTrades;
      if (selectedCategory) {
        filteredResults = workersWithTrades.filter(worker => {
          return worker.trades?.some((trade: any) => 
            trade.name?.toLowerCase().includes(selectedCategory.toLowerCase())
          );
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
      const hasNextPage = (count || 0) > from + (data?.length || 0);
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

  // Fetch meseriași on component mount and when filters change
  useEffect(() => {
    setPage(0);
    setHasNextPage(true);
    fetchMeserias(0, false);
  }, [selectedCategory, searchQuery]);

  // Load more function
  const loadMore = () => {
    if (!loadingMore && hasNextPage) {
      fetchMeserias(page + 1, true);
    }
  };

  // Filter meseriași based on search query (client-side filtering for better relevance)
  const filteredMeserias = meserias.filter(meserias => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    const trades = meserias.trades?.map((trade: any) => trade.name).join(' ') || '';
    
    return (
      meserias.name?.toLowerCase().includes(query) ||
      trades.toLowerCase().includes(query) ||
      meserias.address?.toLowerCase().includes(query) ||
      meserias.bio?.toLowerCase().includes(query) ||
      meserias.phone?.toLowerCase().includes(query)
    );
  }).filter(m => {
    // Apply advanced filters (client-side)
    if (verifiedOnly && !m.is_verified) return false;
    if (minRating != null && Number(m.rating || 0) < minRating) return false;
    if (selectedCats.size > 0) {
      const tradeIds = (m.trades || []).map((t: any) => String(t.id));
      const intersects = tradeIds.some((id: string) => selectedCats.has(id));
      if (!intersects) return false;
    }
    return true;
  });

  const renderTradeChips = (trades: any[] = []) => {
    if (!trades || trades.length === 0) return null;
    const visible = trades.slice(0, 3);
    const extra = trades.length - visible.length;
    return (
      <View style={styles.tradeChipsRow}>
        {visible.map((t: any) => (
          <View key={t.id || t.name} style={styles.tradeChip}>
            <Text style={styles.tradeChipText}>{t.name}</Text>
          </View>
        ))}
        {extra > 0 && (
          <View style={[styles.tradeChip, styles.tradeChipExtra]}>
            <Text style={[styles.tradeChipText, { color: '#0f172a' }]}>+{extra}</Text>
          </View>
        )}
      </View>
    );
  };

  const renderWorkerCard = useCallback(({ item: m }: { item: any }) => (
    <TouchableOpacity 
      key={m.id}
      style={[styles.meseriasCard, { backgroundColor: theme.colors.background.primary }]}
      activeOpacity={0.85}
      onPress={() => navigation.navigate('MeseriasProfile', { meseriasId: m.id, meseriasData: m })}
    >
      {/* Header: Avatar mare + Nume + badge verificat */}
      <View style={styles.headerRow}>
        {m.avatar_url ? (
          <Image source={{ uri: m.avatar_url }} style={styles.avatarLarge} />
        ) : (
          <View style={[styles.avatarLarge, styles.avatarLargeFallback, { backgroundColor: theme.colors.primary[500] }]}>
            <Text style={styles.avatarLargeText}>{m.name?.charAt(0)?.toUpperCase() || 'M'}</Text>
          </View>
        )}
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={[styles.meseriasNameLarge, { color: theme.colors.text.primary }]} numberOfLines={1}>
            {m.name || 'Meseriaș'}
          </Text>
          {m.is_verified && (
            <View style={styles.verifiedPill}>
              <Text style={styles.verifiedIcon}>✔︎</Text>
              <Text style={styles.verifiedText}>VERIFICAT</Text>
            </View>
          )}
        </View>
      </View>

      {/* Address pill */}
      {m.address ? (
        <View style={styles.addressPill}>
          <Text style={styles.addressIcon}>📍</Text>
          <Text style={styles.addressText} numberOfLines={1}>{m.address}</Text>
        </View>
      ) : null}

      {/* Bio bubble */}
      {m.bio ? (
        <View style={styles.bioBubble}>
          <Text style={styles.bioText} numberOfLines={3}>{m.bio}</Text>
        </View>
      ) : null}

      {/* Trades chips */}
      {renderTradeChips(m.trades)}

      {/* Footer: Meta (rating, recenzii, locație) + Vezi profil */}
      <View style={styles.meseriasFooter}>
        <View style={styles.meseriasMetaRow}>
          <Text style={[styles.ratingText, { color: theme.colors.text.primary }]}>
            ⭐ {m.rating ? Number(m.rating).toFixed(1) : '4.5'}
          </Text>
          <Text style={[styles.reviewCount, { color: theme.colors.text.secondary }]}>• 0 recenzii</Text>
          <Text style={[styles.meseriasLocation, { color: theme.colors.text.secondary }]}>• 📍 {m.address || 'București'}</Text>
        </View>
      </View>

      {/* CTA buttons full-width */}
      <View style={styles.ctaColumn}>
        <Button
          title="Vezi Profilul"
          fullWidth
          size="large"
          onPress={() => navigation.navigate('MeseriasProfile', { meseriasId: m.id, meseriasData: m })}
          style={{ backgroundColor: '#0F172A', borderRadius: 20 }}
          textStyle={{ color: '#fff', fontWeight: '700' }}
        />
        <Button
          title="Sună Acum"
          fullWidth
          size="large"
          leftIcon="phone"
          onPress={() => m.phone && Linking.openURL(`tel:${m.phone}`)}
          style={{ backgroundColor: theme.colors.accent.green, borderRadius: 20 }}
          textStyle={{ color: '#fff', fontWeight: '700' }}
        />
      </View>
    </TouchableOpacity>
  ), [navigation, theme.colors]);

  const keyExtractor = useCallback((item: any) => item.id, []);

  const ListHeader = useMemo(() => (
    <>
      {!hideSearch && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Categorii</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContainer}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryChip,
                  selectedCategory === category.id 
                    ? { backgroundColor: theme.colors.primary[500], borderColor: theme.colors.primary[500] }
                    : { backgroundColor: theme.colors.background.primary, borderColor: 'rgba(0,0,0,0.1)' }
                ]}
                onPress={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.categoryChipText,
                  { color: selectedCategory === category.id ? '#ffffff' : theme.colors.text.primary }
                ]}>
                  {category.icon} {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {user?.userType === 'meserias' ? 'Meseriași în zona ta' : 'Meșteșugari în zona ta'}
        </Text>
      </View>
    </>
  ), [hideSearch, selectedCategory, theme.colors, user?.userType]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.secondary }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.background.primary }]}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          {user?.userType === 'meserias' ? 'Alți meseriași' : 'Căutare meșteșugari'}
        </Text>
        {!hideSearch && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
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
              style={styles.filterButton}
              activeOpacity={0.8}
              onPress={() => {
                setFiltersOpen(true);
                Animated.timing(sheetAnim, { toValue: 1, duration: 250, easing: Easing.out(Easing.ease), useNativeDriver: true }).start();
              }}
            >
              <Text style={styles.filterIcon}>⚙️</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
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

      {/* Filter Bottom Sheet */}
      <Modal visible={filtersOpen} transparent animationType="none" onRequestClose={() => setFiltersOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => {
          Animated.timing(sheetAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => setFiltersOpen(false));
        }} />
        <Animated.View style={[styles.sheet, { transform: [{ translateY: sheetAnim.interpolate({ inputRange: [0,1], outputRange: [400,0] }) }] }]}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>Filtrează rezultate</Text>

          {/* Verified toggle */}
          <View style={styles.sheetRowBetween}>
            <Text style={styles.sheetLabel}>Doar verificate</Text>
            <TouchableOpacity
              onPress={() => setVerifiedOnly(v => !v)}
              style={[styles.toggle, verifiedOnly && styles.toggleOn]}
              activeOpacity={0.8}
            >
              <View style={[styles.knob, verifiedOnly && styles.knobOn]} />
            </TouchableOpacity>
          </View>

          {/* Min rating */}
          <Text style={[styles.sheetLabel, { marginTop: 12 }]}>Rating minim</Text>
          <View style={styles.segmentRow}>
            {[3, 4, 4.5].map(r => (
              <TouchableOpacity key={r} onPress={() => setMinRating(minRating === r ? null : r)} activeOpacity={0.8}
                style={[styles.segment, minRating === r && styles.segmentActive]}
              >
                <Text style={[styles.segmentText, minRating === r && styles.segmentTextActive]}>⭐ {r}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Categories multi-select */}
          <Text style={[styles.sheetLabel, { marginTop: 12 }]}>Categorii</Text>
          <View style={styles.sheetChipsWrap}>
            {categories.map(cat => {
              const selected = selectedCats.has(cat.id);
              return (
                <TouchableOpacity key={cat.id} onPress={() => {
                  setSelectedCats(prev => {
                    const next = new Set(prev);
                    if (selected) next.delete(cat.id); else next.add(cat.id);
                    return next;
                  });
                }} style={[styles.sheetChip, selected && styles.sheetChipActive]} activeOpacity={0.8}>
                  <Text style={[styles.sheetChipText, selected && styles.sheetChipTextActive]}>{cat.icon} {cat.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Actions */}
          <View style={{ marginTop: 8, gap: 10 }}>
            <Button title="Aplică filtre" fullWidth size="large" onPress={() => {
              Animated.timing(sheetAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => setFiltersOpen(false));
            }} />
            <Button title="Resetează" fullWidth size="large" variant="outline" onPress={() => {
              setVerifiedOnly(false); setMinRating(null); setSelectedCats(new Set()); setSelectedCategory(null);
            }} />
          </View>
        </Animated.View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 24,
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 24,
    letterSpacing: -0.5,
  },
  searchbar: {
    marginTop: 8,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#C7D2FE'
  },
  filterIcon: { fontSize: 18 },
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
  categoriesContainer: {
    flexDirection: 'row',
  },
  categoryChip: {
    marginRight: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    minWidth: 100,
    alignItems: 'center',
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  meseriasCard: {
    marginBottom: 20,
    marginHorizontal: 16,
    borderRadius: 24,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatarLarge: { width: 72, height: 72, borderRadius: 16 },
  avatarLargeFallback: { justifyContent: 'center', alignItems: 'center' },
  avatarLargeText: { color: '#fff', fontSize: 28, fontWeight: '800' },
  meseriasNameLarge: { fontSize: 22, fontWeight: '800' },
  verifiedPill: {
    marginTop: 6,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0'
  },
  verifiedIcon: { color: '#059669', fontSize: 14 },
  verifiedText: { color: '#065F46', fontWeight: '700', fontSize: 12, letterSpacing: 0.3 },
  addressPill: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  addressIcon: { fontSize: 12, marginRight: 6 },
  addressText: { fontSize: 13, color: '#0f172a', fontWeight: '600' },
  bioBubble: {
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0'
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
  tradeChip: { backgroundColor: '#EEF2FF', borderWidth: 1, borderColor: '#C7D2FE', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16 },
  tradeChipText: { fontSize: 13, color: '#1e293b', fontWeight: '600' },
  tradeChipExtra: { backgroundColor: '#E2E8F0', borderColor: '#CBD5E1' },
  ctaColumn: { marginTop: 12, gap: 12 },
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
