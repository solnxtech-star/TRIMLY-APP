import { StyleSheet, View, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function ProfileScreen() {
  const router = useRouter();
  
  // Get theme colors
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'tabIconDefault');

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => router.replace('/onboarding/welcome') }
      ]
    );
  };

  const menuItems = [
    { icon: 'person', label: 'Your profile', route: '/client/profile/edit-profile' },
    { icon: 'credit-card', label: 'Payment Methods', route: '/client/profile/payment-methods' },
    { icon: 'heart', label: 'Saved', route: '/client/profile/saved-salons' },
    { icon: 'settings', label: 'Settings', route: '/client/profile/settings' },
    { icon: 'receipt', label: 'Transactions', route: '/client/profile/transactions' },
    { icon: 'help-circle', label: 'Help Center', route: '/client/profile/help-center' },
    { icon: 'lock-closed', label: 'Privacy Policy', route: '/client/profile/privacy-policy' },
  ];

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <ThemedText style={[styles.header, { color: textColor }]}>Profile</ThemedText>
        
        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.menuItem}
              onPress={() => router.push(item.route as any)}
            >
              <View style={styles.iconContainer}>
                <IconSymbol name={item.icon} size={20} color="#2D8659" />
              </View>
              <ThemedText style={[styles.menuLabel, { color: textColor }]}>{item.label}</ThemedText>
              <ThemedText style={[styles.chevron, { color: borderColor }]}>›</ThemedText>
            </TouchableOpacity>
          ))}
          
          {/* Logout Item */}
          <TouchableOpacity style={styles.logoutItem} onPress={handleLogout}>
            <View style={styles.logoutIconContainer}>
              <IconSymbol name="exit" size={20} color="#FF3B30" />
            </View>
            <ThemedText style={styles.logoutLabel}>Log out</ThemedText>
            <ThemedText style={[styles.chevron, { color: borderColor }]}>›</ThemedText>
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 30,
    textAlign: 'left',
  },
  menuContainer: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E9', // Light green background
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuLabel: {
    flex: 1,
    fontSize: 17,
    color: '#000000',
    fontWeight: '500',
  },
  chevron: {
    fontSize: 20,
    color: '#8E8E93', // Gray color
  },
  logoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 20,
  },
  logoutIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFECEB', // Light red background
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  logoutLabel: {
    flex: 1,
    fontSize: 17,
    color: '#FF3B30', // Red text
    fontWeight: '500',
  },
});