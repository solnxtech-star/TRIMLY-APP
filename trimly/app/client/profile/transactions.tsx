import { StyleSheet, View, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function TransactionsScreen() {
  // Transaction data grouped by date
  const transactionsData = [
    {
      date: "Today",
      transactions: [
        { service: "Haircut", dateTime: "24 April | 7:30 AM", amount: "-N2000" }
      ]
    },
    {
      date: "Yesterday",
      transactions: [
        { service: "Treatment", dateTime: "24 April | 7:30 AM", amount: "-N3000" }
      ]
    },
    {
      date: "22 March 2025",
      transactions: [
        { service: "Hair Color", dateTime: "22 March | 7:30 AM", amount: "-N2000" },
        { service: "Shaving", dateTime: "22 March | 7:30 AM", amount: "-N2000" },
        { service: "Locs", dateTime: "22 March | 7:30 AM", amount: "-N2000" }
      ]
    },
    {
      date: "19 Feb 2025",
      transactions: [
        { service: "Treatment", dateTime: "19 Feb | 7:30 AM", amount: "-N3000" }
      ]
    },
    {
      date: "15 Jan",
      transactions: [
        { service: "Treatment", dateTime: "15 Jan | 7:30 AM", amount: "-N3000" }
      ]
    }
  ];

  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <ThemedText style={styles.header}>Your transactions</ThemedText>
        
        {/* Transactions */}
        <View style={styles.transactionsContainer}>
          {transactionsData.map((dateGroup, index) => (
            <View key={index} style={styles.dateGroup}>
              <ThemedText style={styles.dateLabel}>{dateGroup.date}</ThemedText>
              {dateGroup.transactions.map((transaction, transIndex) => (
                <View key={transIndex} style={styles.transactionCard}>
                  <View style={styles.transactionInfo}>
                    <ThemedText style={styles.serviceName}>{transaction.service}</ThemedText>
                    <ThemedText style={styles.dateTime}>{transaction.dateTime}</ThemedText>
                  </View>
                  <ThemedText style={styles.amount}>{transaction.amount}</ThemedText>
                </View>
              ))}
            </View>
          ))}
        </View>
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
  transactionsContainer: {
    flex: 1,
  },
  dateGroup: {
    marginBottom: 30,
  },
  dateLabel: {
    fontSize: 17,
    color: '#8E8E93',
    fontWeight: '600',
    marginBottom: 15,
  },
  transactionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 17,
    color: '#000000',
    fontWeight: '600',
    marginBottom: 5,
  },
  dateTime: {
    fontSize: 15,
    color: '#8E8E93',
  },
  amount: {
    fontSize: 17,
    color: '#2D8659', // Green color
    fontWeight: '600',
  },
});