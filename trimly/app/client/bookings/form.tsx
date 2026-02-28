import { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
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
import authService from '@/services/authService';
import bookingService from '@/services/bookingService';
import CustomAlert from '@/components/CustomAlert';

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
  const [viewedDate, setViewedDate] = useState(new Date());
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Custom Alert state
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    title: string;
    message: string;
    buttons?: any[];
  }>({
    visible: false,
    title: '',
    message: '',
  });

  const showAlert = (title: string, message: string, buttons?: any[]) => {
    setAlertConfig({
      visible: true,
      title,
      message,
      buttons,
    });
  };

  const hideAlert = () => {
    setAlertConfig(prev => ({ ...prev, visible: false }));
  };

  // Theme colors
  const backgroundColor = useThemeColor({ light: '#ffffff', dark: '#000000' }, 'background');
  const textColor = useThemeColor({ light: '#000000', dark: '#ffffff' }, 'text');
  const borderColor = useThemeColor({ light: '#E5E5E5', dark: '#424242' }, 'text');
  const cardBackgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#1A1A1A' }, 'text');

  const generateMonthDays = (baseDate: Date): DateItem[] => {
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const items: DateItem[] = [];
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month, i);
      const weekdayIndex = d.getDay();
      items.push({
        labelDay: dayLabels[weekdayIndex],
        labelDate: String(i),
        isoDate: d.toISOString().split('T')[0],
        weekdayIndex,
      });
    }

    return items;
  };

  const dates = generateMonthDays(viewedDate);

  const formatTime = (timeStr: string) => {
    const parts = timeStr.split(':');
    const hour = parseInt(parts[0], 10) || 0;
    const minute = parseInt(parts[1], 10) || 0;
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    const minutePadded = minute.toString().padStart(2, '0');
    return `${displayHour}:${minutePadded}${period}`;
  };

  const generate30MinSlots = (startTime: string, endTime: string): string[] => {
    const slots: string[] = [];
    // Use a fixed date to handle time calculations
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);

    let current = new Date(start);
    while (current < end) {
      const timeStr = current.toTimeString().split(' ')[0];
      slots.push(formatTime(timeStr));
      current.setMinutes(current.getMinutes() + 30);
    }
    return slots;
  };

  const changeMonth = (offset: number) => {
    const newDate = new Date(viewedDate);
    newDate.setMonth(viewedDate.getMonth() + offset);
    setViewedDate(newDate);
    setSelectedDate(null);
    setSelectedTime(null);
    setTimeSlots([]);
    setDate('');
    setTime('');
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
    
    const allSlots: string[] = [];
    dayAvailabilities.forEach((a) => {
      const slots = generate30MinSlots(a.start_time, a.end_time);
      allSlots.push(...slots);
    });

    // Sort slots by time
    const sortedSlots = allSlots.sort((a, b) => {
      const parseTime = (t: string) => {
        const [timePart, period] = t.match(/(\d+:\d+)(AM|PM)/)?.slice(1) || [];
        let [h, m] = timePart.split(':').map(Number);
        if (period === 'PM' && h !== 12) h += 12;
        if (period === 'AM' && h === 12) h = 0;
        return h * 60 + m;
      };
      return parseTime(a) - parseTime(b);
    });

    const uniqueSlots = [...new Set(sortedSlots)];
    setTimeSlots(uniqueSlots);
    setSelectedTime(null);
    if (uniqueSlots.length === 0) {
      setTime('');
    }
  };

  const monthYearLabel = viewedDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const handleConfirmBooking = async () => {
    if (!date || !time) {
      showAlert('Selection required', 'Please select a date and time for your appointment');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const user = await authService.getCurrentUser();
      
      // Parse time (e.g., "8:30AM") to "HH:MM:SS.000Z"
      const [timePart, period] = time.match(/(\d+:\d+)(AM|PM)/)?.slice(1) || [];
      let [h, m] = timePart.split(':').map(Number);
      if (period === 'PM' && h !== 12) h += 12;
      if (period === 'AM' && h === 12) h = 0;
      
      const startTimeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:00`;
      
      const isSalon = businessType === 'salon';
      const serviceUuid = String(optionId);

      // Basic UUID validation regex
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(serviceUuid);

      const performBooking = async () => {
        const bookingData = {
          customer: user.id,
          salon_service: isSalon ? serviceUuid : null,
          vendor_service: !isSalon ? serviceUuid : null,
          date: date,
          start_time: startTimeStr,
          status: 'pending',
          payment_reference: 'PRE_PAID_PENDING', // Placeholder as per instructions
          is_rated: false,
          notes: notes
        };
        
        console.log('🚀 [BOOKING FORM] Submitting booking payload:', JSON.stringify(bookingData, null, 2));
        
        await bookingService.confirmBooking(bookingData);
        
        // Navigate to confirmation screen
        router.push('/client/bookings/confirmation');
      };

      if (!optionId || serviceUuid === 'undefined' || !isUuid) {
        console.warn('⚠️ [BOOKING FORM] Invalid service UUID detected:', serviceUuid);
        showAlert(
          'Invalid Service ID', 
          'The selected service has an invalid identifier. You can still try to book, but the request might be rejected by the server.',
          [{ 
            text: 'Try Anyway', 
            onPress: () => {
              hideAlert();
              performBooking().catch(err => {
                console.error('Booking retry failed:', err);
                showAlert('Booking Failed', err.message || 'An unexpected error occurred');
              });
            }
          }]
        );
        setIsSubmitting(false);
        return;
      }
      
      await performBooking();
    } catch (error: any) {
      console.error('Failed to create booking:', error);
      showAlert('Booking Failed', error.message || 'An unexpected error occurred while processing your booking');
    } finally {
      setIsSubmitting(false);
    }
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
              <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.monthArrow}>
                <AntDesign name="left" size={16} color="#666666" />
              </TouchableOpacity>
              <ThemedText style={[styles.monthYearText, { color: textColor }]}>{monthYearLabel}</ThemedText>
              <TouchableOpacity onPress={() => changeMonth(1)} style={styles.monthArrow}>
                <AntDesign name="right" size={16} color="#666666" />
              </TouchableOpacity>
            </View>
          </View>
          {isLoadingAvailability ? (
            <ActivityIndicator size="small" color="#2D8A47" style={{ marginVertical: 20 }} />
          ) : (
            <View style={styles.dateGrid}>
              {dates.map((item, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={[
                    styles.dateItemGrid, 
                    { 
                      backgroundColor: selectedDate === index ? '#2D8A47' : cardBackgroundColor, 
                      borderColor: borderColor 
                    }
                  ]}
                  onPress={() => handleSelectDate(index)}
                >
                  <ThemedText style={[styles.dayTextSmall, { color: selectedDate === index ? '#FFFFFF' : '#666666' }]}>{item.labelDay}</ThemedText>
                  <ThemedText style={[styles.dateTextGrid, { color: selectedDate === index ? '#FFFFFF' : textColor }]}>{item.labelDate}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Time Selection */}
        <View style={styles.formSection}>
          <ThemedText style={styles.sectionTitle}>Select Time</ThemedText>
          <View style={styles.timeGrid}>
            {timeSlots.map((slot, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.timeSlotGrid,
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
                <ThemedText
                  style={[
                    styles.timeTextGrid,
                    { color: selectedTime === index ? '#FFFFFF' : textColor },
                  ]}
                >
                  {slot}
                </ThemedText>
              </TouchableOpacity>
            ))}
            {date && timeSlots.length === 0 && (
              <ThemedText style={{ color: '#666', marginTop: 8 }}>No availability for this date</ThemedText>
            )}
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
      <TouchableOpacity 
        style={[styles.confirmButton, isSubmitting && { opacity: 0.7 }]} 
        onPress={handleConfirmBooking}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <ThemedText style={styles.confirmButtonText}>Book Appointment</ThemedText>
        )}
      </TouchableOpacity>

      {/* Custom Alert Component */}
      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        buttons={alertConfig.buttons}
        onDismiss={hideAlert}
      />
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
    marginHorizontal: 12,
    fontWeight: '600',
  },
  monthArrow: {
    padding: 4,
  },
  dateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    justifyContent: 'space-between',
  },
  dateItemGrid: {
    width: '23.5%', // Slightly more width to fill 4 columns nicely
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  dayTextSmall: {
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 2,
  },
  dateTextGrid: {
    fontSize: FontSizes.sm, // 14
    fontWeight: '700',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
  },
  timeSlotGrid: {
    width: '31%', // 3 items per row with gaps
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
  },
  timeTextGrid: {
    fontSize: FontSizes.sm, // 14
    fontWeight: '600',
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
