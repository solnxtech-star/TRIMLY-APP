import { useEffect } from 'react';
import { router } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '@/services/authService';

const ONBOARDING_COMPLETED_KEY = 'onboardingCompleted';

export default function IndexScreen() {
  useEffect(() => {
    const checkAuthAndOnboarding = async () => {
      try {
        // 1. Check if user is already authenticated
        try {
          const user = await authService.getCurrentUser();
          if (user) {
            // User is logged in, redirect based on role
            if (user.role === 'salon_owner' || user.role === 'vendor') {
              router.replace('/business/dashboard');
            } else {
              router.replace('/client/dashboard');
            }
            return;
          }
        } catch (error) {
          // Token might be invalid or expired, continue to onboarding check
          console.log('No active session or session expired');
        }

        // 2. Check onboarding status
        const hasCompletedOnboarding = await AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY);
        
        if (hasCompletedOnboarding === 'true') {
          // User has completed onboarding but not logged in
          router.replace('/auth/role-selection');
        } else {
          // User hasn't completed onboarding
          router.replace('/onboarding/welcome');
        }
      } catch (error) {
        console.error('Error checking status:', error);
        // Fallback to onboarding
        router.replace('/onboarding/welcome');
      }
    };
    
    checkAuthAndOnboarding();
  }, []);

  return <ThemedView />;
}