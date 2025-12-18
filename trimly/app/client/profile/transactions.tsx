import { StyleSheet, View, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function TransactionsScreen() {
  // Get theme colors
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({ light: '#8E8E93', dark: '#8E8E93' }, 'icon');
  const greenColor = useThemeColor({ light: '#2D8659', dark: '#2D8659' }, 'tint');
  const cardBackgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#1d1d1d' }, 'background');

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
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <ThemedText style={[styles.header, { color: textColor }]}>Your transactions</ThemedText>
        
        {/* Transactions */}
        <View style={styles.transactionsContainer}>
          {transactionsData.map((dateGroup, index) => (
            <View key={index} style={styles.dateGroup}>
              <ThemedText style={[styles.dateLabel, { color: iconColor }]}>{dateGroup.date}</ThemedText>
              {dateGroup.transactions.map((transaction, transIndex) => (
                <View key={transIndex} style={[styles.transactionCard, { backgroundColor: cardBackgroundColor }]}>
                  <View style={styles.transactionInfo}>
                    <ThemedText style={[styles.serviceName, { color: textColor }]}>{transaction.service}</ThemedText>
                    <ThemedText style={[styles.dateTime, { color: iconColor }]}>{transaction.dateTime}</ThemedText>
                  </View>
                  <ThemedText style={[styles.amount, { color: greenColor }]}>{transaction.amount}</ThemedText>
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
  transactionsContainer: {
    flex: 1,
  },
  dateGroup: {
    marginBottom: 30,
  },
  dateLabel: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 15,
  },
  transactionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    fontWeight: '600',
    marginBottom: 5,
  },
  dateTime: {
    fontSize: 15,
  },
  amount: {
    fontSize: 17,
    fontWeight: '600',
  },
});