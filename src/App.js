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
    console.log(`dealCards(${dealersTurn}, ${dealerCards},${playerCards})`);
    const { cards } = this.state;
    let player = [...this.state.player]; // clone player array so it can be mutated
    let dealer = [...this.state.dealer]; // clone dealer array so it can be mutated
    const scores = [...this.state.scores]; // clone so it can be mutated
    const bust = [...this.state.bust]; // clone so it can be mutated
    const win = [...this.state.win]; // clone so it can be mutated
    const stand = [...this.state.stand]; // clone so it can be mutated
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
    for (let me = 0; me < 2; me++) {
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
              } else {
                  cardValue = 10;
              }
          } else {
              cardValue = parseInt(value);
          }
          score += cardValue;
      }
      scores[me] = score; // dealer's or player's score
      // check for bust (dealer or player), dealer ties at 21, or dealer wins
      if (score > 21) { // if score > 21
        bust[me] = true; // dealer or player bust
        win[other] = true; // if player bust, then dealer win and vice-versa
      } else if (dealersTurn && score[0] === 21 && score[1] === 21) { // if dealer's hit and the dealer and player both have 21, then it's a tie
        stand[0] = true; // dealer stands
        win[0] = true; // both dealer and play win, it's a tie
        win[1] = true;
      } else if (dealersTurn && score[0] > score[1]) { // if dealer's hit and dealer has higher score
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
      console.log(`dealCards() dealer=${dealer} player=${player} scores=${scores} bust=${bust} win=${win}`);
    });
    const winner = win[0] || win[1];
    return winner;
  }
  playerHit() {
    this.dealCards(false, 0, 1); // player's turn, deal 1 card to player
  }
  // Player stands. Dealer plays.
  playerStand() {
    console.log('playerStand()');
    let winner = false;
    const dealerTurn = () => {
      console.log('dealerTurn()');
      setTimeout(
        () => {
          winner = this.dealCards(true, 1, 0);
          if (!winner) {
            dealerTurn();
          }
        }, // dealer's turn, deal 1 card to dealer
        500 // dealer hits every 0.5 seconds until dealer busts or ties at 21
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
