import React from 'react';
import PropTypes from 'prop-types';
import '../styles/App.css';

export default class Board extends React.Component {
    render() {
        const { squares } = this.props;

        return (
            <div className="board">
                {
                    squares.map((row, rowIndex) => {
                        const rowKey = `row-${rowIndex}`;
                        return (
                            <div className="board-row" key={rowKey}>
                                {
                                    row.map((cell, cellIndex) => {
                                        const cellKey = `${rowIndex}${cellIndex}`;
                                        return (
                                            <div draggable="true" id={cellKey} className="cell square" key={cellKey} style={{ backgroundImage: cell.url }} />
                                        );
                                    })
                                }
                            </div>
                        );
                    })
                }
            </div>
        );
    }
}

Board.propTypes = {
    squares: PropTypes.arrayOf(
        PropTypes.arrayOf(PropTypes.object),
    ).isRequired,
};
