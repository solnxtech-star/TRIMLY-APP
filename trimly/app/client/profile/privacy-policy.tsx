import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { FontSizes } from '@/constants/theme';

export default function PrivacyPolicyScreen() {
  // Get theme colors
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'icon');
  const greenColor = useThemeColor({ light: '#2D8659', dark: '#2D8659' }, 'tint');
  const cardBackgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#1d1d1d' }, 'background');

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <ThemedText style={[styles.header, { color: textColor }]}>Privacy Policy</ThemedText>
        
        {/* Policy Items */}
        <View style={styles.policyContainer}>
          <TouchableOpacity style={[styles.policyItem, { borderBottomColor: borderColor }]}>
            <ThemedText style={[styles.policyLabel, { color: greenColor }]}>Cancellation Policy</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.policyItem, { borderBottomColor: borderColor }]}>
            <ThemedText style={[styles.policyLabel, { color: greenColor }]}>Terms & Condition</ThemedText>
          </TouchableOpacity>
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
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    fontSize: FontSizes.titleMd, // 24
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  policyContainer: {
    flex: 1,
    marginTop: 20,
  },
  policyItem: {
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  policyLabel: {
    fontSize: FontSizes.md, // 14
    fontWeight: '500',
  },
});