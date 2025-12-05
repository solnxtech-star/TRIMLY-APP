import { StyleSheet, View, TextInput } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function SearchBar() {
  return (
    <View style={styles.container}>
      <IconSymbol name="magnifyingglass" size={20} color="#6B6B6B" style={styles.searchIcon} />
      <TextInput
        style={styles.input}
        placeholder="Find barber or salon"
        placeholderTextColor="#6B6B6B"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 26,
    height: 52,
    marginHorizontal: 16,
  },
  searchIcon: {
    marginLeft: 16,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#000000',
    paddingLeft: 8,
  },
});