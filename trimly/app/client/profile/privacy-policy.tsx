import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function PrivacyPolicyScreen() {
  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <ThemedText style={styles.header}>Privacy Policy</ThemedText>
        
        {/* Policy Items */}
        <View style={styles.policyContainer}>
          <TouchableOpacity style={styles.policyItem}>
            <ThemedText style={styles.policyLabel}>Cancellation Policy</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.policyItem}>
            <ThemedText style={styles.policyLabel}>Terms & Condition</ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    fontSize: 27,
    fontWeight: 'bold',
    color: '#000000',
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
    borderBottomColor: '#F0F0F0',
  },
  policyLabel: {
    fontSize: 17,
    color: '#2D8659', // Green color
    fontWeight: '500',
  },
});