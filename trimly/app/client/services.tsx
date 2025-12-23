import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CustomSafeAreaView } from '@/components/custom-safe-area-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import { useThemeColor } from '@/hooks/use-theme-color';
import { FontSizes } from '@/constants/theme';

export default function ServicesScreen() {
  const router = useRouter();
  
  // Get theme colors
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({light: '#1a1a1a', dark: '#ffffff'}, 'text');
  const iconColor = useThemeColor({light: '#1a1a1a', dark: '#ffffff'}, 'text');
  const borderColor = useThemeColor({light: '#1a1a1a', dark: '#ffffff'}, 'text');
  const cardBackgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#1a1a1a' }, 'background');
  const cardBackgroundColor2 = useThemeColor({ light: 'lightgray', dark: 'gray' }, 'background');

  const services = [
    { id: 1, name: 'Massage & Body Care', category: 'Spa', icon: 'spa' },
    { id: 2, name: 'Tattooing & Body Piercing', category: 'Body Art', icon: 'brush' },
    { id: 3, name: 'Facial Treatments', category: 'Skincare', icon: 'face' },
    { id: 4, name: 'Manicure & Pedicure', category: 'Nails', icon: 'spa' },
    { id: 5, name: 'Hair Coloring', category: 'Hair', icon: 'brush' },
    { id: 6, name: 'Beard Trimming', category: 'Grooming', icon: 'content-cut' },
  ];

  return (
    <CustomSafeAreaView edges="top" style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <IconSymbol name="chevron.left" size={20} color={iconColor} />
        </TouchableOpacity>
        <ThemedText style={[styles.title, { color: textColor }]}>Services</ThemedText>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {services.map((service) => (
          <TouchableOpacity 
            key={service.id} 
            style={[styles.serviceItem, { backgroundColor: cardBackgroundColor }]}
            onPress={() => router.push('/client/salons')}
          >
            <View style={[styles.iconContainer, { backgroundColor: cardBackgroundColor2 }]}>
              <IconSymbol name={service.icon} size={28} color={iconColor} />
            </View>
            <View style={styles.textContainer}>
              <ThemedText style={[styles.serviceName, { color: textColor }]}>{service.name}</ThemedText>
              <ThemedText style={[styles.categoryText, { color: textColor }]}>{service.category}</ThemedText>
            </View>
            <IconSymbol name="chevron.right" size={20} color={iconColor} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </CustomSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontSize: FontSizes.xl, // 18
    fontWeight: '700',
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
    borderBottomWidth: 1,
  },
  iconContainer: {
    width:43,
    height: 43,
    borderRadius: 250,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  serviceName: {
    fontSize: FontSizes.md, // 14
    fontWeight: '600',
    marginBottom: 4,
  },
  categoryText: {
    fontSize: FontSizes.sm, // 12
    fontWeight: '400',
  },
});