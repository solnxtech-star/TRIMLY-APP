import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useColorScheme } from 'react-native';

const { width, height } = Dimensions.get('window');

interface AddPortfolioModalProps {
  visible: boolean;
  onClose: () => void;
}

const AddPortfolioModal = ({ visible, onClose }: AddPortfolioModalProps) => {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  
  // Define custom colors based on theme
  const colorScheme = useColorScheme();
  const cardBackgroundColor = colorScheme === 'dark' ? '#1F2937' : '#FFFFFF';
  const borderColor = colorScheme === 'dark' ? '#374151' : '#E0E0E0';
  const placeholderTextColor = colorScheme === 'dark' ? '#9CA3AF' : '#AAAAAA';
  const uploadBorderColor = colorScheme === 'dark' ? '#4B5563' : '#CCCCCC';
  const uploadTextColor = colorScheme === 'dark' ? '#9CA3AF' : '#888888';

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleAddPhoto = () => {
    // Handle adding the photo with title and description
    console.log('Adding photo with:', { title, description });
    onClose();
  };

  const handleImageUpload = () => {
    // Handle image upload
    console.log('Opening image picker');
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { backgroundColor: cardBackgroundColor }]}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: textColor }]}>Portfolio</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={textColor} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Image Upload Area */}
            <TouchableOpacity style={[styles.uploadContainer, { borderColor: uploadBorderColor }]} onPress={handleImageUpload}>
              <Ionicons name="add-circle-outline" size={36} color={uploadTextColor} />
              <Text style={[styles.uploadText, { color: uploadTextColor }]}>Add</Text>
            </TouchableOpacity>

            {/* Title Field */}
            <View style={styles.fieldContainer}>
              <Text style={[styles.fieldLabel, { color: textColor }]}>Title</Text>
              <TextInput
                style={[styles.inputField, { backgroundColor: cardBackgroundColor, color: textColor, borderColor: borderColor }]}
                placeholder="Enter photo title"
                placeholderTextColor={placeholderTextColor}
                value={title}
                onChangeText={setTitle}
              />
            </View>

            {/* Description Field */}
            <View style={styles.fieldContainer}>
              <Text style={[styles.fieldLabel, { color: textColor }]}>Description</Text>
              <TextInput
                style={[styles.textArea, { backgroundColor: cardBackgroundColor, color: textColor, borderColor: borderColor }]}
                placeholder="Describe your work....."
                placeholderTextColor={placeholderTextColor}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
              />
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.cancelButton, { borderColor: '#2E7D32' }]} 
              onPress={onClose}
            >
              <Text style={[styles.cancelButtonText, { color: '#2E7D32' }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.addPhotoButton} 
              onPress={handleAddPhoto}
              disabled={!title.trim()}
            >
              <Text style={styles.addPhotoButtonText}>Add Photo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    height: height * 0.75,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadContainer: {
    height: 220,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    backgroundColor: '#F8F8F8',
  },
  uploadText: {
    fontSize: 16,
    marginTop: 8,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  inputField: {
    height: 54,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
  },
  textArea: {
    height: 170,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
    fontSize: 15,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  cancelButton: {
    flex: 0.48,
    borderWidth: 2,
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  addPhotoButton: {
    flex: 0.48,
    backgroundColor: '#2E7D32',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddPortfolioModal;