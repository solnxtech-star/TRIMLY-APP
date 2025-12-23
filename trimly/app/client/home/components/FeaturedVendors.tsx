import { StyleSheet, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useRouter } from 'expo-router';
import { FontSizes } from '@/constants/theme';

export default function FeaturedVendors() {
  const router = useRouter();
  
  const handleSeeAll = () => {
    router.push('/client/salons');
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Featured Vendors</ThemedText>
        <TouchableOpacity onPress={handleSeeAll}>
          <ThemedText style={styles.seeAllText}>See all</ThemedText>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Vendor Card 1 */}
        <TouchableOpacity style={styles.card} onPress={() => router.push('/client/business-details/2')}>
          <Image 
            source={require('@/assets/stock/img.png')} 
            style={styles.cardBackground}
            resizeMode="cover"
          />
          <View style={styles.textOverlay}>
            <ThemedText style={styles.vendorName}>Vendor Name</ThemedText>
          </View>
        </TouchableOpacity>
        
        {/* Vendor Card 2 */}
        <TouchableOpacity style={[styles.card, styles.secondCard]} onPress={() => router.push('/business/2')}>
          <Image 
            source={require('@/assets/stock/special.jpg')} 
            style={styles.cardBackground}
            resizeMode="cover"
          />
          <View style={styles.textOverlay}>
            <ThemedText style={styles.vendorName}>Another Vendor</ThemedText>
          </View>
        </TouchableOpacity>
      </ScrollView>
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
    fontSize: FontSizes.xl, // 18
    fontWeight: '700',
  },
  seeAllText: {
    fontSize: FontSizes.md, // 14
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
    width: 240,
    height: 160,
    borderRadius: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  secondCard: {
  },
  cardBackground: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  textOverlay: {
    position: 'absolute',
    bottom: 12,
    left: 12,
  },
  vendorName: {
    fontSize: FontSizes.md, // 14
    fontWeight: '700',
    color: '#FFFFFF',
  },
});