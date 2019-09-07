import React, {Component} from 'react';

class Score extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
