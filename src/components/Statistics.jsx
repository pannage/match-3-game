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
            <div className="win-screen-container statistics-wrapper">
                <div className="win-screen-title">Statistics</div>
                <div className="win-screen-wrapper">
                    {result ? <ul>
                        {result.map((item) => {
                            return <li key={`Level-${item[0]}`}>
                                {`Level-${item[0]} : ${item[1]} moves`}
                            </li>;
                        })}
                    </ul> : <div>Sorry, no statistics yet</div>}
                    <div className="button-wrap close__btn" onClick={() => this.close()}>
                    </div>
                </div>

            </div>
        );
    }
}

Statistics.propTypes = {
    that: PropTypes.object.isRequired,
};
