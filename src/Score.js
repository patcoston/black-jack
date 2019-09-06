import React, {Component} from 'react';

const handValue = (cards, hand) => {
    let total = 0;
    let cardValue = 0;
    console.log('handValue()');
    console.log(hand);
    for (let i = 0; i < hand.length; i++) {
        const card = hand[i];
        const value = cards[card].value;
        console.log(`value=${value}`);
        if (isNaN(value)) {
            if (value === 'ACE') {
                cardValue = 11;
            } else {
                cardValue = 10;
            }
        } else {
            cardValue = parseInt(value);
        }
        total += cardValue;
    }
    console.log(`total=${total}`);
    return total;
}

class Score extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cards: props.cards, // array of all cards
            hand: props.hand, // array of indexes into cards array for that hand
        }
    }
    
    render() {
        const { cards, hand } = this.state;
        console.log(hand);
        return (
            <span>Score: {handValue(cards, hand)}</span>
        );
    }
}

export default Score;
