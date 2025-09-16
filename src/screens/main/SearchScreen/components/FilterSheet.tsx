import React from 'react';
import { View, Text, TouchableOpacity, Animated, Modal, Pressable } from 'react-native';
import { Button } from '../../../../design-system';

interface FilterSheetProps {
  visible: boolean;
  onClose: () => void;
  sheetAnim: Animated.Value;
  
  // Filter state
  verifiedOnly: boolean;
  setVerifiedOnly: (value: boolean) => void;
  minRating: number | null;
  setMinRating: (value: number | null) => void;
  selectedCategories: Set<string>;
  setSelectedCategories: (value: Set<string> | ((prev: Set<string>) => Set<string>)) => void;
  allCategories: string[];
  
  // Actions
  onApplyFilters: () => void;
  onResetFilters: () => void;
}

export const FilterSheet: React.FC<FilterSheetProps> = ({
  visible,
  onClose,
  sheetAnim,
  verifiedOnly,
  setVerifiedOnly,
  minRating,
  setMinRating,
  selectedCategories,
  setSelectedCategories,
  allCategories,
  onApplyFilters,
  onResetFilters,
}) => {
  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <Animated.View style={[styles.sheet, { 
        transform: [{ 
          translateY: sheetAnim.interpolate({ 
            inputRange: [0, 1], 
            outputRange: [400, 0] 
          }) 
        }] 
      }]}>
        <View style={styles.sheetHandle} />
        <Text style={styles.sheetTitle}>Filtrează rezultate</Text>

        {/* Verified toggle */}
        <View style={styles.sheetRowBetween}>
          <Text style={styles.sheetLabel}>Doar verificate</Text>
          <TouchableOpacity
            onPress={() => setVerifiedOnly(!verifiedOnly)}
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
            <TouchableOpacity 
              key={r} 
              onPress={() => setMinRating(minRating === r ? null : r)} 
              activeOpacity={0.8}
              style={[styles.segment, minRating === r && styles.segmentActive]}
            >
              <Text style={[styles.segmentText, minRating === r && styles.segmentTextActive]}>
                ⭐ {r}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Categories multi-select */}
        <Text style={[styles.sheetLabel, { marginTop: 12 }]}>Categorii</Text>
        <View style={styles.sheetChipsWrap}>
          {allCategories.map(catName => {
            const selected = selectedCategories.has(catName);
            return (
              <TouchableOpacity 
                key={catName} 
                onPress={() => {
                  setSelectedCategories((prev: Set<string>) => {
                    const next = new Set(prev);
                    if (selected) {
                      next.delete(catName);
                    } else {
                      next.add(catName);
                    }
                    return next;
                  });
                }} 
                style={[styles.sheetChip, selected && styles.sheetChipActive]} 
                activeOpacity={0.8}
              >
                <Text style={[styles.sheetChipText, selected && styles.sheetChipTextActive]}>
                  {catName}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <Button 
            title="Aplică filtre" 
            fullWidth 
            size="large" 
            onPress={onApplyFilters}
          />
          <Button 
            title="Resetează" 
            fullWidth 
            size="large" 
            variant="outline" 
            onPress={onResetFilters}
          />
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = {
  backdrop: { 
    position: 'absolute' as const, 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    backgroundColor: 'rgba(0,0,0,0.25)' 
  },
  sheet: { 
    position: 'absolute' as const, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    backgroundColor: '#fff', 
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20, 
    padding: 16 
  },
  sheetHandle: { 
    width: 40, 
    height: 4, 
    backgroundColor: '#CBD5E1', 
    borderRadius: 2, 
    alignSelf: 'center' as const, 
    marginBottom: 12 
  },
  sheetTitle: { 
    fontSize: 18, 
    fontWeight: '800' as const, 
    color: '#0f172a', 
    marginBottom: 8 
  },
  sheetLabel: { 
    fontSize: 14, 
    fontWeight: '700' as const, 
    color: '#0f172a' 
  },
  sheetRowBetween: { 
    flexDirection: 'row' as const, 
    alignItems: 'center' as const, 
    justifyContent: 'space-between' as const, 
    marginTop: 4 
  },
  toggle: { 
    width: 46, 
    height: 28, 
    borderRadius: 14, 
    backgroundColor: '#E2E8F0', 
    padding: 2, 
    justifyContent: 'center' as const 
  },
  toggleOn: { 
    backgroundColor: '#A7F3D0' 
  },
  knob: { 
    width: 24, 
    height: 24, 
    borderRadius: 12, 
    backgroundColor: '#fff', 
    transform: [{ translateX: 0 }] 
  },
  knobOn: { 
    transform: [{ translateX: 18 }] 
  },
  segmentRow: { 
    flexDirection: 'row' as const, 
    gap: 8, 
    marginTop: 8 
  },
  segment: { 
    flexGrow: 1, 
    paddingVertical: 10, 
    borderRadius: 10, 
    backgroundColor: '#F1F5F9', 
    alignItems: 'center' as const, 
    borderWidth: 1, 
    borderColor: '#E2E8F0' 
  },
  segmentActive: { 
    backgroundColor: '#EEF2FF', 
    borderColor: '#C7D2FE' 
  },
  segmentText: { 
    fontSize: 14, 
    fontWeight: '700' as const, 
    color: '#0f172a' 
  },
  segmentTextActive: { 
    color: '#1d4ed8' 
  },
  sheetChipsWrap: { 
    flexDirection: 'row' as const, 
    flexWrap: 'wrap' as const, 
    gap: 8, 
    marginTop: 8 
  },
  sheetChip: { 
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    borderRadius: 16, 
    backgroundColor: '#F1F5F9', 
    borderWidth: 1, 
    borderColor: '#E2E8F0' 
  },
  sheetChipActive: { 
    backgroundColor: '#EEF2FF', 
    borderColor: '#C7D2FE' 
  },
  sheetChipText: { 
    fontSize: 13, 
    color: '#0f172a', 
    fontWeight: '600' as const 
  },
  sheetChipTextActive: { 
    color: '#1d4ed8' 
  },
  actionsContainer: { 
    marginTop: 8, 
    gap: 10 
  },
};
