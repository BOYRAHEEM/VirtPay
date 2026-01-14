import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useCards } from '../context/CardContext';
import * as Haptics from 'expo-haptics';

const ActivityScreen = () => {
  const navigation = useNavigation();
  const { activities } = useCards();
  const [filter, setFilter] = useState('all'); // all, cards, transactions

  const filterOptions = [
    { id: 'all', label: 'All' },
    { id: 'cards', label: 'Cards' },
    { id: 'transactions', label: 'Transactions' },
  ];

  const filteredActivities = activities.filter((activity) => {
    if (filter === 'all') return true;
    return activity.type === filter;
  });

  const getActivityIcon = (type) => {
    switch (type) {
      case 'card_created':
        return 'card';
      case 'card_deleted':
        return 'trash';
      case 'transaction':
        return 'swap-horizontal';
      case 'card_viewed':
        return 'eye';
      default:
        return 'information-circle';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'card_created':
        return '#34C759';
      case 'card_deleted':
        return '#FF3B30';
      case 'transaction':
        return '#007AFF';
      case 'card_viewed':
        return '#8E8E93';
      default:
        return '#8E8E93';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const renderActivityItem = ({ item }) => (
    <TouchableOpacity
      style={styles.activityItem}
      activeOpacity={0.7}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (item.cardId) {
          // Navigate to card details if applicable
        }
      }}
    >
      <View style={styles.activityIconContainer}>
        <View
          style={[
            styles.activityIcon,
            { backgroundColor: `${getActivityColor(item.type)}20` },
          ]}
        >
          <Ionicons
            name={getActivityIcon(item.type)}
            size={20}
            color={getActivityColor(item.type)}
          />
        </View>
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{item.title}</Text>
        <Text style={styles.activityDescription}>{item.description}</Text>
        <Text style={styles.activityTime}>{formatDate(item.timestamp)}</Text>
      </View>
      {item.amount && (
        <View style={styles.activityAmount}>
          <Text
            style={[
              styles.amountText,
              { color: item.amount > 0 ? '#34C759' : '#FF3B30' },
            ]}
          >
            {item.amount > 0 ? '+' : ''}GHS {Math.abs(item.amount).toFixed(2)}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Activity</Text>
        <Text style={styles.subtitle}>
          {filteredActivities.length} activity
          {filteredActivities.length !== 1 ? 'ies' : ''}
        </Text>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {filterOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.filterButton,
                filter === option.id && styles.filterButtonActive,
              ]}
              onPress={() => {
                setFilter(option.id);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === option.id && styles.filterTextActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {filteredActivities.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="time-outline" size={64} color="#C7C7CC" />
          <Text style={styles.emptyTitle}>No Activity</Text>
          <Text style={styles.emptySubtitle}>
            Your activity history will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredActivities}
          renderItem={renderActivityItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#8E8E93',
  },
  filterContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  filterScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#8E8E93',
  },
  filterTextActive: {
    color: '#ffffff',
  },
  listContent: {
    padding: 20,
  },
  activityItem: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activityIconContainer: {
    marginRight: 12,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: '#8E8E93',
  },
  activityAmount: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#8E8E93',
    textAlign: 'center',
  },
});

export default ActivityScreen;
