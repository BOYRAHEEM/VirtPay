import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const QUICK_AMOUNTS = [50, 100, 200, 500];
const MIN_AMOUNT = 1;
const MAX_AMOUNT = 10000;

const FundCardModal = ({ visible, onClose, onFund, card }) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFund = async () => {
    const parsed = parseFloat(amount);
    if (!amount || isNaN(parsed)) {
      setError('Please enter an amount');
      return;
    }
    if (parsed < MIN_AMOUNT) {
      setError(`Minimum amount is GHS ${MIN_AMOUNT}.00`);
      return;
    }
    if (parsed > MAX_AMOUNT) {
      setError(`Maximum amount is GHS ${MAX_AMOUNT.toLocaleString()}.00`);
      return;
    }

    setLoading(true);
    // Simulate processing delay
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onFund(parsed);
    dismiss();
  };

  const dismiss = () => {
    setAmount('');
    setError('');
    onClose();
  };

  const selectQuickAmount = (amt) => {
    setAmount(amt.toString());
    setError('');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={dismiss}>
      <TouchableWithoutFeedback onPress={dismiss}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
              <View style={styles.sheet}>
                <View style={styles.handle} />

                <View style={styles.header}>
                  <Text style={styles.title}>Fund Card</Text>
                  <TouchableOpacity onPress={dismiss} hitSlop={12}>
                    <Ionicons name="close-circle" size={28} color="#C7C7CC" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.balanceLabel}>Current Balance</Text>
                <Text style={styles.balance}>
                  GHS {(card?.balance ?? 0).toFixed(2)}
                </Text>

                <Text style={styles.label}>Amount to add (GHS)</Text>
                <TextInput
                  style={[styles.amountInput, error ? styles.amountInputError : null]}
                  value={amount}
                  onChangeText={(t) => {
                    setAmount(t);
                    setError('');
                  }}
                  placeholder="0.00"
                  placeholderTextColor="#C7C7CC"
                  keyboardType="decimal-pad"
                  autoFocus
                />
                {!!error && <Text style={styles.errorText}>{error}</Text>}

                <View style={styles.quickRow}>
                  {QUICK_AMOUNTS.map((amt) => (
                    <TouchableOpacity
                      key={amt}
                      style={[
                        styles.quickChip,
                        amount === amt.toString() && styles.quickChipActive,
                      ]}
                      onPress={() => selectQuickAmount(amt)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.quickChipText,
                          amount === amt.toString() && styles.quickChipTextActive,
                        ]}
                      >
                        GHS {amt}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {card?.mobileMoneyProvider && (
                  <View style={styles.infoRow}>
                    <Ionicons name="information-circle-outline" size={16} color="#007AFF" />
                    <Text style={styles.infoText}>
                      Funds will be deducted from your {card.mobileMoneyProvider} account
                    </Text>
                  </View>
                )}

                <TouchableOpacity
                  style={[styles.fundBtn, loading && styles.fundBtnLoading]}
                  onPress={handleFund}
                  disabled={loading}
                  activeOpacity={0.85}
                >
                  <Text style={styles.fundBtnText}>
                    {loading ? 'Processing…' : 'Fund Card'}
                  </Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 44 : 28,
  },
  handle: {
    width: 44,
    height: 4,
    backgroundColor: '#E5E5EA',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000000',
  },
  balanceLabel: {
    fontSize: 13,
    color: '#8E8E93',
    marginBottom: 4,
  },
  balance: {
    fontSize: 30,
    fontWeight: '700',
    color: '#34C759',
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 10,
  },
  amountInput: {
    fontSize: 32,
    fontWeight: '600',
    color: '#000000',
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
    paddingVertical: 6,
    marginBottom: 4,
  },
  amountInputError: {
    borderBottomColor: '#FF3B30',
  },
  errorText: {
    fontSize: 13,
    color: '#FF3B30',
    marginBottom: 12,
  },
  quickRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
    marginBottom: 20,
  },
  quickChip: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  quickChipActive: {
    backgroundColor: '#E3F2FD',
    borderColor: '#007AFF',
  },
  quickChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
  },
  quickChipTextActive: {
    color: '#007AFF',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#E3F2FD',
    borderRadius: 10,
    padding: 12,
    gap: 8,
    marginBottom: 20,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#007AFF',
    lineHeight: 18,
  },
  fundBtn: {
    backgroundColor: '#007AFF',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  fundBtnLoading: {
    opacity: 0.6,
  },
  fundBtnText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
  },
});

export default FundCardModal;
