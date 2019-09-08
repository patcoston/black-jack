import React, {Component} from 'react';

class Hand extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cards: props.cards, // array of all cards
            hand: props.hand, // array of indexes into cards array for that hand
        }
    }

    componentWillReceiveProps(nextProps) {
    }

    render() {
        const { cards, hand } = this.state;
        return (
            <div></div>
        );
    }
}

export default Hand;
