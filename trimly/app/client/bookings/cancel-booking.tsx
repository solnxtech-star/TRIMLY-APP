import { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function CancelBookingScreen() {
  const router = useRouter();
  const [selectedReason, setSelectedReason] = useState('Schedule Change');
  const [otherReason, setOtherReason] = useState('');

  const reasons = [
    "Schedule Change",
    "Weather conditions",
    "Parking availability",
    "Lack of amenities",
    "I have an alternative option",
    "Other"
  ];

  const handleCancelBooking = () => {
    // Handle cancel booking logic here
    console.log('Cancelling booking with reason:', selectedReason === 'Other' ? otherReason : selectedReason);
    router.back();
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <IconSymbol name="chevron.left" size={24} color="#000000" />
          </TouchableOpacity>
          <ThemedText style={styles.title}>Cancel Booking</ThemedText>
          <View style={styles.placeholder} />
        </View>
        
        {/* Content */}
        <ThemedText style={styles.instructionText}>
          Please select the reason for cancellation
        </ThemedText>
        
        {/* Radio Button List */}
        <View style={styles.radioList}>
          {reasons.map((reason, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.radioItem}
              onPress={() => setSelectedReason(reason)}
            >
              <View style={styles.radioCircle}>
                {selectedReason === reason && <View style={styles.selectedDot} />}
              </View>
              <ThemedText style={styles.radioLabel}>{reason}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.divider} />
        
        {/* Other Text Input Section */}
        {selectedReason === 'Other' && (
          <View style={styles.otherSection}>
            <ThemedText style={styles.otherLabel}>Other</ThemedText>
            <TextInput
              style={styles.textArea}
              placeholder="Enter you reasons"
              placeholderTextColor="#8E8E93"
              multiline
              numberOfLines={6}
              value={otherReason}
              onChangeText={setOtherReason}
            />
          </View>
        )}
      </ScrollView>
      
      {/* Bottom Button */}
      <TouchableOpacity style={styles.cancelButton} onPress={handleCancelBooking}>
        <ThemedText style={styles.cancelButtonText}>Cancel Booking</ThemedText>
      </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
  },
  placeholder: {
    width: 40,
  },
  instructionText: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 24,
  },
  radioList: {
    marginBottom: 24,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#8E8E93',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  selectedDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2D8659',
  },
  radioLabel: {
    fontSize: 16,
    color: '#000000',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginBottom: 24,
  },
  otherSection: {
    marginBottom: 24,
  },
  otherLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  textArea: {
    height: 220,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
    textAlignVertical: 'top',
  },
  cancelButton: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    height: 56,
    backgroundColor: '#2D8659',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});