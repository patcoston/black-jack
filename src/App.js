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
      split: [], // array of indexes into cards[] array for split cards
      scores: [0, 0, 0], // score for dealer, player and split
      bust: [false, false, false], // did dealer, player bust? split cannot bust, but there's a place-holder anyway, to make the code more uniform.
      win: [false, false, false], // did dealer, player, or split win?
      stand: [false, false, false], // did dealer, player or split stand? split automatically stands because you cannot hit on the stand hand.
      playerHit: this.playerHit.bind(this), // click method for player getting another card
      dealerPlay: this.dealerPlay.bind(this), // click method for player standing
      resetCards: this.resetCards.bind(this), // click method for resetting cards
      playerSplit: this.playerSplit.bind(this), // click method for splitting player cards
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
          this.dealCards(false, false, 1, 2, 0); // player's turn, deal one card to dealer and two cards to player
        }))
        .catch(err => console.log(`Deck API Fetch Error: ${err}`));
      });
    })
    .catch(err => console.log(`Shuffle API Fetch Error: ${err}`));
  }
  resetCards() {
    this.setState({
      scores: [0, 0, 0],
      player: [],
      dealer: [],
      split: [],
      bust: [false, false, false],
      win: [false, false, false],
      stand: [false, false, false],
    }, () => this.dealCards(false, false, 1, 2, 0)); // player's turn, deal one card to dealer and two cards to player
  }
  // deals the cards for players and dealer
  // dealersTurn is true if it's the dealers turn, false otherwise
  // if player splits, then playerSplit is true, false otherwise
  dealCards(dealersTurn, playerSplit, dealerCards, playerCards, splitCards) {
    const { cards } = this.state;
    let player = [...this.state.player]; // clone player[] array so it can be mutated
    let dealer = [...this.state.dealer]; // clone dealer[] array so it can be mutated
    let split = [...this.state.split]; // clone split[] array so it can be mutated
    let scores = [...this.state.scores]; // clone scores[] array so it can be mutated
    let bust = [...this.state.bust]; // clone bust[] array so it can be mutated
    let win = [...this.state.win]; // clone win[] array so it can be mutated
    let stand = [...this.state.stand]; // clone stand[] array so it can be mutated
    if (dealersTurn) { // if it's the dealer's turn
      stand[1] = true; // player stands
    }
    if (playerSplit) { // if player wants to split
      split = []; // reset split hand
      split.push(player[1]); // move second card from player hand to split hand
      player.pop(); // remove second card from player hand that was moved to split hand
    }
    // deal dealer cards
    if (dealerCards) {
      for (let card = 0; card < dealerCards; card++) {
        dealer.push(nextCard());
      }
    }
    // deal player cards
    if (playerCards) {
      for (let card = 0; card < playerCards; card++) {
        player.push(nextCard());
      }
    }
    // deal split cards
    if (splitCards) {
      for (let card = 0; card < splitCards; card++) {
        split.push(nextCard());
      }
    }
    // Calculate new scores for dealer, player and split
    // iterate through dealer, player, and split me: 0=dealer 1=player 2=split
    let aceCount = [0, 0, 0]; // count how many Aces for dealer, player and split
    for (let me = 0; me < 3; me++) {
      if (
        (me === 0 && dealerCards > 0) || // if dealer-loop and deal to dealer
        (me === 1 && playerCards > 0) || // if player-loop and deal to player
        (me === 2 && splitCards > 0)) {  // if split-loop and deal to split
        let score = 0;
        let cardValue = 0;
        let hand = null;
        switch(me) {
          case 0: hand = dealer; break;
          case 1: hand = player; break;
          case 2: hand = split; break;
        }
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
        scores[me] = score; // score for dealer, player or split
        // check for bust (dealer, player, split), dealer ties at 21, or dealer wins
        if (score > 21) { // if score > 21, then dealer or player bust. NOTE: It's impossible for split to bust.
          if (me === 0) { // if dealer
            bust[0] = true; // dealer busts
            win[1] = true; // player wins
            win[2] = true; // split wins
          } else { // otherweise it's player
            bust[me] = true; // player has bust
          }
        }
        if (dealersTurn && me === 0 && !bust[0]) { // if dealer is playing and not bust
          if (scores[0] === 21) { // if dealer has 21
            win[0] = true; // win[] applies to win or tie. It's going to be one or the other.
            if (split.length) { // if player has two hands
              win[1] = scores[1] === 21; // if player has 21, then it's a tie between dealer and player
              win[2] = scores[2] === 21; // if split has 21, then it's a tie between dealer and split
            } else { // player does not have split hand
              win[1] = scores[1] === 21; // if player has 21, then it's a tie between dealer and player
            }
          } else { // dealer does not have 21
            if (split.length) { // if player has two hands, then dealer will try to beat higher hand
              if (scores[1] >= scores[2]) { // if player score greater than or equal to split score
                win[0] = scores[0] > scores[1]; // true if dealer beats player, false otherwise
              } else { // split score is greater than player score
                win[0] = scores[0] > scores[2]; // true if dealer beats split, false otherwise
              }
              win[1] = scores[1] > scores[0]; // true if player beats dealer, false otherwise
              win[2] = scores[2] > scores[0]; // true if split beats dealer, false otherwise
          } else { // player did not split
              win[0] = scores[0] > scores[1]; // true if dealer beats player, false otherwise
              win[1] = scores[1] > scores[0]; // true if player beats dealer, false otherwise
            }
          }
          stand[0] = win[0]; // dealer stands if they won
        }
      }
    }
    this.setState({
      dealer,
      player,
      split,
      scores,
      bust,
      win,
      stand,
    });
    const winner = bust[0] || win[0]; // someone wins when dealer busts or wins. A tie is a win.
    return winner;
  }
  playerHit() {
    this.dealCards(false, false, 0, 1, 0); // player's turn, deal 1 card to player
  }
  playerSplit() {
    this.dealCards(false, true, 0, 1, 1); //split players hand, then deal 1 card for each hand
    this.dealerPlay(); // then dealer plays
  }
  // Player stands. Dealer plays.
  dealerPlay() {
    let winner = false;
    let delay = 50;
    const dealerHit = () => {
      setTimeout(
        () => {
          winner = this.dealCards(true, false, 1, 0, 0);
          if (!winner) { // if nobody has one yet
            delay = 2000;
            dealerHit(); // hit dealer hand again (a tie on 21 is a win for both)
          }
        }, // dealer's turn, deal 1 card to dealer
        delay // dealer hits every second until dealer busts or ties at 21
      );
    }
    dealerHit();
  }
  render() {
    const { cards, dealer, player, split, playerHit, dealerPlay, resetCards, playerSplit, scores, bust, win, stand } = this.state;
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
        <div className="playerHands">
          <Hand
            cards={cards}
            hand={player}
            score={scores[1]}
            bust={bust[1]}
            win={win}
            stand={stand[1]}
            who={1} />
          <Hand
            cards={cards}
            hand={split}
            score={scores[2]}
            bust={bust[2]}
            win={win}
            stand={stand[2]}
            who={2} />
        </div>
        <Actions
          player={player}
          playerHit={playerHit}
          dealerPlay={dealerPlay}
          resetCards={resetCards}
          playerSplit={playerSplit}
          bust={bust[1]}
          win={win[1]}
          stand={stand[1]} />
      </div>
    );  
  }
}

export default App;
