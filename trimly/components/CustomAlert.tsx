import React from 'react';
import { Modal, StyleSheet, View, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { ThemedText } from './themed-text';
import { FontSizes } from '@/constants/theme';

interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  buttons?: AlertButton[];
  onDismiss?: () => void;
}

export default function CustomAlert({ visible, title, message, buttons = [], onDismiss }: CustomAlertProps) {
  const defaultButtons: AlertButton[] = buttons.length > 0 ? buttons : [{ text: 'OK', onPress: onDismiss }];

  const handleButtonPress = (button: AlertButton) => {
    if (button.onPress) {
      button.onPress();
    }
    if (onDismiss) {
      onDismiss();
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <TouchableWithoutFeedback onPress={onDismiss}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.alertContainer}>
              <ThemedText style={styles.title}>{title}</ThemedText>
              <ThemedText style={styles.message}>{message}</ThemedText>
              
              <View style={styles.buttonContainer}>
                {defaultButtons.map((button, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.button,
                      button.style === 'destructive' && styles.destructiveButton,
                      button.style === 'cancel' && styles.cancelButton,
                    ]}
                    onPress={() => handleButtonPress(button)}
                  >
                    <ThemedText
                      style={[
                        styles.buttonText,
                        button.style === 'destructive' && styles.destructiveText,
                        button.style === 'cancel' && styles.cancelText,
                      ]}
                    >
                      {button.text}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  alertContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: '#1A1D2E',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: FontSizes.md,
    color: '#6B7280',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    backgroundColor: '#2D8A47',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  destructiveButton: {
    backgroundColor: '#FF3B30',
  },
  cancelButton: {
    backgroundColor: '#F0F0F0',
  },
  buttonText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  destructiveText: {
    color: '#FFFFFF',
  },
  cancelText: {
    color: '#1A1D2E',
  },
});
