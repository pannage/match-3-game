import React from 'react';
import PropTypes from 'prop-types';
import '../styles/App.css';

export default class Board extends React.Component {
    render() {
        const { squares, background } = this.props;

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

                                        if (!background) {
                                            return (
                                                <div
                                                    className="cell square"
                                                    key={cellKey}
                                                    data-row-index={rowIndex}
                                                    data-cell-index={cellIndex}
                                                    style={{ backgroundImage: cell.url }}
                                                />
                                            );
                                        }

                                        return (<div
                                            className="cell square"
                                            key={cellKey}
                                            style={{ backgroundColor: cell.isDesk ? 'red' : 'none' }}
                                        />);
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
