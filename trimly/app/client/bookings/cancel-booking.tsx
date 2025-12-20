import { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { AntDesign } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function CancelBookingScreen() {
  const router = useRouter();
  const [selectedReason, setSelectedReason] = useState('Schedule Change');
  const [otherReason, setOtherReason] = useState('');
  
  // Theme colors
  const backgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#000000' }, 'background');
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({ light: '#000000', dark: '#FFFFFF' }, 'secondaryText');
  const borderColor = useThemeColor({ light: '#E5E5E5', dark: '#333333' }, 'border');
  const cardBackgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#1A1A1A' }, 'cardBackground');
  const primaryColor = useThemeColor({ light: '#2D8659', dark: '#2D8A47' }, 'tint');
  const placeholderTextColor = useThemeColor({ light: '#8E8E93', dark: '#8E8E93' }, 'placeholderText');
  const backButtonColor = useThemeColor({ light: '#F2F2F7', dark: '#2C2C2E' }, 'backButton');

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
    <ThemedView style={[styles.container, { backgroundColor }]}> 
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={[styles.backButton, { backgroundColor: backButtonColor }]}
            onPress={() => router.back()}
          >
            <AntDesign name="left" size={24} color={secondaryTextColor} />
          </TouchableOpacity>
          <ThemedText style={[styles.title, { color: textColor }]}>Cancel Booking</ThemedText>
          <View style={styles.placeholder} />
        </View>
        
        {/* Content */}
        <ThemedText style={[styles.instructionText, { color: textColor }]}> 
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
              <View style={[styles.radioCircle, { borderColor: borderColor }]}> 
                {selectedReason === reason && <View style={[styles.selectedDot, { backgroundColor: primaryColor }]} />}
              </View>
              <ThemedText style={[styles.radioLabel, { color: textColor }]}>{reason}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={[styles.divider, { backgroundColor: borderColor }]} />
        
        {/* Other Text Input Section */}
        {selectedReason === 'Other' && (
          <View style={styles.otherSection}>
            <ThemedText style={[styles.otherLabel, { color: textColor }]}>Other</ThemedText>
            <TextInput
              style={[styles.textArea, { 
                backgroundColor: cardBackgroundColor, 
                borderColor: borderColor, 
                color: textColor 
              }]}
              placeholder="Enter you reasons"
              placeholderTextColor={placeholderTextColor}
              multiline
              numberOfLines={6}
              value={otherReason}
              onChangeText={setOtherReason}
            />
          </View>
        )}
      </ScrollView>
      
      {/* Bottom Button */}
      <TouchableOpacity style={[styles.cancelButton, { backgroundColor: primaryColor }]} onPress={handleCancelBooking}>
        <ThemedText style={styles.cancelButtonText}>Cancel Booking</ThemedText>
      </TouchableOpacity>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  instructionText: {
    fontSize: 16,
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
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  selectedDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  radioLabel: {
    fontSize: 16,
  },
  divider: {
    height: 1,
    marginBottom: 24,
  },
  otherSection: {
    marginBottom: 24,
  },
  otherLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  textArea: {
    height: 220,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    textAlignVertical: 'top',
  },
  cancelButton: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});