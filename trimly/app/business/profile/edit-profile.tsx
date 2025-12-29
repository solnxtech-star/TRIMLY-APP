import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useColorScheme } from 'react-native';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const EditProfile = () => {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  
  // Define custom colors based on theme
  const colorScheme = useColorScheme();
  const cardBackgroundColor = colorScheme === 'dark' ? '#1F2937' : '#FFFFFF'; // Card background
  
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [experience, setExperience] = useState('');
  const [specialties, setSpecialties] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  const handleProfileImageUpload = () => {
    // Handle profile image upload
    console.log('Upload profile image');
  };

  const handlePortfolioUpload = () => {
    // Handle portfolio image upload
    console.log('Upload portfolio image');
  };

  const handleContinue = () => {
    // Handle continue action
    console.log('Continue to next step');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: backgroundColor }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>Set Up Profile</Text>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile Photo Section */}
        <View style={styles.profilePhotoSection}>
          <TouchableOpacity style={styles.profilePhotoContainer} onPress={handleProfileImageUpload}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profilePhoto} />
            ) : (
              <View style={styles.profilePhotoPlaceholder}>
                <Ionicons name="person-circle" size={100} color="#E0E0E0" />
              </View>
            )}
            <View style={styles.cameraIconContainer}>
              <Ionicons name="camera" size={24} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          <Text style={styles.uploadText}>Tap to upload profile photo</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Full Name Field */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: textColor }]}>Full Name</Text>
            <TextInput
              style={[styles.inputField, { backgroundColor: cardBackgroundColor, color: textColor, borderColor: '#E0E0E0' }]}
              placeholder="Your professional name"
              placeholderTextColor="#999999"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          {/* Bio Field */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: textColor }]}>Bio</Text>
            <TextInput
              style={[styles.textArea, { backgroundColor: cardBackgroundColor, color: textColor, borderColor: '#E0E0E0' }]}
              placeholder="Tell clients about yourself"
              placeholderTextColor="#999999"
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Experience Dropdown */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: textColor }]}>Experience</Text>
            <TouchableOpacity style={[styles.dropdownField, { backgroundColor: cardBackgroundColor, borderColor: '#E0E0E0' }]}>
              <Text style={[styles.dropdownText, { color: experience ? textColor : '#999999' }]}>
                {experience || 'Years of experience'}
              </Text>
              <Ionicons name="chevron-down" size={20} color={textColor} />
            </TouchableOpacity>
          </View>

          {/* Specialties Field */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: textColor }]}>Specialties</Text>
            <TextInput
              style={[styles.inputField, { backgroundColor: cardBackgroundColor, color: textColor, borderColor: '#E0E0E0' }]}
              placeholder="e.g. Hair cut, Shaving, etc."
              placeholderTextColor="#999999"
              value={specialties}
              onChangeText={setSpecialties}
            />
          </View>

          {/* Portfolio Section */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: textColor }]}>Portfolio</Text>
            <TouchableOpacity style={[styles.portfolioContainer, { borderColor: '#E0E0E0' }]} onPress={handlePortfolioUpload}>
              <Ionicons name="add" size={30} color="#999999" />
              <Text style={styles.portfolioText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginRight: 32, // To account for the back button space
  },
  profilePhotoSection: {
    alignItems: 'center',
    marginVertical: 24,
  },
  profilePhotoContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 80,
    overflow: 'hidden',
    marginBottom: 12,
  },
  profilePhoto: {
    width: '100%',
    height: '100%',
  },
  profilePhotoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
      alignItems: 'center',
  },
  uploadText: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  inputField: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 14,
  },
  textArea: {
    height: 140,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingTop: 14,
    fontSize: 14,
    textAlignVertical: 'top',
  },
  dropdownField: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 14,
    flex: 1,
  },
  portfolioContainer: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 12,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  portfolioText: {
    fontSize: 14,
    color: '#999999',
    marginTop: 8,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  continueButton: {
    backgroundColor: '#2E7D32',
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default EditProfile;