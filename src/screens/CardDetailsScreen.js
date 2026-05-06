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
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { useCards } from '../context/CardContext';
import Card from '../components/Card';
import Button from '../components/Button';
import FundCardModal from '../components/FundCardModal';
import * as Haptics from 'expo-haptics';

const CardDetailsScreen = ({ route, navigation }) => {
  const { card: initialCard } = route.params;
  const { deleteCard, toggleCardFreeze, fundCard, cards } = useCards();
  const [showCVV, setShowCVV] = useState(false);
  const [showFundModal, setShowFundModal] = useState(false);

  // Always use live data from context
  const card = cards.find((c) => c.id === initialCard.id) || initialCard;

  const handleShare = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await Share.share({
        message: `VirtMo Card Details\n\nCard Number: ${card.cardNumber}\nExpiry: ${card.expiryDate}\nCardholder: ${card.cardholderName}\nProvider: ${card.mobileMoneyProvider}`,
      });
    } catch {
      Alert.alert('Error', 'Unable to share card details');
    }
  };

  const handleDelete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Delete Card',
      'Are you sure you want to delete this card? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteCard(card.id);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleToggleFreeze = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const isFreezing = card.isActive;
    Alert.alert(
      isFreezing ? 'Freeze Card' : 'Unfreeze Card',
      isFreezing
        ? 'Freezing temporarily blocks all transactions. You can unfreeze anytime.'
        : 'Unfreezing will re-enable all transactions on this card.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: isFreezing ? 'Freeze' : 'Unfreeze',
          style: isFreezing ? 'destructive' : 'default',
          onPress: () => {
            toggleCardFreeze(card.id);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ]
    );
  };

  const copyToClipboard = async (text, label) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await Clipboard.setStringAsync(text);
    } catch (_) {
      // clipboard not available in this environment
    }
    Alert.alert('Copied', `${label} copied to clipboard`);
  };

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.cardSection}>
          <Card card={card} />
          {/* Status badge */}
          <View style={[styles.statusBadge, card.isActive ? styles.statusActive : styles.statusFrozen]}>
            <Ionicons
              name={card.isActive ? 'checkmark-circle' : 'snow-outline'}
              size={14}
              color={card.isActive ? '#34C759' : '#007AFF'}
            />
            <Text style={[styles.statusText, !card.isActive && styles.statusTextFrozen]}>
              {card.isActive ? 'Active' : 'Frozen'}
            </Text>
          </View>
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
              <Text style={styles.detailValue}>{showCVV ? card.cvv : '•••'}</Text>
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

          {!!card.phoneNumber && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Phone Number</Text>
              <Text style={styles.detailValue}>{card.phoneNumber}</Text>
            </View>
          )}

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Balance</Text>
            <Text style={[styles.detailValue, styles.balanceValue]}>
              GHS {(card.balance ?? 0).toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Primary actions */}
        <View style={styles.actionsSection}>
          <Button
            title="Fund Card"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowFundModal(true);
            }}
            style={styles.actionButton}
          />
          <Button
            title={card.isActive ? 'Freeze Card' : 'Unfreeze Card'}
            onPress={handleToggleFreeze}
            variant="secondary"
            style={[
              styles.actionButton,
              !card.isActive && styles.unfreezeButton,
            ]}
          />
        </View>

        {/* Secondary actions */}
        <View style={styles.secondaryActions}>
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

      <FundCardModal
        visible={showFundModal}
        onClose={() => setShowFundModal(false)}
        onFund={(amount) => fundCard(card.id, amount)}
        card={card}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  cardSection: {
    padding: 20,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    backgroundColor: '#E8F5E9',
  },
  statusActive: {
    backgroundColor: '#E8F5E9',
  },
  statusFrozen: {
    backgroundColor: '#E3F2FD',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#34C759',
  },
  statusTextFrozen: {
    color: '#007AFF',
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
    paddingVertical: 14,
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
    marginBottom: 12,
  },
  secondaryActions: {
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    marginBottom: 0,
  },
  unfreezeButton: {
    borderColor: '#007AFF',
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
