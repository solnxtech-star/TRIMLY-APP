import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CustomSafeAreaView } from '@/components/custom-safe-area-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';

export default function ServicesScreen() {
  const router = useRouter();

  const services = [
    { id: 1, name: 'Massage & Body Care', category: 'Spa', icon: 'spa' },
    { id: 2, name: 'Tattooing & Body Piercing', category: 'Body Art', icon: 'brush' },
    { id: 3, name: 'Facial Treatments', category: 'Skincare', icon: 'face' },
    { id: 4, name: 'Manicure & Pedicure', category: 'Nails', icon: 'spa' },
    { id: 5, name: 'Hair Coloring', category: 'Hair', icon: 'brush' },
    { id: 6, name: 'Beard Trimming', category: 'Grooming', icon: 'content-cut' },
  ];

  return (
    <CustomSafeAreaView edges="top" style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <IconSymbol name="chevron.left" size={20} color="#000000" />
        </TouchableOpacity>
        <ThemedText style={styles.title}>Services</ThemedText>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {services.map((service) => (
          <TouchableOpacity key={service.id} style={styles.serviceItem}>
            <View style={styles.iconContainer}>
              <IconSymbol name={service.icon} size={28} color="#000000" />
            </View>
            <View style={styles.textContainer}>
              <ThemedText style={styles.serviceName}>{service.name}</ThemedText>
              <ThemedText style={styles.categoryText}>{service.category}</ThemedText>
            </View>
            <IconSymbol name="chevron.right" size={20} color="#000000" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </CustomSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
  },
  placeholder: {
    width: 44,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 20,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 80,
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  serviceName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6B6B6B',
  },
});