import React from 'react';
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
import Card from '../components/Card';
import Button from '../components/Button';
import * as Haptics from 'expo-haptics';

const MyCardsScreen = () => {
  const navigation = useNavigation();
  const { cards, deleteCard } = useCards();

  const handleDeleteCard = (card) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Delete Card',
      `Are you sure you want to delete card ending in ${card.cardNumber.slice(-4)}?`,
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
        <Text style={styles.subtitle}>{cards.length} card{cards.length !== 1 ? 's' : ''}</Text>
      </View>

      <View style={styles.cardsList}>
        {cards.map((card, index) => (
          <View key={card.id} style={styles.cardWrapper}>
            <TouchableOpacity
              onPress={() => navigation.navigate('CardDetailsFromCards', { card })}
              activeOpacity={0.9}
            >
              <Card card={card} style={styles.card} />
            </TouchableOpacity>
            <View style={styles.cardActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate('CardDetailsFromCards', { card })}
                activeOpacity={0.7}
              >
                <Ionicons name="eye-outline" size={20} color="#007AFF" />
                <Text style={styles.actionText}>View Details</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => handleDeleteCard(card)}
                activeOpacity={0.7}
              >
                <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

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
  cardsList: {
    padding: 20,
    gap: 24,
  },
  cardWrapper: {
    marginBottom: 8,
  },
  card: {
    marginBottom: 12,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  deleteButton: {
    borderColor: '#FFEBEE',
  },
  actionText: {
    fontSize: 15,
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
