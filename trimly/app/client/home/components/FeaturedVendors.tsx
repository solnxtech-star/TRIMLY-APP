import { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useRouter } from 'expo-router';
import { FontSizes } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import vendorService from '@/services/vendorService';
import { Vendor } from '@/types/salon.types';

export default function FeaturedVendors() {
  const router = useRouter();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchVendors();
  }, []);
  
  const fetchVendors = async () => {
    try {
      const response = await vendorService.listVendors({ limit: '5' });
      console.log('Featured vendors loaded:', response.results.length);
      setVendors(response.results);
    } catch (error) {
      console.error('Failed to fetch vendors:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSeeAll = () => {
    router.push('/client/featured-vendors-list');
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Featured Vendors</ThemedText>
        <TouchableOpacity onPress={handleSeeAll}>
          <ThemedText style={styles.seeAllText}>See all</ThemedText>
        </TouchableOpacity>
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#2D8659" />
        </View>
      ) : vendors.length === 0 ? (
        <View style={styles.emptyContainer}>
          <ThemedText style={styles.emptyText}>No vendors available</ThemedText>
        </View>
      ) : (
        <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
            {vendors.map((vendor) => (
          <TouchableOpacity 
            key={vendor.id} 
            style={[styles.card, styles.secondCard]} 
            onPress={() => router.push(`/client/business-details/${vendor.id}`)}
          >
            {vendor.gallery && vendor.gallery.length > 0 ? (
              <Image 
                source={{ uri: vendor.gallery[0].image }}
                style={styles.cardBackground}
                resizeMode="cover"
              />
            ) : (
              <Image
                source={require('@/assets/stock/img.png')}
                style={styles.cardBackground}
                resizeMode="cover"
              />
            )}
            <View style={styles.textOverlay}>
              <ThemedText style={styles.vendorName} numberOfLines={1}>
                {vendor.worker || 'Vendor'}
              </ThemedText>
              <View style={styles.ratingContainer}>
                <MaterialCommunityIcons name='star' size={11} color='yellow' />
                <ThemedText style={styles.rating}>{vendor.rating || 0}</ThemedText>
              </View>
              <ThemedText style={styles.duration}>
                {vendor.is_available ? 'Online' : 'Offline'}
              </ThemedText>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
    fontSize: FontSizes.lg, // 18
    fontWeight: '700',
  },
  seeAllText: {
    fontSize: FontSizes.md, // 14
    fontWeight: '400',
    color: '#2D8659',
  },
  scrollView: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  card: {
    width: 150,
    height: 160,
    borderRadius: 16,
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    elevation: 2,
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 2,
    marginBottom: 5
  },
  secondCard: {
  },
  cardBackground: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  textOverlay: {
    position: 'absolute',
    bottom: 0,
    // left: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: 'white',
    height: 50,
    paddingHorizontal: 8,
    paddingTop: 8
  },
  vendorName: {
    fontSize: 14,
    fontWeight: '600',
    color: 'black',
    flex: 1,
    lineHeight: 15,
    width: '100%',
    textShadowColor: 'rgba(27, 76, 3, 0.15)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  ratingContainer: {
    position: 'absolute',
    right: 5,
    top: 7,
    backgroundColor: 'green',
    paddingHorizontal: 3,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    boxShadow: '1px 1px 4px rgba(0, 0, 0, 0.87)',
    elevation: 2,
    shadowColor: 'rgba(0, 0, 0, 0.52)',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 1,
  },
  rating: {
    fontSize: 11,
    // fontWeight: '500',
    color: 'white',
    // textShadowColor: 'rgba(0, 0, 0, 0.44)',
    // textShadowOffset: { width: 1, height: 1 },
    // textShadowRadius: 1,
  },
  duration: {
    fontSize: 12,
    fontWeight: '400',
    color: 'green',
    zIndex: 5,
    position: 'absolute',
    bottom: 11,
    left: 8
  },
  textcontent: {
    paddingVertical: 2
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FontSizes.md,
    color: '#6B6B6B',
  },
});
