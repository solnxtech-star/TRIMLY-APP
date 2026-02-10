import { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { FontSizes } from '@/constants/theme';
import authService from '@/services/authService';
import { User } from '@/types/auth.types';

export default function EditProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Female');
  
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const borderColor = '#E5E7EB';
  const inputBackgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#2a2a2a' }, 'background');
  
  useEffect(() => {
    loadUser();
  }, []);
  
  const loadUser = async () => {
    try {
      const userData = await authService.getCachedUser();
      console.log('Edit profile loaded user:', userData);
      setUser(userData);
      setName(`${userData?.first_name || ''} ${userData?.last_name || ''}`.trim());
      setEmail(userData?.email || '');
      setPhone(userData?.phone_number || '');
    } catch (error) {
      console.error('Failed to load user:', error);
    }
  };
  
  const displayName = user?.first_name && user?.last_name 
    ? `${user.first_name} ${user.last_name}` 
    : user?.email || 'User';
  const displayEmail = user?.email || '';

  const genders = ['Male', 'Female', 'Other'];

  const handleUpdateProfile = () => {
    Alert.alert(
      'Profile Updated',
      'Your profile has been successfully updated.',
      [{ text: 'OK' }]
    );
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <ThemedText style={[styles.header, { color: textColor }]}>Your Profile</ThemedText>
        
        {/* Profile Photo */}
        <View style={styles.photoContainer}>
          <Image 
            source={require('@/assets/stock/img.png')} 
            style={styles.profilePhoto} 
          />
          <TouchableOpacity style={styles.cameraIconContainer}>
            <IconSymbol name="camera" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        {/* Form Fields */}
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <ThemedText style={[styles.label, { color: textColor }]}>Name</ThemedText>
            <TextInput
              style={[styles.input, { color: textColor, backgroundColor: inputBackgroundColor, borderColor }]}
              value={name}
              onChangeText={setName}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <ThemedText style={[styles.label, { color: textColor }]}>Email</ThemedText>
            <TextInput
              style={[styles.input, { color: textColor, backgroundColor: inputBackgroundColor, borderColor }]}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <ThemedText style={[styles.label, { color: textColor }]}>Phone Number</ThemedText>
            <TextInput
              style={[styles.input, { color: textColor, backgroundColor: inputBackgroundColor, borderColor }]}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <ThemedText style={[styles.label, { color: textColor }]}>DOB</ThemedText>
            <TextInput
              style={[styles.input, { color: textColor, backgroundColor: inputBackgroundColor, borderColor }]}
              value={dob}
              onChangeText={setDob}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <ThemedText style={[styles.label, { color: textColor }]}>Gender</ThemedText>
            <View style={styles.dropdownContainer}>
              <ThemedText style={[styles.dropdownText, { color: textColor }]}>{gender}</ThemedText>
              <IconSymbol name="chevron.down" size={20} color="#8E8E93" />
            </View>
            
            {/* Gender Options (would be shown in a modal in a real app) */}
            <View style={styles.genderOptions}>
              {genders.map((option, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.genderOption}
                  onPress={() => setGender(option)}
                >
                  <ThemedText style={[
                    styles.genderText,
                    { color: textColor },
                    gender === option && styles.selectedGender
                  ]}>
                    {option}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
        
        {/* Update Button */}
        <TouchableOpacity style={styles.updateButton} onPress={handleUpdateProfile}>
          <ThemedText style={styles.updateButtonText}>Update Profile</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontSize: FontSizes.titleMd, // 24
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 30,
    position: 'relative',
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 100,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2D8659',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6B6B6B',
  },
  formContainer: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: FontSizes.md, // 14
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    fontSize: FontSizes.md, // 14
  },
  dropdownContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 15,
  },
  dropdownText: {
    fontSize: FontSizes.md, // 14
  },
  genderOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  genderOption: {
    padding: 10,
  },
  genderText: {
    fontSize: FontSizes.md, // 14
  },
  selectedGender: {
    color: '#2D8659',
    fontWeight: '600',
  },
  updateButton: {
    backgroundColor: '#2D8659',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  updateButtonText: {
    fontSize: FontSizes.md, // 14
    color: '#FFFFFF',
    fontWeight: '600',
  },
});