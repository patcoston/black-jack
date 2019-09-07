import React, {Component} from 'react';

class Actions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            playerHit: props.playerHit, // method to add card to play hand
            playerStand: props.playerStand,
            bust: props.bust,
            win: props.win,
            stand: props.stand,
            who: props.who,
        }
    }

    render() {
        const { playerHit, playerStand, bust, win, stand, who } = this.state;
        const disable = bust[who] || win[who] || stand[who];
        return (
            <div>
                <button disabled={disable} onClick={playerStand}>Stand</button>
                <button disabled={disable} onClick={playerHit}>Hit</button>
            </div>
        );
    }
}

export default Actions;
