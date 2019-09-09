import React, {Component} from 'react';
import './Action.css';

class Actions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            player: props.player, // player hand
            playerHit: props.playerHit, // method to add card to play hand
            dealerPlay: props.dealerPlay,
            resetCards: props.resetCards,
            playerSplit: props.playerSplit,
            bust: props.bust,
            win: props.win,
            stand: props.stand,
        }
    }

    static getDerivedStateFromProps(props) {
        return {
            player: props.player, // player hand
            bust: props.bust, // bust? true/false
            win: props.win, // win? true/false
            stand: props.stand, // stand? true/false
        };
    }

    render() {
        const { player, playerHit, dealerPlay, resetCards, playerSplit, bust, win, stand } = this.state;
        const disabled = bust || win || stand;
        const displableSplit = player.length !== 2; // disable Split button if player Hit and has more than 2 cards
        return (
            <div>
                <button disabled={false} onClick={() => resetCards()}>Deal Cards</button>
                <button disabled={disabled} onClick={() => dealerPlay()}>Stand</button>
                <button disabled={disabled} onClick={() => playerHit()}>Hit</button>
                <button disabled={disabled || displableSplit} onClick={() => playerSplit()}>Split</button>
            </div>
        );
    }
}

export default Actions;
