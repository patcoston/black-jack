import React, {Component} from 'react';
import Hand from './Hand';
import Score from './Score';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deckID: null, // the API deckID which is used to shuffle and obtain decks of cards
      cards: null, // will be array of 312 cards which is 6 decks of 52 cards per deck
      dealCard: 0, // next card to deal
      dealer: [], // array of indexes into cards[] array for dealers cards
      player: [], // array of indexes into cards[] array for players cards
    };
  }
  componentDidMount() {
    console.log('componentDidMount()');
    this.getData();
  }
  // deals the cards for players and dealer
  dealCards(playerCards, dealerCards) {
    // DEBUG: Need to add check if (dealCard + playCards + dealerCards) is greater than or equal to 312, then need to reshuffle
    let dealCard = this.state.dealCard;
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
          this.dealCards(2, 2); // deal two cards to play and two cards to dealer
        }))
        .catch(err => console.log(`Deck API Fetch Error: ${err}`));
      });
    })
    .catch(err => console.log(`Shuffle API Fetch Error: ${err}`));
  }
  render() {
    const { cards, dealer, player } = this.state;
    if (!cards || dealer.length === 0 || player.length === 0) {
      return (
        <div>Loading ...</div>
      );
    }
    return (
      <div className="App">
        <section>
          <h2>Dealer <Score cards={cards} hand={dealer} /></h2>
          <Hand cards={cards} hand={dealer} />
        </section>
        <section>
          <h2>Player <Score cards={cards} hand={player} /></h2>
          <Hand cards={cards} hand={player} />
        </section>
      </div>
    );  
  }

}

export default App;
