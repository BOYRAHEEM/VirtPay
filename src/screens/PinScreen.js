import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import { useAuth } from '../context/AuthContext';
import * as Haptics from 'expo-haptics';

const PIN_LENGTH = 4;

// mode prop for direct (non-navigation) render; route.params.mode for stack screen
const PinScreen = ({ route, navigation, mode: modeProp }) => {
  const mode = route?.params?.mode || modeProp || 'verify';
  const { verifyPin, biometricUnlock, setupPin, logout, user, biometricEnabled } = useAuth();

  const [pin, setPin] = useState('');
  const [step, setStep] = useState('enter'); // 'enter' | 'confirm'
  const [firstPin, setFirstPin] = useState('');
  const [error, setError] = useState('');
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (mode === 'verify') {
      checkBiometrics();
    }
  }, []);

  const checkBiometrics = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      setBiometricAvailable(hasHardware && isEnrolled);
      if (hasHardware && isEnrolled && biometricEnabled) {
        triggerBiometric();
      }
    } catch (_) {}
  };

  const triggerBiometric = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access VirtMo',
        fallbackLabel: 'Use PIN',
        cancelLabel: 'Cancel',
      });
      if (result.success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        biometricUnlock();
      }
    } catch (_) {}
  };

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 12, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -12, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const handleDigit = (digit) => {
    if (pin.length >= PIN_LENGTH) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const next = pin + digit;
    setPin(next);
    setError('');
    if (next.length === PIN_LENGTH) {
      setTimeout(() => handleComplete(next), 120);
    }
  };

  const handleDelete = () => {
    if (!pin.length) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPin((p) => p.slice(0, -1));
  };

  const handleComplete = async (entered) => {
    if (mode === 'verify') {
      const ok = verifyPin(entered);
      if (!ok) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setError('Incorrect PIN. Try again.');
        setPin('');
        shake();
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      return;
    }

    // setup mode
    if (step === 'enter') {
      setFirstPin(entered);
      setPin('');
      setStep('confirm');
    } else {
      if (entered === firstPin) {
        await setupPin(entered);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        navigation?.goBack();
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setError("PINs don't match. Start over.");
        setPin('');
        setFirstPin('');
        setStep('enter');
        shake();
      }
    }
  };

  const title =
    mode === 'verify'
      ? 'Enter PIN'
      : step === 'enter'
      ? 'Create PIN'
      : 'Confirm PIN';

  const subtitle =
    mode === 'verify'
      ? `Welcome back${user?.fullName ? ', ' + user.fullName.split(' ')[0] : ''}`
      : step === 'enter'
      ? 'Choose a 4-digit PIN to secure your account'
      : 'Re-enter your PIN to confirm';

  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', null, '0', 'del'];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logo}>
          <Ionicons name="card" size={34} color="#007AFF" />
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      <Animated.View
        style={[styles.dots, { transform: [{ translateX: shakeAnim }] }]}
      >
        {Array.from({ length: PIN_LENGTH }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i < pin.length && styles.dotFilled,
              error && styles.dotError,
            ]}
          />
        ))}
      </Animated.View>

      {!!error && <Text style={styles.errorText}>{error}</Text>}

      <View style={styles.keypad}>
        {digits.map((d, i) => {
          if (d === null) return <View key={i} style={styles.keyPlaceholder} />;
          if (d === 'del') {
            return (
              <TouchableOpacity
                key={i}
                style={styles.keyDel}
                onPress={handleDelete}
                activeOpacity={0.6}
              >
                <Ionicons name="backspace-outline" size={26} color="#000000" />
              </TouchableOpacity>
            );
          }
          return (
            <TouchableOpacity
              key={i}
              style={styles.key}
              onPress={() => handleDigit(d)}
              activeOpacity={0.7}
            >
              <Text style={styles.keyText}>{d}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {mode === 'verify' && biometricAvailable && biometricEnabled && (
        <TouchableOpacity style={styles.biometricBtn} onPress={triggerBiometric} activeOpacity={0.7}>
          <Ionicons name="finger-print-outline" size={32} color="#007AFF" />
          <Text style={styles.biometricText}>Use Biometrics</Text>
        </TouchableOpacity>
      )}

      {mode === 'verify' && (
        <TouchableOpacity style={styles.signOutBtn} onPress={logout}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 44,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
  },
  dots: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 12,
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#C7C7CC',
    backgroundColor: 'transparent',
  },
  dotFilled: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  dotError: {
    backgroundColor: '#FF3B30',
    borderColor: '#FF3B30',
  },
  errorText: {
    fontSize: 14,
    color: '#FF3B30',
    marginBottom: 8,
    textAlign: 'center',
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 264,
    marginTop: 32,
    gap: 12,
    justifyContent: 'center',
  },
  key: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyPlaceholder: {
    width: 80,
    height: 80,
  },
  keyDel: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyText: {
    fontSize: 28,
    fontWeight: '400',
    color: '#000000',
  },
  biometricBtn: {
    marginTop: 32,
    alignItems: 'center',
    gap: 6,
    padding: 8,
  },
  biometricText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  signOutBtn: {
    marginTop: 20,
    padding: 8,
  },
  signOutText: {
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: '600',
  },
});

export default PinScreen;
