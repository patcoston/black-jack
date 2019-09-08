import React, {Component} from 'react';
import Cards from './Cards';

class Hand extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cards: props.cards, // array of all cards
            hand: props.hand, // array of indexes into cards array for that hand
            score: props.score, // score
            bust: props.bust, // bust? true/false
            win: props.win, // win? true/false
            stand: props.stand, // stand? true/false
            who: props.who, // who? 0=dealer 1=player
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            hand: nextProps.hand, // array of indexes into cards array for that hand
            score: nextProps.score, // score
            bust: nextProps.bust, // bust? true/false
            win: nextProps.win, // win? true/false
            stand: nextProps.stand, // stand? true/false
        });
    }

    render() {
        const { cards, hand, score, bust, win, stand, who } = this.state;
        return (
            <section>
                <h2>
                    <span>{who ? 'Player' : 'Dealer'}</span>
                    <span> Score: {score}</span>
                    {bust && <span> Bust!</span>}
                    {win && <span> Win!</span>}
                    {stand && <span> Stand</span>}
                </h2>
                <Cards cards={cards} hand={hand} />
            </section>
        );
    }
}

export default Hand;
