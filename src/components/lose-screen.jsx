import React from 'react';
import PropTypes from 'prop-types';
import '../styles/App.css';
import { Link } from 'react-router-dom';

export default class LoseScreen extends React.Component {
    constructor(props) {
        super(props);

        this.clear = this.clear.bind(this);
        this.restartLevel = this.restartLevel.bind(this);
    }

    clear() {
        const { that } = this.props;

        that.levelIsFinished = false;
        that.levelIsWon = false;
        that.isLoadLevel = false;
    }

    restartLevel() {
        const { that } = this.props;
        const { level } = that.state;

        this.clear();
        that.getBoardDataOfStartLevel(level);
    }

    render() {
        return (
            <div className="lose-screen-container">
                <div className="lose-screen-title">Try again!</div>
                <div className="lose-screen">
                    <div className="lose-screen-moves">Moves are over</div>
                    <div className="button-wrap">
                        <button className="button" onClick={() => this.restartLevel()}>
                            Reset
                        </button>
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

LoseScreen.propTypes = {
    that: PropTypes.object.isRequired,
};
