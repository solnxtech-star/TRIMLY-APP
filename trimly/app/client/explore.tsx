import { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, ActivityIndicator, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CustomSafeAreaView } from '@/components/custom-safe-area-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import { FontSizes } from '@/constants/theme';
import salonService from '@/services/salonService';
import { Salon } from '@/types/salon.types';

export default function ExploreScreen() {
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  const [selectedStore, setSelectedStore] = useState<Salon | null>(null);
  const [salons, setSalons] = useState<Salon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Lagos, Nigeria coordinates
  const [region, setRegion] = useState<Region>({
    latitude: 6.5244,
    longitude: 3.3792,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  // Get theme colors
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const cardBackgroundColor = useThemeColor({ light: '#f5f5f5', dark: '#1a1a1a' }, 'background');
  const borderColor = '#E5E7EB';
  
  // Fetch salons on component mount
  useEffect(() => {
    fetchSalons();
  }, []);
  
  const fetchSalons = async () => {
    try {
      setError(null);
      const response = await salonService.listSalons();
      
      console.log('=== SALONS DATA (Explore Screen) ===');
      console.log('Total salons loaded:', response.results.length);
      
      setSalons(response.results);
      
      // Update region to fit markers if salons exist
      if (response.results.length > 0) {
        const firstSalon = response.results[0];
        const lat = parseFloat(firstSalon.latitude);
        const lon = parseFloat(firstSalon.longitude);
        
        if (!isNaN(lat) && !isNaN(lon)) {
          setRegion(prev => ({
            ...prev,
            latitude: lat,
            longitude: lon,
          }));
        }
      }
    } catch (err: any) {
      console.error('Failed to fetch salons:', err);
      setError(err.message || 'Failed to load salons');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };
  
  const handleLocationPress = (salon: Salon) => {
    setSelectedStore(salon);
    
    const lat = parseFloat(salon.latitude);
    const lon = parseFloat(salon.longitude);
    
    if (!isNaN(lat) && !isNaN(lon) && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: lat,
        longitude: lon,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }, 1000);
    }
  };
  
  const handleStoreItemPress = (salonId: string) => {
    router.push(`/client/business-details/${salonId}`);
  };
  
  const closeStoreItem = () => {
    setSelectedStore(null);
  };
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchSalons();
  };

  // Show loading state
  if (isLoading) {
    return (
      <CustomSafeAreaView edges="top" style={[styles.container, { backgroundColor }]}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#2D8A47" />
          <ThemedText style={[styles.loadingText, { color: textColor }]}>Loading salons...</ThemedText>
        </View>
      </CustomSafeAreaView>
    );
  }
  
  // Show error state
  if (error && salons.length === 0) {
    return (
      <CustomSafeAreaView edges="top" style={[styles.container, { backgroundColor }]}>
        <View style={styles.centerContainer}>
          <IconSymbol name="exclamationmark.triangle" size={48} color="#EF4444" />
          <ThemedText style={[styles.errorText, { color: textColor }]}>{error}</ThemedText>
          <TouchableOpacity style={styles.retryButton} onPress={fetchSalons}>
            <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
          </TouchableOpacity>
        </View>
      </CustomSafeAreaView>
    );
  }
  
  return (
    <CustomSafeAreaView edges="top" style={[styles.container, { backgroundColor }]}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: cardBackgroundColor }]}>
          <IconSymbol name="magnifyingglass" size={20} color={textColor} style={styles.searchIcon} />
          <ThemedText style={[styles.searchPlaceholder, { color: textColor }]}>Find services or vendors</ThemedText>
        </View>
      </View>
      
      {/* Full Screen Map */}
      <View style={[styles.mapContainer, { backgroundColor: cardBackgroundColor }]}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          initialRegion={region}
          showsUserLocation
          showsMyLocationButton
          onPress={() => closeStoreItem()}
        >
          {salons.map((salon) => {
            const lat = parseFloat(salon.latitude);
            const lon = parseFloat(salon.longitude);
            
            if (isNaN(lat) || isNaN(lon)) return null;
            
            return (
              <Marker
                key={salon.id}
                coordinate={{ latitude: lat, longitude: lon }}
                title={salon.name}
                onPress={() => handleLocationPress(salon)}
              >
                <View style={styles.markerContainer}>
                  <View style={styles.pinIcon} />
                </View>
              </Marker>
            );
          })}
        </MapView>
        
        {/* Store Item Display at Bottom */}
        {selectedStore && (
          <View style={[styles.storeItemContainer, { backgroundColor: backgroundColor }]}>
            <TouchableOpacity 
              style={[styles.storeCard, { 
                backgroundColor: cardBackgroundColor,
                borderColor: borderColor
              }]}
              onPress={() => handleStoreItemPress(selectedStore.id)}
            >
              <View style={styles.cardContent}>
                {selectedStore.gallery && selectedStore.gallery.length > 0 ? (
                  <Image source={{ uri: selectedStore.gallery[0].image }} style={styles.storeImage} />
                ) : (
                  <View style={[styles.storeImage, { backgroundColor: '#E5E7EB' }]} />
                )}
                <View style={styles.infoSection}>
                  <View style={styles.nameRow}>
                    <ThemedText style={[styles.storeName, { color: textColor }]}>{selectedStore.name}</ThemedText>
                    <View style={styles.statusBadge}>
                      <ThemedText style={[styles.statusText, { color: '#2D8659' }]}>Open</ThemedText>
                    </View>
                  </View>
                  
                  <View style={styles.ratingRow}>
                    <IconSymbol name="star" size={16} color="#FFC107" />
                    <ThemedText style={[styles.ratingText, { color: textColor }]}>{selectedStore.rating || 0}</ThemedText>
                    <ThemedText style={[styles.reviewText, { color: textColor }]}>({selectedStore.review_count || 0} Reviews)</ThemedText>
                  </View>
                  
                  <ThemedText style={[styles.servicesText, { color: textColor }]} numberOfLines={1}>
                    {selectedStore.services && selectedStore.services.length > 0
                      ? selectedStore.services.slice(0, 3).map(s => s.name).join('.')
                      : 'Services available'}
                  </ThemedText>
                  
                  <View style={styles.bottomRow}>
                    <ThemedText style={[styles.priceText, { color: '#2D8659' }]}>
                      {selectedStore.services && selectedStore.services.length > 0 ? (() => {
                        const prices = selectedStore.services.map(s => parseFloat(s.price)).filter(p => !isNaN(p));
                        return prices.length > 0 
                          ? `₦${Math.min(...prices)} - ₦${Math.max(...prices)}`
                          : 'Contact for pricing';
                      })()
                        : 'Contact for pricing'}
                    </ThemedText>
                    <View style={styles.locationRow}>
                      <IconSymbol name="location" size={14} color={textColor} />
                      <ThemedText style={[styles.distanceText, { color: textColor }]}>{selectedStore.location}</ThemedText>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.closeButton} onPress={closeStoreItem}>
              <IconSymbol name="xmark" size={20} color={textColor} />
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      {/* Explore All Button */}
      <TouchableOpacity 
        style={[styles.exploreButton, { backgroundColor: '#2D8A47' }]} 
        onPress={() => router.push('/client/salons')}
      >
        <ThemedText style={styles.exploreButtonText}>Explore All</ThemedText>
      </TouchableOpacity>
    </CustomSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
    marginTop: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 26,
    height: 52,
    paddingHorizontal: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchPlaceholder: {
    fontSize: FontSizes.sm, // 12
  },
  mapContainer: {
    flex: 1,
    marginHorizontal: 16,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#2D8A47',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 4,
  },
  locationName: {
    fontSize: 10,
    fontWeight: '500',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  // Positioning for sample locations
  location1: {
    top: '30%',
    left: '20%',
  },
  location2: {
    top: '40%',
    left: '40%',
  },
  location3: {
    top: '50%',
    left: '60%',
  },
  location4: {
    top: '60%',
    left: '30%',
  },
  storeItemContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  storeCard: {
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    // paddingLeft: 2
  },
  cardContent: {
    flexDirection: 'row',
  },
  storeImage: {
    width: 90,
    height: 90,
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
    marginBottom: 0,
  },
  storeName: {
    fontSize: 13,
    fontWeight: '600',
  },
  statusBadge: {
    width: 50,
    height: 29,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#2D8659',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2D8659',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
    marginRight: 4,
  },
  reviewText: {
    fontSize: 12,
    fontWeight: '400',
  },
  servicesText: {
    fontSize: 12,
    fontWeight: '400',
    marginBottom: 0,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2D8659',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceText: {
    fontSize: 12,
    fontWeight: '400',
    marginLeft: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exploreButton: {
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  exploreButtonText: {
    fontSize: FontSizes.lg, // 16
    fontWeight: '600',
    color: '#FFFFFF',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: FontSizes.md,
    fontWeight: '500',
  },
  errorText: {
    marginTop: 16,
    fontSize: FontSizes.md,
    fontWeight: '500',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#2D8A47',
    borderRadius: 12,
  },
  retryButtonText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
