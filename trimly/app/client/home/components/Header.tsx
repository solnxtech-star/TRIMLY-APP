import { StyleSheet, View, Image } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function Header() {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Image 
          source={require('@/assets/stock/img.png')} 
          style={styles.profileImage} 
        />
        <View style={styles.textStack}>
          <ThemedText style={styles.welcomeText}>Welcome Back</ThemedText>
          <ThemedText style={styles.nameText}>Mr Clemz</ThemedText>
        </View>
      </View>
      
      <View style={styles.rightSection}>
        <IconSymbol name="magnifyingglass" size={24} color="#000000" />
        <IconSymbol name="bell" size={24} color="#000000" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 60,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textStack: {
    marginLeft: 12,
  },
  welcomeText: {
    fontSize: 13,
    color: '#6B6B6B',
    fontWeight: '400',
  },
  nameText: {
    fontSize: 18,
    color: '#000000',
    fontWeight: '700',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
});