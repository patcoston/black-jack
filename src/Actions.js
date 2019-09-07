import React, {Component} from 'react';

class Actions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hit: props.hit, // method to add card to play hand
        }
    }

    render() {
        const { hit } = this.state;
        return (
            <div>
                <button disabled={false} onClick={hit}>Hit</button>
            </div>
        );
    }
}

export default Actions;
