import { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { router } from 'expo-router';
import { FontSizes } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import vendorService from '@/services/vendorService';
import { Vendor } from '@/types/salon.types';

export default function FeaturedVendorsListScreen() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  useEffect(() => {
    fetchVendors();
  }, []);
  
  const fetchVendors = async () => {
    try {
      const response = await vendorService.listVendors({ limit: '50' });
      console.log('=== VENDORS DATA ===');
      console.log('Total vendors loaded:', response.results.length);
      console.log('Full response:', JSON.stringify(response, null, 2));
      console.log('Vendors array:', JSON.stringify(response.results, null, 2));
      
      // Log individual vendor details
      response.results.forEach((vendor, index) => {
        console.log(`\n--- Vendor ${index + 1} ---`);
        console.log('ID:', vendor.id);
        console.log('Worker ID:', vendor.worker);
        console.log('Bio:', vendor.bio);
        console.log('Rating:', vendor.rating);
        console.log('Is Available:', vendor.is_available);
        console.log('Is Active:', vendor.is_active);
        console.log('Address:', vendor.address);
        console.log('Gallery:', vendor.gallery);
        console.log('Services:', vendor.services);
      });
      
      setVendors(response.results);
    } catch (error) {
      console.error('Failed to fetch vendors:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchVendors();
  };

  const renderVendor = ({ item }: { item: Vendor }) => (
    <TouchableOpacity 
      style={styles.vendorCard} 
      onPress={() => router.push(`/client/business-details/${item.id}`)}
    >
      {item.gallery && item.gallery.length > 0 ? (
        <Image 
          source={{ uri: item.gallery[0].image }} 
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
          {(item.worker && item.worker.length > 8)
            ? `${item.worker.slice(0, 4)}...${item.worker.slice(-4)}`
            : (item.worker || 'Vendor')}
        </ThemedText>
        <View style={styles.ratingContainer}>
          <MaterialCommunityIcons name='star' size={12} color='yellow' />
          <ThemedText style={styles.rating}>{item.rating || 0}</ThemedText>
        </View>
        <ThemedText style={[
          styles.status, 
          { color: item.is_available ? 'green' : 'gray' }
        ]}>
          {item.is_available ? 'Online' : 'Offline'}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ThemedText style={styles.backButton}>← Back</ThemedText>
        </TouchableOpacity>
        <ThemedText style={styles.title}>Featured Vendors</ThemedText>
        <View style={{ width: 60 }} /> {/* Spacer for alignment */}
      </View>
      
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#2D8659" />
        </View>
      ) : (
        <FlatList
          data={vendors}
          renderItem={renderVendor}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} colors={['#2D8659']} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <ThemedText style={styles.emptyText}>No vendors found</ThemedText>
            </View>
          }
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 40,
    marginBottom: 20,
  },
  backButton: {
    fontSize: FontSizes.md,
    fontWeight: '500',
    color: '#2D8659',
  },
  title: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: '#1A1D2E',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    gap: 12,
  },
  vendorCard: {
    width: '48%', // Adjust for two columns with spacing
    height: 180,
    borderRadius: 16,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 12,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    elevation: 2,
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 2,
  },
  cardBackground: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  textOverlay: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    height: 60,
    paddingHorizontal: 8,
    paddingTop: 8,
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
    color: 'white',
  },
  status: {
    fontSize: 12,
    fontWeight: '400',
    zIndex: 5,
    position: 'absolute',
    bottom: 11,
    left: 8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: FontSizes.md,
    color: '#9CA3AF',
  },
});
