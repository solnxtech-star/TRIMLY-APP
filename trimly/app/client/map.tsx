import { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CustomSafeAreaView } from '@/components/custom-safe-area-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';

export default function MapScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Get theme colors
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const cardBackgroundColor = useThemeColor({ light: '#f5f5f5', dark: '#1a1a1a' }, 'background');
  const borderColor = useThemeColor({ light: 'transparent', dark: '#333333' }, 'border');
  
  // Sample categories data
  const categories = [
    { id: 'all', name: 'All' },
    { id: 'haircuts', name: 'Haircuts' },
    { id: 'makeup', name: 'Make Up' },
    { id: 'massage', name: 'Massage' },
    { id: 'nails', name: 'Nails' },
    { id: 'spa', name: 'Spa' },
  ];
  
  // Sample store data
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
    },
    {
      id: 5,
      name: 'Royal Barber Shop',
      rating: 4.9,
      reviews: 120,
      services: 'Haircut.Beard.Mustache',
      price: '$15 - $40',
      distance: '0.8 miles',
      status: 'Open',
      isFeatured: false,
      image: require('@/assets/stock/img.png')
    },
    {
      id: 6,
      name: 'Luxury Nail Studio',
      rating: 4.8,
      reviews: 75,
      services: 'Manicure.Pedicure.Nail Art',
      price: '$25 - $65',
      distance: '1.5 miles',
      status: 'Open',
      isFeatured: false,
      image: require('@/assets/stock/service.jpg')
    }
  ];
  
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    // In a real app, you would filter the stores based on the selected category
  };
  
  const handleStorePress = (storeId: number) => {
    router.push(`/client/business-details/${storeId}`);
  };
  
  return (
    <CustomSafeAreaView edges="top" style={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <IconSymbol name="chevron.left" size={24} color={textColor} />
        </TouchableOpacity>
        <ThemedText style={[styles.headerTitle, { color: textColor }]}>Explore</ThemedText>
        <View style={styles.placeholder} />
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: cardBackgroundColor }]}>
          <IconSymbol name="magnifyingglass" size={20} color={textColor} style={styles.searchIcon} />
          <ThemedText style={[styles.searchPlaceholder, { color: textColor }]}>Find services or vendors</ThemedText>
        </View>
      </View>
      
      {/* Horizontal Category Filters */}
      <View style={styles.categoryFilterContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScrollContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryPill,
                { backgroundColor: cardBackgroundColor },
                selectedCategory === category.id && styles.selectedCategoryPill
              ]}
              onPress={() => handleCategorySelect(category.id)}
            >
              <ThemedText 
                style={[
                  styles.categoryText,
                  { color: textColor },
                  selectedCategory === category.id && styles.selectedCategoryText
                ]}
              >
                {category.name}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      {/* Vendors Found Section */}
      <View style={styles.content}>
        <ThemedText style={[styles.sectionTitle, { color: textColor }]}>Vendors Found</ThemedText>
        
        {/* Store List */}
        <ScrollView style={styles.storeList}>
          {stores.map((store) => (
            <TouchableOpacity 
              key={store.id} 
              style={[styles.storeCard, { 
                backgroundColor: store.isFeatured ? cardBackgroundColor : cardBackgroundColor,
                borderColor: store.isFeatured ? '#2D8659' : borderColor
              }]}
              onPress={() => handleStorePress(store.id)}
            >
              <View style={styles.cardContent}>
                <Image source={store.image} style={styles.storeImage} />
                <View style={styles.infoSection}>
                  <View style={styles.nameRow}>
                    <ThemedText style={[styles.storeName, { color: textColor }]}>{store.name}</ThemedText>
                    <View style={styles.statusBadge}>
                      <ThemedText style={[styles.statusText, { color: '#2D8659' }]}>{store.status}</ThemedText>
                    </View>
                  </View>
                  
                  <View style={styles.ratingRow}>
                    <IconSymbol name="star" size={16} color="#FFC107" />
                    <ThemedText style={[styles.ratingText, { color: textColor }]}>{store.rating}</ThemedText>
                    <ThemedText style={[styles.reviewText, { color: textColor }]}>({store.reviews} Reviews)</ThemedText>
                  </View>
                  
                  <ThemedText style={[styles.servicesText, { color: textColor }]}>{store.services}</ThemedText>
                  
                  <View style={styles.bottomRow}>
                    <ThemedText style={[styles.priceText, { color: '#2D8659' }]}>{store.price}</ThemedText>
                    <View style={styles.locationRow}>
                      <IconSymbol name="location" size={14} color={textColor} />
                      <ThemedText style={[styles.distanceText, { color: textColor }]}>{store.distance}</ThemedText>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  placeholder: {
    width: 44,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
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
    fontSize: 15,
  },
  categoryFilterContainer: {
    marginBottom: 16,
  },
  categoryScrollContent: {
    paddingHorizontal: 16,
  },
  categoryPill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
  },
  selectedCategoryPill: {
    backgroundColor: '#2D8A47',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  storeList: {
    flex: 1,
  },
  storeCard: {
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1.5,
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
});