import { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CustomSafeAreaView } from '@/components/custom-safe-area-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import { FontSizes } from '@/constants/theme';

export default function ExploreScreen() {
  const router = useRouter();
  const [selectedStore, setSelectedStore] = useState<any>(null);
  
  // Get theme colors
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const cardBackgroundColor = useThemeColor({ light: '#f5f5f5', dark: '#1a1a1a' }, 'background');
  const borderColor = useThemeColor({}, 'border');
  
  // Sample store data with images
  const stores = [
    {
      id: 1,
      name: 'Glamour Haven',
      rating: 4.7,
      reviews: 50,
      services: 'Haircut.Beard Trim.Braiding',
      price: '$25 - $60',
      distance: '0.5 miles',
      status: 'Open',
      isFeatured: true,
      image: require('@/assets/stock/img.png')
    },
    {
      id: 2,
      name: 'Glow Spa & Nails',
      rating: 4.7,
      reviews: 89,
      services: 'Manicure.Pedicure.Facials',
      price: '$30 - $70',
      distance: '1.2 miles',
      status: 'Open',
      isFeatured: false,
      image: require('@/assets/stock/service.jpg')
    },
    {
      id: 3,
      name: 'Tranquil Touch Spa',
      rating: 4.7,
      reviews: 89,
      services: 'Massage.Sauna.Body Wrap',
      price: '$40 - $90',
      distance: '0.5 miles',
      status: 'Open',
      isFeatured: false,
      image: require('@/assets/stock/rated.png')
    },
    {
      id: 4,
      name: 'Serenity Salon',
      rating: 4.7,
      reviews: 89,
      services: 'Hair.Color.Nails',
      price: '$20 - $50',
      distance: '1.2 miles',
      status: 'Open',
      isFeatured: false,
      image: require('@/assets/stock/special.jpg')
    }
  ];
  
  const handleExploreAllPress = () => {
    router.push('/client/components/map');
  };
  
  const handleLocationPress = (storeId: number) => {
    // Find the store that corresponds to this location
    const store = stores.find(s => s.id === storeId);
    if (store) {
      setSelectedStore(store);
    }
  };
  
  const handleStoreItemPress = (storeId: number) => {
    router.push(`/client/business-details/${storeId}` as `${string}/${number}`);
  };
  
  const closeStoreItem = () => {
    setSelectedStore(null);
  };
  
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
        {/* Lagos area representation */}
        <View style={styles.lagosArea}>
          <TouchableOpacity
            style={[styles.locationPin, styles.location1]}
            onPress={() => handleLocationPress(1)}
          >
            <View style={styles.pinIcon} />
            <ThemedText style={[styles.locationName, { color: textColor }]}>Oshodi-Isolo</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.locationPin, styles.location2]}
            onPress={() => handleLocationPress(2)}
          >
            <View style={styles.pinIcon} />
            <ThemedText style={[styles.locationName, { color: textColor }]}>Mushin</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.locationPin, styles.location3]}
            onPress={() => handleLocationPress(3)}
          >
            <View style={styles.pinIcon} />
            <ThemedText style={[styles.locationName, { color: textColor }]}>Surulere</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.locationPin, styles.location4]}
            onPress={() => handleLocationPress(4)}
          >
            <View style={styles.pinIcon} />
            <ThemedText style={[styles.locationName, { color: textColor }]}>Ikeja</ThemedText>
          </TouchableOpacity>
        </View>
        
        {/* Store Item Display at Bottom */}
        {selectedStore && (
          <View style={[styles.storeItemContainer, { backgroundColor: backgroundColor }]}>
            <TouchableOpacity 
              style={[styles.storeCard, { 
                backgroundColor: selectedStore.isFeatured ? cardBackgroundColor : cardBackgroundColor,
                borderColor: selectedStore.isFeatured ? '#2D8659' : borderColor
              }]}
              onPress={() => handleStoreItemPress(selectedStore.id)}
            >
              <View style={styles.cardContent}>
                <Image source={selectedStore.image} style={styles.storeImage} />
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
                      <IconSymbol name="location" size={14} color={textColor} />
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
      
      {/* Explore All Button */}
      <TouchableOpacity style={[styles.exploreButton, { backgroundColor: '#2D8A47' }]} onPress={handleExploreAllPress}>
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
  },
  lagosArea: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
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
});