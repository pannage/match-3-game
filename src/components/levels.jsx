import React from 'react';
import PropTypes from 'prop-types';
import '../styles/App.css';

export default class LevelRoad extends React.Component {
    render() {
        return (
            <div className="level-road">
                <div className="level-wrapper">
                    <div className="level-7 level-btn"></div>
                    <div className="level-6 level-btn"></div>
                    <div className="level-5 level-btn"></div>
                    <div className="level-4 level-btn"></div>
                    <div className="level-3 level-btn"></div>
                    <div className="level-2 level-btn"></div>
                    <div className="level-1 level-btn"></div>
                </div>
            </div>

        )
    }
}