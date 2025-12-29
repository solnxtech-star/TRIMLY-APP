import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/use-theme-color';
import { TouchableOpacity } from 'react-native';
import { useColorScheme } from 'react-native';

const { width } = Dimensions.get('window');

const Availability = () => {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  
  // Define custom colors based on theme
  const colorScheme = useColorScheme();
  const cardBackgroundColor = colorScheme === 'dark' ? '#1F2937' : '#FFFFFF';
  const borderColor = colorScheme === 'dark' ? '#374151' : '#E0E0E0';
  const secondaryTextColor = colorScheme === 'dark' ? '#9CA3AF' : '#666666';
  const timeValueColor = colorScheme === 'dark' ? '#9CA3AF' : '#AAAAAA';
  
  const [availability, setAvailability] = useState([
    { day: 'Monday', enabled: true, startTime: '09:00', endTime: '17:00' },
    { day: 'Tuesday', enabled: true, startTime: '09:00', endTime: '17:00' },
    { day: 'Wednesday', enabled: true, startTime: '09:00', endTime: '17:00' },
    { day: 'Thursday', enabled: true, startTime: '09:00', endTime: '17:00' },
    { day: 'Friday', enabled: true, startTime: '09:00', endTime: '17:00' },
    { day: 'Saturday', enabled: true, startTime: '09:00', endTime: '17:00' },
    { day: 'Sunday', enabled: false, startTime: '09:00', endTime: '17:00' },
  ]);
  
  const handleToggleDay = (index: number) => {
    const updatedAvailability = [...availability];
    updatedAvailability[index].enabled = !updatedAvailability[index].enabled;
    setAvailability(updatedAvailability);
  };
  
  const handleTimeChange = (index: number, timeType: 'startTime' | 'endTime', increment: number) => {
    const updatedAvailability = [...availability];
    const currentDay = updatedAvailability[index];
    
    if (timeType === 'startTime') {
      const [hours, minutes] = currentDay.startTime.split(':').map(Number);
      let newHours = hours;
      let newMinutes = minutes;
      
      newMinutes += increment * 15; // 15-minute increments
      if (newMinutes >= 60) {
        newHours += 1;
        newMinutes = 0;
      } else if (newMinutes < 0) {
        newHours -= 1;
        newMinutes = 45;
      }
      
      if (newHours >= 24) newHours = 0;
      if (newHours < 0) newHours = 23;
      
      updatedAvailability[index].startTime = `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
    } else {
      const [hours, minutes] = currentDay.endTime.split(':').map(Number);
      let newHours = hours;
      let newMinutes = minutes;
      
      newMinutes += increment * 15; // 15-minute increments
      if (newMinutes >= 60) {
        newHours += 1;
        newMinutes = 0;
      } else if (newMinutes < 0) {
        newHours -= 1;
        newMinutes = 45;
      }
      
      if (newHours >= 24) newHours = 0;
      if (newHours < 0) newHours = 23;
      
      updatedAvailability[index].endTime = `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
    }
    
    setAvailability(updatedAvailability);
  };

  const handleContinue = () => {
    // Handle continue action
    console.log('Continue with availability settings:', availability);
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: backgroundColor }]}>      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>Set Availability</Text>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.instructionText, { color: secondaryTextColor }]}>Set your regular working hours. You can adjust these later or set special hours for specific dates.</Text>
        
        {availability.map((day, index) => (
          <View key={index} style={styles.dayContainer}>
            <View style={styles.dayHeader}>
              <Switch
                trackColor={{ false: '#E0E0E0', true: colorScheme === 'dark' ? '#4B5563' : '#000000' }}
                thumbColor="#FFFFFF"
                onValueChange={() => handleToggleDay(index)}
                value={day.enabled}
                style={styles.toggleSwitch}
              />
              <Text style={[styles.dayLabel, { color: textColor }]}>{day.day}</Text>
            </View>
            
            {day.enabled && (
              <View style={styles.timePickerContainer}>
                <View style={styles.timePickerColumn}>
                  <Text style={[styles.timeLabel, { color: textColor }]}>Start Time</Text>
                  <View style={[styles.timePicker, { backgroundColor: cardBackgroundColor, borderColor: borderColor }]}>
                    <Text style={[styles.timeValue, { color: timeValueColor }]}>{day.startTime}</Text>
                    <View style={styles.spinnerContainer}>
                      <TouchableOpacity onPress={() => handleTimeChange(index, 'startTime', 1)}>
                        <Ionicons name="chevron-up" size={14} color={textColor} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleTimeChange(index, 'startTime', -1)}>
                        <Ionicons name="chevron-down" size={14} color={textColor} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                
                <View style={styles.timePickerColumn}>
                  <Text style={[styles.timeLabel, { color: textColor }]}>End Time</Text>
                  <View style={[styles.timePicker, { backgroundColor: cardBackgroundColor, borderColor: borderColor }]}>
                    <Text style={[styles.timeValue, { color: timeValueColor }]}>{day.endTime}</Text>
                    <View style={styles.spinnerContainer}>
                      <TouchableOpacity onPress={() => handleTimeChange(index, 'endTime', 1)}>
                        <Ionicons name="chevron-up" size={14} color={textColor} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleTimeChange(index, 'endTime', -1)}>
                        <Ionicons name="chevron-down" size={14} color={textColor} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 100, // Extra padding to account for the button at the bottom
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginRight: 32, // To account for the back button space
  },
  instructionText: {
    fontSize: 13,
    marginBottom: 24,
    lineHeight: 18,
  },
  dayContainer: {
    marginBottom: 24,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  toggleSwitch: {
    width: 50,
    height: 30,
    marginRight: 12,
  },
  dayLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  timePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timePickerColumn: {
    width: '47%',
  },
  timeLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  timePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 12,
    height: 54,
    paddingHorizontal: 16,
  },
  timeValue: {
    fontSize: 13,
  },
  spinnerContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
  },
  continueButton: {
    backgroundColor: '#2E7D32',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default Availability;