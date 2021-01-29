import React from 'react';
import PropTypes from 'prop-types';
import '../styles/App.css';
import { Switch, Route, Link } from 'react-router-dom';

export default class LoseScreen extends React.Component {
constructor(props) {
    super(props);
}
    clear() {
        const {that} = this.props;
        that.levelIsFinished = false;
        that.levelIsWon = false;
    }
    render() {
        return (
            <div>
                <div className="lose-screen-title">Try again!</div>
                <div className="lose-screen">
                    <div className="lose-screen-moves">Moves are over</div>
                    <div className="button-wrap">
                        <button className="button-reset">Reset</button>
                        <Link to="/">
                        <button className="button-levels" onClick={() => this.clear()}>Levels</button>
                    </Link>

                    </div>
                </div>
            </div>
        );
    }
}