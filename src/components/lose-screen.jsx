import React from 'react';
import PropTypes from 'prop-types';
import '../styles/App.css';

export default class LoseScreen extends React.Component {
    render() {
        return (
            <div>
                <div className="lose-screen-title">Try again!</div>
                <div className="lose-screen">
                    <div className="lose-screen-moves">Moves are over</div>
                    <div className="button-wrap">
                        <button className="button-reset">Reset</button>
                        <button className="button-levels">Levels</button>
                    </div>
                </div>
            </div>
        );
    }
}