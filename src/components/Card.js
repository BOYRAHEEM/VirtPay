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
          {/* Header: chip on left, provider badge on right */}
          <View style={styles.cardHeader}>
            <View style={styles.chipContainer}>
              <View style={styles.chip} />
            </View>
            <View style={styles.providerBadge}>
              <Text style={styles.providerText}>{card.mobileMoneyProvider}</Text>
            </View>
          </View>

          {/* Card number */}
          <View style={styles.cardNumberContainer}>
            <Text style={styles.cardNumber}>
              {formatCardNumber(card.cardNumber)}
            </Text>
          </View>

          {/* Footer: cardholder on left, expiry + network logo on right */}
          <View style={styles.cardFooter}>
            <View>
              <Text style={styles.label}>CARDHOLDER</Text>
              <Text style={styles.cardholderName}>
                {card.cardholderName.toUpperCase()}
              </Text>
            </View>
            <View style={styles.cardFooterRight}>
              <View style={styles.expiryContainer}>
                <Text style={styles.label}>EXPIRES</Text>
                <Text style={styles.expiryDate}>{card.expiryDate}</Text>
              </View>
              <Text style={styles.cardType}>{getCardLogo()}</Text>
            </View>
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
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  providerBadge: {
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
  cardNumberContainer: {
    marginVertical: 16,
  },
  cardNumber: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: 3,
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
  cardFooterRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  expiryContainer: {
    alignItems: 'flex-end',
  },
  expiryDate: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  cardType: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    fontStyle: 'italic',
    letterSpacing: 1,
  },
});

export default Card;
