import { StyleSheet, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';

export default function Salons() {
  const router = useRouter();

  const handleSeeAll = () => {
    // For now, we'll just log to console since we don't have routing set up
    console.log('See all salons');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Salons</ThemedText>
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
        <View style={styles.card}>
          <Image 
            source={require('@/assets/stock/service.jpg')} 
            style={styles.cardBackground}
            resizeMode="cover"
          />
          <View style={styles.heartIconBackground}>
            <IconSymbol name="heart" size={20} color="#FFFFFF" style={styles.heartIcon} />
          </View>
          <View style={styles.textOverlay}>
            <ThemedText style={styles.salonName}>Slay Best Saloon</ThemedText>
          </View>
        </View>
        
        {/* Salon Card 2 */}
        <View style={[styles.card, styles.secondCard]}>
          <Image 
            source={require('@/assets/stock/rated.png')} 
            style={styles.cardBackground}
            resizeMode="cover"
          />
          <View style={styles.heartIconBackground}>
            <IconSymbol name="heart" size={20} color="#FFFFFF" style={styles.heartIcon} />
          </View>
          <View style={styles.textOverlay}>
            <ThemedText style={styles.salonName}>Slay Best Saloon</ThemedText>
          </View>
        </View>
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
    fontSize: 20,
    fontWeight: '700',
  },
  seeAllText: {
    fontSize: 14,
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
    backgroundColor: '#2D8659',
  },
  secondCard: {
    backgroundColor: '#6B6B6B',
  },
  cardBackground: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  heartIconBackground: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartIcon: {
    // Positioning handled by parent container
  },
  textOverlay: {
    position: 'absolute',
    bottom: 12,
    left: 12,
  },
  salonName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});