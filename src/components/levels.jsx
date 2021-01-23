import React from 'react';
import PropTypes from 'prop-types';
import '../styles/App.css';

export default class LevelRoad extends React.Component {
    render() {
        return (
            <div className="level-road">
                <div className="level-wrapper">
                    <div
                        className="level-7 level-btn"
                        data-level="7"
                        data-type-btn="level"
                    />
                    <div
                        className="level-6 level-btn"
                        data-level="6"
                        data-type-btn="level"
                    />
                    <div
                        className="level-5 level-btn"
                        data-level="5"
                        data-type-btn="level"
                    />
                    <div
                        className="level-4 level-btn"
                        data-level="4"
                        data-type-btn="level"
                    />
                    <div
                        className="level-3 level-btn"
                        data-level="3"
                        data-type-btn="level"
                    />
                    <div
                        className="level-2 level-btn"
                        data-level="2"
                        data-type-btn="level"
                    />
                    <div
                        className="level-1 level-btn"
                        data-level="1"
                        data-type-btn="level"
                    />
                </div>
            </div>

        );
    }
}
