import React, {Component} from 'react';

const RenderCards = (props) => {
    const { cards, hand } = props;
    console.log('RenderCards(props)');
    console.log(cards, hand);
    return hand.map((card, index) => <img src={cards[card].image} alt={cards[card].code} /> );
}

class Hand extends Component {
    constructor(props) {
        super(props);
        console.log('PROPS');
        console.log(props);
        this.state = {
            cards: props.cards, // array of all cards
            hand: props.hand, // array of indexes into cards array for that hand
        }
    }
    
    render() {
        const { cards, hand } = this.state;
        console.log('Hand.js class Hand render() next console.log is cards/hand');
        console.log(cards, hand);
        return (
            <RenderCards cards={cards} hand={hand} />
        );
    }
}

export default Hand;
