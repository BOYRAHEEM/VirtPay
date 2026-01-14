import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import * as Haptics from 'expo-haptics';

const SignupScreen = () => {
  const navigation = useNavigation();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    ghanaCardNumber: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateGhanaCard = (cardNumber) => {
    // Ghana Card format: GHA-XXXXXXXX-X (e.g., GHA-123456789-1)
    const ghanaCardRegex = /^GHA-\d{9}-\d{1}$/;
    return ghanaCardRegex.test(cardNumber.toUpperCase());
  };

  const validatePhoneNumber = (phone) => {
    // Ghana phone numbers: 0244xxxxxx, 020xxxxxxx, 050xxxxxxx, etc.
    const phoneRegex = /^(0|\+233)[2-9]\d{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const formatGhanaCard = (text) => {
    // Auto-format: GHA-123456789-1
    let formatted = text.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (formatted.startsWith('GHA')) {
      formatted = formatted.substring(3);
    }
    if (formatted.length > 0) {
      formatted = 'GHA-' + formatted;
    }
    if (formatted.length > 13) {
      formatted = formatted.substring(0, 13) + '-' + formatted.substring(13, 14);
    }
    return formatted;
  };

  const formatPhoneNumber = (text) => {
    // Format: 0244 123 4567
    let cleaned = text.replace(/\D/g, '');
    if (cleaned.startsWith('233')) {
      cleaned = '0' + cleaned.substring(3);
    }
    if (cleaned.length > 0 && cleaned[0] !== '0') {
      cleaned = '0' + cleaned;
    }
    if (cleaned.length > 3) {
      cleaned = cleaned.substring(0, 3) + ' ' + cleaned.substring(3);
    }
    if (cleaned.length > 7) {
      cleaned = cleaned.substring(0, 7) + ' ' + cleaned.substring(7, 11);
    }
    return cleaned;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.ghanaCardNumber.trim()) {
      newErrors.ghanaCardNumber = 'Ghana Card number is required';
    } else if (!validateGhanaCard(formData.ghanaCardNumber)) {
      newErrors.ghanaCardNumber = 'Invalid Ghana Card format (GHA-123456789-1)';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!validatePhoneNumber(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Invalid phone number format';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Simulate KYC verification API call
    setTimeout(() => {
      setLoading(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      Alert.alert(
        'KYC Verification',
        'Your Ghana Card and phone number are being verified. You will receive a confirmation SMS shortly.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Set authentication state after successful signup
              signup({
                fullName: formData.fullName,
                ghanaCardNumber: formData.ghanaCardNumber,
                phoneNumber: formData.phoneNumber.replace(/\s/g, ''),
                email: formData.email,
                // In real app, you'd get this from API response
              });
            },
          },
        ]
      );
    }, 2000);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Sign up with your Ghana Card for KYC verification
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Full Name"
            value={formData.fullName}
            onChangeText={(text) => {
              setFormData({ ...formData, fullName: text });
              if (errors.fullName) setErrors({ ...errors, fullName: null });
            }}
            placeholder="Enter your full name"
            autoCapitalize="words"
            error={errors.fullName}
          />

          <Input
            label="Ghana Card Number"
            value={formData.ghanaCardNumber}
            onChangeText={(text) => {
              const formatted = formatGhanaCard(text);
              setFormData({ ...formData, ghanaCardNumber: formatted });
              if (errors.ghanaCardNumber)
                setErrors({ ...errors, ghanaCardNumber: null });
            }}
            placeholder="GHA-123456789-1"
            autoCapitalize="characters"
            maxLength={14}
            error={errors.ghanaCardNumber}
            rightIcon="card-outline"
          />

          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={16} color="#007AFF" />
            <Text style={styles.infoText}>
              Your Ghana Card number is required for KYC verification
            </Text>
          </View>

          <Input
            label="Phone Number"
            value={formData.phoneNumber}
            onChangeText={(text) => {
              const formatted = formatPhoneNumber(text);
              setFormData({ ...formData, phoneNumber: formatted });
              if (errors.phoneNumber)
                setErrors({ ...errors, phoneNumber: null });
            }}
            placeholder="0244 123 4567"
            keyboardType="phone-pad"
            maxLength={13}
            error={errors.phoneNumber}
            rightIcon="call-outline"
          />

          <Input
            label="Email Address"
            value={formData.email}
            onChangeText={(text) => {
              setFormData({ ...formData, email: text });
              if (errors.email) setErrors({ ...errors, email: null });
            }}
            placeholder="your.email@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
            rightIcon="mail-outline"
          />

          <Input
            label="Password"
            value={formData.password}
            onChangeText={(text) => {
              setFormData({ ...formData, password: text });
              if (errors.password) setErrors({ ...errors, password: null });
            }}
            placeholder="At least 8 characters"
            secureTextEntry={!showPassword}
            error={errors.password}
            rightIcon={showPassword ? 'eye-off-outline' : 'eye-outline'}
            onRightIconPress={() => setShowPassword(!showPassword)}
          />

          <Input
            label="Confirm Password"
            value={formData.confirmPassword}
            onChangeText={(text) => {
              setFormData({ ...formData, confirmPassword: text });
              if (errors.confirmPassword)
                setErrors({ ...errors, confirmPassword: null });
            }}
            placeholder="Re-enter your password"
            secureTextEntry={!showConfirmPassword}
            error={errors.confirmPassword}
            rightIcon={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
            onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
          />

          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              By signing up, you agree to our{' '}
              <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </View>

          <Button
            title="Create Account & Verify KYC"
            onPress={handleSignup}
            loading={loading}
            disabled={loading}
            style={styles.signupButton}
          />

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#ffffff',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
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
    lineHeight: 22,
  },
  form: {
    padding: 20,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    gap: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#007AFF',
    lineHeight: 18,
  },
  termsContainer: {
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  termsText: {
    fontSize: 13,
    color: '#8E8E93',
    lineHeight: 20,
    textAlign: 'center',
  },
  termsLink: {
    color: '#007AFF',
    fontWeight: '600',
  },
  signupButton: {
    marginBottom: 20,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 15,
    color: '#8E8E93',
  },
  loginLink: {
    fontSize: 15,
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default SignupScreen;
