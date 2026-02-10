import { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import { FontSizes } from '@/constants/theme';
import salonService from '@/services/salonService';
import { Salon } from '@/types/salon.types';

export default function Salons() {
  const router = useRouter();
  const [salons, setSalons] = useState<Salon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchSalons();
  }, []);
  
  const fetchSalons = async () => {
    try {
      const response = await salonService.listSalons({ limit: 5 });
      console.log('Salons component loaded:', response.results.length);
      setSalons(response.results);
    } catch (error) {
      console.error('Failed to fetch salons:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeeAll = () => {
    router.push('/client/salons');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Salons</ThemedText>
        <TouchableOpacity onPress={handleSeeAll}>
          <ThemedText style={styles.seeAllText}>See all</ThemedText>
        </TouchableOpacity>
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#2D8659" />
        </View>
      ) : salons.length === 0 ? (
        <View style={styles.emptyContainer}>
          <ThemedText style={styles.emptyText}>No salons available</ThemedText>
        </View>
      ) : (
        <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {salons.map((salon) => (
          <TouchableOpacity 
            key={salon.id} 
            style={styles.card} 
            onPress={() => router.push(`/client/business-details/${salon.id}`)}
          >
            {salon.gallery && salon.gallery.length > 0 ? (
              <Image 
                source={{ uri: salon.gallery[0].image }} 
                style={styles.cardBackground}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.cardBackground, { backgroundColor: '#E5E7EB' }]} />
            )}
            <View style={styles.heartIconBackground}>
              <IconSymbol name="heart" size={20} color="#FFFFFF" style={styles.heartIcon} />
            </View>
            <View style={styles.textOverlay}>
              <View style={styles.salonInfoContainer}>
                <ThemedText style={styles.salonName} numberOfLines={1}>{salon.name}</ThemedText>
                <View style={styles.ratingPill}>
                  <IconSymbol name="star.fill" size={12} color="#FFD700" />
                  <ThemedText style={styles.ratingText}>{salon.rating || 0}</ThemedText>
                </View>
              </View>
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
    fontSize: FontSizes.lg, 
    fontWeight: '700',
  },
  seeAllText: {
    fontSize: FontSizes.md, 
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
    width: 300,
    height: 160,
    borderRadius: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  secondCard: {
    backgroundColor: '#6B6B6B',
  },
  cardBackground: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  heartIconBackground: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartIcon: {
    // Positioning handled by parent container
  },
  textOverlay: {
    position: 'absolute',
    bottom: 12,
    left: 12,
  },
  salonName: {
    fontSize: FontSizes.md, // 14
    fontWeight: '700',
    color: '#FFFFFF',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  comingSoonText: {
    fontSize: FontSizes.xxxl,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  salonInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  ratingText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: '#000000',
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