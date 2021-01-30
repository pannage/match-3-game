import React from 'react';
import PropTypes from 'prop-types';
import '../styles/App.css';
import { Switch, Route, Link } from 'react-router-dom';

export default class WinScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    clear() {
        const { that } = this.props;

        that.levelIsFinished = false;
        that.levelIsWon = false;
    }

    nextLevel() {
        const { that } = this.props;
        const { boardData, level } = that.state;

        that.getBoardDataOfStartLevel((parseInt(level) + 1).toString());
        this.clear();
    }

    render() {
        return (
            <div>
                <div className="win-screen-title">Well done!</div>
                <div className="win-screen-win-screen">
                    <div className="win-screen-moves">Moves:</div>
                    <div className="win-screen-deleted">Deleted:</div>
                    <div className="button-wrap">
                    <button className="button-next" onClick={() => this.nextLevel()}>Next</button>
                        <Link to="/">
                            <button className="button-levels" onClick={() => this.clear()}>
                                Levels
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}
