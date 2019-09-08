import React, {Component} from 'react';
import Cards from './Cards';
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
          this.dealCards(1, 2); // deal one card to dealer and two cards to player
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
    }, () => this.dealCards(1, 2)); // deal one card to dealer and two cards to player
  }
  // deals the cards for players and dealer
  dealCards(dealerCards, playerCards) {
    console.log(`dealCards(${dealerCards},${playerCards})`);
    const { cards } = this.state;
    let player = [...this.state.player]; // clone player array so it can be mutated
    let dealer = [...this.state.dealer]; // clone dealer array so it can be mutated
    const scores = [...this.state.scores]; // clone so it can be mutated
    const bust = [...this.state.bust]; // clone so it can be mutated
    const win = [...this.state.win]; // clone so it can be mutated
    // deal player cards
    for (let card = 0; card < playerCards; card++) {
      player.push(nextCard());
    }
    // deal dealer cards
    for (let card = 0; card < dealerCards; card++) {
      dealer.push(nextCard());
    }
    // iterate through dealer and player who=0=dealer who=1=player
    for (let who = 0; who < 2; who++) {
      let score = 0;
      let cardValue = 0;
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
          win[1-who] = true; // if player bust, then dealer win and vice-versa
      }
      scores[who] = score; // dealer or player score
    }
    this.setState({
      dealer,
      player,
      scores,
      bust,
      win,
    }, () => {
      console.log(`dealCards() dealer=${dealer} player=${player} scores=${scores} bust=${bust} win=${win}`);
    });
  }
  playerHit() {
    this.dealCards(0, 1); // deal 1 card to player
  }
  // dealer or player stands. who 0=dealer, 1=player
  playerStand(who) {
    let {stand} = this.state;
    stand[who] = true;
    this.setState({stand});
  }
  render() {
    const { cards, dealer, player, playerHit, playerStand, resetCards, scores, bust, win, stand } = this.state;
    const dealerScore = scores[0];
    const playerScore = scores[1];
    if (!cards || !dealer.length || !player.length) {
      return (
        <div>Loading ...</div>
      );
    }
    return (
      <div className="App">
        <section>
          <h2>
            Dealer
            <span> Score: {dealerScore}</span>
            {bust[0] && <span> Bust!</span>}
            {win[0] && <span> Win!</span>}
            {stand[0] && <span> Stand</span>}
          </h2>
          <Cards cards={cards} hand={dealer} />
        </section>
        <section>
        <h2>
            Player
            <span> Score: {playerScore}</span>
            {bust[1] && <span> Bust!</span>}
            {win[1] && <span> Win!</span>}
            {stand[1] && <span> Stand</span>}
          </h2>
          <Cards cards={cards} hand={player} />
          <Actions
            playerHit={playerHit}
            playerStand={playerStand}
            resetCards={resetCards}
            bust={bust}
            win={win}
            stand={stand}
            who={1} />
        </section>
      </div>
    );  
  }
}

export default App;
