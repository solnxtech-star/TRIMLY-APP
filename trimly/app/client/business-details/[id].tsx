import { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image, Platform, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useThemeColor } from '@/hooks/use-theme-color';
import { AntDesign } from '@expo/vector-icons';
import salonService from '@/services/salonService';
import vendorService from '@/services/vendorService';
import { Salon, Service, GalleryImage } from '@/types/salon.types';

export default function BusinessDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('Services');
  
  // Theme colors for packages section
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const cardBackgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#1A1A1A' }, 'background');
  const borderColor = useThemeColor({ light: '#E5E5E5', dark: '#424242' }, 'text');
  const secondaryTextColor = useThemeColor({ light: '#666666', dark: '#CCCCCC' }, 'text');
  const savingsBackgroundColor = useThemeColor(
    { light: '#F5F1E8', dark: '#2D2D2D' },
    'background'
  );
  const [salon, setSalon] = useState<Salon | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [businessType, setBusinessType] = useState<'salon' | 'vendor'>('salon');

  useEffect(() => {
    const loadSalon = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        setError(null);
        let resolvedSalon: Salon | null = null;

        try {
          const data = await salonService.getSalonById(String(id));
          resolvedSalon = data;
        } catch (err: any) {
          const status = err?.status || err?.response?.status;
          if (status === 404) {
            const vendor: any = await vendorService.getVendorById(String(id));

            const mappedSalon: Salon = {
              ...(vendor as any),
              name: vendor.worker || vendor.name || 'Vendor',
              about: vendor.bio,
              address: vendor.address,
              is_open: vendor.is_available,
              location: vendor.address || vendor.location || '',
              services: vendor.services || [],
              gallery: vendor.gallery || [],
            };

            resolvedSalon = mappedSalon;
            setBusinessType('vendor');
          } else {
            throw err;
          }
        }

        setSalon(resolvedSalon);
        setServices(resolvedSalon?.services || []);

        let resolvedGallery: GalleryImage[] = [];
        if (resolvedSalon) {
          try {
            resolvedGallery = await salonService.getSalonGallery(String(id));
          } catch {
            resolvedGallery = resolvedSalon.gallery || [];
          }
        }

        setGalleryItems(resolvedGallery);
      } catch (e: any) {
        setError(e.message || 'Failed to load salon');
      } finally {
        setIsLoading(false);
      }
    };

    loadSalon();
  }, [id]);

  const salonReviews = (salon as any)?.salon_reviews || [];
  const vendorGender =
    (salon as any)?.Gender || (salon as any)?.gender || null;
  const vendorActive =
    typeof (salon as any)?.is_active === 'boolean'
      ? (salon as any)?.is_active
      : null;
  const vendorStatusText = [
    vendorGender
      ? String(vendorGender).charAt(0).toUpperCase() +
        String(vendorGender).slice(1)
      : null,
    vendorActive !== null ? (vendorActive ? 'Active' : 'Inactive') : null,
  ]
    .filter(Boolean)
    .join(' • ');

  const heroImageSource =
    salon && salon.profile_pic
      ? { uri: salon.profile_pic }
      : salon && salon.gallery && salon.gallery.length > 0
      ? { uri: salon.gallery[0].image }
      : require('@/assets/stock/service.jpg');

  const businessName = salon?.name || 'Salon';
  const businessDescription = salon?.about || 'No description available';
  const businessLocation = salon?.address || salon?.location || '';
  const businessHours = salon?.is_open ? 'Open now' : 'Closed';

  const specialists = (salon as any)?.specialists || [];

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

  const handleServicePress = (service: Service, index: number) => {
    if (!service.id) {
      console.warn('⚠️ [BUSINESS DETAILS] Service is missing a valid ID');
      return;
    }

    router.push({
      pathname: '/client/components/service-options',
      params: {
        salonId: String(id),
        businessType,
        serviceId: String(service.id),
        serviceName: service.name,
        serviceDescription: service.description || '',
        servicePrice: String(service.price),
        serviceDurationMinutes: String(service.duration_minutes),
      },
    });
  };

  const handleBookAppointment = () => {
    console.log('Book appointment pressed');
    // Navigate to service options screen in components folder with source parameter
    router.push({
      pathname: '/client/components/service-options',
      params: {
        source: 'appointment',
        salonId: String(id),
        businessType: businessType,
      },
    });
  };

  const handleBookPackage = (packageId: string) => {
    console.log('Book package pressed:', packageId);
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#2D8A47" />
          <ThemedText style={{ marginTop: 16 }}>Loading salon...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.container}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 24,
          }}
        >
          <ThemedText style={{ textAlign: 'center' }}>{error}</ThemedText>
          <TouchableOpacity style={styles.bookButton} onPress={() => router.back()}>
            <ThemedText style={styles.bookButtonText}>Go Back</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Hero Image Area */}
        <View style={styles.heroContainer}>
          <Image 
            source={heroImageSource} 
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

        <ThemedView style={styles.infoContainer}>
          {/* iOS-style indicator */}
          <View style={styles.indicator} />
          
          <ThemedText style={styles.businessName}>{businessName}</ThemedText>
          <ThemedText style={styles.businessDescription}>{businessDescription}</ThemedText>
          
          <View style={styles.locationContainer}>
            <IconSymbol name="location" size={20} color="#666666" />
            <ThemedText style={styles.locationText}>{businessLocation}</ThemedText>
          </View>
          
          <View style={styles.hoursContainer}>
            <AntDesign name="clock-circle" size={16} color="#666666" />
            <ThemedText style={styles.hoursText}>{businessHours}</ThemedText>
          </View>

          {vendorStatusText ? (
            <View style={styles.statusContainer}>
              <AntDesign name="user" size={16} color="#666666" />
              <ThemedText style={styles.statusText}>{vendorStatusText}</ThemedText>
            </View>
          ) : null}
        </ThemedView>

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

        {/* Packages Section */}
        <View style={[styles.packagesSection, { backgroundColor: backgroundColor }]}> 
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.packagesScrollContent}
          >
            {packages.map((pkg) => (
              <View key={pkg.id} style={[styles.packageCardHorizontal, { backgroundColor: cardBackgroundColor, borderColor: borderColor }]}> 
                {/* Best Deal Badge */}
                <View style={styles.badge}>
                  <ThemedText style={styles.badgeIcon}>🔥</ThemedText>
                  <ThemedText style={styles.badgeText}>BEST DEAL</ThemedText>
                </View>

                <View style={styles.packageCardContent}>
                  {/* Image Section with Discount Badge */}
                  <View style={styles.packageImageContainer}>
                    <Image
                      source={pkg.image}
                      style={styles.packageImageHorizontal}
                    />
                    <View style={styles.discountBadge}>
                      <ThemedText style={styles.saveText}>Save</ThemedText>
                      <ThemedText style={styles.percentText}>{pkg.discount.replace('% off', '')}%</ThemedText>
                    </View>
                  </View>

                  {/* Content Section */}
                  <View style={styles.packageContentHorizontal}>
                    <ThemedText style={[styles.packageTitleHorizontal, { color: textColor }]}>{pkg.name}</ThemedText>
                    <ThemedText style={[styles.packageSubtitle, { color: secondaryTextColor }]}>{pkg.description}</ThemedText>

                    {/* Services List */}
                    <View style={styles.servicesList}>
                      {pkg.services.map((service, index) => (
                        <View key={index} style={styles.serviceItemHorizontal}>
                          <ThemedText style={[styles.checkmark, { color: '#2D7A3E' }]}>✓</ThemedText>
                          <ThemedText style={[styles.serviceText, { color: textColor }]}>{service}</ThemedText>
                        </View>
                      ))}
                    </View>

                    {/* Provider Info */}
                    <View style={[styles.providerContainer, { borderTopColor: borderColor }]}> 
                      <Image
                        source={require('@/assets/stock/img.png')}
                        style={styles.avatar}
                      />
                      <ThemedText style={[styles.providerName, { color: textColor }]}>{pkg.staffName}</ThemedText>
                      <ThemedText style={[styles.rating, { color: secondaryTextColor }]}>{pkg.staffRating}</ThemedText>
                      <ThemedText style={styles.star}>⭐</ThemedText>
                      <ThemedText style={[styles.reviews, { color: secondaryTextColor }]}>49 Review</ThemedText>
                    </View>

                    {/* Pricing */}
                    <View style={styles.pricingContainer}>
                      <ThemedText style={[styles.oldPrice, { color: secondaryTextColor }]}>{pkg.originalPrice}</ThemedText>
                      <ThemedText style={[styles.arrow, { color: secondaryTextColor }]}>→</ThemedText>
                      <ThemedText style={[styles.newPrice, { color: '#2D7A3E' }]}>{pkg.price}</ThemedText>
                    </View>

                    <View
                      style={[
                        styles.savingsContainer,
                        { backgroundColor: savingsBackgroundColor },
                      ]}
                    >
                      <ThemedText style={[styles.savingsText, { color: secondaryTextColor }]}> 
                        You save <ThemedText style={[styles.savingsAmount, { color: textColor }]}>₦{(parseInt(pkg.originalPrice.replace('₦', '')) - parseInt(pkg.price.replace('₦', ''))).toLocaleString()}</ThemedText> ({pkg.discount})
                      </ThemedText>
                    </View>

                    {/* Footer with Validity and CTA */}
                    <View style={styles.footer}>
                      <View style={styles.validityContainer}>
                        <ThemedText style={[styles.validityIcon, { color: secondaryTextColor }]}>⏱</ThemedText>
                        <ThemedText style={[styles.validityText, { color: secondaryTextColor }]}> 
                          Valid until{'\n'}Dec 31
                        </ThemedText>
                      </View>
                      <TouchableOpacity style={[styles.ctaButton, { backgroundColor: '#2D7A3E' }]} onPress={() => handleBookPackage(pkg.id)}>
                        <ThemedText style={styles.ctaText}>Book Promo Now</ThemedText>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Component Navigator */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.componentNavigator}
          contentContainerStyle={styles.componentNavigatorContent}
        >
          {['Services', 'Specialist', 'Review', 'Gallery'].map((tab) => (
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
              {services.map((service, index) => (
                <TouchableOpacity
                  key={String(service.id ?? index)}
                  style={styles.serviceItem}
                  onPress={() =>
                    handleServicePress(service, index)
                  }
                >
                  <ThemedText style={styles.serviceName}>{service.name}</ThemedText>
                  <IconSymbol name="chevron.right" size={20} color="#666666" />
                </TouchableOpacity>
              ))}
            </>
          )}
          
          {activeTab === 'Specialist' && (
            <>
              <ThemedText style={styles.tabTitle}>Specialists ({specialists.length})</ThemedText>
              <View style={styles.specialistsGrid}>
                {specialists.map((specialist:any) => (
                  <View key={specialist.id} style={styles.specialistCard}>
                    <Image source={specialist.image} style={styles.specialistImage} />
                    <View style={styles.specialistInfo}>
                      <ThemedText style={styles.specialistName}>{specialist.name}</ThemedText>
                      <View style={styles.specialistRating}>
                        <IconSymbol name="star" size={12} color="#FFD700" />
                        <ThemedText style={styles.specialistRatingText}>{specialist.rating} <ThemedText style={{fontSize: 11}}>(49 Reviews)</ThemedText></ThemedText>
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
          
          {activeTab === 'Review' && (
            <>
              <ThemedText style={styles.tabTitle}>Reviews ({salonReviews.length})</ThemedText>
              {salonReviews.map((review: any) => (
                <View key={review.id} style={styles.reviewCard}>
                  <ThemedText style={styles.reviewDate}>{review.created_at}</ThemedText>
                  <View style={styles.reviewUserInfo}>
                    <Image
                      source={require('@/assets/stock/service.jpg')}
                      style={styles.reviewUserImage}
                    />
                    <View style={styles.reviewUserNameRating}>
                      <ThemedText style={styles.reviewUserName}>
                        {review.customer_name}
                      </ThemedText>
                      <View style={styles.reviewRating}>
                        {[...Array(5)].map((_, i) => (
                          <IconSymbol
                            key={i}
                            name="star"
                            size={12}
                            color={i < Math.floor(review.rating || 0) ? '#FFD700' : '#E0E0E0'}
                          />
                        ))}
                        <ThemedText style={styles.reviewRatingText}>
                          {review.rating}
                        </ThemedText>
                      </View>
                    </View>
                  </View>
                  <ThemedText style={styles.reviewText}>{review.review}</ThemedText>
                </View>
              ))}
            </>
          )}
          
          {activeTab === 'Gallery' && (
            <>
              <ThemedText style={styles.tabTitle}>Gallery ({galleryItems.length})</ThemedText>
              <View style={styles.galleryGrid}>
                {galleryItems.map((item: any, index: number) => (
                  <View
                    key={String(item.id || index)}
                    style={styles.galleryImageContainer}
                  >
                    <Image source={{ uri: item.image }} style={styles.galleryImage} />
                  </View>
                ))}
              </View>
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
    marginTop: 15,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    zIndex: 2,
    // backgroundColor: 'white'
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
    marginBottom: 8,
  },
  businessDescription: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
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
    marginLeft: 8,
    fontWeight: 'bold'
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 4,
    marginTop: 4,
  },
  statusText: {
    fontSize: 14,
    marginLeft: 8,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
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
    paddingHorizontal: 5,
    marginRight: 20,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2D8A47',
  },
  navTabText: {
    fontSize: 13,
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
    width: '47%',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    zIndex: 2,
    overflow: 'hidden',
    paddingBottom: 5
  },
  specialistImage: {
    width: '100%',
    height: 100,
    marginBottom: 8,
  },
  specialistName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  specialistRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  specialistRatingText: {
    fontSize: 12,
    marginLeft: 4,
  },
  specialistInfo: {
    paddingHorizontal: 10,
  },
  packageCard: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5'
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
    marginBottom: 4,
  },
  packageDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  packageServices: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  packageService: {
    fontSize: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 4
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
    marginRight: 8,
  },
  packageOriginalPrice: {
    fontSize: 14,
    textDecorationLine: 'line-through',
  },
  packageDuration: {
    fontSize: 14,
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
    fontWeight: '600',
  },
  packageStaffRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  packageStaffRatingText: {
    fontSize: 12,
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
  reviewCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    paddingVertical: 12
  },
  reviewDate: {
    fontSize: 11,
    textAlign: 'right',
  },
  reviewUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewUserImage: {
    width: 45,
    height: 45,
    borderRadius: 25,
  },
  reviewUserNameRating: {
    marginLeft: 12,
  },
  reviewUserName: {
    fontSize: 13,
    fontWeight: '600',
    // marginBottom: 4,
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewRatingText: {
    fontSize: 12,
    marginLeft: 4,
  },
  reviewText: {
    fontSize: 12,
    lineHeight: 20,
  },
  tabContent: {
    padding: 16,
  },
  tabTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 16,
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderRadius: 15,
    marginBottom: 12,
    borderColor: "#E5E5E5"
  },
  serviceName: {
    fontSize: 14,
  },
  bookButton: {
    backgroundColor: '#2D8A47',
    margin: 16,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  bookButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Packages Section Styles
  packagesSection: {
    paddingVertical: 12,
    backgroundColor: '#f5f5f5',
  },
  packagesScrollContent: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  packageCardHorizontal: {
    width: 270,
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginRight: 16,
    borderWidth: 2
  },
  packageCardContent: {
    flex: 1,
  },
  packageImageContainer: {
    position: 'relative',
    backgroundColor: '#D4E8D4',
  },
  packageImageHorizontal: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  discountBadge: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    backgroundColor: '#2D7A3E',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  percentText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  packageContentHorizontal: {
    padding: 12,
  },
  packageTitleHorizontal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  packageSubtitle: {
    fontSize: 11,
    color: '#666',
    marginBottom: 8,
    lineHeight: 14,
  },
  servicesList: {
    marginBottom: 8,
  },
  serviceItemHorizontal: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  checkmark: {
    color: '#2D7A3E',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 6,
  },
  serviceText: {
    fontSize: 12,
    color: '#333',
  },
  providerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 6,
  },
  providerName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },
  rating: {
    fontSize: 10,
    color: '#666',
    marginRight: 2,
  },
  star: {
    fontSize: 10,
    marginRight: 2,
  },
  reviews: {
    fontSize: 10,
    color: '#666',
  },
  pricingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  oldPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 6,
  },
  arrow: {
    fontSize: 14,
    color: '#999',
    marginRight: 6,
  },
  newPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D7A3E',
  },
  savingsContainer: {
    backgroundColor: '#F5F1E8',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  savingsText: {
    fontSize: 10,
    color: '#666',
  },
  savingsAmount: {
    fontWeight: 'bold',
    color: '#333',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  validityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  validityIcon: {
    fontSize: 12,
    marginRight: 4,
    color: '#999',
  },
  validityText: {
    fontSize: 10,
    color: '#999',
    lineHeight: 12,
  },
  ctaButton: {
    backgroundColor: '#2D7A3E',
    paddingVertical: 5,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  ctaText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E89B2E',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: -47,
    zIndex: 1,
    marginLeft: 12,
    marginTop: 15,
  },
  badgeIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  badgeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 10,
    letterSpacing: 0.5,
  },
});
