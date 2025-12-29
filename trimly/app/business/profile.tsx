import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useColorScheme } from 'react-native';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const BusinessProfile = () => {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  
  // Define custom colors based on theme
  const colorScheme = useColorScheme();
  const cardBackgroundColor = colorScheme === 'dark' ? 'transparent' : '#FFFFFF'; // Card background
  const dividerColor = colorScheme === 'dark' ? '#374151' : '#F0F0F0'; // Light gray for dividers

  const iconColor = '#00C853'; // Green color for icons

  const menuItems = [
    {
      id: 'profile',
      title: 'Your profile',
      icon: 'person-outline',
      action: () => router.push('/business/profile/edit-profile')
    },
    {
      id: 'services',
      title: 'Services & Pricing',
      icon: 'pricetag-outline',
      action: () => router.push('/business/profile/services')
    },
    {
      id: 'availability',
      title: 'Availability',
      icon: 'time-outline',
      action: () => router.push('/business/profile/availability')
    },
    {
      id: 'portfolio',
      title: 'Portfolio & Reviews',
      icon: 'star-outline',
      action: () => router.push('/business/profile/portfolio')
    },
    {
      id: 'notification',
      title: 'Notification',
      icon: 'notifications-outline',
      action: () => router.push('/business/profile/notification-settings')
    },
    {
      id: 'transactions',
      title: 'Transactions',
      icon: 'card-outline',
      action: () => router.push('/business/profile/transactions')
    },
    {
      id: 'help',
      title: 'Help Center',
      icon: 'help-circle-outline',
      action: () => router.push('/business/profile/help-center')
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      icon: 'lock-closed-outline',
      action: () => router.push('/business/profile/privacy-policy')
    },
    {
      id: 'logout',
      title: 'Log out',
      icon: 'log-out-outline',
      action: () => router.push('/auth/sign-in'),
      isDestructive: true
    }
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: backgroundColor }]}>
      <View style={styles.headerContainer}>
        <Text style={[styles.headerTitle, { color: textColor }]}>Profile</Text>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.menuItem,
              { 
                backgroundColor: cardBackgroundColor,
                borderBottomColor: dividerColor,
                borderBottomWidth: index < menuItems.length - 1 ? 1 : 0
              }
            ]}
            onPress={item.action}
          >
            <View style={styles.menuContent}>
              <View style={[styles.iconCircle, { backgroundColor: item.isDestructive ? '#FFEBEE' : '#F8F8F8' }]}>
                <Ionicons 
                  name={item.icon as any} 
                  size={22} 
                  color={item.isDestructive ? '#FF5252' : iconColor} 
                />
              </View>
              
              <Text 
                style={[
                  styles.menuText, 
                  { 
                    color: item.isDestructive ? '#FF5252' : textColor,
                    flex: 1
                  }
                ]}
              >
                {item.title}
              </Text>
              
              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={item.isDestructive ? '#FF5252' : '#666666'} 
              />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
  },
  menuItem: {
    height: 70,
    paddingHorizontal: 16,
  },
  menuContent: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuText: {
    fontSize: 13,
    fontWeight: '500',
    marginRight: 12,
  },
});

export default BusinessProfile;