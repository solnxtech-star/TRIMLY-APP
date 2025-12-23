import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { FontSizes } from '@/constants/theme';

interface Category {
  id: string;
  name: string;
}

interface CategoryPillsProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export default function CategoryPills({ categories, selectedCategory, onSelectCategory }: CategoryPillsProps) {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.pill,
            selectedCategory === category.id && styles.selectedPill
          ]}
          onPress={() => onSelectCategory(category.id)}
        >
          <ThemedText
            style={[
              styles.pillText,
              selectedCategory === category.id && styles.selectedPillText
            ]}
          >
            {category.name}
          </ThemedText>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  pill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  selectedPill: {
    backgroundColor: '#2D8A47',
  },
  pillText: {
    fontSize: FontSizes.sm, // 12
    fontWeight: '500',
    color: '#666666',
  },
  selectedPillText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});