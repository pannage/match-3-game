import React from 'react';
import PropTypes from 'prop-types';
import '../styles/App.css';
import { Link } from 'react-router-dom';

export default class LoseScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    clear() {
        const { that } = this.props;

        that.levelIsFinished = false;
        that.levelIsWon = false;
    }

    restartLevel() {
        const { that } = this.props;
        const { level } = that.state;

        that.getBoardDataOfStartLevel(level);
        this.clear();
    }

    render() {
        return (
            <div>
                <div className="lose-screen-title">Try again!</div>
                <div className="lose-screen">
                    <div className="lose-screen-moves">Moves are over</div>
                    <div className="button-wrap">
                        <button className="button-reset" onClick={() => this.restartLevel()}>
                            Reset
                        </button>
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
