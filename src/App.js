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
    };
  }
  componentDidMount() {
    this.getData();
  }
  getData() {
    console.log('getDeck()')
    fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6')
    .then(data => data.json())
    .then(deck => {
      this.setState({ deck }, () => {
        console.log('setState()');
        console.log(this.state);
        const deckID = this.state.deck.deck_id;
        console.log(`deckID: ${deckID}`);
        const url = `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=2`;
        fetch(url)
        .then(data => data.json())
        .then(player => this.setState({ player }, () => console.log(this.state)))
        .catch(err => console.log(err));
      });
    })
    .catch(err => console.log(`Error: ${err}`));
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
