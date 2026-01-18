import { StyleSheet, View, FlatList, TouchableOpacity, Image } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { router } from 'expo-router';
import { FontSizes } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Define the featured vendor type
type FeaturedVendor = {
  id: number;
  name: string;
  rating: number;
  status: string;
  image: any; // In a real app, this would be a more specific type
};

export default function FeaturedVendorsListScreen() {
  // Sample featured vendor data - in a real app, this would come from an API or state management
  const featuredVendors: FeaturedVendor[] = [
    {
      id: 1,
      name: 'Premium Salon',
      rating: 4.8,
      status: 'Online',
      image: require('@/assets/images/4.jpg'),
    },
    {
      id: 2,
      name: 'Luxury Hair Studio',
      rating: 4.7,
      status: 'Offline',
      image: require('@/assets/images/3.jpg'),
    },
    {
      id: 3,
      name: 'Elite Barber Shop',
      rating: 4.9,
      status: 'Online',
      image: require('@/assets/images/4.jpg'),
    },
    {
      id: 4,
      name: 'Beauty Paradise',
      rating: 4.6,
      status: 'Online',
      image: require('@/assets/images/3.jpg'),
    },
    {
      id: 5,
      name: 'Modern Grooming Co.',
      rating: 4.5,
      status: 'Offline',
      image: require('@/assets/images/4.jpg'),
    },
    {
      id: 6,
      name: 'Style Haven',
      rating: 4.9,
      status: 'Online',
      image: require('@/assets/images/3.jpg'),
    },
    {
      id: 7,
      name: 'Chic Cuts',
      rating: 4.4,
      status: 'Online',
      image: require('@/assets/images/4.jpg'),
    },
    {
      id: 8,
      name: 'Urban Styles',
      rating: 4.7,
      status: 'Offline',
      image: require('@/assets/images/3.jpg'),
    },
  ];

  const renderVendor = ({ item }: { item: FeaturedVendor }) => (
    <TouchableOpacity 
      style={styles.vendorCard} 
      onPress={() => router.push(`/client/business-details/${item.id}`)}
    >
      <Image 
        source={item.image} 
        style={styles.cardBackground}
        resizeMode="cover"
      />
      <View style={styles.textOverlay}>
        <ThemedText style={styles.vendorName}>{item.name}</ThemedText>
        <View style={styles.ratingContainer}>
          <MaterialCommunityIcons name='star' size={12} color='yellow' />
          <ThemedText style={styles.rating}>{item.rating}</ThemedText>
        </View>
        <ThemedText style={[
          styles.status, 
          { color: item.status === 'Online' ? 'green' : 'gray' }
        ]}>
          {item.status}
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
      
      <FlatList
        data={featuredVendors}
        renderItem={renderVendor}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
      />
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
});