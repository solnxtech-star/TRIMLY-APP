import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useColorScheme } from 'react-native';

const { width, height } = Dimensions.get('window');

interface ReplyToReviewModalProps {
  visible: boolean;
  onClose: () => void;
  review: {
    id: number;
    name: string;
    review: string;
  };
  onSendReply: (reply: string) => void;
}

const ReplyToReviewModal = ({ visible, onClose, review, onSendReply }: ReplyToReviewModalProps) => {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  
  // Define custom colors based on theme
  const colorScheme = useColorScheme();
  const cardBackgroundColor = colorScheme === 'dark' ? '#1F2937' : '#FFFFFF';
  const borderColor = colorScheme === 'dark' ? '#374151' : '#E0E0E0';
  const placeholderTextColor = colorScheme === 'dark' ? '#9CA3AF' : '#AAAAAA';
  const contextCardBackgroundColor = colorScheme === 'dark' ? '#111827' : '#F5F5F5';
  const secondaryTextColor = colorScheme === 'dark' ? '#9CA3AF' : '#666666';

  const [replyText, setReplyText] = useState('');

  const handleSendReply = () => {
    if (replyText.trim()) {
      onSendReply(replyText);
      setReplyText('');
    }
  };

  // Truncate the review text to show in the context card
  const truncatedReview = review.review.length > 100 
    ? review.review.substring(0, 100) + '...' 
    : review.review;

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
            <Text style={[styles.modalTitle, { color: textColor }]}>Reply to Review</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={textColor} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Review Context Card */}
            <View style={[styles.contextCard, { backgroundColor: contextCardBackgroundColor }]}>
              <Text style={[styles.reviewerName, { color: textColor }]}>{review.name}</Text>
              <Text style={[styles.reviewText, { color: secondaryTextColor }]}>{truncatedReview}</Text>
            </View>

            {/* Reply Input Section */}
            <View style={styles.fieldContainer}>
              <Text style={[styles.fieldLabel, { color: textColor }]}>Your Reply</Text>
              <TextInput
                style={[styles.textArea, { backgroundColor: cardBackgroundColor, color: textColor, borderColor: borderColor }]}
                placeholder="Write your reply...."
                placeholderTextColor={placeholderTextColor}
                value={replyText}
                onChangeText={setReplyText}
                multiline
                numberOfLines={6}
                autoFocus
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
              style={styles.sendReplyButton} 
              onPress={handleSendReply}
              disabled={!replyText.trim()}
            >
              <Text style={styles.sendReplyButtonText}>Send Reply</Text>
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
    height: height * 0.7,
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
  contextCard: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 24,
  },
  reviewerName: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  reviewText: {
    fontSize: 15,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  textArea: {
    height: 190,
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
  sendReplyButton: {
    flex: 0.48,
    backgroundColor: '#2E7D32',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.7,
  },
  sendReplyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ReplyToReviewModal;