import React from 'react';
import PropTypes from 'prop-types';
import '../styles/App.css';

export default class Statistics extends React.Component {
    constructor(props) {
        super(props);
        this.close = this.close.bind(this);
    }

    close() {
        const { that } = this.props;
        that.showStatistics = false;
        that.forceUpdate();
    }

    render() {
        const result = JSON.parse(localStorage.getItem('result'));

        return (
            <div className="win-screen-container">
                <div className="win-screen-title">Statistics</div>
                <div className="win-screen-wrapper">
                    <ul>
                        {result.map((item) => {
                            return <li key={`Level-${item[0]}`}>
                                {`Level-${item[0]} : ${item[1]} moves`}
                            </li>;
                        })}
                    </ul>
                    <div className="button-wrap">
                        <button className="button" onClick={() => this.close()}>CLOSE</button>
                    </div>
                </div>

            </div>
        );
    }
}
