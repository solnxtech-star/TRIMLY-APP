import { StyleSheet, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import { FontSizes } from '@/constants/theme';

export default function TopRatedSalons() {
  const router = useRouter();
  
  const handleSeeAll = () => {
    router.push('/client/salons');
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Top Rated salons</ThemedText>
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
        {/* Salon Card 1 */}
        <TouchableOpacity style={styles.card} onPress={() => router.push('/client/business-details/1')}>
          <Image 
            source={require('@/assets/stock/rated.png')} 
            style={styles.cardBackground}
            resizeMode="cover"
          />
          <IconSymbol name="heart" size={20} color="#FFFFFF" style={styles.heartIcon} />
          <View style={styles.bottomSection}>
            <ThemedText style={styles.salonName}>Slay Best Saloon</ThemedText>
            <View style={styles.ratingBadge}>
              <IconSymbol name="star" size={14} color="#FFD700" />
              <ThemedText style={styles.ratingText}>4.8</ThemedText>
            </View>
          </View>
        </TouchableOpacity>
        
        {/* Salon Card 2 */}
        <TouchableOpacity style={[styles.card, styles.secondCard]} onPress={() => router.push('/business/2')}>
          <Image 
            source={require('@/assets/stock/service.jpg')} 
            style={styles.cardBackground}
            resizeMode="cover"
          />
          <IconSymbol name="heart" size={20} color="#FFFFFF" style={styles.heartIcon} />
          <View style={styles.bottomSection}>
            <ThemedText style={styles.salonName}>Slay Best Saloon</ThemedText>
            <View style={styles.ratingBadge}>
              <IconSymbol name="star" size={14} color="#FFD700" />
              <ThemedText style={styles.ratingText}>4.8</ThemedText>
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
    width: 280,
    height: 180,
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
  heartIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  bottomSection: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  salonName: {
    fontSize: FontSizes.md, // 14
    fontWeight: '700',
    color: '#FFFFFF',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ratingText: {
    fontSize: FontSizes.md, // 14
    fontWeight: '700',
    color: '#000000',
    marginLeft: 4,
  },
});