import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  CARDS: '@virtmo:cards',
  ACTIVITIES: '@virtmo:activities',
};

const CardContext = createContext();

export const CardProvider = ({ children }) => {
  const [cards, setCards] = useState([]);
  const [mobileMoneyProvider, setMobileMoneyProvider] = useState('MTN');
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  // Persist cards whenever they change (skip during initial load)
  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(cards)).catch(
        (e) => console.error('Failed to persist cards:', e)
      );
    }
  }, [cards, isLoading]);

  // Persist activities whenever they change
  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities)).catch(
        (e) => console.error('Failed to persist activities:', e)
      );
    }
  }, [activities, isLoading]);

  const loadData = async () => {
    try {
      const [storedCards, storedActivities] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.CARDS),
        AsyncStorage.getItem(STORAGE_KEYS.ACTIVITIES),
      ]);
      if (storedCards) setCards(JSON.parse(storedCards));
      if (storedActivities) setActivities(JSON.parse(storedActivities));
    } catch (e) {
      console.error('Failed to load stored data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const generateId = () =>
    `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

  const generateCardNumber = () => {
    const cardType = Math.random() > 0.5 ? 'visa' : 'mastercard';
    const prefix = cardType === 'visa' ? '4' : '5';
    let cardNumber = prefix;
    for (let i = 0; i < 15; i++) {
      cardNumber += Math.floor(Math.random() * 10);
    }
    return { number: cardNumber, type: cardType };
  };

  const generateCVV = () => Math.floor(100 + Math.random() * 900).toString();

  const generateExpiryDate = () => {
    const month = Math.floor(Math.random() * 12) + 1;
    const year =
      new Date().getFullYear() + Math.floor(Math.random() * 5) + 1;
    return `${month.toString().padStart(2, '0')}/${year.toString().slice(-2)}`;
  };

  const addCard = (cardData) => {
    const { number, type } = generateCardNumber();
    const newCard = {
      id: generateId(),
      cardNumber: number,
      cardType: type,
      cvv: generateCVV(),
      expiryDate: generateExpiryDate(),
      cardholderName: cardData.name || 'Cardholder',
      mobileMoneyProvider: cardData.provider || mobileMoneyProvider,
      phoneNumber: cardData.phoneNumber || '',
      balance: cardData.amount || 0,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    setCards((prev) => [newCard, ...prev]);
    addActivity({
      type: 'card_created',
      title: 'Card Created',
      description: `${type === 'visa' ? 'Visa' : 'Mastercard'} card ending in ${number.slice(-4)}`,
      cardId: newCard.id,
      timestamp: new Date().toISOString(),
    });
    return newCard;
  };

  const deleteCard = (cardId) => {
    const card = cards.find((c) => c.id === cardId);
    setCards((prev) => prev.filter((c) => c.id !== cardId));
    if (card) {
      addActivity({
        type: 'card_deleted',
        title: 'Card Deleted',
        description: `${card.cardType === 'visa' ? 'Visa' : 'Mastercard'} card ending in ${card.cardNumber.slice(-4)}`,
        cardId,
        timestamp: new Date().toISOString(),
      });
    }
  };

  const updateCard = (cardId, updates) => {
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, ...updates } : c))
    );
  };

  const toggleCardFreeze = (cardId) => {
    const card = cards.find((c) => c.id === cardId);
    if (!card) return;
    const willBeActive = !card.isActive;
    updateCard(cardId, { isActive: willBeActive });
    addActivity({
      type: willBeActive ? 'card_unfrozen' : 'card_frozen',
      title: willBeActive ? 'Card Unfrozen' : 'Card Frozen',
      description: `${card.cardType === 'visa' ? 'Visa' : 'Mastercard'} card ending in ${card.cardNumber.slice(-4)}`,
      cardId,
      timestamp: new Date().toISOString(),
    });
  };

  const fundCard = (cardId, amount) => {
    const card = cards.find((c) => c.id === cardId);
    if (!card) return;
    updateCard(cardId, { balance: (card.balance || 0) + amount });
    addActivity({
      type: 'transaction',
      title: 'Card Funded',
      description: `${card.cardType === 'visa' ? 'Visa' : 'Mastercard'} card ending in ${card.cardNumber.slice(-4)} funded via ${card.mobileMoneyProvider}`,
      amount,
      cardId,
      timestamp: new Date().toISOString(),
    });
  };

  const addActivity = (activity) => {
    setActivities((prev) => [{ id: generateId(), ...activity }, ...prev]);
  };

  const addTransaction = (transactionData) => {
    addActivity({
      type: 'transaction',
      title: transactionData.title || 'Transaction',
      description: transactionData.description || '',
      amount: transactionData.amount || 0,
      cardId: transactionData.cardId,
      timestamp: new Date().toISOString(),
    });
  };

  const clearAllData = async () => {
    setCards([]);
    setActivities([]);
    await Promise.all([
      AsyncStorage.removeItem(STORAGE_KEYS.CARDS),
      AsyncStorage.removeItem(STORAGE_KEYS.ACTIVITIES),
    ]).catch((e) => console.error('Failed to clear data:', e));
  };

  return (
    <CardContext.Provider
      value={{
        cards,
        mobileMoneyProvider,
        setMobileMoneyProvider,
        activities,
        isLoading,
        addCard,
        deleteCard,
        updateCard,
        toggleCardFreeze,
        fundCard,
        addActivity,
        addTransaction,
        clearAllData,
      }}
    >
      {children}
    </CardContext.Provider>
  );
};

export const useCards = () => {
  const context = useContext(CardContext);
  if (!context) throw new Error('useCards must be used within a CardProvider');
  return context;
};
