import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function ClientLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2D8A4B', // Brand green color
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#151718' : '#FFFFFF',
          borderTopColor: colorScheme === 'dark' ? '#9BA1A6' : '#E5E7EB',
          borderTopWidth: 1,
        },
      }}>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="magnifyingglass" color={color} />,
        }}
      />
      <Tabs.Screen
        name="appointments"
        options={{
          title: 'Bookings',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="calendar" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="salons"
        options={{
          href: null,
          // tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="featured-vendors-list"
        options={{
          href: null,
          // tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          href: null,
          // tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="bookings/cancel-booking"
        options={{
          href: null,
          // tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="bookings/cancelled"
        options={{
          href: null,
          // tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="bookings/completed"
        options={{
          href: null,
          // tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="bookings/main"
        options={{
          href: null,
          // tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="bookings/upcoming"
        options={{
          href: null,
          // tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="bookings/index"
        options={{
          href: null,
          // tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="profile/cancellation-policy"
        options={{
          href: null,
          // tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="profile/edit-profile"
        options={{
          href: null,
          // tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="profile/help-center"
        options={{
          href: null,
          // tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="profile/payment-methods"
        options={{
          href: null,
          // tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="profile/privacy-policy"
        options={{
          href: null,
          // tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="profile/saved-salons"
        options={{
          href: null,
          // tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="profile/settings"
        options={{
          href: null,
          // tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="profile/terms-condition"
        options={{
          href: null,
          // tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="profile/transactions"
        options={{
          href: null,
          // tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="components/CategoryPills"
        options={{
          href: null,
          // tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="components/MapView"
        options={{
          href: null,
          // tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="components/VendorCard"
        options={{
          href: null,
          // tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="home/index"
        options={{
          href: null,
          // tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="home/components/SearchBar"
        options={{
          href: null,
          // tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="home/components/FeaturedVendors"
        options={{
          href: null,
          // tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="home/components/Salons"
        options={{
          href: null,
          // tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="home/components/Services"
        options={{
          href: null,
          // tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="home/components/SpecialForYou"
        options={{
          href: null,
          // tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="home/components/TopRatedSalons"
        options={{
          href: null,
          // tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="home/components/Header"
        options={{
          href: null,
          // tabBarButton: () => null,
        }}
      />
       <Tabs.Screen
        name="components/map"
        options={{
          href: null,
          // tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="business-details/[id]"
        options={{
          href: null,
          // tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="components/service-options"
        options={{
          href: null,
          // tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="bookings/form"
        options={{
          href: null,
          // tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="bookings/confirmation"
        options={{
          href: null,
          // tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="bookings/checkout"
        options={{
          href: null,
          // tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="service-options"
        options={{
          href: null,
          // tabBarButton: () => null,
        }}
      />
    </Tabs>
  );
}