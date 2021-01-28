import React from 'react';
import PropTypes from 'prop-types';
import '../styles/App.css';

export default class WinScreen extends React.Component {
    render() {
        return (
            <div>
                <div className="win-screen-title">Well done!</div>
                <div className="win-screen-win-screen">
                    <div className="win-screen-moves">Moves:</div>
                    <div className="win-screen-deleted">Deleted:</div>
                    <div className="button-wrap">
                        <button className="button-next">Next</button>
                        <button className="button-levels">Levels</button>
                    </div>
                </div>
            </div>
        );
    }
}