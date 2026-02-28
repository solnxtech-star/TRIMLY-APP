import { StyleSheet, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CustomSafeAreaView } from '@/components/custom-safe-area-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { useThemeColor } from '@/hooks/use-theme-color';
import { FontSizes } from '@/constants/theme';
import salonService from '@/services/salonService';
import { ServiceCategory } from '@/types/salon.types';

export type CategoryItem = {
  id?: number;
  name: string;
  icon: any;
};

export const baseCategories: CategoryItem[] = [
  { name: 'Haircut', icon: require('@/assets/icon/beard.png') },
  { name: 'Hair Styling', icon: require('@/assets/icon/styling.png') },
  { name: 'Nails', icon: require('@/assets/icon/nails.png') },
  { name: 'Facials & Skincare', icon: require('@/assets/icon/makeup.png') },
  { name: 'Lashes & Brows', icon: require('@/assets/icon/lashes.png') },
  { name: 'Massage', icon: require('@/assets/icon/massage.png') },
  { name: 'Tatoo', icon: require('@/assets/icon/tattoo.png') },
];

export const buildCategoriesFromApi = (
  apiCategories: ServiceCategory[]
): CategoryItem[] => {
  if (!apiCategories || apiCategories.length === 0) {
    return baseCategories;
  }

  return baseCategories.map(category => {
    const match = apiCategories.find(apiCat => apiCat.name === category.name);
    if (match) {
      return {
        id: match.id,
        name: match.name,
        icon: category.icon,
      };
    }
    return category;
  });
};

export default function ServicesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({light: '#1a1a1a', dark: '#ffffff'}, 'text');
  const iconColor = useThemeColor({light: '#1a1a1a', dark: '#ffffff'}, 'text');
  const borderColor = useThemeColor({light: '#1a1a1a', dark: '#ffffff'}, 'text');
  const cardBackgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#1a1a1a' }, 'background');
  const cardBackgroundColor2 = useThemeColor({ light: 'lightgray', dark: 'gray' }, 'background');

  const [categories, setCategories] = useState<CategoryItem[]>(baseCategories);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    params.categoryId ? Number(params.categoryId) : null
  );

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const apiCategories = await salonService.getServiceCategories();
        setCategories(buildCategoriesFromApi(apiCategories));
      } catch {
        setCategories(baseCategories);
      }
    };

    loadCategories();
  }, []);

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
        {categories.map(service => (
          <TouchableOpacity 
            key={service.name} 
            style={[styles.serviceItem, { backgroundColor: cardBackgroundColor }]}
            onPress={() => {
              if (service.id) {
                router.push({
                  pathname: '/client/salons',
                  params: { categoryId: String(service.id) },
                });
              } else {
                router.push('/client/salons');
              }
            }}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#2D8659' }]}>              
              <Image 
                source={service.icon} 
                style={styles.serviceIcon}
                resizeMode="contain"
              />
            </View>
            <View style={styles.textContainer}>
              <ThemedText style={[styles.serviceName, { color: textColor }]}>{service.name}</ThemedText>
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
  serviceIcon: {
    width: 28,
    height: 28,
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
