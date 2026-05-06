import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const LoadingScreen = () => (
  <View style={styles.container}>
    <View style={styles.logo}>
      <Ionicons name="card" size={44} color="#007AFF" />
    </View>
    <Text style={styles.appName}>VirtMo</Text>
    <Text style={styles.tagline}>Virtual Cards for Ghana</Text>
    <ActivityIndicator size="large" color="#007AFF" style={styles.spinner} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  logo: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000000',
  },
  tagline: {
    fontSize: 15,
    color: '#8E8E93',
  },
  spinner: {
    marginTop: 24,
  },
});

export default LoadingScreen;
