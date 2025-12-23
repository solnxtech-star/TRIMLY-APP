import { StyleSheet, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CustomSafeAreaView } from '@/components/custom-safe-area-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function SalonsScreen() {
  const router = useRouter();
  
  // Get theme colors
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'text');
  const cardBackgroundColor = useThemeColor({ light: '#f5f5f5', dark: '#1a1a1a' }, 'background');
  const featuredCardBackgroundColor = useThemeColor({ light: '#f0f0f0', dark: '#2a2a2a' }, 'background');

  const salons = [
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
    },
    {
      id: 5,
      name: 'Serenity Salon',
      rating: 4.7,
      reviews: 89,
      services: 'Hair.Color.Nails',
      price: '$20 - $50',
      distance: '1.2 miles',
      status: 'Open',
      isFeatured: false,
      image: require('@/assets/stock/img.png')
    }
  ];

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
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {salons.map((salon) => (
          <TouchableOpacity 
            key={salon.id} 
            style={[
              {backgroundColor: salon.isFeatured ? featuredCardBackgroundColor : cardBackgroundColor},
              styles.salonCard, 
              salon.isFeatured && styles.featuredCard
            ]}
            onPress={() => router.push(`/client/business-details/${salon.id}`)}
          >
            <View style={styles.cardContent}>
              <Image source={salon.image} style={styles.salonImage} />
              <View style={styles.infoSection}>
                <View style={styles.nameRow}>
                  <ThemedText style={[styles.salonName, { color: textColor }]}>{salon.name}</ThemedText>
                  <View style={styles.statusBadge}>
                    <ThemedText style={[styles.statusText, { color: '#2D8659' }]}>{salon.status}</ThemedText>
                  </View>
                </View>
                
                <View style={styles.ratingRow}>
                  <IconSymbol name="star" size={16} color="#FFC107" />
                  <ThemedText style={[styles.ratingText, { color: textColor }]}>{salon.rating}</ThemedText>
                  <ThemedText style={[styles.reviewText, { color: textColor }]}>({salon.reviews} Reviews)</ThemedText>
                </View>
                
                <ThemedText style={[styles.servicesText, { color: textColor }]}>{salon.services}</ThemedText>
                
                <View style={styles.bottomRow}>
                  <ThemedText style={[styles.priceText, { color: '#2D8659' }]}>{salon.price}</ThemedText>
                  <View style={styles.locationRow}>
                    <IconSymbol name="location" size={14} color={iconColor} />
                    <ThemedText style={[styles.distanceText, { color: textColor }]}>{salon.distance}</ThemedText>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
});