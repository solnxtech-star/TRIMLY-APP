import React, { useState, useEffect } from 'react';
import { Animated, TouchableOpacity, View, StyleSheet, ViewStyle } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface CircularProgressButtonProps {
  onPress: () => void;
  progress?: number; // 0 to 1
  loading?: boolean;
  success?: boolean;
  disabled?: boolean;
  size?: number;
  progressSize?: number; // Stroke width of the progress indicator
  progressLength?: number; // Length of the progress indicator in degrees
  staticProgressLength?: number; // Static length of the progress indicator in degrees (overrides progress-based length)
  borderColor?: string;
  backgroundColor?: string;
  arrowColor?: string;
  style?: ViewStyle;
  destination?: string; // Optional destination for navigation
}

const CircularProgressButton: React.FC<CircularProgressButtonProps> = ({
  onPress,
  progress = 0,
  loading = false,
  success = false,
  disabled = false,
  size = 56,
  progressSize = 2, // Default stroke width
  progressLength = 30, // Default length in degrees
  staticProgressLength = 0, // No static length by default
  borderColor = '#00C853',
  backgroundColor = '#00C853',
  arrowColor = '#ffffff',
  style,
  destination = '/onboarding/features', // Default destination
}) => {
  const [rotation] = useState(new Animated.Value(0));
  const [successAnimation] = useState(new Animated.Value(0));
  const [scaleValue] = useState(new Animated.Value(1));

  useEffect(() => {
    if (success) {
      Animated.timing(successAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [success, successAnimation]);

  useEffect(() => {
    let animation: Animated.CompositeAnimation | undefined;

    if (loading) {
      animation = Animated.loop(
        Animated.timing(rotation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        })
      );
      animation.start();
    } else {
      rotation.setValue(0);
    }

    return () => {
      if (animation) {
        animation.stop();
      }
    };
  }, [loading, rotation]);

  const rotationInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const successScale = successAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const handlePressIn = () => {
    if (!disabled && !loading && !success) {
      Animated.spring(scaleValue, {
        toValue: 1.1,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handleButtonPress = () => {
    if (!disabled && !loading && !success) {
      onPress();
      if (destination) {
        router.push(destination);
      }
    }
  };

  // Calculate the progress in degrees (0 to 360)
  const progressDegrees = progress * 360;

  // Calculate the inner circle size (with padding from the outer ring)
  const innerSize = size - 8; // 4px padding on each side

  return (
    <TouchableOpacity
      onPress={handleButtonPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[styles.container, style, { width: size, height: size }]}
      activeOpacity={0.7}
    >
      <Animated.View 
        style={[
          styles.button, 
          { 
            width: size, 
            height: size,
            transform: [{ scale: scaleValue }]
          },
          {
            borderColor: 'transparent', // No border color for the main button
            backgroundColor: 'transparent', // No background color for the main button
          }
        ]}
      >
        {/* Outer ring (static ring that's always visible) */}
        <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
          {/* Static outer ring that's always visible */}
          <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: progressSize,
            borderColor: disabled ? 'rgba(200, 200, 200, 0.3)' : borderColor,
            opacity: disabled ? 0.3 : 0.3, // Semi-transparent static ring
          }} />
          
          {/* Progress arc - overlay on top of the static ring */}
          {!loading && !success && (progress > 0 || staticProgressLength > 0) && (
            <View style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              width: size,
              height: size,
              transform: [{ rotate: '-90deg' }] // Start from the top
            }}>
              {/* This creates a single progress indicator that grows in length */}
              <View style={{
                width: size,
                height: size,
                borderRadius: size / 2,
                borderLeftWidth: progressSize,
                borderRightWidth: progressSize,
                borderTopWidth: progressSize,
                borderBottomWidth: progressSize,
                borderLeftColor: 'transparent',
                borderRightColor: 'transparent',
                borderTopColor: disabled ? 'rgba(200, 200, 200, 0.3)' : borderColor,
                borderBottomColor: 'transparent',
                transform: [
                  { rotate: `${staticProgressLength > 0 ? staticProgressLength : progress * progressLength}deg` } // End at the correct position based on static or dynamic progress
                ],
                opacity: disabled ? 0.3 : 1
              }} />
            </View>
          )}
          
          {/* Loading animation */}
          {loading && (
            <Animated.View 
              style={[
                { 
                  position: 'absolute',
                  width: size,
                  height: size,
                  transform: [{ rotate: rotationInterpolate }]
                }
              ]}
            >
              <View style={[styles.loadingCircle, { 
                width: size, 
                height: size,
                borderWidth: progressSize,
                borderColor: borderColor
              }]} />
            </Animated.View>
          )}
          
          {/* Success indicator - complete circle */}
          {success && (
            <View style={{ 
              position: 'absolute',
              width: size,
              height: size,
            }}>
              <View style={[styles.loadingCircle, { 
                width: size, 
                height: size,
                borderWidth: progressSize,
                borderColor: borderColor
              }]} />
            </View>
          )}
        </View>

        {/* Inner circle with content - this is the actual button */}
        <View style={[
          styles.innerCircle,
          {
            width: innerSize,
            height: innerSize,
            backgroundColor: disabled ? 'rgba(200, 200, 200, 0.3)' : backgroundColor,
          }
        ]}>
          {/* Button content */}
          <View style={styles.content}>
            {success ? (
              <Animated.View style={{ transform: [{ scale: successScale }] }}>
                <Ionicons name="checkmark" size={innerSize / 2} color={arrowColor} />
              </Animated.View>
            ) : (
              <ThemedText style={[styles.arrow, { color: arrowColor }]}>→</ThemedText>
            )}
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    borderWidth: 0, // No border for the main button
    backgroundColor: 'transparent', // No background for the outer ring
    overflow: 'visible', // Allow the progress indicator to be visible
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  innerCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
  loadingCircle: {
    borderRadius: 100,
    position: 'absolute',
    top: 0,
    left: 0,
    borderLeftColor: 'transparent',
    borderTopColor: 'transparent',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  arrow: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 40,
  },
});

export default CircularProgressButton;