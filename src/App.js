import React, {Component} from 'react';
import Hand from './Hand';  
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deckID: null, // the API deckID which is used to shuffle and obtain decks of cards
      cards: null, // will be array of 312 cards which is 6 decks of 52 cards per deck
      dealCard: 0, // next card which is dealed
      dealer: [], // array of indexes into cards[] array for dealers cards
      player: [], // array of indexes into cards[] array for players cards
    };
  }
  componentDidMount() {
    this.getData();
  }
  getData() {
    fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6')
    .then(data => data.json())
    .then(json => {
      this.setState({ deckID: json.deck_id }, () => {
        const deckID = this.state.deckID;
        const url = `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=312`;
        fetch(url)
        .then(data => data.json())
        .then(json => this.setState({ cards: json.cards }, () => {
          console.log(this.state)
        }))
        .catch(err => console.log(`Deck API Fetch Error: ${err}`));
      });
    })
    .catch(err => console.log(`Shuffle API Fetch Error: ${err}`));
  }
  render() {
    return (
      <div className="App">
        <Hand />
      </div>
    );  
  }
  
}

export default App;
