import React, {Component} from 'react';
import Hand from './Hand';
import Actions from './Actions';
import './App.css';

const decks = 6;
const totalCards = decks * 52;
const nextCard = () => parseInt(Math.random() * totalCards); // get next card randomly from 6 decks of cards

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
    };
    this.getData();
  }
  getData() {
    console.log('getData()');
    fetch(`https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=${decks}`)
    .then(data => data.json())
    .then(json => {
      this.setState({ deckID: json.deck_id }, () => {
        const { deckID } = this.state;
        const url = `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=${totalCards}`;
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
  // deals the cards for players and dealer
  dealCards(playerCards, dealerCards) {
    console.log(`dealCards()`);
    let player = [...this.state.player]; // clone player array
    let dealer = [...this.state.dealer]; // clone dealer array
    // deal player cards
    for (let card = 0; card < playerCards; card++) {
      player.push(nextCard());
    }
    // deal dealer cards
    for (let card = 0; card < dealerCards; card++) {
      dealer.push(nextCard());
    }
    // update which card is to be dealt next, and arrays for dealer and player cards
    this.setState({
      player,
      dealer,
    }, () => {
      console.log('dealCards() state');
      console.log(this.state);
      this.updateScore(0);
      this.updateScore(1);
      });
  }
  updateScore(who) {
    console.log(`updateScore(${who})`);
    let score = 0;
    let cardValue = 0;
    const { cards, dealer, player, scores, bust, win } = this.state;
    console.log(`dealer=${dealer} player=${player}`);
    const hand = who ? player : dealer;
    console.log(`hand=${hand}`);
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
        win[1-who] = true; // player or dealer win
    }
    console.log(`who=${who} score=${score}`);
    scores[who] = score; // dealer or player score
    this.setState({
      scores,
      bust,
      win,
    }, () => {
      console.log(`updateScore(${who}) state`);
      console.log(this.state);
    })
  }
  playerHit() {
    let {player} = this.state;
    player.push(nextCard()); // push next card on player[] array
    this.setState({
      player,
    });
    this.updateScore(1); // update score for player
  }
  // dealer or player stands. who 0=dealer, 1=player
  playerStand(who) {
    let {stand} = this.state;
    stand[who] = true;
    this.setState({stand});
  }
  render() {
    const { cards, dealer, player, playerHit, playerStand, scores, bust, win, stand } = this.state;
    const dealerScore = scores[0];
    const playerScore = scores[1];
    console.log(`render() dealerScore=${dealerScore} playerScore=${playerScore}`);
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
          <Hand cards={cards} hand={dealer} />
        </section>
        <section>
        <h2>
            Player
            <span> Score: {playerScore}</span>
            {bust[1] && <span> Bust!</span>}
            {win[1] && <span> Win!</span>}
            {stand[1] && <span> Stand</span>}
          </h2>
          <Hand cards={cards} hand={player} />
          <Actions
            playerHit={playerHit}
            playerStand={playerStand}
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
