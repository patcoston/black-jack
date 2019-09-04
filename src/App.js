import React, {Component} from 'react';
import Hand from './Hand';  
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deck: null,
      dealer: null,
      player: null,
      cards: null,
    };
  }
  componentDidMount() {
    this.getData();
  }
  getData() {
    fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6')
    .then(data => data.json())
    .then(deck => {
      this.setState({ deck }, () => {
        const deckID = this.state.deck.deck_id;
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
