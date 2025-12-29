import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useColorScheme } from 'react-native';

interface LogoutConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutConfirmationModal = ({ visible, onClose, onConfirm }: LogoutConfirmationModalProps) => {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  
  // Define custom colors based on theme
  const colorScheme = useColorScheme();
  const modalBackgroundColor = colorScheme === 'dark' ? '#1F2937' : '#FFFFFF';
  const messageTextColor = colorScheme === 'dark' ? '#D1D5DB' : '#666666';
  const separatorColor = colorScheme === 'dark' ? '#374151' : '#E0E0E0';

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { backgroundColor: modalBackgroundColor }]}>
          {/* Modal Title */}
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: textColor }]}>Log out</Text>
          </View>
          
          {/* Separator */}
          <View style={[styles.separator, { backgroundColor: separatorColor }]} />
          
          {/* Confirmation Message */}
          <View style={styles.messageContainer}>
            <Text style={[styles.confirmationMessage, { color: messageTextColor }]}>
              Are you sure you want to log out?
            </Text>
          </View>
          
          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.cancelButton, { borderColor: '#DC3545' }]} 
              onPress={onClose}
            >
              <Text style={[styles.cancelButtonText, { color: '#DC3545' }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.confirmButton} 
              onPress={onConfirm}
            >
              <Text style={styles.confirmButtonText}>Log Out</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    borderRadius: 16,
    paddingVertical: 24,
  },
  modalHeader: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  separator: {
    height: 1,
    marginHorizontal: 24,
    marginBottom: 24,
  },
  messageContainer: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  confirmationMessage: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  cancelButton: {
    flex: 0.48,
    borderWidth: 2,
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirmButton: {
    flex: 0.48,
    backgroundColor: '#DC3545',
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LogoutConfirmationModal;