import React from 'react';
import PropTypes from 'prop-types';
import '../styles/App.css';

export default class TaskScreen extends React.Component {
    render() {
        return (
            <div>
                <div className="start-screen-title">Level: </div>
                <div className="start-screen">
                    <div className="start-screen-moves">Target: </div>
                    <div className="button-wrap">
                        <button className="button-start">Go!</button>

                    </div>
                </div>
            </div>
        );
    }
}