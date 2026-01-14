import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useCards } from '../context/CardContext';
import Input from '../components/Input';
import Button from '../components/Button';
import * as Haptics from 'expo-haptics';

const GenerateCardScreen = () => {
  const navigation = useNavigation();
  const { addCard, mobileMoneyProvider, setMobileMoneyProvider } = useCards();
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const mobileMoneyProviders = [
    { id: 'MTN', name: 'MTN Mobile Money', icon: 'phone-portrait' },
    { id: 'Vodafone', name: 'Vodafone Cash', icon: 'call' },
    { id: 'AirtelTigo', name: 'AirtelTigo Money', icon: 'cellular' },
  ];

  const handleGenerate = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Simulate API call
    setTimeout(() => {
      const newCard = addCard({
        name: name.trim(),
        phoneNumber: phoneNumber.trim(),
        amount: parseFloat(amount),
        provider: mobileMoneyProvider,
      });

      setLoading(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      Alert.alert(
        'Success!',
        'Your virtual card has been generated successfully.',
        [
          {
            text: 'View Card',
            onPress: () => {
              navigation.navigate('CardDetails', { card: newCard });
              setName('');
              setPhoneNumber('');
              setAmount('');
            },
          },
          {
            text: 'OK',
            style: 'cancel',
          },
        ]
      );
    }, 1500);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Generate Virtual Card</Text>
        <Text style={styles.subtitle}>
          Create a Visa or Mastercard linked to your mobile money account
        </Text>
      </View>

      <View style={styles.form}>
        <Input
          label="Cardholder Name"
          value={name}
          onChangeText={setName}
          placeholder="Enter your full name"
          autoCapitalize="words"
        />

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Mobile Money Provider</Text>
          <View style={styles.providerGrid}>
            {mobileMoneyProviders.map((provider) => (
              <TouchableOpacity
                key={provider.id}
                style={[
                  styles.providerCard,
                  mobileMoneyProvider === provider.id && styles.providerCardActive,
                ]}
                onPress={() => {
                  setMobileMoneyProvider(provider.id);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={provider.icon}
                  size={24}
                  color={
                    mobileMoneyProvider === provider.id ? '#007AFF' : '#8E8E93'
                  }
                />
                <Text
                  style={[
                    styles.providerText,
                    mobileMoneyProvider === provider.id && styles.providerTextActive,
                  ]}
                >
                  {provider.name}
                </Text>
                {mobileMoneyProvider === provider.id && (
                  <View style={styles.checkmark}>
                    <Ionicons name="checkmark-circle" size={20} color="#007AFF" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Input
          label="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="e.g., 0244123456"
          keyboardType="phone-pad"
        />

        <Input
          label="Initial Balance (GHS)"
          value={amount}
          onChangeText={setAmount}
          placeholder="0.00"
          keyboardType="decimal-pad"
        />

        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={20} color="#007AFF" />
          <Text style={styles.infoText}>
            Your card will be linked to your {mobileMoneyProvider} account. You
            can fund it directly from your mobile money wallet.
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Generate Card"
            onPress={handleGenerate}
            loading={loading}
            disabled={loading}
          />
        </View>
      </View>

      <View style={styles.featuresSection}>
        <Text style={styles.featuresTitle}>Card Features</Text>
        <View style={styles.featuresList}>
          <View style={styles.featureItem}>
            <Ionicons name="shield-checkmark" size={20} color="#34C759" />
            <Text style={styles.featureText}>Secure & Protected</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="globe" size={20} color="#007AFF" />
            <Text style={styles.featureText}>Accepted Worldwide</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="flash" size={20} color="#FF9500" />
            <Text style={styles.featureText}>Instant Generation</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="card" size={20} color="#AF52DE" />
            <Text style={styles.featureText}>Virtual Card</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    padding: 20,
    paddingTop: 20,
    backgroundColor: '#ffffff',
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
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  providerGrid: {
    gap: 12,
  },
  providerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  providerCardActive: {
    backgroundColor: '#E3F2FD',
    borderColor: '#007AFF',
  },
  providerText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
    marginLeft: 12,
  },
  providerTextActive: {
    color: '#007AFF',
  },
  checkmark: {
    marginLeft: 8,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#007AFF',
    lineHeight: 20,
  },
  buttonContainer: {
    marginTop: 10,
  },
  featuresSection: {
    padding: 20,
    paddingTop: 0,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 16,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
});

export default GenerateCardScreen;
