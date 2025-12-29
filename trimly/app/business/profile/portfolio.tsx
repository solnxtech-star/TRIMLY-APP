import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/use-theme-color';
import { TouchableOpacity } from 'react-native';
import { useColorScheme } from 'react-native';

const Portfolio = () => {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  
  // Define custom colors based on theme
  const colorScheme = useColorScheme();
  const cardBackgroundColor = colorScheme === 'dark' ? '#1F2937' : '#FFFFFF';
  const borderColor = colorScheme === 'dark' ? '#374151' : '#E0E0E0';
  const secondaryTextColor = colorScheme === 'dark' ? '#9CA3AF' : '#666666';
  const reviewTextColor = colorScheme === 'dark' ? '#D1D5DB' : '#333333';
  
  const [activeTab, setActiveTab] = useState('Reviews');
  
  // Mock data for reviews
  const reviews = [
    { 
      id: 1, 
      name: 'John D.', 
      date: '2024-01-10', 
      rating: 5, 
      review: 'Excellent service! The barber was very skilled and prodessional',
      profileImage: null // In a real app, this would be an image URL
    },
    { 
      id: 2, 
      name: 'Sharon Herbert', 
      date: '2024-01-10', 
      rating: 5, 
      review: 'Great atmosphere and quality service. Highly recommend.',
      profileImage: null
    },
    { 
      id: 3, 
      name: 'John D.', 
      date: '2024-01-10', 
      rating: 5, 
      review: 'Excellent service! The barber was very skilled and prodessional',
      profileImage: null
    },
    { 
      id: 4, 
      name: 'Jacob Harry', 
      date: '2024-01-10', 
      rating: 5, 
      review: 'Best haircut i\'ve had in years, will definetly be coming back!!!',
      profileImage: null
    },
  ];

  const handleReply = (reviewId: number) => {
    // Handle reply to review
    console.log('Reply to review:', reviewId);
  };
    
  const renderStars = (rating: number) => {
    return (
      <View style={styles.starsContainer}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Ionicons 
            key={index} 
            name={index < rating ? 'star' : 'star-outline'} 
            size={18} 
            color={index < rating ? '#FFD700' : secondaryTextColor} 
          />
        ))}
      </View>
    );
  };
    
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: backgroundColor }]}>      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>Portfolio & Reviews</Text>
      </View>
        
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={styles.tabButton}
          onPress={() => setActiveTab('Portfolios')}
        >
          <Text style={[styles.tabText, { color: activeTab === 'Portfolios' ? textColor : secondaryTextColor, fontWeight: activeTab === 'Portfolios' ? 'bold' : 'normal' }]}>Portfolios (4)</Text>
          {activeTab === 'Portfolios' && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.tabButton}
          onPress={() => setActiveTab('Reviews')}
        >
          <Text style={[styles.tabText, { color: activeTab === 'Reviews' ? '#2E7D32' : textColor, fontWeight: activeTab === 'Reviews' ? 'bold' : 'normal' }]}>Reviews (3)</Text>
          {activeTab === 'Reviews' && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
      </View>
        
      {activeTab === 'Reviews' && (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {reviews.map((review) => (
            <View key={review.id} style={[styles.reviewCard, { backgroundColor: cardBackgroundColor, borderColor: borderColor }]}>              
              {/* Card Header */}
              <View style={styles.cardHeader}>
                <View style={styles.profileSection}>
                  <View style={styles.profilePhotoPlaceholder}>
                    <Ionicons name="person-circle" size={60} color={secondaryTextColor} />
                  </View>
                  <View>
                    <Text style={[styles.reviewerName, { color: textColor }]}>{review.name}</Text>
                    {renderStars(review.rating)}
                  </View>
                </View>
                <Text style={[styles.reviewDate, { color: secondaryTextColor }]}>{review.date}</Text>
              </View>
                
              {/* Review Content */}
              <Text style={[styles.reviewText, { color: reviewTextColor }]}>{review.review}</Text>
                
              {/* Reply Button */}
              <TouchableOpacity style={styles.replyButton} onPress={() => handleReply(review.id)}>
                <Ionicons name="chatbubble-outline" size={18} color="#2E7D32" />
                <Text style={[styles.replyText, { color: '#2E7D32' }]}>Reply</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
        
      {activeTab === 'Portfolios' && (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Text style={{ color: textColor }}>Portfolio content would be displayed here</Text>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 24,
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
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginRight: 32, // To account for the back button space
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tabButton: {
    alignItems: 'center',
    paddingBottom: 12,
    flex: 1,
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: 0,
    width: '50%',
    height: 4,
    backgroundColor: '#2E7D32',
    borderRadius: 2,
  },
  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePhotoPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  reviewerName: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  reviewDate: {
    fontSize: 13,
    fontWeight: 'normal',
  },
  reviewText: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  replyButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  replyText: {
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 6,
  },
});

export default Portfolio;