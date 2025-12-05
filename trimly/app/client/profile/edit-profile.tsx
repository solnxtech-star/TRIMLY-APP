import { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function EditProfileScreen() {
  const [name, setName] = useState('Alex Briggs');
  const [email, setEmail] = useState('Alexbg@gmail.com');
  const [phone, setPhone] = useState('+2348165234875');
  const [dob, setDob] = useState('01/05/98');
  const [gender, setGender] = useState('Female');

  const genders = ['Male', 'Female', 'Other'];

  const handleUpdateProfile = () => {
    Alert.alert(
      'Profile Updated',
      'Your profile has been successfully updated.',
      [{ text: 'OK' }]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <ThemedText style={styles.header}>Your Profile</ThemedText>
        
        {/* Profile Photo */}
        <View style={styles.photoContainer}>
          <Image 
            source={require('@/assets/stock/img.png')} 
            style={styles.profilePhoto} 
          />
          <TouchableOpacity style={styles.cameraIconContainer}>
            <IconSymbol name="photo" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        {/* Form Fields */}
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Name</ThemedText>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Email</ThemedText>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Phone Number</ThemedText>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>DOB</ThemedText>
            <TextInput
              style={styles.input}
              value={dob}
              onChangeText={setDob}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Gender</ThemedText>
            <View style={styles.dropdownContainer}>
              <ThemedText style={styles.dropdownText}>{gender}</ThemedText>
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
  },
  formContainer: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    color: '#8E8E93',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 15,
    fontSize: 17,
    color: '#000000',
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
    fontSize: 17,
    color: '#000000',
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
    fontSize: 15,
    color: '#8E8E93',
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
    fontSize: 17,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});