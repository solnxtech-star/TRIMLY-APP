import { StyleSheet, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useRouter } from 'expo-router';
import { FontSizes } from '@/constants/theme';

export default function Services() {
  const router = useRouter();
  
  const services = [
    { id: 1, name: 'Haircut', icon: require('@/assets/icon/beard.png') },
    { id: 2, name: 'Hair Styling', icon: require('@/assets/icon/styling.png') },
    { id: 3, name: 'Nails', icon: require('@/assets/icon/nails.png') },
    { id: 4, name: 'Facials & Skincare', icon: require('@/assets/icon/makeup.png') },
    { id: 5, name: 'Lashes & Brows', icon: require('@/assets/icon/lashes.png') },
  ];
  
  const handleSeeAll = () => {
    router.push('/client/services');
  };
  
  const handleServicePress = (serviceId: number) => {
    router.push('/client/services');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Categories</ThemedText>
        <TouchableOpacity onPress={handleSeeAll}>
          <ThemedText style={styles.seeAllText}>See all</ThemedText>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {services.map((service) => (
          <TouchableOpacity key={service.id} style={styles.serviceItem} onPress={() => handleServicePress(service.id)}>
            <View style={styles.iconContainer}>
              <Image source={service.icon} style={styles.serviceIcon} />
            </View>
            <ThemedText style={styles.serviceName}>{service.name}</ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: FontSizes.xl, // 18
    fontWeight: '700',
  },
  seeAllText: {
    fontSize: FontSizes.md, // 14
    fontWeight: '400',
    color: '#2D8659',
  },
  scrollView: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  serviceItem: {
    alignItems: 'center',
    width: 72,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 36,
    backgroundColor: '#2D8659',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },

  serviceIcon: {
    width: 34,
    height: 34,
    resizeMode: 'contain',
  },
  serviceName: {
    fontSize: FontSizes.sm, // 12
    fontWeight: '500',
    textAlign: 'center',
  },
});