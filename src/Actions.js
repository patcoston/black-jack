import React, {Component} from 'react';

class Actions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            playerHit: props.playerHit, // method to add card to play hand
            playerStand: props.playerStand,
            resetCards: props.resetCards,
            bust: props.bust,
            win: props.win,
            stand: props.stand,
            who: props.who,
        }
    }

    render() {
        const { playerHit, playerStand, resetCards, bust, win, stand, who } = this.state;
        const disabled = bust || win || stand;
        return (
            <div>
                <button disabled={!disabled} onClick={() => resetCards()}>Deal Cards</button>
                <button disabled={disabled} onClick={() => playerStand(who)}>Stand</button>
                <button disabled={disabled} onClick={() => playerHit()}>Hit</button>
            </div>
        );
    }
}

export default Actions;
