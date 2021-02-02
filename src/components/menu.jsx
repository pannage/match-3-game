import React from 'react';
import PropTypes from 'prop-types';
import '../styles/App.css';
import { Link } from 'react-router-dom';
import { playAudioLevel, pauseAudioLevel, playAudioEffect } from './playAudio';

export default class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.isClickBtnVolume = false;
    }

    restartGame() {
        const { that } = this.props;

        that.getBoardDataOfStartLevel(that.state.level);
    }

    volumeOffOn(){

    }

    render() {
        return (
            <div className="menu-container">
                <Link to="/">
                    <div className="menu-point" onClick={pauseAudioLevel}>arrow_back</div>
                </Link>
                <div className="menu-point" onClick={() => this.restartGame()}>refresh</div>
                <div className="menu-point" onClick={() => this.volumeOffOn()}>volume_up</div>
                <div className="menu-point">music_note</div>
                <div className="menu-point">grading</div>
                <div className="menu-point">contact_support</div>
            </div>
        );
    }
}
