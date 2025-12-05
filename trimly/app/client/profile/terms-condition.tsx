import { StyleSheet, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function TermsConditionScreen() {
  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <ThemedText style={styles.header}>Terms & Conditions</ThemedText>
        
        {/* Terms Content */}
        <ThemedText style={styles.content}>
          These terms and conditions outline the rules and regulations for the use of Trimly's Services.
        </ThemedText>
        
        <ThemedText style={styles.content}>
          By accessing this website we assume you accept these terms and conditions. Do not continue to use Trimly if you do not agree to take all of the terms and conditions stated on this page.
        </ThemedText>
        
        <ThemedText style={styles.content}>
          The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and all Agreements: "Client", "You" and "Your" refers to you, the person log on this website and compliant to the Company's terms and conditions. "The Company", "Ourselves", "We", "Our" and "Us", refers to our Company. "Party", "Parties", or "Us", refers to both the Client and ourselves.
        </ThemedText>
        
        <ThemedText style={styles.content}>
          All terms refer to the offer, acceptance and consideration of payment necessary to undertake the process of our assistance to the Client in the most appropriate manner for the express purpose of meeting the Client's needs in respect of provision of the Company's stated services, in accordance with and subject to, prevailing law of Netherlands.
        </ThemedText>
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
  content: {
    fontSize: 17,
    color: '#000000',
    lineHeight: 24,
    marginBottom: 20,
  },
});