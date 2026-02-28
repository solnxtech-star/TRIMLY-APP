import { StyleSheet, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FontSizes } from '@/constants/theme';
import { baseCategories, buildCategoriesFromApi, CategoryItem } from '@/app/client/services';
import salonService from '@/services/salonService';

export default function Services() {
  const [categories, setCategories] = useState<CategoryItem[]>(baseCategories);
  const router = useRouter();

  const handleSeeAll = () => {
    router.push('/client/services');
  };
  
  const handleServicePress = (service: CategoryItem) => {
    if (service.id) {
      router.push({
        pathname: '/client/salons',
        params: { categoryId: String(service.id) },
      });
    } else {
      router.push('/client/salons');
    }
  };

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
        {categories.map(category => (
          <TouchableOpacity
            key={category.name}
            style={styles.serviceItem}
            onPress={() => handleServicePress(category)}
          >
            <View style={styles.iconContainer}>
              <Image source={category.icon} style={styles.serviceIcon} />
            </View>
            <ThemedText style={styles.serviceName}>{category.name}</ThemedText>
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
    fontSize: FontSizes.lg, // 18
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
    boxShadow: '0px 1.8px 2px rgb(0, 0, 0)',
    elevation: 2,
    shadowColor: 'rgb(0, 0, 0)',
    shadowOffset: { width: 5, height: 4 },
    shadowRadius: 0,
    marginTop: 8
  },

  serviceIcon: {
    width: 34,
    height: 34,
    resizeMode: 'contain',
  },
  serviceName: {
    fontSize: FontSizes.sm, // 12
    fontWeight: '700',
    textAlign: 'center',
  },
});
