import { StyleSheet, ScrollView } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import SpecialForYou from './components/SpecialForYou';
import Services from './components/Services';
import Salons from './components/Salons';
import TopRatedSalons from './components/TopRatedSalons';
import FeaturedVendors from './components/FeaturedVendors';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <Header />
        <SearchBar />
        <SpecialForYou />
        <Services />
        <Salons />
        <TopRatedSalons />
        <FeaturedVendors />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
});