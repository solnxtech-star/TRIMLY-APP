import { StyleSheet, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { FontSizes } from '@/constants/theme';

export default function TermsConditionScreen() {
  // Get theme colors
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <ThemedText style={[styles.header, { color: textColor }]}>Terms & Conditions</ThemedText>
        
        {/* Terms Content */}
        <ThemedText style={[styles.content, { color: textColor }]}>
          These terms and conditions outline the rules and regulations for the use of Trimly's Services.
        </ThemedText>
        
        <ThemedText style={[styles.content, { color: textColor }]}>
          By accessing this website we assume you accept these terms and conditions. Do not continue to use Trimly if you do not agree to take all of the terms and conditions stated on this page.
        </ThemedText>
        
        <ThemedText style={[styles.content, { color: textColor }]}>
          The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and all Agreements: "Client", "You" and "Your" refers to you, the person log on this website and compliant to the Company's terms and conditions. "The Company", "Ourselves", "We", "Our" and "Us", refers to our Company. "Party", "Parties", or "Us", refers to both the Client and ourselves.
        </ThemedText>
        
        <ThemedText style={[styles.content, { color: textColor }]}>
          All terms refer to the offer, acceptance and consideration of payment necessary to undertake the process of our assistance to the Client in the most appropriate manner for the express purpose of meeting the Client's needs in respect of provision of the Company's stated services, in accordance with and subject to, prevailing law of Netherlands.
        </ThemedText>
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
    fontSize: FontSizes.titleMd, // 24
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  content: {
    fontSize: FontSizes.md, // 14
    lineHeight: 24,
    marginBottom: 20,
  },
});