import React, {Component} from 'react';
import Hand from './Hand';
import Actions from './Actions';
import Score from './Score';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    deckID: null, // the API deckID which is used to shuffle and obtain decks of cards
    cards: null, // will be array of 312 cards which is 6 decks of 52 cards per deck
    dealCard: 0, // next card to deal. It is an index in cards[] array
    dealer: [], // array of indexes into cards[] array for dealers cards
    player: [], // array of indexes into cards[] array for players cards
    scores: [0, 0], // score for dealer and player
    bust: [false, false], // did dealer or player bust?
    playerHit: this.playerHit.bind(this), // click method for player getting another card
  };
  componentDidMount() {
    this.getData();
  }
  // deals the cards for players and dealer
  dealCards(playerCards, dealerCards) {
    // DEBUG: Need to add check if (dealCard + playCards + dealerCards) is greater than or equal to 312, then need to reshuffle
    let {dealCard} = this.state;
    let player = [...this.state.player]; // clone player array
    let dealer = [...this.state.dealer]; // clone dealer array
    // deal player cards
    for (let card = 0; card < playerCards; card++) {
      player.push(dealCard++);
    }
    // deal dealer cards
    for (let card = 0; card < dealerCards; card++) {
      dealer.push(dealCard++);
    }
    // update which card is to be dealt next, and arrays for dealer and player cards
    this.setState({
      dealCard,
      player,
      dealer,
    }, () => {
      console.log('dealCards()');
      console.log(this.state);
    });
    this.updateScore(0);
    this.updateScore(1);
  }
  getData() {
    console.log('getData()');
    fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6')
    .then(data => data.json())
    .then(json => {
      this.setState({ deckID: json.deck_id }, () => {
        const { deckID } = this.state;
        const url = `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=312`;
        fetch(url)
        .then(data => data.json())
        .then(json => this.setState({ cards: json.cards }, () => {
          this.dealCards(2, 2); // deal two cards to player and two cards to dealer
        }))
        .catch(err => console.log(`Deck API Fetch Error: ${err}`));
      });
    })
    .catch(err => console.log(`Shuffle API Fetch Error: ${err}`));
  }
  playerHit() {
    let {player, dealCard} = this.state;
    player.push(dealCard++); // push card on player[] array, then point to next dealCard: DEBUG: 311 is last card. Need logic to reshuffle before overflowing cards[] array. Check when Vegas reshuffles.
    this.setState({
      dealCard,
      player,
    });
    this.updateScore(1); // update score for player
  }
  updateScore(who) {
    let score = 0;
    let cardValue = 0;
    const { cards, dealer, player, scores, bust } = this.state;
    const hand = who ? player : dealer;
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
    if (score > 21) { // if score > 21
        bust[who] = true; // dealer or player bust
    }
    scores[who] = score; // dealer or player score
    this.setState({
      scores,
      bust,
    })
}
  render() {
    const { cards, dealer, player, playerHit,scores } = this.state;
    if (!cards || !dealer.length || !player.length) {
      return (
        <div>Loading ...</div>
      );
    }
    return (
      <div className="App">
        <section>
          <h2>Dealer <Score cards={cards} hand={dealer} score={scores[0]} /></h2>
          <Hand cards={cards} hand={dealer} />
        </section>
        <section>
          <h2>Player <Score cards={cards} hand={player} score={scores[1]} /></h2>
          <Hand cards={cards} hand={player} />
          <Actions hit={playerHit} />
        </section>
      </div>
    );  
  }

}

export default App;
