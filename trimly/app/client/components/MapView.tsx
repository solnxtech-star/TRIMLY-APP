import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useRouter } from 'expo-router';

interface Location {
  id: string;
  name: string;
  district: string;
}

interface MapViewProps {
  locations: Location[];
}

export default function MapViewComponent({ locations }: MapViewProps) {
  const router = useRouter();
  
  const handleLocationPress = (locationId: string) => {
    // For now, we'll navigate to a sample business
    // In a real app, you would filter businesses by location
    router.push(`/business/${locationId}` as any);
  };
  
  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Map View</ThemedText>
      <View style={styles.mapContainer}>
        {/* Simplified map representation */}
        <View style={styles.mapBackground}>
          {/* Lagos area representation */}
          <View style={styles.lagosArea}>
            <TouchableOpacity
              style={[styles.locationPin, styles.location1]}
              onPress={() => handleLocationPress(locations[0]?.id)}
            >
              <View style={styles.pinIcon} />
              <ThemedText style={styles.locationName}>{locations[0]?.district}</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.locationPin, styles.location2]}
              onPress={() => handleLocationPress(locations[1]?.id)}
            >
              <View style={styles.pinIcon} />
              <ThemedText style={styles.locationName}>{locations[1]?.district}</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.locationPin, styles.location3]}
              onPress={() => handleLocationPress(locations[2]?.id)}
            >
              <View style={styles.pinIcon} />
              <ThemedText style={styles.locationName}>{locations[2]?.district}</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.locationPin, styles.location4]}
              onPress={() => handleLocationPress(locations[3]?.id)}
            >
              <View style={styles.pinIcon} />
              <ThemedText style={styles.locationName}>{locations[3]?.district}</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  mapContainer: {
    height: 200,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  mapBackground: {
    flex: 1,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lagosArea: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  locationPin: {
    position: 'absolute',
    alignItems: 'center',
  },
  pinIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#2D8A47',
    marginBottom: 4,
  },
  locationName: {
    fontSize: 10,
    fontWeight: '500',
    color: '#000000',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  // Positioning for sample locations (you would adjust these based on actual coordinates)
  location1: {
    top: '30%',
    left: '20%',
  },
  location2: {
    top: '40%',
    left: '40%',
  },
  location3: {
    top: '50%',
    left: '60%',
  },
  location4: {
    top: '60%',
    left: '30%',
  },
});