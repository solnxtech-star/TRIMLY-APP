import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';

export default function Services() {
  const router = useRouter();
  
  const services = [
    { id: 1, name: 'Haircut', icon: 'content-cut' },
    { id: 2, name: 'Hair Styling', icon: 'brush' },
    { id: 3, name: 'Nails', icon: 'spa' },
    { id: 4, name: 'Facials & Skincare', icon: 'face' },
    { id: 5, name: 'Lashes & Brows', icon: 'visibility' },
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
        <ThemedText style={styles.title}>Services</ThemedText>
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
              <IconSymbol name={service.icon} size={28} color="#000000" />
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
    fontSize: 20,
    fontWeight: '700',
  },
  seeAllText: {
    fontSize: 14,
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
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
});