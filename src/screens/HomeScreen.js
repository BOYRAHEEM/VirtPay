import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useCards } from '../context/CardContext';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation();
  const { cards } = useCards();
  const { user } = useAuth();
  const latestCard = cards[0];
  const firstName = user?.fullName?.split(' ')[0] || '';

  const totalBalance = cards.reduce((sum, card) => sum + (card.balance || 0), 0);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello{firstName ? `, ${firstName}` : ''}!</Text>
          <Text style={styles.subtitle}>Welcome to VirtMo</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color="#000000" />
        </TouchableOpacity>
      </View>

      {latestCard ? (
        <View style={styles.cardSection}>
          <Text style={styles.sectionTitle}>Your Card</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('CardDetails', { card: latestCard })}
            activeOpacity={0.9}
          >
            <Card card={latestCard} />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.emptyCardSection}>
          <View style={styles.emptyCardContainer}>
            <Ionicons name="card-outline" size={64} color="#C7C7CC" />
            <Text style={styles.emptyCardText}>No cards yet</Text>
            <Text style={styles.emptyCardSubtext}>
              Generate your first virtual card
            </Text>
          </View>
        </View>
      )}

      <View style={styles.statsSection}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Balance</Text>
          <Text style={styles.statValue}>GHS {totalBalance.toFixed(2)}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Active Cards</Text>
          <Text style={styles.statValue}>{cards.filter(c => c.isActive).length}</Text>
        </View>
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Generate')}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#007AFF' }]}>
              <Ionicons name="add-circle" size={28} color="#ffffff" />
            </View>
            <Text style={styles.actionText}>Generate Card</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Cards')}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#34C759' }]}>
              <Ionicons name="card" size={28} color="#ffffff" />
            </View>
            <Text style={styles.actionText}>My Cards</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Settings')}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#FF9500' }]}>
              <Ionicons name="settings" size={28} color="#ffffff" />
            </View>
            <Text style={styles.actionText}>Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => {
              // Navigate to Activity tab
              navigation.getParent()?.navigate('Activity');
            }}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#AF52DE' }]}>
              <Ionicons name="time" size={28} color="#ffffff" />
            </View>
            <Text style={styles.actionText}>Activity</Text>
          </TouchableOpacity>
        </View>
      </View>

      {cards.length > 0 && (
        <View style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Cards</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Cards')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recentCardsContainer}
          >
            {cards.slice(0, 3).map((card) => (
              <TouchableOpacity
                key={card.id}
                onPress={() => navigation.navigate('CardDetails', { card })}
                style={styles.recentCard}
                activeOpacity={0.8}
              >
                <View style={styles.recentCardContent}>
                  <Ionicons
                    name={card.cardType?.toLowerCase() === 'visa' ? 'card' : 'card-outline'}
                    size={24}
                    color="#007AFF"
                  />
                  <Text style={styles.recentCardNumber}>
                    •••• {card.cardNumber.slice(-4)}
                  </Text>
                  <Text style={styles.recentCardProvider}>
                    {card.mobileMoneyProvider}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Securely linked to your mobile money
        </Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#ffffff',
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 4,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardSection: {
    padding: 20,
    paddingTop: 30,
  },
  emptyCardSection: {
    padding: 20,
    paddingTop: 30,
  },
  emptyCardContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 220,
  },
  emptyCardText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginTop: 16,
  },
  emptyCardSubtext: {
    fontSize: 15,
    color: '#8E8E93',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 16,
  },
  statsSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
  },
  quickActions: {
    padding: 20,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: (width - 52) / 2,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
  },
  recentSection: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 15,
    color: '#007AFF',
    fontWeight: '600',
  },
  recentCardsContainer: {
    gap: 12,
  },
  recentCard: {
    width: 140,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recentCardContent: {
    gap: 8,
  },
  recentCardNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  recentCardProvider: {
    fontSize: 12,
    color: '#8E8E93',
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: '#8E8E93',
  },
});

export default HomeScreen;
