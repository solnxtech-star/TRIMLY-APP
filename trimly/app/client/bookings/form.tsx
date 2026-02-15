import { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColor } from '@/hooks/use-theme-color';
import { FontSizes } from '@/constants/theme';
import vendorService from '@/services/vendorService';
import salonService from '@/services/salonService';

interface Availability {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  salon: string | null;
  vendor: string | null;
}

interface DateItem {
  labelDay: string;
  labelDate: string;
  isoDate: string;
  weekdayIndex: number;
}

export default function BookingFormScreen() {
  const router = useRouter();
  const {
    optionId,
    businessId,
    businessType,
    serviceName,
    servicePrice,
    serviceDurationMinutes,
  } = useLocalSearchParams();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);

  // Theme colors
  const backgroundColor = useThemeColor({ light: '#ffffff', dark: '#000000' }, 'background');
  const textColor = useThemeColor({ light: '#000000', dark: '#ffffff' }, 'text');
  const borderColor = useThemeColor({ light: '#E5E5E5', dark: '#424242' }, 'text');
  const cardBackgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#1A1A1A' }, 'text');

  const getTimeFromIndex = (index: number) => {
    const hours = Math.floor(index / 2) + 9; // Starting from 9 AM
    const minutes = index % 2 === 0 ? '00' : '30';
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    return `${displayHours}:${minutes}${period}`;
  };

  const generateNext7Days = (): DateItem[] => {
    const today = new Date();
    const items: DateItem[] = [];
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const weekdayIndex = d.getDay();
      items.push({
        labelDay: dayLabels[weekdayIndex],
        labelDate: String(d.getDate()),
        isoDate: d.toISOString().split('T')[0],
        weekdayIndex,
      });
    }

    return items;
  };

  const dates = generateNext7Days();

  const formatTime = (timeStr: string) => {
    const parts = timeStr.split(':');
    const hour = parseInt(parts[0], 10) || 0;
    const minute = parseInt(parts[1], 10) || 0;
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    const minutePadded = minute.toString().padStart(2, '0');
    return `${displayHour}:${minutePadded}${period}`;
  };

  const formatTimeRange = (start: string, end: string) => {
    return `${formatTime(start)} - ${formatTime(end)}`;
  };

  useEffect(() => {
    const loadAvailability = async () => {
      if (!businessId) {
        return;
      }

      try {
        setIsLoadingAvailability(true);
        const type = typeof businessType === 'string' ? businessType.toLowerCase() : 'salon';
        let records: Availability[] = [];

        if (type === 'vendor') {
          records = await vendorService.getAvailability(String(businessId));
        } else {
          records = await salonService.getSalonAvailability(String(businessId));
        }

        setAvailability(records);
      } catch (e) {
        setAvailability([]);
      } finally {
        setIsLoadingAvailability(false);
      }
    };

    loadAvailability();
  }, [businessId, businessType]);

  const handleSelectDate = (index: number) => {
    setSelectedDate(index);
    const selected = dates[index];
    setDate(selected.isoDate);

    const dayAvailabilities = availability.filter(
      (a) => a.day_of_week === selected.weekdayIndex
    );
    const slots = dayAvailabilities.map((a) =>
      formatTimeRange(a.start_time, a.end_time)
    );
    setTimeSlots(slots);
    setSelectedTime(null);
    if (slots.length === 0) {
      setTime('');
    }
  };

  const handleConfirmBooking = () => {
    console.log('Booking confirmed with:', {
      date,
      time,
      notes,
      optionId,
      businessId,
      businessType,
      serviceName,
      servicePrice,
      serviceDurationMinutes,
    });
    // Navigate to confirmation screen
    router.push('/client/bookings/confirmation');
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={[styles.container, { backgroundColor }]}> 
      <ScrollView style={styles.content}>
        {/* Header with Back Button */}
        <View style={[styles.header, { backgroundColor: 'transparent' }]}> 
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <AntDesign name="left" size={20} color={textColor} />
          </TouchableOpacity>
          <ThemedText style={[styles.headerTitle, { color: textColor }]}>Book Appointment</ThemedText>
        </View>

        {/* Header Texts */}
        <View style={styles.headerTexts}>
          <ThemedText style={[styles.mainHeader, { color: textColor }]}>Select Date & Time</ThemedText>
          <ThemedText style={[styles.subHeader, { color: textColor }]}>Choose your Preferred appointment</ThemedText>
        </View>

        {/* Date Selection */}
        <View style={styles.formSection}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Select Date</ThemedText>
            <View style={styles.monthYearContainer}>
              <ThemedText style={styles.monthYearText}>December 2023</ThemedText>
              <IconSymbol name="chevron.down" size={16} color="#666666" />
            </View>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.dateContainer}>
              {dates.map((item, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={[styles.dateItem, { backgroundColor: selectedDate === index ? '#2D8A47' : cardBackgroundColor, borderColor: borderColor }]}
                  onPress={() => handleSelectDate(index)}
                >
                  <ThemedText style={[styles.dayText, { color: selectedDate === index ? '#FFFFFF' : textColor }]}>{item.labelDay}</ThemedText>
                  <ThemedText style={[styles.dateText, { color: selectedDate === index ? '#FFFFFF' : textColor }]}>{item.labelDate}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Time Selection */}
        <View style={styles.formSection}>
          <ThemedText style={styles.sectionTitle}>Select Time</ThemedText>
          <View style={styles.timeGrid}>
            {timeSlots.map((slot, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.timeSlot,
                  {
                    backgroundColor:
                      selectedTime === index ? '#2D8A47' : cardBackgroundColor,
                    borderColor: borderColor,
                  },
                ]}
                onPress={() => {
                  setSelectedTime(index);
                  setTime(slot);
                }}
              >
                <IconSymbol
                  name="clock"
                  size={16}
                  color={selectedTime === index ? '#FFFFFF' : '#666666'}
                />
                <ThemedText
                  style={[
                    styles.timeText,
                    { color: selectedTime === index ? '#FFFFFF' : textColor },
                  ]}
                >
                  {slot}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Notes */}
        <View style={styles.formSection}>
          <ThemedText style={[styles.sectionTitle, { color: textColor }]}>Additional Notes <ThemedText style={styles.optionalText}>(Optional)</ThemedText></ThemedText>
          <View style={[styles.textAreaContainer, { borderColor, backgroundColor: cardBackgroundColor }]}> 
            <TextInput
              style={[styles.textArea, { color: textColor }]}
              placeholder="Any special requests or notes..."
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              placeholderTextColor={'#8E8E93'}
            />
          </View>
        </View>
      </ScrollView>

      {/* Confirm Button */}
      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmBooking}>
        <ThemedText style={styles.confirmButtonText}>Book Appointment</ThemedText>
      </TouchableOpacity>
    </SafeAreaView>
  </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FontSizes.md, // 16
    fontWeight: '600',
    marginLeft: 16,
  },
  headerTexts: {
    padding: 16,
  },
  mainHeader: {
    fontSize: FontSizes.titleSm, // 24
    fontWeight: '700',
    marginBottom: 8,
  },
  subHeader: {
    fontSize: FontSizes.sm, // 14
  },
  formSection: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: FontSizes.md, // 16
    fontWeight: '600',
  },
  optionalText: {
    fontSize: FontSizes.sm, // 14
    fontWeight: 'normal',
  },
  monthYearContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthYearText: {
    fontSize: FontSizes.sm, // 14
    marginRight: 4,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
    gap: 15
  },
  dateItem: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
    minWidth: 60,
    borderWidth: 1
  },
  dayText: {
    fontSize: FontSizes.sm, // 14
    fontWeight: '600',
    marginBottom: 4,
  },
  dateText: {
    fontSize: FontSizes.sm, // 14
    fontWeight: '600',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timeSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%',
    padding: 8,
    marginVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  timeText: {
    fontSize: FontSizes.sm, // 14
    fontWeight: '600',
    marginLeft: 8,
  },
  textAreaContainer: {
    borderWidth: 1,
    borderRadius: 12,
  },
  textArea: {
    fontSize: FontSizes.sm, // 14
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  specialistCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  specialistInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  specialistAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  specialistName: {
    fontSize: FontSizes.sm, // 14
    fontWeight: '600',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: FontSizes.md, // 14
    marginLeft: 4,
  },
  confirmButton: {
    backgroundColor: '#2D8A47',
    margin: 16,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: FontSizes.lg, // 16
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
