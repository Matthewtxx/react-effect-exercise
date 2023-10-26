// src/CardDeck.js
import React, { useState, useEffect } from 'react';

function CardDeck() {
  const [deckId, setDeckId] = useState(null);
  const [remaining, setRemaining] = useState(null);
  const [currentCard, setCurrentCard] = useState(null);
  const [isShuffling, setIsShuffling] = useState(false);

  useEffect(() => {
    // Function to create a new deck when the component mounts
    async function createNewDeck() {
      try {
        const response = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/');
        const data = await response.json();
        setDeckId(data.deck_id);
        setRemaining(data.remaining);
      } catch (error) {
        console.error('Error creating a new deck:', error);
      }
    }

    createNewDeck();
  }, []);

  const drawCard = async () => {
    if (remaining === 0) {
      alert('Error: no cards remaining!');
      return;
    }

    try {
      const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/`);
      const data = await response.json();
      if (data.cards.length === 0) {
        alert('Error drawing a card!');
      } else {
        setCurrentCard(data.cards[0]);
        setRemaining(data.remaining);
      }
    } catch (error) {
      console.error('Error drawing a card:', error);
    }
  };

  const shuffleDeck = async () => {
    if (isShuffling) {
      return;
    }

    setIsShuffling(true);

    try {
      const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`);
      const data = await response.json();
      if (data.shuffled) {
        // Clear the current card and reset the remaining count
        setCurrentCard(null);
        setRemaining(data.remaining);
      }
    } catch (error) {
      console.error('Error shuffling the deck:', error);
    } finally {
      setIsShuffling(false);
    }
  };

  return (
    <div>
      <h1>Card Deck App</h1>
      {remaining !== null && <p>Remaining Cards: {remaining}</p>}
      {currentCard && (
        <div>
          <img src={currentCard.image} alt={currentCard.code} />
          <p>{currentCard.value} of {currentCard.suit}</p>
        </div>
      )}
      <button onClick={drawCard} disabled={remaining === 0}>Draw a Card</button>
      <button onClick={shuffleDeck} disabled={isShuffling}>Shuffle Deck</button>
    </div>
  );
}

export default CardDeck;
