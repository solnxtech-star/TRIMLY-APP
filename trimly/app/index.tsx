import { useEffect } from 'react';
import { router } from 'expo-router';
import { ThemedView } from '@/components/themed-view';

export default function IndexScreen() {
  useEffect(() => {
    // Check if user is already authenticated
    // For now, we'll redirect to onboarding
    // In a real app, you would check authentication state
    router.replace('/onboarding/welcome');
  }, []);

  return <ThemedView />;
}