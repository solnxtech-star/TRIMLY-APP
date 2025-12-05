import { StyleSheet, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';

export default function SalonsScreen() {
  const router = useRouter();

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
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <IconSymbol name="chevron.left" size={20} color="#000000" />
        </TouchableOpacity>
        <ThemedText style={styles.title}>Salon</ThemedText>
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
              styles.salonCard, 
              salon.isFeatured && styles.featuredCard
            ]}
          >
            <View style={styles.cardContent}>
              <Image source={salon.image} style={styles.salonImage} />
              <View style={styles.infoSection}>
                <View style={styles.nameRow}>
                  <ThemedText style={styles.salonName}>{salon.name}</ThemedText>
                  <View style={styles.statusBadge}>
                    <ThemedText style={styles.statusText}>{salon.status}</ThemedText>
                  </View>
                </View>
                
                <View style={styles.ratingRow}>
                  <IconSymbol name="star" size={16} color="#FFC107" />
                  <ThemedText style={styles.ratingText}>{salon.rating}</ThemedText>
                  <ThemedText style={styles.reviewText}>({salon.reviews} Reviews)</ThemedText>
                </View>
                
                <ThemedText style={styles.servicesText}>{salon.services}</ThemedText>
                
                <View style={styles.bottomRow}>
                  <ThemedText style={styles.priceText}>{salon.price}</ThemedText>
                  <View style={styles.locationRow}>
                    <IconSymbol name="location" size={14} color="#6B6B6B" />
                    <ThemedText style={styles.distanceText}>{salon.distance}</ThemedText>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
    color: '#000000',
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
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },
  featuredCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
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
    width: 120,
    height: 120,
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
    marginBottom: 8,
  },
  salonName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  statusBadge: {
    width: 60,
    height: 28,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#2D8659',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2D8659',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
    marginLeft: 4,
    marginRight: 4,
  },
  reviewText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6B6B6B',
  },
  servicesText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6B6B6B',
    marginBottom: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2D8659',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6B6B6B',
    marginLeft: 8,
  },
});