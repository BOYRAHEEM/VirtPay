import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const Card = ({ card, style }) => {
  const formatCardNumber = (number) => {
    return number.replace(/(.{4})/g, '$1 ').trim();
  };

  const getCardGradient = () => {
    if (card.cardType === 'visa') {
      return ['#1e3c72', '#2a5298'];
    } else {
      return ['#eb3349', '#f45c43'];
    }
  };

  const getCardLogo = () => {
    return card.cardType === 'visa' ? 'VISA' : 'Mastercard';
  };

  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={getCardGradient()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <View style={styles.chipContainer}>
              <View style={styles.chip} />
            </View>
            <Text style={styles.cardType}>{getCardLogo()}</Text>
          </View>

          <View style={styles.cardNumberContainer}>
            <Text style={styles.cardNumber}>
              {formatCardNumber(card.cardNumber)}
            </Text>
          </View>

          <View style={styles.cardFooter}>
            <View>
              <Text style={styles.label}>CARDHOLDER</Text>
              <Text style={styles.cardholderName}>
                {card.cardholderName.toUpperCase()}
              </Text>
            </View>
            <View style={styles.expiryContainer}>
              <Text style={styles.label}>EXPIRES</Text>
              <Text style={styles.expiryDate}>{card.expiryDate}</Text>
            </View>
          </View>

          <View style={styles.providerBadge}>
            <Text style={styles.providerText}>{card.mobileMoneyProvider}</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  gradient: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  chipContainer: {
    width: 50,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chip: {
    width: 40,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 4,
  },
  cardType: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 1,
  },
  cardNumberContainer: {
    marginBottom: 30,
  },
  cardNumber: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 2,
    fontFamily: 'monospace',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  label: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 1,
    marginBottom: 4,
  },
  cardholderName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
  },
  expiryContainer: {
    alignItems: 'flex-end',
  },
  expiryDate: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  providerBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  providerText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default Card;
