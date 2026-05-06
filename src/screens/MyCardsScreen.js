import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useCards } from '../context/CardContext';
import Card from '../components/Card';
import Button from '../components/Button';
import * as Haptics from 'expo-haptics';

const MyCardsScreen = () => {
  const navigation = useNavigation();
  const { cards, deleteCard } = useCards();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCards = cards
    .filter((card) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        card.cardholderName.toLowerCase().includes(q) ||
        card.mobileMoneyProvider.toLowerCase().includes(q) ||
        card.cardNumber.slice(-4).includes(q)
      );
    })
    // Active cards first, frozen last
    .sort((a, b) => (b.isActive ? 1 : 0) - (a.isActive ? 1 : 0));

  const handleDeleteCard = (card) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Delete Card',
      `Are you sure you want to delete card ending in ${card.cardNumber.slice(-4)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteCard(card.id);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ]
    );
  };

  if (cards.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyContent}>
          <Ionicons name="card-outline" size={80} color="#C7C7CC" />
          <Text style={styles.emptyTitle}>No Cards Yet</Text>
          <Text style={styles.emptySubtitle}>
            Generate your first virtual card to get started
          </Text>
          <Button
            title="Generate Card"
            onPress={() => navigation.navigate('Generate')}
            style={styles.emptyButton}
          />
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>My Cards</Text>
        <Text style={styles.subtitle}>
          {cards.length} card{cards.length !== 1 ? 's' : ''}
          {cards.filter((c) => !c.isActive).length > 0
            ? ` · ${cards.filter((c) => !c.isActive).length} frozen`
            : ''}
        </Text>
      </View>

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={18} color="#8E8E93" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by name, provider or last 4 digits"
          placeholderTextColor="#C7C7CC"
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color="#C7C7CC" />
          </TouchableOpacity>
        )}
      </View>

      {filteredCards.length === 0 ? (
        <View style={styles.noResultsContainer}>
          <Ionicons name="search-outline" size={40} color="#C7C7CC" />
          <Text style={styles.noResultsText}>No cards match "{searchQuery}"</Text>
        </View>
      ) : (
        <View style={styles.cardsList}>
          {filteredCards.map((card) => (
            <View key={card.id} style={styles.cardWrapper}>
              <TouchableOpacity
                onPress={() => navigation.navigate('CardDetailsFromCards', { card })}
                activeOpacity={0.9}
              >
                <Card card={card} style={styles.card} />
              </TouchableOpacity>

              {/* Status + actions row */}
              <View style={styles.cardMeta}>
                <View
                  style={[
                    styles.statusBadge,
                    card.isActive ? styles.statusActive : styles.statusFrozen,
                  ]}
                >
                  <Ionicons
                    name={card.isActive ? 'checkmark-circle' : 'snow-outline'}
                    size={12}
                    color={card.isActive ? '#34C759' : '#007AFF'}
                  />
                  <Text
                    style={[
                      styles.statusText,
                      !card.isActive && styles.statusTextFrozen,
                    ]}
                  >
                    {card.isActive ? 'Active' : 'Frozen'}
                  </Text>
                </View>
                <Text style={styles.balanceText}>
                  GHS {(card.balance ?? 0).toFixed(2)}
                </Text>
              </View>

              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => navigation.navigate('CardDetailsFromCards', { card })}
                  activeOpacity={0.7}
                >
                  <Ionicons name="eye-outline" size={18} color="#007AFF" />
                  <Text style={styles.actionText}>View</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => handleDeleteCard(card)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="trash-outline" size={18} color="#FF3B30" />
                  <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      <View style={styles.footer}>
        <Button
          title="Generate New Card"
          onPress={() => navigation.navigate('Generate')}
          variant="secondary"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyContent: {
    alignItems: 'center',
    maxWidth: 300,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    marginTop: 24,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 32,
  },
  emptyButton: {
    width: '100%',
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#8E8E93',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 4,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  searchIcon: {
    flexShrink: 0,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#000000',
  },
  noResultsContainer: {
    alignItems: 'center',
    padding: 48,
    gap: 12,
  },
  noResultsText: {
    fontSize: 15,
    color: '#8E8E93',
    textAlign: 'center',
  },
  cardsList: {
    padding: 20,
    gap: 24,
  },
  cardWrapper: {
    marginBottom: 4,
  },
  card: {
    marginBottom: 10,
  },
  cardMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    backgroundColor: '#E8F5E9',
  },
  statusActive: {
    backgroundColor: '#E8F5E9',
  },
  statusFrozen: {
    backgroundColor: '#E3F2FD',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#34C759',
  },
  statusTextFrozen: {
    color: '#007AFF',
  },
  balanceText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 13,
    gap: 7,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  deleteButton: {
    borderColor: '#FFEBEE',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  deleteText: {
    color: '#FF3B30',
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
  },
});

export default MyCardsScreen;
