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
            win: props.win, // win[] array of true/false, index 0=dealer 1=player
            stand: props.stand, // stand? true/false
            me: props.who, // me is 0=dealer 1=player
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            hand: nextProps.hand, // array of indexes into cards array for that hand
            score: nextProps.score, // score
            bust: nextProps.bust, // bust? true/false
            win: nextProps.win, // win[] array of true/false, index 0=dealer 1=player
            stand: nextProps.stand, // stand? true/false
        });
    }

    render() {
        const { cards, hand, score, bust, win, stand, me } = this.state;
        const them = 1 - me;
        const tie = win[0] && win[1];
        return (
            <section>
                <h2>
                    <span>{me ? 'Player' : 'Dealer'}</span>
                    <span> Score: {score}</span>
                    {stand && <span> Stand</span>}
                    {bust && <span> Bust!</span>}
                    {win[me] && !tie && <span> Win!</span>}
                    {win[them] && !tie && <span> Lose!</span>}
                    {tie && <span>Tie!</span>}
                </h2>
                <Cards cards={cards} hand={hand} me={me} />
            </section>
        );
    }
}

export default Hand;
