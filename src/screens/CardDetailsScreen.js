import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCards } from '../context/CardContext';
import Card from '../components/Card';
import Button from '../components/Button';
import * as Haptics from 'expo-haptics';

const CardDetailsScreen = ({ route }) => {
  const { card: initialCard } = route.params;
  const { updateCard, deleteCard } = useCards();
  const [showCVV, setShowCVV] = useState(false);
  const [card] = useState(initialCard);

  const handleShare = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await Share.share({
        message: `VirtMo Card Details\n\nCard Number: ${card.cardNumber}\nExpiry: ${card.expiryDate}\nCardholder: ${card.cardholderName}\nProvider: ${card.mobileMoneyProvider}`,
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to share card details');
    }
  };

  const handleDelete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Delete Card',
      `Are you sure you want to delete this card? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteCard(card.id);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            // Navigation will be handled by the navigation system
          },
        },
      ]
    );
  };

  const copyToClipboard = (text, label) => {
    // In a real app, you'd use Clipboard from expo-clipboard
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Copied', `${label} copied to clipboard`);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.cardSection}>
        <Card card={card} />
      </View>

      <View style={styles.detailsSection}>
        <Text style={styles.sectionTitle}>Card Information</Text>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Card Number</Text>
          <TouchableOpacity
            style={styles.detailValueContainer}
            onPress={() => copyToClipboard(card.cardNumber, 'Card number')}
            activeOpacity={0.7}
          >
            <Text style={styles.detailValue}>
              {card.cardNumber.replace(/(.{4})/g, '$1 ').trim()}
            </Text>
            <Ionicons name="copy-outline" size={18} color="#007AFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>CVV</Text>
          <TouchableOpacity
            style={styles.detailValueContainer}
            onPress={() => {
              setShowCVV(!showCVV);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.detailValue}>
              {showCVV ? card.cvv : '•••'}
            </Text>
            <Ionicons
              name={showCVV ? 'eye-off-outline' : 'eye-outline'}
              size={18}
              color="#007AFF"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Expiry Date</Text>
          <Text style={styles.detailValue}>{card.expiryDate}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Cardholder Name</Text>
          <Text style={styles.detailValue}>{card.cardholderName}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Mobile Money Provider</Text>
          <View style={styles.providerBadge}>
            <Text style={styles.providerText}>{card.mobileMoneyProvider}</Text>
          </View>
        </View>

        {card.phoneNumber && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Phone Number</Text>
            <Text style={styles.detailValue}>{card.phoneNumber}</Text>
          </View>
        )}

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Balance</Text>
          <Text style={[styles.detailValue, styles.balanceValue]}>
            GHS {card.balance?.toFixed(2) || '0.00'}
          </Text>
        </View>
      </View>

      <View style={styles.actionsSection}>
        <Button
          title="Share Card Details"
          onPress={handleShare}
          variant="secondary"
          style={styles.actionButton}
        />
        <Button
          title="Delete Card"
          onPress={handleDelete}
          variant="secondary"
          style={[styles.actionButton, styles.deleteButton]}
        />
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoCard}>
          <Ionicons name="shield-checkmark" size={20} color="#34C759" />
          <Text style={styles.infoText}>
            Your card is secure and protected. Never share your CVV with anyone.
          </Text>
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
  cardSection: {
    padding: 20,
    paddingTop: 20,
  },
  detailsSection: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  detailLabel: {
    fontSize: 15,
    color: '#8E8E93',
    fontWeight: '500',
  },
  detailValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  balanceValue: {
    fontSize: 18,
    color: '#34C759',
  },
  providerBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  providerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  actionsSection: {
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    marginBottom: 0,
  },
  deleteButton: {
    borderColor: '#FF3B30',
  },
  infoSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#2E7D32',
    lineHeight: 20,
  },
});

export default CardDetailsScreen;
