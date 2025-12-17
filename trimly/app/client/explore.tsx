import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { IconSymbol } from '@/components/ui/icon-symbol';
import CategoryPills from '@/app/client/components/CategoryPills';
import VendorCard from '@/app/client/components/VendorCard';
import MapViewComponent from '@/app/client/components/MapView';

export default function ExploreScreen() {
  // Get theme colors
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  
  // Sample data
  const categories = [
    { id: 'all', name: 'All' },
    { id: 'haircuts', name: 'Haircuts' },
    { id: 'makeup', name: 'Make Up' },
    { id: 'massage', name: 'Massage' },
  ];
  
  const vendors = [
    {
      id: '1',
      name: 'Glamour Haven',
      rating: 4.8,
      reviewCount: 120,
      services: ['Haircut', 'Styling', 'Coloring'],
      priceRange: '$25 - $60',
      distance: '2.5 km',
      isOpen: true,
    },
    {
      id: '2',
      name: 'Royal Spa',
      rating: 4.6,
      reviewCount: 95,
      services: ['Massage', 'Facial', 'Manicure'],
      priceRange: '$30 - $80',
      distance: '3.2 km',
      isOpen: true,
    },
    {
      id: '3',
      name: 'Style Studio',
      rating: 4.9,
      reviewCount: 210,
      services: ['Haircut', 'Beard Trim', 'Waxing'],
      priceRange: '$20 - $50',
      distance: '1.8 km',
      isOpen: false,
    },
  ];
  
  const locations = [
    { id: '1', name: 'Oshodi Salon', district: 'Oshodi-Isolo' },
    { id: '2', name: 'Mushin Beauty', district: 'Mushin' },
    { id: '3', name: 'Surulere Spa', district: 'Surulere' },
    { id: '4', name: 'Ikeja Parlor', district: 'Ikeja' },
  ];
  
  const handleCategorySelect = (categoryId: string) => {
    console.log('Selected category:', categoryId);
    // Implement category filtering logic here
  };
  

  
  const handleLocationPress = (locationId: string) => {
    console.log('Pressed location:', locationId);
    // Navigate to business details or filter by location
  };
  
  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      {/* Header with Search and Filter */}
      <View style={styles.header}>
        <ThemedText type="title" style={[styles.title, { color: textColor }]}>Explore</ThemedText>
        <TouchableOpacity style={styles.filterButton}>
          <IconSymbol name="line.horizontal.3.decrease" size={24} color="#000000" />
        </TouchableOpacity>
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <IconSymbol name="magnifyingglass" size={20} color="#6B6B6B" style={styles.searchIcon} />
          <ThemedText style={styles.searchPlaceholder}>Find services or vendors</ThemedText>
        </View>
      </View>
      
      {/* Category Pills */}
      <CategoryPills 
        categories={categories} 
        selectedCategory="all" 
        onSelectCategory={handleCategorySelect} 
      />
      
      {/* Scrollable Content */}
      <ScrollView style={styles.content}>
        {/* Vendor Cards */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Nearby Vendors</ThemedText>
          {vendors.map((vendor) => (
            <VendorCard 
              key={vendor.id} 
              vendor={vendor} 
            />
          ))}
        </View>
        
        {/* Map View */}
        <MapViewComponent 
          locations={locations} 
        />
      </ScrollView>
    </ThemedView>
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
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  filterButton: {
    padding: 8,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 26,
    height: 52,
    paddingHorizontal: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchPlaceholder: {
    fontSize: 15,
    color: '#6B6B6B',
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginHorizontal: 16,
    marginBottom: 12,
  },
});