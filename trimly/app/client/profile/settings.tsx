import { StyleSheet, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function SettingsScreen() {
  const settingsItems = [
    { icon: "bell", label: "Notification settings" },
    { icon: "key", label: "Password Manager" },
    { icon: "trash", label: "Delete Account" },
  ];

  const handleSettingPress = (label: string) => {
    Alert.alert(
      label,
      `This would navigate to the ${label} screen.`,
      [{ text: 'OK' }]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <ThemedText style={styles.header}>Settings</ThemedText>
        
        {/* Settings Items */}
        <View style={styles.settingsContainer}>
          {settingsItems.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.settingItem}
              onPress={() => handleSettingPress(item.label)}
            >
              <View style={styles.iconContainer}>
                <IconSymbol name={item.icon} size={20} color="#2D8659" />
              </View>
              <ThemedText style={styles.settingLabel}>{item.label}</ThemedText>
              <IconSymbol name="chevron.right" size={20} color="#8E8E93" />
            </TouchableOpacity>
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
  settingsContainer: {
    flex: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E9', // Light green background
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  settingLabel: {
    flex: 1,
    fontSize: 17,
    color: '#000000',
    fontWeight: '500',
  },
});