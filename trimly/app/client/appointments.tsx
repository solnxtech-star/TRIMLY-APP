import { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import UpcomingBookings from './bookings/upcoming';
import CompletedBookings from './bookings/completed';
import CancelledBookings from './bookings/cancelled';

export default function AppointmentsScreen() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
  
  // Get theme colors
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tabIndicatorColor = useThemeColor({ light: '#2D8659', dark: '#2D8A47' }, 'tint');
  
  return (
    <ThemedView style={[styles.container, { backgroundColor }]}> 
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <ThemedText style={[styles.header, { color: textColor }]}>Booking</ThemedText>
        
        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
            onPress={() => setActiveTab('upcoming')}
          >
            <ThemedText style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText, { color: textColor }]}> 
              Upcoming
            </ThemedText>
            {activeTab === 'upcoming' && <View style={[styles.tabIndicator, { backgroundColor: tabIndicatorColor }]} />}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
            onPress={() => setActiveTab('completed')}
          >
            <ThemedText style={[styles.tabText, activeTab === 'completed' && styles.activeTabText, { color: textColor }]}> 
              Completed
            </ThemedText>
            {activeTab === 'completed' && <View style={[styles.tabIndicator, { backgroundColor: tabIndicatorColor }]} />}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'cancelled' && styles.activeTab]}
            onPress={() => setActiveTab('cancelled')}
          >
            <ThemedText style={[styles.tabText, activeTab === 'cancelled' && styles.activeTabText, { color: textColor }]}> 
              Cancelled
            </ThemedText>
            {activeTab === 'cancelled' && <View style={[styles.tabIndicator, { backgroundColor: tabIndicatorColor }]} />}
          </TouchableOpacity>
        </View>
        
        {/* Content */}
        <View style={styles.contentContainer}>
          {activeTab === 'upcoming' && <UpcomingBookings />}
          {activeTab === 'completed' && <CompletedBookings />}
          {activeTab === 'cancelled' && <CancelledBookings />}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'left',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  activeTab: {
    // No additional styling needed
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
  },
  activeTabText: {
    fontWeight: '600',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 3,
    borderRadius: 2,
  },
  contentContainer: {
    flex: 1,
  },
});