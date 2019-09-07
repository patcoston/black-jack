import React, {Component} from 'react';

class Score extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cards: props.cards, // array of all cards
            hand: props.hand, // array of indexes into cards array for that hand
            score: props.score, // score of dealer or player
        }
    }
    render() {
        const { score } = this.state;
        return (
            <span>Score: {score}</span>
        );
    }
}

export default Score;
