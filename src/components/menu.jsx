import React from 'react';
import PropTypes from 'prop-types';
import '../styles/App.css';
import { Link } from 'react-router-dom';
import { pauseAudioLevel, volumeOff, volumeOn } from './playAudio';

export default class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isClickBtnVolume: false,
            isClickBtnMusic: false,
            isClickRulesOfGame: false,
        };
        this.isClickBtnVolume = false;
        this.isClickBtnMusic = false;
    }

    restartGame() {
        const { that } = this.props;

        if (that.isLoadLevel) {
            that.getBoardDataOfStartLevel(that.state.level);
        }
    }

    volumeOffOn() {
        const { that } = this.props;

        that.state.isClickBtnVolume = !that.state.isClickBtnVolume;

        this.isClickBtnVolume = !this.isClickBtnVolume;

        this.setState({ isClickBtnVolume: !this.isClickBtnVolume });
    }

    clickButtonArrowBack() {
        const { that } = this.props;

        that.isLoadLevel = false;

        pauseAudioLevel();
    }

    musicOffOn() {
        const { that } = this.props;

        that.state.isClickBtnMusic = !that.state.isClickBtnMusic;

        this.isClickBtnMusic = !this.isClickBtnMusic;

        if (this.isClickBtnMusic) {
            volumeOff();
        } else {
            volumeOn();
        }

        this.setState({ isClickBtnMusic: !this.isClickBtnMusic });
    }

    showStatistics() {
        const { that } = this.props;

        that.showStatistics = true;
        that.forceUpdate();
    }

    getButtonBackMenu(isLoadPage) {
        if (isLoadPage) {
            return (
                <Link to="/">
                    <div className="menu-point" onClick={() => this.clickButtonArrowBack()}>
                        arrow_back
                    </div>
                </Link>
            );
        }

        return (
            <div className="menu-point" onClick={() => this.clickButtonArrowBack()}>
                arrow_back
            </div>
        );
    }

    showRulesPage() {
        const { that } = this.props;

        that.isClickRulesOfGame = true;
        that.forceUpdate();
    }

    render() {
        const { that } = this.props;

        if (that.levelIsFinished || that.levelIsWon) {
            pauseAudioLevel();

            return (
                <div className="menu-container">
                    <div className="menu-point">arrow_back</div>
                    <div className="menu-point">refresh</div>
                    <div className="menu-point">
                        {!this.isClickBtnVolume ? 'volume_up' : 'volume_off'}
                    </div>
                    <div className="menu-point">
                        {!this.isClickBtnMusic ? 'music_note' : 'music_off'}
                    </div>
                    <div className="menu-point">grading</div>
                    <div className="menu-point">contact_support</div>
                </div>
            );
        }

        return (
            <div className="menu-container">
                {that.isLoadLevel ? this.getButtonBackMenu(true) : this.getButtonBackMenu(false)}
                <div className="menu-point" onClick={() => this.restartGame()}>
                    refresh
                </div>
                <div className="menu-point" onClick={() => this.volumeOffOn()}>
                    {!this.isClickBtnVolume ? 'volume_up' : 'volume_off'}
                </div>
                <div className="menu-point" onClick={() => this.musicOffOn()}>
                    {!this.isClickBtnMusic ? 'music_note' : 'music_off'}
                </div>
                <div className="menu-point" onClick={() => this.showStatistics()}>
                    grading
                </div>
                <div className="menu-point" onClick={() => this.showRulesPage()}>
                    contact_support
                </div>
            </div>
        );
    }
}
