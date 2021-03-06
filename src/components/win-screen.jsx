import React from 'react';
import PropTypes from 'prop-types';
import '../styles/App.css';
import { Link } from 'react-router-dom';
import { pauseAudioLevel } from './playAudio';

export default class WinScreen extends React.Component {
    constructor(props) {
        super(props);
        this.clear = this.clear.bind(this);
    }

    clear() {
        const { that } = this.props;

        that.levelIsFinished = false;
        that.levelIsWon = false;
        that.isLoadLevel = false;

        pauseAudioLevel();
    }

    nextLevel() {
        const { that } = this.props;
        const { level } = that.state;

        this.clear();
        that.getBoardDataOfStartLevel((parseInt(level, 10) + 1).toString());
    }

    render() {
        const { that } = this.props;

        return (
            <div className="win-screen-container">
                <div className="win-screen-title">Well done!</div>
                <div className="win-screen-wrapper">
                    <div className="win-screen-moves">Moves: {30 - that.state.task.moves}</div>
                    <div className="button-wrap">
                        {parseInt(that.state.level, 10) !== 7 && <button className="button" onClick={() => this.nextLevel()}>Next</button>}
                        <Link to="/">
                            <button className="button" onClick={() => this.clear()}>
                                Levels
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}

WinScreen.propTypes = {
    that: PropTypes.object.isRequired,
};
