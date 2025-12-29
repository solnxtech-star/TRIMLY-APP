import { useEffect } from 'react';
import { router } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_COMPLETED_KEY = 'onboardingCompleted';

export default function IndexScreen() {
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const hasCompletedOnboarding = await AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY);
        
        if (hasCompletedOnboarding === 'true') {
          // User has already completed onboarding, redirect to auth
          router.replace('/auth/role-selection');
        } else {
          // User hasn't completed onboarding, show onboarding flow
          router.replace('/onboarding/welcome');
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        // If there's an error, default to showing onboarding
        router.replace('/onboarding/welcome');
      }
    };
    
    checkOnboardingStatus();
  }, []);

  return <ThemedView />;
}