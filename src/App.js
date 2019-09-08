import React, {Component} from 'react';
import Hand from './Hand';
import Actions from './Actions';
import './App.css';

const decks = 6;
const totalCards = decks * 52;
const nextCard = () => parseInt(Math.random() * totalCards); // get next card randomly

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deckID: null, // the API deckID which is used to shuffle and obtain decks of cards
      cards: null, // array of cards
      dealer: [], // array of indexes into cards[] array for dealers cards
      player: [], // array of indexes into cards[] array for players cards
      scores: [0, 0], // score for dealer and player
      bust: [false, false], // did dealer or player bust?
      win: [false, false], // did dealer or player win?
      stand: [false, false], // did dealer or player stand?
      playerHit: this.playerHit.bind(this), // click method for player getting another card
      playerStand: this.playerStand.bind(this), // click method for player standing
      resetCards: this.resetCards.bind(this), // click method for resetting cards
    };
    this.getData();
  }
  getData() {
    fetch(`https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=${decks}`)
    .then(data => data.json())
    .then(json => {
      this.setState({ deckID: json.deck_id }, () => {
        const { deckID } = this.state;
        const url = `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=${totalCards}`;
        fetch(url)
        .then(data => data.json())
        .then(json => this.setState({ cards: json.cards }, () => {
          this.dealCards(false, 1, 2); // player's turn, deal one card to dealer and two cards to player
        }))
        .catch(err => console.log(`Deck API Fetch Error: ${err}`));
      });
    })
    .catch(err => console.log(`Shuffle API Fetch Error: ${err}`));
  }
  resetCards() {
    this.setState({
      scores: [0, 0],
      player: [],
      dealer: [],
      bust: [false, false],
      win: [false, false],
      stand: [false, false],
    }, () => this.dealCards(false, 1, 2)); // player's turn, deal one card to dealer and two cards to player
  }
  // deals the cards for players and dealer
  // dealersTurn is true if it's the dealers turn, false otherwise
  dealCards(dealersTurn, dealerCards, playerCards) {
    const { cards } = this.state;
    let player = [...this.state.player]; // clone player array so it can be mutated
    let dealer = [...this.state.dealer]; // clone dealer array so it can be mutated
    const scores = [...this.state.scores]; // clone so it can be mutated
    const bust = [...this.state.bust]; // clone so it can be mutated
    const win = [...this.state.win]; // clone so it can be mutated
    const stand = [...this.state.stand]; // clone so it can be mutated
    //console.log(`dealCards(${dealersTurn}, ${dealerCards},${playerCards}) scores=${scores} bust=${bust} win=${win} stand=${stand}`);
    if (dealersTurn) { // if it's the dealer's turn
      stand[1] = true; // player stands
    }
    // deal player cards
    for (let card = 0; card < playerCards; card++) {
      player.push(nextCard());
    }
    // deal dealer cards
    for (let card = 0; card < dealerCards; card++) {
      dealer.push(nextCard());
    }
    // Calculate new score(s)
    // iterate through dealer and player me 0=dealer me 1=player
    let first = 0; // start with dealer
    let last = 1; // end with player
    if (dealerCards === 0) { // if no dealer
      first = 1; // start with player
    }
    if (playerCards === 0) { // if no player
      last = 0; // end with dealer
    }
    let aceCount = [0, 0]; // count how many aces dealer and player has
    for (let me = first; me <= last; me++) {
      let score = 0;
      let cardValue = 0;
      const hand = me ? player : dealer;
      const other = 1 - me;
      for (let i = 0; i < hand.length; i++) {
          const card = hand[i];
          const value = cards[card].value;
          if (isNaN(value)) {
              if (value === 'ACE') {
                  cardValue = 11;
                  aceCount[me]++; // count Ace for dealer or player
              } else {
                  cardValue = 10;
              }
          } else {
              cardValue = parseInt(value);
          }
          score += cardValue;
      }
      // Adjust score if over 21 and have Aces
      if (score > 21 && aceCount[me] > 0) { // if hand is bust and have one or more Aces
        // This will convert the Aces from 11 to 1, one at a time until the score is 21 or lower, or there are no more Aces to convert
        while (aceCount[me] > 0 && score > 21) { // while have Aces worth 11 and score is over 21
          score -= 10; // convert Ace value 11 to 1
          aceCount[me]--; // subtract Ace with value 11
        }
      }
      scores[me] = score; // dealer's or player's score
      // check for bust (dealer or player), dealer ties at 21, or dealer wins
      console.log(`score=${score} scores=${scores} stand=${stand} bust=${bust} win=${win}`);
      if (score > 21) { // if score > 21
        console.log('Bust!');
        bust[me] = true; // dealer or player bust
        win[other] = true; // if player bust, then dealer win and vice-versa
      } else if (dealersTurn && me === 0 && scores[0] === 21 && scores[1] === 21) { // if dealer's hit and the dealer and player both have 21, then it's a tie
        console.log('Dealers Turn: Tie for 21');
        stand[0] = true; // dealer stands
        win[0] = true; // both dealer and play win, it's a tie
        win[1] = true;
      } else if (dealersTurn && me === 0 && scores[0] > scores[1]) { // if dealer's hit and dealer has higher score
        console.log('Dealers Turn: Dealer won!')
        stand[0] = true; // dealer stands
        win[0] = true; // dealer wins
      }
    }
    this.setState({
      dealer,
      player,
      scores,
      bust,
      win,
      stand,
    }, () => {
      console.log(`setState() dealer=${dealer} player=${player} scores=${scores} stand=${stand} bust=${bust} win=${win}`);
    });
    const winner = win[0] || win[1];
    return winner;
  }
  playerHit() {
    this.dealCards(false, 0, 1); // player's turn, deal 1 card to player
  }
  // Player stands. Dealer plays.
  playerStand() {
    let winner = false;
    const dealerTurn = () => {
      setTimeout(
        () => {
          winner = this.dealCards(true, 1, 0);
          if (!winner) {
            dealerTurn();
          }
        }, // dealer's turn, deal 1 card to dealer
        2000 // dealer hits every second until dealer busts or ties at 21
      );
    }
    dealerTurn();
  }
  render() {
    const { cards, dealer, player, playerHit, playerStand, resetCards, scores, bust, win, stand } = this.state;
    if (!cards || !dealer.length || !player.length) {
      return (
        <div>Loading ...</div>
      );
    }
    return (
      <div className="App">
        <Hand
          cards={cards}
          hand={dealer}
          score={scores[0]}
          bust={bust[0]}
          win={win}
          stand={stand[0]}
          who={0} />
        <Hand
          cards={cards}
          hand={player}
          score={scores[1]}
          bust={bust[1]}
          win={win}
          stand={stand[1]}
          who={1} />
        <Actions
          playerHit={playerHit}
          playerStand={playerStand}
          resetCards={resetCards}
          bust={bust[1]}
          win={win[1]}
          stand={stand[1]} />
      </div>
    );  
  }
}

export default App;
