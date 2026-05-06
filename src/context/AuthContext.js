import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
} from 'react';
import * as SecureStore from 'expo-secure-store';
import { AppState } from 'react-native';

const KEYS = {
  USER: 'virtmo:user',
  PIN: 'virtmo:pin',
  IS_AUTH: 'virtmo:isAuthenticated',
  BIOMETRIC: 'virtmo:biometricEnabled',
};

// Lock app after 5 minutes in background
const INACTIVITY_TIMEOUT_MS = 5 * 60 * 1000;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [pin, setPin] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  const appStateRef = useRef(AppState.currentState);
  const backgroundTimeRef = useRef(null);

  // Restore session on mount
  useEffect(() => {
    restoreSession();
  }, []);

  // Inactivity lock listener
  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange
    );
    return () => subscription.remove();
  }, [isAuthenticated, pin]);

  const handleAppStateChange = (nextState) => {
    const prev = appStateRef.current;

    if (prev === 'active' && nextState.match(/inactive|background/)) {
      backgroundTimeRef.current = Date.now();
    }

    if (prev.match(/inactive|background/) && nextState === 'active') {
      if (backgroundTimeRef.current && pin && isAuthenticated) {
        const elapsed = Date.now() - backgroundTimeRef.current;
        if (elapsed >= INACTIVITY_TIMEOUT_MS) {
          setIsLocked(true);
        }
      }
      backgroundTimeRef.current = null;
    }

    appStateRef.current = nextState;
  };

  const restoreSession = async () => {
    try {
      const [storedUser, storedPin, storedAuth, storedBiometric] = await Promise.all([
        SecureStore.getItemAsync(KEYS.USER),
        SecureStore.getItemAsync(KEYS.PIN),
        SecureStore.getItemAsync(KEYS.IS_AUTH),
        SecureStore.getItemAsync(KEYS.BIOMETRIC),
      ]);

      if (storedAuth === 'true' && storedUser) {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
        if (storedPin) {
          setPin(storedPin);
          setIsLocked(true); // always lock on cold open if PIN is set
        }
      }
      if (storedBiometric === 'true') setBiometricEnabled(true);
    } catch (e) {
      console.error('Failed to restore session:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setIsLocked(false);
    try {
      await Promise.all([
        SecureStore.setItemAsync(KEYS.USER, JSON.stringify(userData)),
        SecureStore.setItemAsync(KEYS.IS_AUTH, 'true'),
      ]);
    } catch (e) {
      console.error('Failed to persist login:', e);
    }
  };

  const signup = async (userData) => {
    await login(userData);
  };

  const logout = async () => {
    setUser(null);
    setIsAuthenticated(false);
    setIsLocked(false);
    setPin(null);
    setBiometricEnabled(false);
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(KEYS.USER),
        SecureStore.deleteItemAsync(KEYS.PIN),
        SecureStore.deleteItemAsync(KEYS.IS_AUTH),
        SecureStore.deleteItemAsync(KEYS.BIOMETRIC),
      ]);
    } catch (e) {
      console.error('Failed to clear session:', e);
    }
  };

  const toggleBiometric = async (enabled) => {
    setBiometricEnabled(enabled);
    try {
      await SecureStore.setItemAsync(KEYS.BIOMETRIC, enabled ? 'true' : 'false');
    } catch (e) {
      console.error('Failed to save biometric preference:', e);
    }
  };

  const setupPin = async (newPin) => {
    setPin(newPin);
    try {
      await SecureStore.setItemAsync(KEYS.PIN, newPin);
    } catch (e) {
      console.error('Failed to save PIN:', e);
    }
  };

  const verifyPin = (enteredPin) => {
    if (enteredPin === pin) {
      setIsLocked(false);
      return true;
    }
    return false;
  };

  const biometricUnlock = () => {
    setIsLocked(false);
  };

  const removePin = async () => {
    setPin(null);
    try {
      await SecureStore.deleteItemAsync(KEYS.PIN);
    } catch (e) {
      console.error('Failed to remove PIN:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLocked,
        isLoading,
        user,
        pin,
        biometricEnabled,
        login,
        logout,
        signup,
        setupPin,
        verifyPin,
        biometricUnlock,
        removePin,
        toggleBiometric,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
