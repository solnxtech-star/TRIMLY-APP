import { useEffect, useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Image, Modal, FlatList, Platform, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import { FontSizes } from '@/constants/theme';
import salonService from '@/services/salonService';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Theme colors
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({light: '#1a1a1a', dark: '#f5f5f5'}, 'text');
  const cardBackgroundColor = useThemeColor({ light: '#f5f5f5', dark: '#1a1a1a' }, 'background');
  const iconColor = useThemeColor({light: '#1a1a1a', dark: '#f5f5f5'}, 'text');

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };

  useEffect(() => {
    const performSearch = async () => {
      const trimmed = searchQuery.trim();
      if (!trimmed) {
        setResults([]);
        return;
      }

      try {
        setIsLoading(true);
        const response = await salonService.searchMarketplace({
          query: trimmed,
        });
        setResults(response.results || []);
      } catch (err) {
        console.error('❌ [SEARCH BAR] Search failed:', err);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(performSearch, 400);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleCloseModal = () => {
    setSearchQuery('');
    setResults([]);
  };

  const hasQuery = !!searchQuery.trim();

  const renderSearchInput = (autoFocus = false) => (
    <View style={styles.container}>
      <IconSymbol name="magnifyingglass" size={20} color="#6B6B6B" style={styles.searchIcon} />
      <TextInput
        style={styles.input}
        placeholder="Find barber or salon"
        placeholderTextColor="#6B6B6B"
        value={searchQuery}
        onChangeText={handleSearchChange}
        autoFocus={autoFocus}
      />
    </View>
  );

  return (
    <View style={styles.wrapper}>
      {/* Search Input - Outside Modal when no query */}
      {!hasQuery && renderSearchInput()}

      <Modal
        visible={hasQuery}
        transparent
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          {/* Background overlay to close search */}
          <TouchableOpacity
            activeOpacity={1}
            style={styles.modalBackground}
            onPress={handleCloseModal}
          />
          
          {/* Search Input - Inside Modal so it remains interactive */}
          <View style={styles.modalContent}>
            {renderSearchInput(true)}

            <View style={styles.resultsContainer}>
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#2D8A47" />
                  <ThemedText style={styles.loadingText}>Searching...</ThemedText>
                </View>
              ) : results.length === 0 ? (
                <ThemedText style={styles.emptyText}>No results found</ThemedText>
              ) : (
                <FlatList
                  data={results}
                  keyExtractor={(item) => String(item.id)}
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={styles.resultsListContent}
                  renderItem={({ item }) => (
                    <TouchableOpacity 
                      style={[
                        {backgroundColor: cardBackgroundColor},
                        styles.salonCard
                      ]}
                      onPress={() => {
                        // Following salons.tsx navigation style
                        router.push({
                          pathname: '/client/business-details/[id]',
                          params: { id: item.id, type: item.type }
                        });
                        handleCloseModal();
                      }}
                    >
                      <View style={styles.cardContent}>
                        {item.gallery && item.gallery.length > 0 ? (
                          <Image source={{ uri: item.gallery[0].image }} style={styles.salonImage} />
                        ) : (
                          <Image
                            source={require('@/assets/stock/service.jpg')}
                            style={styles.salonImage}
                          />
                        )}
                        <View style={styles.infoSection}>
                          <View style={styles.nameRow}>
                            <ThemedText style={[styles.salonName, { color: textColor }]} numberOfLines={1}>
                              {item.display_name || item.worker}
                            </ThemedText>
                            <View style={styles.statusBadge}>
                              <ThemedText style={[styles.statusText, { color: '#2D8659' }]}>Open</ThemedText>
                            </View>
                          </View>
                          
                          <View style={styles.ratingRow}>
                            <IconSymbol name="star" size={16} color="#FFC107" />
                            <ThemedText style={[styles.ratingText, { color: textColor }]}>
                              {item.rating || 0}
                            </ThemedText>
                            <ThemedText style={[styles.reviewText, { color: textColor }]}>
                              ({item.review_count || 0} Reviews)
                            </ThemedText>
                          </View>
                          
                          <ThemedText style={[styles.servicesText, { color: textColor }]} numberOfLines={1}>
                            {item.services && item.services.length > 0
                              ? item.services.slice(0, 3).map((s: any) => s.name).join(' . ')
                              : 'Services available'}
                          </ThemedText>
                          
                          <View style={styles.bottomRow}>
                            <ThemedText style={[styles.priceText, { color: '#2D8659' }]}>
                              {item.services && item.services.length > 0
                                ? `₦${Math.min(...item.services.map((s: any) => Number(s.price)))} - ₦${Math.max(...item.services.map((s: any) => Number(s.price)))}`
                                : 'Contact for pricing'}
                            </ThemedText>
                            <View style={styles.locationRow}>
                              <IconSymbol name="location" size={14} color={iconColor} />
                              <ThemedText style={[styles.distanceText, { color: textColor }]} numberOfLines={1}>
                                {item.location}
                              </ThemedText>
                            </View>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )}
                />
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    zIndex: 100,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 26,
    height: 52,
    marginHorizontal: 16,
    marginTop: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  searchIcon: {
    marginLeft: 16,
  },
  input: {
    flex: 1,
    fontSize: FontSizes.md, // 14
    color: '#000000',
    paddingLeft: 8,
  },
  modalOverlay: {
    flex: 1,
  },
  modalBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContent: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 40 : 20, // Adjust for status bar
  },
  resultsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginHorizontal: 16,
    marginTop: 10,
    maxHeight: '80%',
  },
  resultsListContent: {
    paddingBottom: 10,
  },
  salonCard: {
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },
  cardContent: {
    flexDirection: 'row',
  },
  salonImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 12,
  },
  infoSection: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  salonName: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusBadge: {
    width: 50,
    height: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2D8659',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 9,
    fontWeight: '600',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 4,
    marginRight: 4,
  },
  reviewText: {
    fontSize: 11,
    fontWeight: '400',
    color: '#6B6B6B',
  },
  servicesText: {
    fontSize: 11,
    fontWeight: '400',
    color: '#6B6B6B',
    marginBottom: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2D8659',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceText: {
    fontSize: 11,
    fontWeight: '400',
    color: '#6B6B6B',
    marginLeft: 4,
  },
  loadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: FontSizes.md,
    color: '#6B7280',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: FontSizes.md,
    marginVertical: 12,
    color: '#6B7280',
  },
});
