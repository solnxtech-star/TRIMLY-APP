import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';

interface Vendor {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  services: string[];
  priceRange: string;
  distance: string;
  isOpen: boolean;
}

interface VendorCardProps {
  vendor: Vendor;
}

export default function VendorCard({ vendor }: VendorCardProps) {
  const router = useRouter();
  
  const handlePress = () => {
    router.push(`/business/${vendor.id}` as `${string}/${string}`);
  };
  
  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      {/* Vendor Thumbnail */}
      <View style={styles.thumbnail} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <ThemedText style={styles.vendorName}>{vendor.name}</ThemedText>
          <TouchableOpacity>
            <IconSymbol name="heart" size={20} color="#666666" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.ratingContainer}>
          <IconSymbol name="star.fill" size={16} color="#FFD700" />
          <ThemedText style={styles.ratingText}>
            {vendor.rating} ({vendor.reviewCount})
          </ThemedText>
        </View>
        
        <ThemedText style={styles.servicesText}>
          {vendor.services.join(', ')}
        </ThemedText>
        
        <ThemedText style={styles.priceRange}>
          {vendor.priceRange}
        </ThemedText>
        
        <View style={styles.footer}>
          <ThemedText style={styles.distance}>{vendor.distance}</ThemedText>
          {vendor.isOpen && (
            <View style={styles.openBadge}>
              <ThemedText style={styles.openText}>Open</ThemedText>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  vendorName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 4,
  },
  servicesText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  priceRange: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  distance: {
    fontSize: 14,
    color: '#666666',
  },
  openBadge: {
    backgroundColor: '#2D8A47',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  openText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});