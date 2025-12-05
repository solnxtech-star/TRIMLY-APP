import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';

export default function FeaturedVendors() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Featured Vendors</ThemedText>
        <TouchableOpacity>
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
        <View style={styles.card}>
          <View style={styles.cardBackground} />
          <View style={styles.textOverlay}>
            <ThemedText style={styles.vendorName}>Vendor Name</ThemedText>
          </View>
        </View>
        
        {/* Vendor Card 2 */}
        <View style={[styles.card, styles.secondCard]}>
          <View style={styles.cardBackground} />
          <View style={styles.textOverlay}>
            <ThemedText style={styles.vendorName}>Another Vendor</ThemedText>
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
    backgroundColor: '#2D8659',
  },
  secondCard: {
    backgroundColor: '#6B6B6B',
  },
  cardBackground: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  textOverlay: {
    position: 'absolute',
    bottom: 12,
    left: 12,
  },
  vendorName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});