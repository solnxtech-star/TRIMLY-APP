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
            source={require('@/assets/images/4.jpg')} 
            style={styles.cardBackground}
            resizeMode="cover"
          />
          <View style={styles.textOverlay}>
            <ThemedText style={styles.vendorName}>Vendor Name</ThemedText>
            <View style={styles.ratingContainer}>
              <ThemedText style={styles.rating}>★ 4.8</ThemedText>
            </View>
          </View>
        </TouchableOpacity>
        
        {/* Vendor Card 2 */}
        <TouchableOpacity style={[styles.card, styles.secondCard]} onPress={() => router.push('/client/business-details/2')}>
          <Image 
            source={require('@/assets/images/3.jpg')} 
            style={styles.cardBackground}
            resizeMode="cover"
          />
          <View style={styles.textOverlay}>
            <ThemedText style={styles.vendorName}>Another Vendor</ThemedText>
            <View style={styles.ratingContainer}>
              <ThemedText style={styles.rating}>★ 4.5</ThemedText>
            </View>
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
    height: '150%',
    borderRadius: 16,
  },
  textOverlay: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%'
  },
  vendorName: {
    fontSize: FontSizes.md, // 14
    fontWeight: '700',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  ratingContainer: {
    marginTop: 4,
  },
  rating: {
    fontSize: FontSizes.sm, // 12
    fontWeight: '500',
    color: 'yellow',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});