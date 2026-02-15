import { useState, useEffect } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { FontSizes } from '@/constants/theme';
import authService from '@/services/authService';
import { User } from '@/types/auth.types';

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    loadUser();
  }, []);
  
  const loadUser = async () => {
    try {
      const userData = await authService.getCachedUser();
      console.log('Header loaded user:', userData);
      setUser(userData);
    } catch (error) {
      console.error('Failed to load user:', error);
    }
  };
  
  const displayName = user?.first_name && user?.last_name 
    ? `${user.first_name} ${user.last_name}` 
    : user?.email || 'User';
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Image 
          source={require('@/assets/stock/service.jpg')} 
          style={styles.profileImage}
        />
        <View style={styles.textStack}>
          <ThemedText style={styles.welcomeText}>Welcome Back</ThemedText>
          <ThemedText style={styles.nameText}>{displayName}</ThemedText>
        </View>
      </View>
      
      <View style={styles.rightSection}>
        <IconSymbol name="bell" size={24} color="gray" />
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
    fontSize: FontSizes.sm, // 12
    color: '#6B6B6B',
    fontWeight: '400',
  },
  nameText: {
    fontSize: FontSizes.lg, // 16
    fontWeight: '700',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
});
