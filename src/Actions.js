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
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            bust: nextProps.bust, // bust? true/false
            win: nextProps.win, // win? true/false
            stand: nextProps.stand, // stand? true/false
        });
    }

    render() {
        const { playerHit, playerStand, resetCards, bust, win, stand } = this.state;
        const disabled = bust || win || stand;
        return (
            <div>
                <button disabled={!disabled} onClick={() => resetCards()}>Deal Cards</button>
                <button disabled={disabled} onClick={() => playerStand()}>Stand</button>
                <button disabled={disabled} onClick={() => playerHit()}>Hit</button>
            </div>
        );
    }
}

export default Actions;
