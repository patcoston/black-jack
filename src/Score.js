import React, {Component} from 'react';

class Score extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cards: props.cards, // array of all cards
            hand: props.hand, // array of indexes into cards array for that hand
            scores: [0, 0], // score for dealer and player
            bust: [false, false], // did dealer or player bust?
            who: props.who, // 0=dealer 1=player, used as indexes into score[] array when call udpateScore()
        }
    }
    componentWillUnmount() {
        console.log('componentWillUnmount()');
        let score = 0;
        let cardValue = 0;
        const { cards, hand, scores, bust, who } = this.state;
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
        this.setState({scores})
    }
    render() {
        const { scores, who } = this.state;
        return (
            <span>Score: {scores[who]}</span>
        );
    }
}

export default Score;
