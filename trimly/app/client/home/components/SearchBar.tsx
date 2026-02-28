import { useEffect, useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Image, Modal, FlatList, Platform } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import { FontSizes } from '@/constants/theme';
import salonService from '@/services/salonService';
import { ServiceCategory } from '@/types/salon.types';

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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
      } catch {
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
                <ThemedText style={styles.loadingText}>Searching...</ThemedText>
              ) : results.length === 0 ? (
                <ThemedText style={styles.emptyText}>No results found</ThemedText>
              ) : (
                <FlatList
                  data={results}
                  keyExtractor={(item) => String(item.id)}
                  keyboardShouldPersistTaps="handled"
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.card}
                      onPress={() => {
                        // Determine type if available in search result
                        const itemType = item.type || (item.worker ? 'vendor' : 'salon');
                        router.push({
                          pathname: `/client/business-details/${item.id}`,
                          params: { type: itemType }
                        });
                        handleCloseModal();
                      }}
                    >
                      <Image 
                        source={require('@/assets/stock/service.jpg')} 
                        style={styles.cardBackground}
                        resizeMode="cover"
                      />
                      <View style={styles.overlay}>
                        <ThemedText style={styles.comingSoonText}>
                          {item.display_name || searchQuery}
                        </ThemedText>
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
  card: {
    width: '100%',
    height: 160,
    borderRadius: 16,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 10,
  },
  cardBackground: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  comingSoonText: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: FontSizes.md,
    marginVertical: 8,
    color: '#111827',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: FontSizes.md,
    marginVertical: 8,
    color: '#6B7280',
  },
});
//   card: {
//     width: '100%',
//     height: 160,
//     borderRadius: 16,
//     position: 'relative',
//     overflow: 'hidden',
//     marginBottom: 10,
//   },
//   cardBackground: {
//     width: '100%',
//     height: '100%',
//     borderRadius: 16,
//   },
//   overlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 1,
//   },
//   comingSoonText: {
//     fontSize: FontSizes.lg,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//   },
//   heartIconBackground: {
//     position: 'absolute',
//     top: 12,
//     right: 12,
//     backgroundColor: 'rgba(255, 255, 255, 0.3)',
//     borderRadius: 15,
//     width: 30,
//     height: 30,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   heartIcon: {
//     // Positioning handled by parent container
//   },
//   textOverlay: {
//     position: 'absolute',
//     bottom: 12,
//     left: 12,
//   },
//   salonName: {
//     fontSize: FontSizes.md, // 14
//     fontWeight: '700',
//     color: '#FFFFFF',
//   },
//   modalOverlay: {
//     flex: 1,
//     justifyContent: 'flex-start',
//   },
//   modalBackground: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.4)',
//     marginTop: 120,
//     paddingTop: 16,
//     paddingHorizontal: 16,
//     justifyContent: 'flex-start',
//   },
//   loadingText: {
//     textAlign: 'center',
//     fontSize: FontSizes.md,
//     marginVertical: 8,
//     color: '#111827',
//   },
//   emptyText: {
//     textAlign: 'center',
//     fontSize: FontSizes.md,
//     marginVertical: 8,
//     color: '#6B7280',
//   },
// });
