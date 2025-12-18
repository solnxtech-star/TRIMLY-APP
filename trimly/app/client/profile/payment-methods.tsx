import { StyleSheet, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function PaymentMethodsScreen() {
  const paymentMethods = [
    { icon: "credit-card", label: "•••• •••• •••• 1234", type: "Visa" },
    { icon: "credit-card", label: "•••• •••• •••• 5678", type: "Mastercard" },
  ];
  
  // Get theme colors
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({ light: '#000000', dark: '#2a2a2a' }, 'text');
  const cardBackgroundColor = useThemeColor({ light: '#ffffff', dark: '#000000' }, 'background');

  const handleAddPaymentMethod = () => {
    Alert.alert(
      "Add Payment Method",
      "This would open a form to add a new payment method.",
      [{ text: "OK" }]
    );
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <ThemedText style={[styles.header]}>Payment Methods</ThemedText>
        
        {/* Payment Methods */}
        <View style={styles.paymentMethodsContainer}>
          {paymentMethods.map((method, index) => (
            <TouchableOpacity key={index} style={[styles.paymentMethodCard, { backgroundColor: cardBackgroundColor }]}>
              <View style={styles.cardInfo}>
                <IconSymbol name={method.icon} size={24} color="#2D8659" />
                <View style={styles.cardDetails}>
                  <ThemedText style={[styles.cardNumber]}>{method.label}</ThemedText>
                  <ThemedText style={[styles.cardType]}>{method.type}</ThemedText>
                </View>
              </View>
              <IconSymbol name="chevron.right" size={20} color="#8E8E93" />
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Add New Button */}
        <TouchableOpacity style={styles.addButton} onPress={handleAddPaymentMethod}>
          <IconSymbol name="add" size={24} color="#2D8659" />
          <ThemedText style={[styles.addButtonText, { color: textColor }]}>Add New Payment Method</ThemedText>
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
    fontSize: 27,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  paymentMethodsContainer: {
    flex: 1,
    marginBottom: 30,
  },
  paymentMethodCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardDetails: {
    marginLeft: 15,
  },
  cardNumber: {
    fontSize: 17,
    fontWeight: '500',
  },
  cardType: {
    fontSize: 15,
    marginTop: 3,
  },
  addButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    padding: 15,
  },
  addButtonText: {
    fontSize: 17,
    fontWeight: '600',
    marginLeft: 10,
  },
});