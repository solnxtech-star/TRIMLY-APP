import { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Image } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import { FontSizes } from '@/constants/theme';

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const handleSalonPress = () => {
    router.push('/client/salons');
  };

  return (
    <View style={styles.container}>
      <IconSymbol name="magnifyingglass" size={20} color="#6B6B6B" style={styles.searchIcon} />
      <TextInput
        style={styles.input}
        placeholder="Find barber or salon"
        placeholderTextColor="#6B6B6B"
        value={searchQuery}
        onChangeText={handleSearch}
      />
      {searchQuery ? (
        <View style={styles.resultsContainer}>
          <TouchableOpacity style={styles.card} onPress={handleSalonPress}>
            <Image 
              source={require('@/assets/stock/service.jpg')} 
              style={styles.cardBackground}
              resizeMode="cover"
            />
            <View style={styles.overlay}>
              <ThemedText style={styles.comingSoonText}>Coming Soon!</ThemedText>
            </View>
            <View style={styles.heartIconBackground}>
              <IconSymbol name="heart" size={20} color="#FFFFFF" style={styles.heartIcon} />
            </View>
            <View style={styles.textOverlay}>
              <ThemedText style={styles.salonName}>{searchQuery}</ThemedText>
            </View>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 26,
    height: 52,
    marginHorizontal: 16,
    marginTop: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    position: 'relative',
  },
  searchIcon: {
    marginLeft: 16,
  },
  input: {
    flex: 1,
    fontSize: FontSizes.md, // 14
    color: '#000000',
    paddingLeft: 8,
  },
  resultsContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    zIndex: 10000000000,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    width: '100%',
  },
  card: {
    width: '100%',
    height: 160,
    borderRadius: 16,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 10,
  },
  cardBackground: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  comingSoonText: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: '#FFFFFF',
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
    fontSize: FontSizes.md, // 14
    fontWeight: '700',
    color: '#FFFFFF',
  },
});