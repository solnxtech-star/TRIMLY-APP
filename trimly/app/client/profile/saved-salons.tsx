import { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function SavedSalonsScreen() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Haircuts', 'Make Up', 'Massage'];

  const salons = [
    { name: "Waves and Beard Trim", address: "No 22 Ozuoba Rd", rating: "4.7 (1k + Reviews)", image: "@/assets/stock/img.png" },
    { name: "Prime Cuts & Styles", address: "No 22 Ozuoba Rd", rating: "4.7 (1k + Reviews)", image: "@/assets/stock/service.jpg" },
    { name: "Classic Touch Salon", address: "No 22 Ozuoba Rd", rating: "4.7 (1k + Reviews)", image: "@/assets/stock/special.jpg" },
    { name: "Serenity & Style Studio", address: "No 22 Ozuoba Rd", rating: "4.7 (1k + Reviews)", image: "@/assets/stock/rated.png" },
    { name: "Waves and Beard Trim", address: "No 22 Ozuoba Rd", rating: "4.7 (1k + Reviews)", image: "@/assets/stock/img.png" },
  ];

  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <ThemedText style={styles.header}>Saved</ThemedText>
        
        {/* Filters */}
        <View style={styles.filtersContainer}>
          {filters.map((filter, index) => (
            <TouchableOpacity 
              key={index} 
              style={[
                styles.filterPill, 
                activeFilter === filter && styles.activeFilterPill
              ]}
              onPress={() => setActiveFilter(filter)}
            >
              <ThemedText style={[
                styles.filterText,
                activeFilter === filter && styles.activeFilterText
              ]}>
                {filter}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Salon Cards */}
        <View style={styles.salonsContainer}>
          {salons.map((salon, index) => (
            <View key={index} style={styles.salonCard}>
              <Image 
                source={require('@/assets/stock/img.png')} 
                style={styles.salonImage} 
              />
              <View style={styles.salonInfo}>
                <ThemedText style={styles.salonName}>{salon.name}</ThemedText>
                <View style={styles.locationContainer}>
                  <IconSymbol name="location" size={16} color="#8E8E93" />
                  <ThemedText style={styles.address}>{salon.address}</ThemedText>
                </View>
                <View style={styles.ratingContainer}>
                  <IconSymbol name="star" size={16} color="#FFD700" />
                  <ThemedText style={styles.rating}>{salon.rating}</ThemedText>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 20,
    textAlign: 'center',
  },
  filtersContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  filterPill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    marginRight: 10,
  },
  activeFilterPill: {
    backgroundColor: '#2D8659', // Green background
  },
  filterText: {
    fontSize: 15,
    color: '#000000',
  },
  activeFilterText: {
    color: '#FFFFFF', // White text
  },
  salonsContainer: {
    flex: 1,
  },
  salonCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  salonImage: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  salonInfo: {
    flex: 1,
    padding: 15,
  },
  salonName: {
    fontSize: 17,
    color: '#000000',
    fontWeight: '600',
    marginBottom: 5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  address: {
    fontSize: 15,
    color: '#8E8E93',
    marginLeft: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 15,
    color: '#000000',
    marginLeft: 5,
  },
});