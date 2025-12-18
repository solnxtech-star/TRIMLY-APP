import { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useRouter } from 'expo-router';
import { useThemeColor } from '@/hooks/use-theme-color';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface Location {
  id: string;
  name: string;
  district: string;
}

interface Store {
  id: number;
  name: string;
  rating: number;
  reviews: number;
  services: string;
  price: string;
  distance: string;
  status: string;
  isFeatured: boolean;
  image: any;
}

interface MapViewProps {
  locations: Location[];
  stores: Store[];
}

export default function MapViewComponent({ locations, stores }: MapViewProps) {
  const router = useRouter();
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  
  // Get theme colors
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');
  const cardBackgroundColor = useThemeColor({ light: '#f5f5f5', dark: '#1a1a1a' }, 'background');
  const featuredCardBackgroundColor = useThemeColor({ light: '#f0f0f0', dark: '#2a2a2a' }, 'background');
  
  const handleLocationPress = (storeId: number) => {
    // Find the store that corresponds to this location
    const store = stores.find(s => s.id === storeId);
    if (store) {
      setSelectedStore(store);
    }
  };
  
  const handleStoreItemPress = (storeId: number) => {
    router.push(`/client/business-details/${storeId}`);
  };
  
  const handleExploreAllPress = () => {
    // Navigate to the salons screen to show all stores
    router.push('/client/salons');
  };
  
  const closeStoreItem = () => {
    setSelectedStore(null);
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={[styles.title, { color: textColor }]}>Map View</ThemedText>
        <TouchableOpacity style={styles.exploreButton} onPress={handleExploreAllPress}>
          <ThemedText style={styles.exploreText}>Explore All</ThemedText>
          <IconSymbol name="chevron.right" size={16} color={textColor} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.mapContainer}>
        {/* Simplified map representation */}
        <View style={[styles.mapBackground, { backgroundColor: cardBackgroundColor }]}>
          {/* Lagos area representation */}
          <View style={styles.lagosArea}>
            <TouchableOpacity
              style={[styles.locationPin, styles.location1]}
              onPress={() => handleLocationPress(1)}
            >
              <View style={styles.pinIcon} />
              <ThemedText style={[styles.locationName, { color: textColor }]}>{locations[0]?.district}</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.locationPin, styles.location2]}
              onPress={() => handleLocationPress(2)}
            >
              <View style={styles.pinIcon} />
              <ThemedText style={[styles.locationName, { color: textColor }]}>{locations[1]?.district}</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.locationPin, styles.location3]}
              onPress={() => handleLocationPress(3)}
            >
              <View style={styles.pinIcon} />
              <ThemedText style={[styles.locationName, { color: textColor }]}>{locations[2]?.district}</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.locationPin, styles.location4]}
              onPress={() => handleLocationPress(4)}
            >
              <View style={styles.pinIcon} />
              <ThemedText style={[styles.locationName, { color: textColor }]}>{locations[3]?.district}</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      {/* Store Item Display at Bottom */}
      {selectedStore && (
        <View style={[styles.storeItemContainer, { backgroundColor: backgroundColor }]}>
          <TouchableOpacity 
            style={[styles.storeCard, { 
              backgroundColor: selectedStore.isFeatured ? featuredCardBackgroundColor : cardBackgroundColor,
              borderColor: selectedStore.isFeatured ? '#2D8659' : borderColor
            }]}
            onPress={() => handleStoreItemPress(selectedStore.id)}
          >
            <View style={styles.cardContent}>
              <View style={[styles.storeImage, { backgroundColor: cardBackgroundColor }]} />
              <View style={styles.infoSection}>
                <View style={styles.nameRow}>
                  <ThemedText style={[styles.storeName, { color: textColor }]}>{selectedStore.name}</ThemedText>
                  <View style={styles.statusBadge}>
                    <ThemedText style={[styles.statusText, { color: '#2D8659' }]}>{selectedStore.status}</ThemedText>
                  </View>
                </View>
                
                <View style={styles.ratingRow}>
                  <IconSymbol name="star" size={16} color="#FFC107" />
                  <ThemedText style={[styles.ratingText, { color: textColor }]}>{selectedStore.rating}</ThemedText>
                  <ThemedText style={[styles.reviewText, { color: textColor }]}>({selectedStore.reviews} Reviews)</ThemedText>
                </View>
                
                <ThemedText style={[styles.servicesText, { color: textColor }]}>{selectedStore.services}</ThemedText>
                
                <View style={styles.bottomRow}>
                  <ThemedText style={[styles.priceText, { color: '#2D8659' }]}>{selectedStore.price}</ThemedText>
                  <View style={styles.locationRow}>
                    <IconSymbol name="location" size={14} color={iconColor} />
                    <ThemedText style={[styles.distanceText, { color: textColor }]}>{selectedStore.distance}</ThemedText>
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
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exploreText: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 4,
  },
  mapContainer: {
    height: 200,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  mapBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lagosArea: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  locationPin: {
    position: 'absolute',
    alignItems: 'center',
  },
  pinIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#2D8A47',
    marginBottom: 4,
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
    fontSize: 16,
    fontWeight: '600',
  },
  statusBadge: {
    width: 60,
    height: 25,
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
});