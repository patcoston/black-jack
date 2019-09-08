import React, {Component} from 'react';

const RenderCards = (props) => {
    const { cards, hand, me } = props;
    console.log(`RenderCards() hand=${hand}`);
    return hand.map((card, index) => <img src={cards[card].image} alt={cards[card].code} key={cards[card].code + me + index} /> );
}

class Cards extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cards: props.cards, // array of all cards
            hand: props.hand, // array of indexes into cards array for that hand
            me: props.me, // 0=dealer 1=player
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            cards: nextProps.cards, // array of all cards
            hand: nextProps.hand, // array of indexes into cards array for that hand
        });
    }

    render() {
        const { cards, hand } = this.state;
        return (
            <RenderCards cards={cards} hand={hand} />
        );
    }
}

export default Cards;
