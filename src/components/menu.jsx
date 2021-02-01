import React from 'react';
import PropTypes from 'prop-types';
import '../styles/App.css';
import { Link } from 'react-router-dom';

export default class Menu extends React.Component {

    render() {
        return (
            <div className="menu-container">
                <div className="menu-point">arrow_back</div>
                <div className="menu-point">refresh</div>
                <div className="menu-point">volume_up</div>
                <div className="menu-point">music_note</div>
                <div className="menu-point">grading</div>
                <div className="menu-point">contact_support</div>
            </div>
        );
    }
}
