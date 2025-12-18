import { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';

export default function BusinessDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('Services');

  // Sample business data - in a real app this would come from an API
  const businessImages = [
    require('@/assets/stock/img.png'),
    require('@/assets/stock/rated.png'),
    require('@/assets/stock/service.jpg'),
    require('@/assets/stock/special.jpg'),
  ];
  
  // Select image based on business ID
  const getImageForBusiness = (businessId: string) => {
    const index = parseInt(businessId) % businessImages.length;
    return businessImages[index];
  };
  
  const business = {
    id: id || '1',
    name: 'Glamour Haven',
    description: 'Premium beauty salon offering top-notch haircuts, styling, and grooming services.',
    location: 'No. 20 Ozuoba Rd, Ph',
    hours: 'Mon - Sun | 11am - 11pm',
    rating: 4.8,
    reviewCount: 120,
    image: getImageForBusiness(id as string || '1'),
  };

  const services = [
    { id: '1', name: 'Haircut', chevron: true },
    { id: '2', name: 'Braiding', chevron: true },
    { id: '3', name: 'Treatment', chevron: true },
    { id: '4', name: 'Massage', chevron: true },
    { id: '5', name: 'Nails', chevron: true },
  ];

  // Sample specialists data
  const specialists = [
    { id: '1', name: 'John Doe', rating: 4.8, image: require('@/assets/stock/img.png') },
    { id: '2', name: 'Jane Smith', rating: 4.9, image: require('@/assets/stock/rated.png') },
    { id: '3', name: 'Michael Brown', rating: 4.7, image: require('@/assets/stock/service.jpg') },
    { id: '4', name: 'Sarah Johnson', rating: 4.9, image: require('@/assets/stock/special.jpg') },
  ];

  // Sample packages data
  const packages = [
    {
      id: '1',
      name: 'Deluxe Hair Treatment',
      description: 'Complete hair care package including wash, cut, and styling',
      price: '₦4500',
      originalPrice: '₦6000',
      discount: '25% off',
      image: require('@/assets/stock/img.png'),
      duration: '60 min',
      staffName: 'John Doe',
      staffRating: 4.8,
      services: ['Hair Wash', 'Cut', 'Styling'],
    },
    {
      id: '2',
      name: 'Spa Day Package',
      description: 'Full body massage with facial and foot spa',
      price: '₦8000',
      originalPrice: '₦10000',
      discount: '20% off',
      image: require('@/assets/stock/service.jpg'),
      duration: '120 min',
      staffName: 'Jane Smith',
      staffRating: 4.9,
      services: ['Massage', 'Facial', 'Foot Spa'],
    },
  ];

  // Sample gallery images
  const galleryImages = [
    { id: '1', image: require('@/assets/stock/img.png') },
    { id: '2', image: require('@/assets/stock/rated.png') },
    { id: '3', image: require('@/assets/stock/service.jpg') },
    { id: '4', image: require('@/assets/stock/special.jpg') },
    { id: '5', image: require('@/assets/stock/img.png') },
    { id: '6', image: require('@/assets/stock/rated.png') },
  ];

  const handleServicePress = (serviceId: string) => {
    console.log('Selected service:', serviceId);
    // Navigate to service options screen
  };

  const handleBookAppointment = () => {
    console.log('Book appointment pressed');
    // Navigate to service selection screen
  };

  const handleBookPackage = (packageId: string) => {
    console.log('Book package pressed:', packageId);
    // Navigate to booking screen for specific package
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Hero Image Area */}
        <View style={styles.heroContainer}>
          <Image 
            source={business.image} 
            style={styles.heroImage} 
            resizeMode="cover"
          />
          <View style={styles.heroOverlay} />
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <AntDesign name="arrow-left" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.favoriteButton} onPress={() => setIsFavorite(!isFavorite)}>
            <IconSymbol name={isFavorite ? "heart.fill" : "heart"} size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Business Info */}
        <View style={styles.infoContainer}>
          {/* iOS-style indicator */}
          <View style={styles.indicator} />
          
          <ThemedText style={styles.businessName}>{business.name}</ThemedText>
          <ThemedText style={styles.businessDescription}>{business.description}</ThemedText>
          
          <View style={styles.locationContainer}>
            <IconSymbol name="location" size={20} color="#666666" />
            <ThemedText style={styles.locationText}>{business.location}</ThemedText>
          </View>
          
          <View style={styles.hoursContainer}>
            <AntDesign name="clock-circle" size={16} color="#666666" />
            <ThemedText style={styles.hoursText}>{business.hours}</ThemedText>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsRow}>
          <View style={styles.actionButtonItem}>
            <TouchableOpacity style={styles.actionButton}>
              <IconSymbol name="globe" size={24} color="#000000" />
            </TouchableOpacity>
            <ThemedText style={styles.actionButtonText}>Website</ThemedText>
          </View>
          <View style={styles.actionButtonItem}>
            <TouchableOpacity style={styles.actionButton}>
              <AntDesign name="message" size={24} color="#000000" />
            </TouchableOpacity>
            <ThemedText style={styles.actionButtonText}>Chat</ThemedText>
          </View>
          <View style={styles.actionButtonItem}>
            <TouchableOpacity style={styles.actionButton}>
              <IconSymbol name="phone" size={24} color="#000000" />
            </TouchableOpacity>
            <ThemedText style={styles.actionButtonText}>Call</ThemedText>
          </View>
          <View style={styles.actionButtonItem}>
            <TouchableOpacity style={styles.actionButton}>
              <IconSymbol name="location" size={24} color="#000000" />
            </TouchableOpacity>
            <ThemedText style={styles.actionButtonText}>Map</ThemedText>
          </View>
          <View style={styles.actionButtonItem}>
            <TouchableOpacity style={styles.actionButton}>
              <AntDesign name="share-alt" size={24} color="#000000" />
            </TouchableOpacity>
            <ThemedText style={styles.actionButtonText}>Share</ThemedText>
          </View>
        </View>

        {/* Component Navigator */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.componentNavigator}
          contentContainerStyle={styles.componentNavigatorContent}
        >
          {['Services', 'Specialist', 'Package', 'Gallery', 'Review'].map((tab) => (
            <TouchableOpacity 
              key={tab}
              style={[styles.navTab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <ThemedText style={[styles.navTabText, activeTab === tab && styles.activeTabText]}>
                {tab}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === 'Services' && (
            <>
              <ThemedText style={styles.tabTitle}>Services ({services.length})</ThemedText>
              {services.map((service) => (
                <TouchableOpacity 
                  key={service.id} 
                  style={styles.serviceItem}
                  onPress={() => handleServicePress(service.id)}
                >
                  <ThemedText style={styles.serviceName}>{service.name}</ThemedText>
                  {service.chevron && (
                    <IconSymbol name="chevron.right" size={20} color="#666666" />
                  )}
                </TouchableOpacity>
              ))}
            </>
          )}
          
          {activeTab === 'Specialist' && (
            <>
              <ThemedText style={styles.tabTitle}>Specialists ({specialists.length})</ThemedText>
              <View style={styles.specialistsGrid}>
                {specialists.map((specialist) => (
                  <View key={specialist.id} style={styles.specialistCard}>
                    <Image source={specialist.image} style={styles.specialistImage} />
                    <View style={styles.specialistInfo}>
                      <ThemedText style={styles.specialistName}>{specialist.name}</ThemedText>
                      <View style={styles.specialistRating}>
                        <IconSymbol name="star" size={16} color="#FFD700" />
                        <ThemedText style={styles.specialistRatingText}>{specialist.rating} <ThemedText style={{fontSize: 11, color: 'black'}}>(49 Reviews)</ThemedText></ThemedText>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </>
          )}
          
          {activeTab === 'Package' && (
            <>
              <ThemedText style={styles.tabTitle}>Packages ({packages.length})</ThemedText>
              {packages.map((pkg) => (
                <View key={pkg.id} style={styles.packageCard}>
                  <Image source={pkg.image} style={styles.packageImage} />
                  <View style={styles.packageInfo}>
                    <ThemedText style={styles.packageTitle}>{pkg.name}</ThemedText>
                    {/* <View style={styles.packageMetaRow}> */}
                      <View style={styles.packageDurationContainer}>
                        <AntDesign name="clock-circle" size={16} color="#666666" />
                        <ThemedText style={styles.packageDuration}>{pkg.duration}</ThemedText>
                      </View>
                      <View style={styles.packageStaffContainer}>
                        <ThemedText style={styles.packageStaffName}>{pkg.staffName}</ThemedText>
                        <View style={styles.packageStaffRating}>
                          <IconSymbol name="star" size={14} color="#FFD700" />
                          <ThemedText style={styles.packageStaffRatingText}>{pkg.staffRating}</ThemedText>
                        </View>
                      </View>
                    {/* </View> */}
                    <View style={styles.packageServices}>
                      {pkg.services.map((service, index) => (
                        <ThemedText key={index} style={styles.packageService}>
                          {service}{index < pkg.services.length - 1 ? ', ' : ''}
                        </ThemedText>
                      ))}
                    </View>
                    <View style={styles.packageBottomRow}>
                      <View style={styles.packagePriceContainer}>
                        <ThemedText style={styles.packagePrice}>{pkg.price}</ThemedText>
                        <ThemedText style={styles.packageOriginalPrice}>{pkg.originalPrice}</ThemedText>
                      </View>
                      <TouchableOpacity style={styles.bookNowButton} onPress={() => handleBookPackage(pkg.id)}>
                        <ThemedText style={styles.bookNowButtonText}>Book Now</ThemedText>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </>
          )}
          
          {activeTab === 'Gallery' && (
            <>
              <ThemedText style={styles.tabTitle}>Gallery ({galleryImages.length})</ThemedText>
              <View style={styles.galleryGrid}>
                {galleryImages.map((item) => (
                  <View key={item.id} style={styles.galleryImageContainer}>
                    <Image source={item.image} style={styles.galleryImage} />
                  </View>
                ))}
              </View>
            </>
          )}
          
          {activeTab === 'Review' && (
            <>
              <ThemedText style={styles.tabTitle}>Reviews (0)</ThemedText>
              <ThemedText>No reviews available at this time.</ThemedText>
            </>
          )}
        </View>
      </ScrollView>

      {/* Book Appointment Button */}
      <TouchableOpacity style={styles.bookButton} onPress={handleBookAppointment}>
        <ThemedText style={styles.bookButtonText}>Book Appointment</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  heroContainer: {
    height: 200,
    position: 'relative',
    zIndex: 1,
  },
  heroImage: {
    width: '100%',
    height: 230,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  backButton: {
    position: 'absolute',
    top: 36,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  favoriteButton: {
    position: 'absolute',
    top: 36,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  infoContainer: {
    marginTop: 0,
    paddingTop: 20,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    zIndex: 2
  },
  indicator: {
    width: 60,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#C7C7CC',
    alignSelf: 'center',
    marginBottom: 25,
  },
  businessName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  businessDescription: {
    fontSize: 14,
    color: '#000000',
    marginBottom: 12,
    lineHeight: 20,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#000000',
    marginLeft: 8,
    fontWeight: 'bold'
  },
  hoursContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 4,
  },
  hoursText: {
    fontSize: 14,
    color: '#000000',
    marginLeft: 8,
    fontWeight: 'bold'
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    // borderBottomWidth: 1,
    // borderBottomColor: '#E5E5E5',
  },
  actionButtonItem: {
    alignItems: 'center',
  },
  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionButtonText: {
    fontSize: 12,
    color: '#000000',
    marginTop: 4,
  },
  componentNavigator: {
    paddingVertical: 16
  },
  componentNavigatorContent: {
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  navTab: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginRight: 20,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2D8A47',
  },
  navTabText: {
    fontSize: 16,
    color: '#666666',
  },
  activeTabText: {
    color: '#2D8A47',
    fontWeight: '600',
  },
  specialistsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  specialistCard: {
    width: '48%',
    borderRadius: 12,
    // padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5'
  },
  specialistImage: {
    width: '100%',
    height: 140,
    marginBottom: 8,
  },
  specialistName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  specialistRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  specialistRatingText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 4,
  },
  specialistInfo: {
    paddingHorizontal: 10,
  },
  packageCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  packageImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginRight: 12,
  },
  packageInfo: {
    flex: 1,
  },
  packageTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  packageDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  packageServices: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  packageService: {
    fontSize: 12,
    color: '#2D8A47',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 4,
  },
  packageBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  packagePriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  packagePrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D8A47',
    marginRight: 8,
  },
  packageOriginalPrice: {
    fontSize: 14,
    color: '#999999',
    textDecorationLine: 'line-through',
  },
  packageDuration: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 4,
  },
  packageMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  packageDurationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  packageStaffContainer: {
    alignItems: 'flex-start',
  },
  packageStaffName: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '600',
  },
  packageStaffRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  packageStaffRatingText: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 4,
  },
  bookNowButton: {
    backgroundColor: '#2D8A47',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  bookNowButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  galleryImageContainer: {
    width: '48%',
    marginBottom: 12,
  },
  galleryImage: {
    width: '100%',
    height: 120,
    borderRadius: 12,
  },
  tabContent: {
    padding: 16,
  },
  tabTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 16,
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 15,
    marginBottom: 12,
  },
  serviceName: {
    fontSize: 18,
    color: '#000000',
  },
  bookButton: {
    backgroundColor: '#2D8A47',
    margin: 16,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  bookButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});