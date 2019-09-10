import React, {Component} from 'react';
import Cards from './Cards';
import './Hand.css';

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
            me: props.who, // me is 0=dealer 1=player 2=split
        }
    }

    static getDerivedStateFromProps(nextProps) {
        return {
            hand: nextProps.hand, // array of indexes into cards array for that hand
            score: nextProps.score, // score
            bust: nextProps.bust, // bust? true/false
            win: nextProps.win, // win[] array of true/false, index 0=dealer 1=player
            stand: nextProps.stand, // stand? true/false
        };
    }

    render() {
        const { cards, hand, score, bust, win, stand, me } = this.state;
        let them = null;
        let name = null;
        let tie = null;
        switch(me) {
            case 0: them = 1; name = 'Dealer'; tie = win[0] && win[1]; break;
            case 1: them = 0; name = 'Player'; tie = win[0] && win[1]; break;
            case 2: them = 0; name = 'Split'; tie = win[0] && win[2]; break;
            default: console.log(`Value of me is ${me} but should be 1, 2 or 3`);
        }
        if (hand.length) {
            return (
                <section className="hand">
                    <h2>
                        <span>{name}</span>
                        <span> Score: {score}</span>
                        {stand && <span> Stand</span>}
                        {bust && <span> Bust!</span>}
                        {win[me] && !tie && <span> Win!</span>}
                        {win[them] && !tie && <span> Lose!</span>}
                        {tie && <span> Tie!</span>}
                    </h2>
                    <div>
                        <Cards cards={cards} hand={hand} me={me} />
                    </div>
                </section>
            );
        } else {
            return (
                <section></section>
            )            
        }
    }
}

export default Hand;
