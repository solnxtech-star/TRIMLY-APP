import { StyleSheet, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';

export default function Salons() {
  const router = useRouter();

  const handleSeeAll = () => {
    router.push('../client/salons');
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
            source={require('@/assets/stock/img.png')} 
            style={styles.cardImage} 
          />
          <IconSymbol name="heart" size={20} color="#FFFFFF" style={styles.heartIcon} />
          <View style={styles.textOverlay}>
            <ThemedText style={styles.salonName}>Slay Best Saloon</ThemedText>
          </View>
        </View>
        
        {/* Salon Card 2 */}
        <View style={[styles.card, styles.secondCard]}>
          <Image 
            source={require('@/assets/stock/service.jpg')} 
            style={styles.cardImage} 
          />
          <IconSymbol name="heart" size={20} color="#FFFFFF" style={styles.heartIcon} />
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
    color: '#000000',
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
  },
  secondCard: {
    // Different styling if needed
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heartIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
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