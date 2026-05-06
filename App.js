import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './src/screens/HomeScreen';
import GenerateCardScreen from './src/screens/GenerateCardScreen';
import MyCardsScreen from './src/screens/MyCardsScreen';
import CardDetailsScreen from './src/screens/CardDetailsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ActivityScreen from './src/screens/ActivityScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import LoadingScreen from './src/screens/LoadingScreen';
import PinScreen from './src/screens/PinScreen';

import { CardProvider, useCards } from './src/context/CardContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';

import ErrorBoundary from './src/components/ErrorBoundary';
import NetworkBanner from './src/components/NetworkBanner';
import useNetworkStatus from './src/hooks/useNetworkStatus';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HEADER_OPTS = {
  headerStyle: { backgroundColor: '#ffffff' },
  headerTintColor: '#000000',
  headerTitleStyle: { fontWeight: '600' },
};

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={HEADER_OPTS}>
      <Stack.Screen name="HomeMain" component={HomeScreen} options={{ title: 'VirtMo' }} />
      <Stack.Screen name="CardDetails" component={CardDetailsScreen} options={{ title: 'Card Details' }} />
    </Stack.Navigator>
  );
}

function CardsStack() {
  return (
    <Stack.Navigator screenOptions={HEADER_OPTS}>
      <Stack.Screen name="MyCardsMain" component={MyCardsScreen} options={{ title: 'My Cards' }} />
      <Stack.Screen name="CardDetailsFromCards" component={CardDetailsScreen} options={{ title: 'Card Details' }} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const icons = {
            Home: focused ? 'home' : 'home-outline',
            Cards: focused ? 'card' : 'card-outline',
            Activity: focused ? 'time' : 'time-outline',
            Generate: focused ? 'add-circle' : 'add-circle-outline',
            Settings: focused ? 'settings' : 'settings-outline',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#E5E5EA',
          borderTopWidth: 0.5,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '500' },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Cards" component={CardsStack} />
      <Tab.Screen name="Activity" component={ActivityScreen} options={{ title: 'Activity' }} />
      <Tab.Screen name="Generate" component={GenerateCardScreen} options={{ title: 'Generate Card' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

// Root stack: tabs + PIN setup as a modal screen
function MainStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SetupPin"
        component={PinScreen}
        initialParams={{ mode: 'setup' }}
        options={{
          title: 'PIN Protection',
          presentation: 'modal',
          ...HEADER_OPTS,
        }}
      />
    </Stack.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

function AppContent() {
  const { isAuthenticated, isLocked, isLoading: authLoading } = useAuth();
  const { isLoading: cardsLoading } = useCards();
  const isOnline = useNetworkStatus();

  // Wait for both contexts to hydrate from storage
  if (authLoading || cardsLoading) {
    return <LoadingScreen />;
  }

  // Show lock screen outside NavigationContainer so it can't be navigated away from
  if (isAuthenticated && isLocked) {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <PinScreen mode="verify" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <View style={styles.container}>
        <StatusBar style="dark" />
        <NetworkBanner isOnline={isOnline} />
        {isAuthenticated ? <MainStack /> : <AuthStack />}
      </View>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CardProvider>
          <AppContent />
        </CardProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
});
