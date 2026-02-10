import { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Image, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CustomSafeAreaView } from '@/components/custom-safe-area-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import { useThemeColor } from '@/hooks/use-theme-color';
import salonService from '@/services/salonService';
import { Salon } from '@/types/salon.types';
import { FontSizes } from '@/constants/theme';

export default function SalonsScreen() {
  const router = useRouter();
  const [salons, setSalons] = useState<Salon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get theme colors
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'text');
  const borderColor = '#E5E7EB';
  const cardBackgroundColor = useThemeColor({ light: '#f5f5f5', dark: '#1a1a1a' }, 'background');
  const featuredCardBackgroundColor = useThemeColor({ light: '#f0f0f0', dark: '#2a2a2a' }, 'background');
  
  useEffect(() => {
    fetchSalons();
  }, []);
  
  const fetchSalons = async () => {
    try {
      setError(null);
      const response = await salonService.listSalons({ limit: 50 });
      
      console.log('=== SALONS DATA (Salons Screen) ===');
      console.log('Total salons loaded:', response.results.length);
      console.log('Full response:', JSON.stringify(response, null, 2));
      console.log('Salons array:', JSON.stringify(response.results, null, 2));
      
      // Log individual salon details
      response.results.forEach((salon, index) => {
        console.log(`\n--- Salon ${index + 1} ---`);
        console.log('ID:', salon.id);
        console.log('Name:', salon.name);
        console.log('Owner:', salon.owner);
        console.log('Category:', salon.category);
        console.log('Address:', salon.address);
        console.log('Location:', salon.location);
        console.log('Is Open:', salon.is_open);
        console.log('Rating:', salon.rating);
        console.log('Review Count:', salon.review_count);
        console.log('Services:', salon.services);
        console.log('Gallery:', salon.gallery);
      });
      
      setSalons(response.results);
    } catch (err: any) {
      console.error('Failed to fetch salons:', err);
      setError(err.message || 'Failed to load salons');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchSalons();
  };

  return (
    <CustomSafeAreaView edges="top" style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <IconSymbol name="chevron.left" size={20} color={iconColor} />
        </TouchableOpacity>
        <ThemedText style={[styles.title, { color: textColor }]}>Salon</ThemedText>
        <View style={styles.placeholder} />
      </View>
      
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#2D8A47" />
          <ThemedText style={[styles.loadingText, { color: textColor }]}>Loading salons...</ThemedText>
        </View>
      ) : error && salons.length === 0 ? (
        <View style={styles.centerContainer}>
          <IconSymbol name="exclamationmark.triangle" size={48} color="#EF4444" />
          <ThemedText style={[styles.errorText, { color: textColor }]}>{error}</ThemedText>
          <TouchableOpacity style={styles.retryButton} onPress={fetchSalons}>
            <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} colors={['#2D8A47']} />
          }
        >
          {salons.length === 0 ? (
            <View style={styles.emptyContainer}>
              <IconSymbol name="building.2" size={64} color="#9CA3AF" />
              <ThemedText style={[styles.emptyText, { color: textColor }]}>No salons found</ThemedText>
            </View>
          ) : (
            salons.map((salon) => (
              <TouchableOpacity 
                key={salon.id} 
                style={[
                  {backgroundColor: cardBackgroundColor},
                  styles.salonCard
                ]}
                onPress={() => router.push(`/client/business-details/${salon.id}`)}
              >
                <View style={styles.cardContent}>
                  {salon.gallery && salon.gallery.length > 0 ? (
                    <Image source={{ uri: salon.gallery[0].image }} style={styles.salonImage} />
                  ) : (
                    <View style={[styles.salonImage, { backgroundColor: '#E5E7EB' }]} />
                  )}
                  <View style={styles.infoSection}>
                    <View style={styles.nameRow}>
                      <ThemedText style={[styles.salonName, { color: textColor }]} numberOfLines={1}>
                        {salon.name}
                      </ThemedText>
                      <View style={styles.statusBadge}>
                        <ThemedText style={[styles.statusText, { color: '#2D8659' }]}>Open</ThemedText>
                      </View>
                    </View>
                    
                    <View style={styles.ratingRow}>
                      <IconSymbol name="star" size={16} color="#FFC107" />
                      <ThemedText style={[styles.ratingText, { color: textColor }]}>
                        {salon.rating || 0}
                      </ThemedText>
                      <ThemedText style={[styles.reviewText, { color: textColor }]}>
                        ({salon.review_count || 0} Reviews)
                      </ThemedText>
                    </View>
                    
                    <ThemedText style={[styles.servicesText, { color: textColor }]} numberOfLines={1}>
                      {salon.services && salon.services.length > 0
                        ? salon.services.slice(0, 3).map(s => s.name).join('.')
                        : 'Services available'}
                    </ThemedText>
                    
                    <View style={styles.bottomRow}>
                      <ThemedText style={[styles.priceText, { color: '#2D8659' }]}>
                        {salon.services && salon.services.length > 0
                          ? `₦${Math.min(...salon.services.map(s => Number(s.price)))} - ₦${Math.max(...salon.services.map(s => Number(s.price)))}`
                          : 'Contact for pricing'}
                      </ThemedText>
                      <View style={styles.locationRow}>
                        <IconSymbol name="location" size={14} color={iconColor} />
                        <ThemedText style={[styles.distanceText, { color: textColor }]} numberOfLines={1}>
                          {salon.location}
                        </ThemedText>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}
    </CustomSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  placeholder: {
    width: 44,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  salonCard: {
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },
  featuredCard: {
    borderWidth: 1.5,
    borderColor: '#2D8659',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
  },
  salonImage: {
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
  salonName: {
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
    color: '#6B6B6B',
  },
  servicesText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#6B6B6B',
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
    color: '#6B6B6B',
    marginLeft: 8,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: FontSizes.lg,
    fontWeight: '500',
    color: '#9CA3AF',
  },
});