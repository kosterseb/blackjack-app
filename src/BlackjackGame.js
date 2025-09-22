import React, { useState } from 'react';

const BlackjackGame = () => {
  // Game state using React hooks
  const [playerCards, setPlayerCards] = useState([]);
  const [dealerCards, setDealerCards] = useState([]);
  const [deck, setDeck] = useState([]);
  const [gameStatus, setGameStatus] = useState('ready'); // 'ready', 'playing', 'playerWon', 'dealerWon', 'tie'
  const [playerScore, setPlayerScore] = useState(0);
  const [dealerScore, setDealerScore] = useState(0);

  // Create a standard deck of cards
  const createDeck = () => {
    const suits = ['♠', '♥', '♦', '♣'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const newDeck = [];
    
    suits.forEach(suit => {
      values.forEach(value => {
        newDeck.push({ suit, value });
      });
    });
    
    // Shuffle the deck
    for (let i = newDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
    }
    
    return newDeck;
  };

  // Calculate score for a hand of cards
  const calculateScore = (cards) => {
    let score = 0;
    let aces = 0;
    
    cards.forEach(card => {
      if (card.value === 'A') {
        aces++;
        score += 11;
      } else if (['J', 'Q', 'K'].includes(card.value)) {
        score += 10;
      } else {
        score += parseInt(card.value);
      }
    });
    
    // Adjust for aces
    while (score > 21 && aces > 0) {
      score -= 10;
      aces--;
    }
    
    return score;
  };

  // Start a new game
  const startGame = () => {
    const newDeck = createDeck();
    const playerHand = [newDeck[0], newDeck[1]];
    const dealerHand = [newDeck[2], newDeck[3]];
    
    setDeck(newDeck.slice(4));
    setPlayerCards(playerHand);
    setDealerCards(dealerHand);
    setPlayerScore(calculateScore(playerHand));
    setDealerScore(calculateScore(dealerHand));
    setGameStatus('playing');
  };

  // Player hits (takes another card)
  const hit = () => {
    if (gameStatus !== 'playing' || deck.length === 0) return;
    
    const newCard = deck[0];
    const newPlayerCards = [...playerCards, newCard];
    const newDeck = deck.slice(1);
    const newScore = calculateScore(newPlayerCards);
    
    setPlayerCards(newPlayerCards);
    setDeck(newDeck);
    setPlayerScore(newScore);
    
    if (newScore > 21) {
      setGameStatus('dealerWon');
    }
  };

  // Player stands (dealer's turn)
  const stand = () => {
    if (gameStatus !== 'playing') return;
    
    let currentDealerCards = [...dealerCards];
    let currentDeck = [...deck];
    let dealerCurrentScore = calculateScore(currentDealerCards);
    
    // Dealer hits until 17 or higher
    while (dealerCurrentScore < 17 && currentDeck.length > 0) {
      const newCard = currentDeck[0];
      currentDealerCards.push(newCard);
      currentDeck = currentDeck.slice(1);
      dealerCurrentScore = calculateScore(currentDealerCards);
    }
    
    setDealerCards(currentDealerCards);
    setDeck(currentDeck);
    setDealerScore(dealerCurrentScore);
    
    // Determine winner
    if (dealerCurrentScore > 21) {
      setGameStatus('playerWon');
    } else if (dealerCurrentScore > playerScore) {
      setGameStatus('dealerWon');
    } else if (playerScore > dealerCurrentScore) {
      setGameStatus('playerWon');
    } else {
      setGameStatus('tie');
    }
  };

  // Component to render a single card
  const Card = ({ card }) => (
    <div className="inline-block bg-white border-2 border-gray-300 rounded-lg p-3 m-1 shadow-md min-w-[60px] text-center">
      <div className={`text-lg font-bold ${card.suit === '♥' || card.suit === '♦' ? 'text-red-500' : 'text-black'}`}>
        {card.value}
      </div>
      <div className={`text-xl ${card.suit === '♥' || card.suit === '♦' ? 'text-red-500' : 'text-black'}`}>
        {card.suit}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-green-800 flex flex-col items-center justify-center p-4">
      <div className="bg-green-700 rounded-lg p-8 max-w-4xl w-full shadow-2xl">
        <h1 className="text-4xl font-bold text-white text-center mb-8">Blackjack</h1>
        
        {/* Dealer's Hand */}
        <div className="mb-8">
          <h2 className="text-2xl text-white mb-4">Dealer's Hand (Score: {dealerScore})</h2>
          <div className="flex flex-wrap">
            {dealerCards.map((card, index) => (
              <Card key={index} card={card} />
            ))}
          </div>
        </div>
        
        {/* Player's Hand */}
        <div className="mb-8">
          <h2 className="text-2xl text-white mb-4">Your Hand (Score: {playerScore})</h2>
          <div className="flex flex-wrap">
            {playerCards.map((card, index) => (
              <Card key={index} card={card} />
            ))}
          </div>
        </div>
        
        {/* Game Status */}
        <div className="text-center mb-6">
          {gameStatus === 'ready' && (
            <p className="text-xl text-white">Click "New Game" to start!</p>
          )}
          {gameStatus === 'playing' && (
            <p className="text-xl text-white">Choose your move: Hit or Stand?</p>
          )}
          {gameStatus === 'playerWon' && (
            <p className="text-2xl text-green-300 font-bold">You Win! 🎉</p>
          )}
          {gameStatus === 'dealerWon' && (
            <p className="text-2xl text-red-300 font-bold">Dealer Wins! 😔</p>
          )}
          {gameStatus === 'tie' && (
            <p className="text-2xl text-yellow-300 font-bold">It's a Tie! 🤝</p>
          )}
        </div>
        
        {/* Game Controls */}
        <div className="flex justify-center gap-4">
          <button 
            onClick={startGame}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            New Game
          </button>
          
          {gameStatus === 'playing' && (
            <>
              <button 
                onClick={hit}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Hit
              </button>
              <button 
                onClick={stand}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Stand
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlackjackGame;