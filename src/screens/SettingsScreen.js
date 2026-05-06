import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCards } from '../context/CardContext';
import { useAuth } from '../context/AuthContext';
import * as Haptics from 'expo-haptics';

const SettingsScreen = () => {
  const { cards, mobileMoneyProvider, setMobileMoneyProvider } = useCards();
  const { logout, user } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [biometricEnabled, setBiometricEnabled] = React.useState(false);

  const settingsSections = [
    {
      title: 'Account',
      items: [
        {
          icon: 'person-outline',
          label: 'Profile',
          action: () => Alert.alert('Profile', 'Profile settings coming soon'),
        },
        {
          icon: 'card-outline',
          label: 'Payment Methods',
          action: () => Alert.alert('Payment Methods', 'Payment methods coming soon'),
        },
        {
          icon: 'shield-checkmark-outline',
          label: 'Security',
          action: () => Alert.alert('Security', 'Security settings coming soon'),
        },
        {
          icon: 'log-out-outline',
          label: 'Sign Out',
          action: () => {
            Alert.alert(
              'Sign Out',
              'Are you sure you want to sign out?',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Sign Out',
                  style: 'destructive',
                  onPress: () => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    logout();
                  },
                },
              ]
            );
          },
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: 'notifications-outline',
          label: 'Notifications',
          type: 'switch',
          value: notificationsEnabled,
          onValueChange: setNotificationsEnabled,
        },
        {
          icon: 'finger-print-outline',
          label: 'Biometric Authentication',
          type: 'switch',
          value: biometricEnabled,
          onValueChange: setBiometricEnabled,
        },
        {
          icon: 'moon-outline',
          label: 'Dark Mode',
          type: 'switch',
          value: false,
          onValueChange: () => Alert.alert('Dark Mode', 'Dark mode coming soon'),
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: 'help-circle-outline',
          label: 'Help Center',
          action: () => Alert.alert('Help Center', 'Help center coming soon'),
        },
        {
          icon: 'document-text-outline',
          label: 'Terms & Conditions',
          action: () => Alert.alert('Terms', 'Terms & Conditions coming soon'),
        },
        {
          icon: 'lock-closed-outline',
          label: 'Privacy Policy',
          action: () => Alert.alert('Privacy', 'Privacy Policy coming soon'),
        },
        {
          icon: 'mail-outline',
          label: 'Contact Us',
          action: () => Alert.alert('Contact', 'Contact support coming soon'),
        },
      ],
    },
    {
      title: 'About',
      items: [
        {
          icon: 'information-circle-outline',
          label: 'App Version',
          value: '1.0.0',
          action: null,
        },
        {
          icon: 'stats-chart-outline',
          label: 'Statistics',
          value: `${cards.length} card${cards.length !== 1 ? 's' : ''}`,
          action: null,
        },
      ],
    },
  ];

  const handleAction = (action) => {
    if (action) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      action();
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      {settingsSections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.sectionContent}>
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                style={[
                  styles.settingItem,
                  itemIndex === section.items.length - 1 && styles.settingItemLast,
                ]}
                onPress={() => handleAction(item.action)}
                disabled={!item.action && item.type !== 'switch'}
                activeOpacity={item.action ? 0.7 : 1}
              >
                <View style={styles.settingItemLeft}>
                  <Ionicons
                    name={item.icon}
                    size={22}
                    color="#007AFF"
                    style={styles.settingIcon}
                  />
                  <Text style={styles.settingLabel}>{item.label}</Text>
                </View>
                {item.type === 'switch' ? (
                  <Switch
                    value={item.value}
                    onValueChange={item.onValueChange}
                    trackColor={{ false: '#E5E5EA', true: '#34C759' }}
                    thumbColor="#ffffff"
                  />
                ) : item.value ? (
                  <Text style={styles.settingValue}>{item.value}</Text>
                ) : (
                  <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      <View style={styles.footer}>
        <Text style={styles.footerText}>VirtMo - Virtual Cards for Ghana</Text>
        <Text style={styles.footerSubtext}>
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
    padding: 20,
    paddingTop: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  sectionContent: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  settingItemLast: {
    borderBottomWidth: 0,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  settingValue: {
    fontSize: 16,
    color: '#8E8E93',
    marginRight: 8,
  },
  footer: {
    padding: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 13,
    color: '#8E8E93',
  },
});

export default SettingsScreen;
