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
      <ThemedText style={{ color: textColor }}>Your upcoming bookings will appear here</ThemedText>
      <View style={styles.separator} />
      <ThemedText style={{ color: textColor }}>You haven't made any bookings yet.</ThemedText>
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
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});