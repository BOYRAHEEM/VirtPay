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
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import { useCards } from '../context/CardContext';
import { useAuth } from '../context/AuthContext';
import * as Haptics from 'expo-haptics';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const { cards, clearAllData } = useCards();
  const {
    logout,
    user,
    pin,
    removePin,
    biometricEnabled,
    toggleBiometric,
  } = useAuth();

  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  const handleSignOut = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await clearAllData();
          await logout();
        },
      },
    ]);
  };

  const handlePinAction = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (pin) {
      Alert.alert('PIN Protection', 'Your account is protected with a PIN.', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Change PIN',
          onPress: () => navigation.navigate('SetupPin'),
        },
        {
          text: 'Disable PIN',
          style: 'destructive',
          onPress: () =>
            Alert.alert(
              'Disable PIN',
              'Your account will no longer require a PIN to unlock.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Disable',
                  style: 'destructive',
                  onPress: () => {
                    removePin();
                    toggleBiometric(false);
                  },
                },
              ]
            ),
        },
      ]);
    } else {
      navigation.navigate('SetupPin');
    }
  };

  const handleBiometricToggle = async (value) => {
    if (value) {
      if (!pin) {
        Alert.alert(
          'PIN Required',
          'You must set up a PIN before enabling biometric authentication.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Set Up PIN', onPress: () => navigation.navigate('SetupPin') },
          ]
        );
        return;
      }
      try {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        if (!hasHardware || !isEnrolled) {
          Alert.alert(
            'Not Available',
            'Biometric authentication is not set up on this device. Please configure it in your device settings.'
          );
          return;
        }
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Confirm to enable biometric unlock',
        });
        if (!result.success) return;
      } catch (_) {
        return;
      }
    }
    toggleBiometric(value);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const settingsSections = [
    {
      title: 'Account',
      items: [
        {
          icon: 'person-outline',
          label: 'Profile',
          value: user?.fullName || user?.phoneNumber || '',
          action: () => Alert.alert('Profile', 'Profile settings coming soon'),
        },
        {
          icon: 'card-outline',
          label: 'Payment Methods',
          action: () =>
            Alert.alert('Payment Methods', 'Payment methods coming soon'),
        },
        {
          icon: 'log-out-outline',
          label: 'Sign Out',
          destructive: true,
          action: handleSignOut,
        },
      ],
    },
    {
      title: 'Security',
      items: [
        {
          icon: 'keypad-outline',
          label: 'PIN Protection',
          value: pin ? 'Enabled' : 'Disabled',
          valueColor: pin ? '#34C759' : '#FF3B30',
          action: handlePinAction,
        },
        {
          icon: 'finger-print-outline',
          label: 'Biometric Authentication',
          type: 'switch',
          value: biometricEnabled,
          onValueChange: handleBiometricToggle,
        },
        {
          icon: 'shield-checkmark-outline',
          label: 'Privacy & Security',
          action: () =>
            Alert.alert('Privacy & Security', 'Security settings coming soon'),
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
          onValueChange: (val) => {
            setNotificationsEnabled(val);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          },
        },
        {
          icon: 'moon-outline',
          label: 'Dark Mode',
          value: 'Coming Soon',
          action: null,
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
          action: () =>
            Alert.alert('Terms', 'Terms & Conditions coming soon'),
        },
        {
          icon: 'lock-closed-outline',
          label: 'Privacy Policy',
          action: () =>
            Alert.alert('Privacy', 'Privacy Policy coming soon'),
        },
        {
          icon: 'mail-outline',
          label: 'Contact Us',
          action: () =>
            Alert.alert('Contact', 'Contact support coming soon'),
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
        {user?.fullName && (
          <Text style={styles.userName}>{user.fullName}</Text>
        )}
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
                    color={item.destructive ? '#FF3B30' : '#007AFF'}
                    style={styles.settingIcon}
                  />
                  <Text
                    style={[
                      styles.settingLabel,
                      item.destructive && styles.settingLabelDestructive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </View>

                {item.type === 'switch' ? (
                  <Switch
                    value={item.value}
                    onValueChange={item.onValueChange}
                    trackColor={{ false: '#E5E5EA', true: '#34C759' }}
                    thumbColor="#ffffff"
                  />
                ) : item.value ? (
                  <Text
                    style={[
                      styles.settingValue,
                      item.valueColor ? { color: item.valueColor } : null,
                    ]}
                  >
                    {item.value}
                  </Text>
                ) : item.action ? (
                  <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
                ) : null}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      <View style={styles.footer}>
        <Text style={styles.footerText}>VirtMo — Virtual Cards for Ghana</Text>
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
  userName: {
    fontSize: 15,
    color: '#8E8E93',
    marginTop: 4,
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
  settingLabelDestructive: {
    color: '#FF3B30',
  },
  settingValue: {
    fontSize: 15,
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
