import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function AppointmentsScreen() {
  // Get theme colors
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  
  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <ThemedText type="title" style={{ color: textColor }}>Bookings</ThemedText>
      <ThemedText style={{ color: textColor, textAlign: 'center', marginVertical: 20 }}>
        Your booking management screen is available in the app.
      </ThemedText>
      <ThemedText style={{ color: textColor, textAlign: 'center' }}>
        Navigate to the Bookings tab to view your appointments.
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
});