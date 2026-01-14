import React, { createContext, useState, useContext } from 'react';

const CardContext = createContext();

export const CardProvider = ({ children }) => {
  const [cards, setCards] = useState([]);
  const [mobileMoneyProvider, setMobileMoneyProvider] = useState('MTN');
  const [activities, setActivities] = useState([]);

  const generateCardNumber = () => {
    // Generate a valid-looking card number (Visa starts with 4, Mastercard with 5)
    const cardType = Math.random() > 0.5 ? 'visa' : 'mastercard';
    const prefix = cardType === 'visa' ? '4' : '5';
    let cardNumber = prefix;
    
    for (let i = 0; i < 15; i++) {
      cardNumber += Math.floor(Math.random() * 10);
    }
    
    return { number: cardNumber, type: cardType };
  };

  const generateCVV = () => {
    return Math.floor(100 + Math.random() * 900).toString();
  };

  const generateExpiryDate = () => {
    const month = Math.floor(Math.random() * 12) + 1;
    const year = new Date().getFullYear() + Math.floor(Math.random() * 5) + 1;
    return `${month.toString().padStart(2, '0')}/${year.toString().slice(-2)}`;
  };

  const addCard = (cardData) => {
    const { number, type } = generateCardNumber();
    const newCard = {
      id: Date.now().toString(),
      cardNumber: number,
      cardType: type,
      cvv: generateCVV(),
      expiryDate: generateExpiryDate(),
      cardholderName: cardData.name || 'Cardholder',
      mobileMoneyProvider: cardData.provider || mobileMoneyProvider,
      phoneNumber: cardData.phoneNumber || '',
      balance: cardData.amount || 0,
      createdAt: new Date().toISOString(),
    };
    
    setCards(prev => [newCard, ...prev]);
    
    // Add activity
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
    const card = cards.find(c => c.id === cardId);
    setCards(prev => prev.filter(card => card.id !== cardId));
    
    // Add activity
    if (card) {
      addActivity({
        type: 'card_deleted',
        title: 'Card Deleted',
        description: `${card.cardType === 'visa' ? 'Visa' : 'Mastercard'} card ending in ${card.cardNumber.slice(-4)}`,
        cardId: cardId,
        timestamp: new Date().toISOString(),
      });
    }
  };

  const updateCard = (cardId, updates) => {
    setCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, ...updates } : card
    ));
  };

  const addActivity = (activity) => {
    const newActivity = {
      id: Date.now().toString(),
      ...activity,
    };
    setActivities(prev => [newActivity, ...prev]);
  };

  const addTransaction = (transactionData) => {
    const transaction = {
      type: 'transaction',
      title: transactionData.title || 'Transaction',
      description: transactionData.description || '',
      amount: transactionData.amount || 0,
      cardId: transactionData.cardId,
      timestamp: new Date().toISOString(),
    };
    addActivity(transaction);
  };

  return (
    <CardContext.Provider
      value={{
        cards,
        mobileMoneyProvider,
        setMobileMoneyProvider,
        activities,
        addCard,
        deleteCard,
        updateCard,
        addActivity,
        addTransaction,
      }}
    >
      {children}
    </CardContext.Provider>
  );
};

export const useCards = () => {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error('useCards must be used within a CardProvider');
  }
  return context;
};
