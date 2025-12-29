import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useColorScheme } from 'react-native';

const appointments = () => {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  
  // Define custom colors based on theme
  const colorScheme = useColorScheme();
  const cardBackgroundColor = colorScheme === 'dark' ? '#1F2937' : '#FFFFFF';
  const borderColor = colorScheme === 'dark' ? '#374151' : '#E0E0E0';
  const secondaryTextColor = colorScheme === 'dark' ? '#9CA3AF' : '#666666';
  
  const [activeTab, setActiveTab] = useState('Today');
  
  // Mock data for appointments
  const appointments = [
    { 
      id: 1, 
      clientName: 'Micheal Brown', 
      time: '10:30 AM', 
      service: 'Haircut & Beard Trim', 
      lastVisit: '2 months ago',
      status: 'Confirmed',
      profileImage: null // In a real app, this would be an image URL
    },
    { 
      id: 2, 
      clientName: 'Micheal Brown', 
      time: '10:30 AM', 
      service: 'Haircut & Beard Trim', 
      lastVisit: '2 months ago',
      status: 'Confirmed',
      profileImage: null
    },
    { 
      id: 3, 
      clientName: 'Micheal Brown', 
      time: '10:30 AM', 
      service: 'Haircut & Beard Trim', 
      lastVisit: '2 months ago',
      status: 'Pending',
      profileImage: null
    },
    { 
      id: 4, 
      clientName: 'Micheal Brown', 
      time: '10:30 AM', 
      service: 'Haircut & Beard Trim', 
      lastVisit: '2 months ago',
      status: 'Confirmed',
      profileImage: null
    },
  ];
  
  const getStatusStyle = (status: string) => {
    if (status === 'Confirmed') {
      return {
        backgroundColor: '#E3F2FD',
        color: '#1976D2',
      };
    } else if (status === 'Pending') {
      return {
        backgroundColor: '#FFE8D6',
        color: '#F57C00',
      };
    }
    return {
      backgroundColor: '#F5F5F5',
      color: '#666666',
    };
  };
  
  const handleMoreOptions = (appointmentId: number) => {
    // Handle more options for appointment
    console.log('More options for appointment:', appointmentId);
  };
  
  return (
    <ScrollView style={{ flex: 1, backgroundColor: backgroundColor }} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <Text style={[styles.headerTitle, { color: textColor }]}>Appointments</Text>
      </View>
      
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={styles.tabButton}
          onPress={() => setActiveTab('Today')}
        >
          <Text style={[styles.tabText, { color: activeTab === 'Today' ? textColor : secondaryTextColor, fontWeight: activeTab === 'Today' ? 'bold' : 'normal' }]}>Today</Text>
          {activeTab === 'Today' && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.tabButton}
          onPress={() => setActiveTab('Upcoming')}
        >
          <Text style={[styles.tabText, { color: activeTab === 'Upcoming' ? textColor : secondaryTextColor, fontWeight: activeTab === 'Upcoming' ? 'bold' : 'normal' }]}>Upcoming</Text>
          {activeTab === 'Upcoming' && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.tabButton}
          onPress={() => setActiveTab('Past')}
        >
          <Text style={[styles.tabText, { color: activeTab === 'Past' ? textColor : secondaryTextColor, fontWeight: activeTab === 'Past' ? 'bold' : 'normal' }]}>Past</Text>
          {activeTab === 'Past' && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
      </View>
      
      {appointments.map((appointment) => (
        <View key={appointment.id} style={[styles.appointmentCard, { backgroundColor: cardBackgroundColor, borderColor: borderColor }]}>              
          {/* Left Section - Profile Photo */}
          <View style={styles.profileSection}>
            <View style={styles.profilePhotoPlaceholder}>
              <Ionicons name="person-circle" size={50} color={secondaryTextColor} />
            </View>
          </View>
          
          {/* Center Section - Appointment Details */}
          <View style={styles.detailsSection}>
            <Text style={[styles.clientName, { color: textColor }]}>{appointment.clientName}</Text>
            
            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={16} color={secondaryTextColor} />
              <Text style={[styles.detailText, { color: secondaryTextColor }]}>{appointment.time}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Ionicons name="cut-outline" size={16} color={secondaryTextColor} />
              <Text style={[styles.detailText, { color: secondaryTextColor }]}>{appointment.service}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={16} color={secondaryTextColor} />
              <Text style={[styles.detailText, { color: secondaryTextColor }]}>Last Visit: {appointment.lastVisit}</Text>
            </View>
          </View>
          
          {/* Right Section - Status & Actions */}
          <View style={styles.statusSection}>
            <View style={[styles.statusBadge, getStatusStyle(appointment.status)]}>
              <Text style={[styles.statusText, { color: getStatusStyle(appointment.status).color }]}>{appointment.status}</Text>
            </View>
            
            <TouchableOpacity style={styles.moreOptionsButton} onPress={() => handleMoreOptions(appointment.id)}>
              <Ionicons name="ellipsis-vertical" size={20} color={secondaryTextColor} />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 80, // Extra padding to account for bottom navigation
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tabButton: {
    alignItems: 'center',
    paddingBottom: 12,
    flex: 1,
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: 0,
    width: '30%', // Width of the tab text
    height: 4,
    backgroundColor: '#2E7D32',
    borderRadius: 2,
  },
  appointmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 9,
    paddingHorizontal: 6,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileSection: {
    marginRight: 16,
  },
  profilePhotoPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsSection: {
    flex: 1,
    marginRight: 16,
  },
  clientName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 12,
    marginLeft: 8,
  },
  statusSection: {
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  moreOptionsButton: {
    padding: 8,
  },
});

export default appointments