import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '../../hooks/use-theme-color';
import { useColorScheme } from 'react-native';

const { width } = Dimensions.get('window');

const BusinessDashboard = () => {
  // Get theme-aware colors
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  
  // Define custom colors based on theme
  const colorScheme = useColorScheme();
  const secondaryTextColor = colorScheme === 'dark' ? '#A0AEC0' : '#666666'; // Light gray for secondary text
  const cardBackgroundColor = colorScheme === 'dark' ? '#1F2937' : '#FFFFFF'; // Card background
  const borderLineColor = colorScheme === 'dark' ? '#374151' : '#E0E0E0'; // Border color
  
  // Mock data for appointments
  const appointments = [
    {
      id: '1',
      clientName: 'Micheal Brown',
      time: '10:30 AM',
      service: 'Haircut & Beard Trim',
      status: 'Confirmed',
      clientPhoto: require('../../assets/stock/img.png')
    },
    {
      id: '2',
      clientName: 'David Williams',
      time: '11:00 AM',
      service: 'Haircut',
      status: 'Confirmed',
      clientPhoto: require('../../assets/stock/rated.png')
    },
    {
      id: '3',
      clientName: 'John Smith',
      time: '1:00 PM',
      service: 'Beard Trim',
      status: 'Pending',
      clientPhoto: require('../../assets/stock/service.jpg')
    }
  ];

  // Mock data for messages
  const messages = [
    {
      id: '1',
      senderName: 'Micheal Brown',
      message: 'Hi, I want to book an appointment',
      time: '10:23 AM',
      isOnline: true,
      profilePhoto: require('../../assets/stock/img.png')
    },
    {
      id: '2',
      senderName: 'David Williams',
      message: 'Thanks for the great service!',
      time: 'Yesterday',
      isOnline: false,
      profilePhoto: require('../../assets/stock/rated.png')
    }
  ];

  return (
    <SafeAreaView style={getStyles(backgroundColor, textColor, secondaryTextColor, cardBackgroundColor, borderLineColor).container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={[getStyles(backgroundColor, textColor, secondaryTextColor, cardBackgroundColor, borderLineColor).headerContainer, { backgroundColor: cardBackgroundColor }] }>
          <View style={getStyles(backgroundColor, textColor, secondaryTextColor, cardBackgroundColor, borderLineColor).profileSection}>
            <Image 
              source={require('../../assets/stock/service.jpg')} 
              style={getStyles(backgroundColor, textColor, secondaryTextColor, cardBackgroundColor, borderLineColor).profilePicture} 
            />
            <View style={getStyles(backgroundColor, textColor, secondaryTextColor, cardBackgroundColor, borderLineColor).profileText}>
              <Text style={[getStyles(backgroundColor, textColor, secondaryTextColor, cardBackgroundColor, borderLineColor).welcomeText, { color: secondaryTextColor }]}>Welcome Back</Text>
              <Text style={[getStyles(backgroundColor, textColor, secondaryTextColor, cardBackgroundColor, borderLineColor).userName, { color: textColor }]}>Mr Clemz</Text>
            </View>
          </View>
          
          <View style={getStyles(backgroundColor, textColor, secondaryTextColor, cardBackgroundColor, borderLineColor).actionIcons}>
            <TouchableOpacity style={getStyles(backgroundColor, textColor, secondaryTextColor, cardBackgroundColor, borderLineColor).iconButton}>
              <Ionicons name="search-outline" size={20} color={textColor} />
            </TouchableOpacity>
            <TouchableOpacity style={[getStyles(backgroundColor, textColor, secondaryTextColor, cardBackgroundColor, borderLineColor).iconButton, { marginLeft: 12 }]}>
              <Ionicons name="notifications-outline" size={20} color={textColor} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Statistics Cards Section */}
        <View style={getStyles(backgroundColor, textColor, secondaryTextColor, cardBackgroundColor, borderLineColor).statsContainer}>
          {/* Today's Earning Card */}
          <View style={[getStyles(backgroundColor, textColor, secondaryTextColor, cardBackgroundColor, borderLineColor).earningCard, { backgroundColor: '#E8F5E9' }] }>
            <View>
              <Text style={[getStyles(backgroundColor, textColor, secondaryTextColor, cardBackgroundColor, borderLineColor).cardLabel, { color: secondaryTextColor }]}>Today's Earning</Text>
              <Text style={[getStyles(backgroundColor, textColor, secondaryTextColor, cardBackgroundColor, borderLineColor).cardValue, { color: '#000000' }]}>N20000</Text>
            </View>
            <View style={getStyles(backgroundColor, textColor, secondaryTextColor, cardBackgroundColor, borderLineColor).currencyButton}>
              <Ionicons name="cash-outline" size={18} color="#FFFFFF" />
            </View>
          </View>

          {/* Today's Appointments Card */}
          <View style={[getStyles(backgroundColor, textColor, secondaryTextColor, cardBackgroundColor, borderLineColor).appointmentCard, { backgroundColor: '#E3F2FD' }] }>
            <View>
              <Text style={[getStyles(backgroundColor, textColor, secondaryTextColor, cardBackgroundColor, borderLineColor).cardLabel, { color: secondaryTextColor, width: '80%' }]}>Today's Appointments</Text>
              <Text style={[getStyles(backgroundColor, textColor, secondaryTextColor, cardBackgroundColor, borderLineColor).cardValue, { color: '#000000', width: '80%' }]}>5</Text>
            </View>
            <View style={[getStyles(backgroundColor, textColor, secondaryTextColor, cardBackgroundColor, borderLineColor).calendarButton, {marginLeft: -50}]}>
              <Ionicons name="calendar-outline" size={18} color="#FFFFFF" />
            </View>
          </View>
        </View>

        {/* Today's Appointment Section */}
        <View style={getStyles(backgroundColor, textColor, secondaryTextColor, cardBackgroundColor, borderLineColor).sectionHeader}>
          <Text style={[getStyles(backgroundColor, textColor, secondaryTextColor, cardBackgroundColor, borderLineColor).sectionTitle, { color: textColor }]}>Today's Appointment</Text>
          <TouchableOpacity>
            <Text style={getStyles(backgroundColor, textColor, secondaryTextColor, cardBackgroundColor, borderLineColor).seeAllLink}>See all</Text>
          </TouchableOpacity>
        </View>

        {/* Appointment Cards */}
        <View style={getStyles(backgroundColor, textColor, secondaryTextColor, cardBackgroundColor, borderLineColor).appointmentsContainer}>
          {appointments.map((appointment) => (
            <View key={appointment.id} style={[getStyles(backgroundColor, textColor, secondaryTextColor, cardBackgroundColor, borderLineColor).appointmentCardContainer, { backgroundColor: cardBackgroundColor, borderColor: borderLineColor }] }>
              <Image 
                source={appointment.clientPhoto} 
                style={getStyles(backgroundColor, textColor, secondaryTextColor, cardBackgroundColor, borderLineColor).clientPhoto} 
              />
              
              <View style={getStyles(backgroundColor, textColor, secondaryTextColor, cardBackgroundColor, borderLineColor).clientInfo}>
                <View style={getStyles(backgroundColor, textColor, secondaryTextColor, cardBackgroundColor, borderLineColor).clientNameContainer}>
                  <Text style={[getStyles(backgroundColor, textColor, secondaryTextColor, cardBackgroundColor, borderLineColor).clientName, { color: textColor }]}>{appointment.clientName}</Text>
                  <View style={getStyles(backgroundColor, textColor, secondaryTextColor, cardBackgroundColor, borderLineColor).statusContainer}>
                    <View style={[
                      getStyles(backgroundColor, textColor, secondaryTextColor, cardBackgroundColor, borderLineColor).statusBadge, 
                      { backgroundColor: appointment.status === 'Confirmed' ? '#E3F2FD' : '#FFF3E0' }
                    ]}>
                      <Text style={[
                        getStyles(backgroundColor, textColor, secondaryTextColor, cardBackgroundColor, borderLineColor).statusText,
                        { color: appointment.status === 'Confirmed' ? '#2196F3' : '#FF9800' }
                      ]}>
                        {appointment.status}
                      </Text>
                    </View>
                    
                    <TouchableOpacity style={getStyles(backgroundColor, textColor, secondaryTextColor, cardBackgroundColor, borderLineColor).moreOptions}>
                      <Ionicons name="ellipsis-vertical" size={20} color={secondaryTextColor} />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={getStyles(backgroundColor, textColor, secondaryTextColor, cardBackgroundColor, borderLineColor).timeContainer}>
                  <Ionicons name="time-outline" size={14} color={secondaryTextColor} />
                  <Text style={[getStyles(backgroundColor, textColor, secondaryTextColor, cardBackgroundColor, borderLineColor).timeText, { color: secondaryTextColor }]}>{appointment.time}</Text>
                </View>
                <View style={getStyles(backgroundColor, textColor, secondaryTextColor, cardBackgroundColor, borderLineColor).serviceContainer}>
                  <Ionicons name="cut-outline" size={14} color={secondaryTextColor} />
                  <Text style={[getStyles(backgroundColor, textColor, secondaryTextColor, cardBackgroundColor, borderLineColor).serviceText, { color: secondaryTextColor }]}>{appointment.service}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Recent Messages Section */}
        <View style={getStyles(backgroundColor, textColor, secondaryTextColor, cardBackgroundColor, borderLineColor).sectionHeader}>
          <Text style={[getStyles(backgroundColor, textColor, secondaryTextColor, cardBackgroundColor, borderLineColor).sectionTitle, { color: textColor }]}>Recent Messages</Text>
          <TouchableOpacity>
            <Text style={getStyles(backgroundColor, textColor, secondaryTextColor, cardBackgroundColor, borderLineColor).seeAllLink}>See all</Text>
          </TouchableOpacity>
        </View>

        {/* Message Cards */}
        <View style={getStyles(backgroundColor, textColor, secondaryTextColor, cardBackgroundColor, borderLineColor).messagesContainer}>
          {messages.map((message) => (
            <View key={message.id} style={[getStyles(backgroundColor, textColor, secondaryTextColor, cardBackgroundColor, borderLineColor).messageCard, { backgroundColor: cardBackgroundColor }] }>
              <View style={getStyles(backgroundColor, textColor, secondaryTextColor, cardBackgroundColor, borderLineColor).messageProfileContainer}>
                <Image 
                  source={message.profilePhoto} 
                  style={getStyles(backgroundColor, textColor, secondaryTextColor, cardBackgroundColor, borderLineColor).messageProfilePhoto} 
                />
                {message.isOnline && (
                  <View style={getStyles(backgroundColor, textColor, secondaryTextColor, cardBackgroundColor, borderLineColor).onlineIndicator} />
                )}
              </View>
              
              <View style={getStyles(backgroundColor, textColor, secondaryTextColor, cardBackgroundColor, borderLineColor).messageContent}>
                <Text style={[getStyles(backgroundColor, textColor, secondaryTextColor, cardBackgroundColor, borderLineColor).messageSender, { color: textColor }]}>{message.senderName}</Text>
                <Text style={[getStyles(backgroundColor, textColor, secondaryTextColor, cardBackgroundColor, borderLineColor).messagePreview, { color: secondaryTextColor }]} numberOfLines={2}>
                  {message.message}
                </Text>
              </View>
              
              <Text style={[getStyles(backgroundColor, textColor, secondaryTextColor, cardBackgroundColor, borderLineColor).messageTime, { color: '#999999' }]}>{message.time}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const getStyles = (backgroundColor: string, textColor: string, secondaryTextColor: string, cardBackgroundColor: string, borderLineColor: string) => {
  return StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: backgroundColor,
  },
    headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
    profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
    profilePicture: {
    width: 36,
    height: 36,
    borderRadius: 28,
  },
    profileText: {
    marginLeft: 10,
  },
    welcomeText: {
    fontSize: 11,
    fontWeight: '400',
    color: secondaryTextColor,
  },
    userName: {
    fontSize: 14,
    fontWeight: '700',
    color: textColor,
    marginTop: 2,
  },
    actionIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
    iconButton: {
    padding: 6,
  },
    statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 16,
  },
    earningCard: {
    width: (width * 0.92) / 2 - 6, // 48% of screen width minus half of gap
    height: 90,
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
    appointmentCard: {
    width: (width * 0.92) / 2 - 6, // 48% of screen width minus half of gap
    height: 90,
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
    cardLabel: {
    fontSize: 11,
    fontWeight: '400',
    color: secondaryTextColor,
  },
    cardValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000000',
    marginTop: 4,
  },
    currencyButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#00C853',
    justifyContent: 'center',
    alignItems: 'center',
  },
    calendarButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
    sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
    sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: textColor,
  },
    seeAllLink: {
    fontSize: 12,
    fontWeight: '600',
    color: '#00C853',
  },
    appointmentsContainer: {
    paddingHorizontal: 8,
    marginBottom: 16,
  },
    appointmentCardContainer: {
    backgroundColor: cardBackgroundColor,
    borderWidth: 1,
    borderColor: borderLineColor,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 8,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  },
    clientPhoto: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
    clientInfo: {
    flex: 1,
    marginLeft: 12,
  },
    clientNameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
    clientName: {
    fontSize: 13,
    fontWeight: '700',
    color: textColor,
  },
    timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
    timeText: {
    fontSize: 11,
    fontWeight: '400',
    color: secondaryTextColor,
    marginLeft: 4,
  },
    serviceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
    serviceText: {
    fontSize: 11,
    fontWeight: '400',
    color: secondaryTextColor,
    marginLeft: 4,
  },
    statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
    statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
    statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
    moreOptions: {
    padding: 6,
  },
    messagesContainer: {
    paddingHorizontal: 8,
    marginBottom: 16,
  },
    messageCard: {
    backgroundColor: cardBackgroundColor,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 8,
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
    messageProfileContainer: {
    position: 'relative',
  },
    messageProfilePhoto: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
    onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
    messageContent: {
    flex: 1,
    marginLeft: 12,
  },
    messageSender: {
    fontSize: 12,
    fontWeight: '700',
    color: textColor,
  },
    messagePreview: {
    fontSize: 11,
    fontWeight: '400',
    color: secondaryTextColor,
    marginTop: 2,
  },
    messageTime: {
    fontSize: 12,
    fontWeight: '400',
    color: '#999999',
    position: 'absolute',
    top: 12,
    right: 12,
  },
  });
};

export default BusinessDashboard;