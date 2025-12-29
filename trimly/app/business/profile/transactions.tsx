import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/use-theme-color';
import { TouchableOpacity } from 'react-native';
import { useColorScheme } from 'react-native';
import { router } from 'expo-router';

const Transactions = () => {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  // Define custom colors based on theme
  const colorScheme = useColorScheme();
  const cardBackgroundColor = colorScheme === 'dark' ? '#1F2937' : '#FFFFFF';
  const borderColor = colorScheme === 'dark' ? '#374151' : '#E0E0E0';
  const secondaryTextColor = colorScheme === 'dark' ? '#9CA3AF' : '#666666';
    
  // Mock data for transactions
  const transactions = [
    { id: 1, date: '2024-01-15', description: 'Haircut Service', amount: '+$45.00', status: 'Completed' },
    { id: 2, date: '2024-01-10', description: 'Beard Trim', amount: '+$25.00', status: 'Completed' },
    { id: 3, date: '2024-01-05', description: 'Styling Service', amount: '+$35.00', status: 'Completed' },
    { id: 4, date: '2024-01-01', description: 'Package Deal', amount: '+$75.00', status: 'Completed' },
  ];
    
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: backgroundColor }]}>      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.push('/business/profile')}>
            <Ionicons name="chevron-back" size={24} color={textColor} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: textColor }]}>Transactions</Text>
        </View>
          
        <View style={styles.balanceContainer}>
          <Text style={[styles.balanceLabel, { color: secondaryTextColor }]}>Current Balance</Text>
          <Text style={[styles.balanceAmount, { color: textColor }]}>$180.00</Text>
        </View>
          
        <View style={styles.transactionsContainer}>
          {transactions.map((transaction) => (
            <View key={transaction.id} style={[styles.transactionCard, { backgroundColor: cardBackgroundColor, borderColor: borderColor }]}>            
              <View style={styles.transactionInfo}>
                <Text style={[styles.transactionDescription, { color: textColor }]}>{transaction.description}</Text>
                <Text style={[styles.transactionDate, { color: secondaryTextColor }]}>{transaction.date}</Text>
              </View>
                
              <View style={styles.transactionAmountContainer}>
                <Text style={[styles.transactionAmount, { color: '#2E7D32' }]}>{transaction.amount}</Text>
                <Text style={[styles.transactionStatus, { color: '#2E7D32' }]}>{transaction.status}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontWeight: '600',
  },
  balanceContainer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  transactionsContainer: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  transactionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 14,
  },
  transactionAmountContainer: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  transactionStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default Transactions;