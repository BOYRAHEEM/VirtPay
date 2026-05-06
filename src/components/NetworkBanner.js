import React, { useEffect, useRef, useState } from 'react';
import { Animated, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const NetworkBanner = ({ isOnline }) => {
  const translateY = useRef(new Animated.Value(-48)).current;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setMounted(true);
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 4,
      }).start();
    } else if (mounted) {
      Animated.timing(translateY, {
        toValue: -48,
        duration: 280,
        useNativeDriver: true,
      }).start(() => setMounted(false));
    }
  }, [isOnline]);

  if (!mounted) return null;

  return (
    <Animated.View style={[styles.banner, { transform: [{ translateY }] }]}>
      <Ionicons name="cloud-offline-outline" size={16} color="#ffffff" />
      <Text style={styles.text}>No internet connection</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#FF3B30',
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    zIndex: 999,
  },
  text: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default NetworkBanner;
