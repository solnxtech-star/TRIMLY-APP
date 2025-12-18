import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CustomSafeAreaView } from '@/components/custom-safe-area-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { IconSymbol } from '@/components/ui/icon-symbol';
import VendorCard from '@/app/client/components/VendorCard';

export default function MapScreen() {
  // Get theme colors
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  
  // Sample data
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
  
  return (
    <CustomSafeAreaView edges="top" style={[styles.container, { backgroundColor }]}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <ThemedText type="title" style={[styles.title, { color: textColor }]}>Map View</ThemedText>
      </View>
      
      {/* Vendor Cards */}
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          {vendors.map((vendor) => (
            <VendorCard 
              key={vendor.id} 
              vendor={vendor} 
            />
          ))}
        </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
});