import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/use-theme-color';
import { TouchableOpacity } from 'react-native';
import { useColorScheme } from 'react-native';
import { Switch } from 'react-native';
import { router } from 'expo-router';

const NotificationSettings = () => {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  
  // Define custom colors based on theme
  const colorScheme = useColorScheme();
  const cardBackgroundColor = colorScheme === 'dark' ? '#1F2937' : '#FFFFFF';
  const secondaryTextColor = colorScheme === 'dark' ? '#9CA3AF' : '#666666';
  
  const [notifications, setNotifications] = useState({
    appointmentNotifications: true,
    messageNotifications: true,
    appointmentReminders: true,
    marketingUpdates: false,
  });
  
  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSavePreferences = () => {
    // Handle saving notification preferences
    console.log('Saving notification preferences:', notifications);
  };
    
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: backgroundColor }]}>      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/business/profile')}>
          <Ionicons name="chevron-back" size={24} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>Notifications</Text>
      </View>
        
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Notification Options */}
        <View style={styles.notificationItem}>
          <View style={styles.notificationTextContainer}>
            <Text style={[styles.notificationLabel, { color: textColor }]}>Appointment Notifications</Text>
            <Text style={[styles.notificationDescription, { color: secondaryTextColor }]}>Receive notifications about appointments</Text>
          </View>
          <Switch
            trackColor={{ false: '#E0E0E0', true: colorScheme === 'dark' ? '#4B5563' : '#000000' }}
            thumbColor="#FFFFFF"
            onValueChange={() => handleToggle('appointmentNotifications')}
            value={notifications.appointmentNotifications}
            style={styles.toggleSwitch}
          />
        </View>
          
        <View style={styles.notificationItem}>
          <View style={styles.notificationTextContainer}>
            <Text style={[styles.notificationLabel, { color: textColor }]}>Message Notifications</Text>
            <Text style={[styles.notificationDescription, { color: secondaryTextColor }]}>Receive notifications for messages</Text>
          </View>
          <Switch
            trackColor={{ false: '#E0E0E0', true: colorScheme === 'dark' ? '#4B5563' : '#000000' }}
            thumbColor="#FFFFFF"
            onValueChange={() => handleToggle('messageNotifications')}
            value={notifications.messageNotifications}
            style={styles.toggleSwitch}
          />
        </View>
          
        <View style={styles.notificationItem}>
          <View style={styles.notificationTextContainer}>
            <Text style={[styles.notificationLabel, { color: textColor }]}>Appointment Reminders</Text>
            <Text style={[styles.notificationDescription, { color: secondaryTextColor }]}>Receive reminders before appointments</Text>
          </View>
          <Switch
            trackColor={{ false: '#E0E0E0', true: colorScheme === 'dark' ? '#4B5563' : '#000000' }}
            thumbColor="#FFFFFF"
            onValueChange={() => handleToggle('appointmentReminders')}
            value={notifications.appointmentReminders}
            style={styles.toggleSwitch}
          />
        </View>
          
        <View style={styles.notificationItem}>
          <View style={styles.notificationTextContainer}>
            <Text style={[styles.notificationLabel, { color: textColor }]}>Marketing Updates</Text>
            <Text style={[styles.notificationDescription, { color: secondaryTextColor }]}>Receive updates about Trimly features</Text>
          </View>
          <Switch
            trackColor={{ false: '#E0E0E0', true: colorScheme === 'dark' ? '#4B5563' : '#000000' }}
            thumbColor="#FFFFFF"
            onValueChange={() => handleToggle('marketingUpdates')}
            value={notifications.marketingUpdates}
            style={styles.toggleSwitch}
          />
        </View>
      </ScrollView>
        
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSavePreferences}>
          <Text style={styles.saveButtonText}>Save Preferences</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 100, // Extra padding to account for the button at the bottom
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginRight: 32, // To account for the back button space
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  notificationTextContainer: {
    flex: 0.75,
  },
  notificationLabel: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  notificationDescription: {
    fontSize: 14,
  },
  toggleSwitch: {
    width: 50,
    height: 30,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
  },
  saveButton: {
    backgroundColor: '#2E7D32',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NotificationSettings;