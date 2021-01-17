import React from 'react';
import PropTypes from 'prop-types';
import '../styles/App.css';
import Board from './Board.jsx';

function CreateScore(props) {
    const { score } = props;
    return (
        <div className="score-board">
            <h3>score</h3>
            <h1 id='score'>{score}</h1>
        </div>
    );
}
CreateScore.propTypes = {
    score: PropTypes.number.isRequired,
};

class App extends React.Component {
    constructor(props) {
        super(props);
        this.width = 8;
        this.candies = [
            'url("../images/red-candy.png")',
            'url("../images/yellow-candy.png")',
            'url("../images/orange-candy.png")',
            'url("../images/purple-candy.png")',
            'url("../images/green-candy.png")',
            'url("../images/blue-candy.png")',
        ];

        this.state = {
            score: 0,
            boardData: new Array(8).fill(null)
                .map(() => new Array(8).fill({ type: 1 }).map(() => {
                    const randColor = this.candies[
                        Math.floor(Math.random() * 6)
                    ];
                    return {
                        url: randColor,
                        type: this.candies.indexOf(randColor),
                        toDelete: false,
                    };
                })),
        };

        this.moveIntoSquareBelow = this.moveIntoSquareBelow.bind(this);
        this.checkGameField = this.checkGameField.bind(this);
        this.checkForFourAndFive = this.checkForFourAndFive.bind(this);
    }

    componentDidMount() {
        this.checkGameField();
    }

    componentDidUpdate(prevProps, prevState) {
        console.log(prevState.boardData, 'prev');
        console.log(this.state.boardData, 'curr');
        if (
            JSON.stringify(prevState.boardData) !==
            JSON.stringify(this.state.boardData)
        ) {
            setTimeout(this.moveIntoSquareBelow, 100);
        }
    }



    onMouseDown(e) {
        if (e.target.classList.contains('cell')) {

            this.cellToDrag = {
                y: e.target.dataset.rowIndex,
                x: e.target.dataset.cellIndex,
            };
            let fakeCell = document.querySelector('.cell.square.fake');
            fakeCell.classList.remove('cell-hidden');
            e.target.classList.add('cell-hidden')
            fakeCell.style.left = `${e.clientX}px`;
            fakeCell.style.top = `${e.clientY}px`;
            fakeCell.style.backgroundImage = e.target.style.backgroundImage;
        }
    }

    onMouseMove(e) {

        if (this.cellToDrag) {
            let fakeCell = document.querySelector('.cell.square.fake')
            fakeCell.style.left = `${e.clientX}px`;
            fakeCell.style.top = `${e.clientY}px`;
        }
    }

    onMouseUp(e) {
        let fakeCell = document.querySelector('.cell.square.fake')
        fakeCell.style.left = 0;
        fakeCell.style.top = 0;
        if (e.target.classList.contains('cell')) {
            this.cellToReplace = {
                y: e.target.dataset.rowIndex,
                x: e.target.dataset.cellIndex,
            };
            fakeCell.style.backgroundImage = e.target.style.backgroundImage;
            this.dragEnd()
            this.cellToDrag = null;
        }
        document.querySelector('.cell-hidden').classList.remove('cell-hidden')
        fakeCell.classList.add('cell-hidden');
    }

    dragEnd() {
        const movementVector = {
            x: this.cellToReplace.x - this.cellToDrag.x,
            y: this.cellToReplace.y - this.cellToDrag.y,
        };

        const isMoveValid =
            Math.abs(movementVector.x) + Math.abs(movementVector.y) < 2;

            const { boardData } = this.state;

        if (this.cellToReplace !== undefined && isMoveValid) {

            const changeSqr = boardData[this.cellToReplace.y][this.cellToReplace.x];
            boardData[this.cellToReplace.y][this.cellToReplace.x] = boardData[this.cellToDrag.y][this.cellToDrag.x];
            boardData[this.cellToDrag.y][this.cellToDrag.x] = changeSqr;
        }

        const isMatch3 = this.checkGameField(false);
        if (!isMatch3) {
            if (this.cellToReplace !== undefined && isMoveValid) {

                const changeSqr = boardData[this.cellToReplace.y][this.cellToReplace.x];
                boardData[this.cellToReplace.y][this.cellToReplace.x] = boardData[this.cellToDrag.y][this.cellToDrag.x];
                boardData[this.cellToDrag.y][this.cellToDrag.x] = changeSqr;
            }
        } else {
            this.checkGameField();
        }


        this.cellToReplace = undefined;

    }

    moveIntoSquareBelow() {
        const { boardData } = this.state;
        const result = boardData.map((row, rowIndex) => {
            return row.map((cell, cellIndex) => {
                if (rowIndex === 0 && cell.type === 'empty') {
                    const randColor = this.candies[
                        Math.floor(Math.random() * 6)
                    ];
                    return {
                        type: this.candies.indexOf(randColor),
                        url: randColor,
                    };
                }
                if (
                    boardData[rowIndex + 1] !== undefined &&
                    boardData[rowIndex + 1][cellIndex].type === 'empty'
                ) {
                    const changecell = boardData[rowIndex + 1][cellIndex];
                    boardData[rowIndex + 1][cellIndex] = cell;
                    return changecell;
                }
                return cell;
            });
        });
        if (JSON.stringify(boardData) !== JSON.stringify(result)) {
            this.setState({ boardData: result });
        } else {
            setTimeout(this.checkGameField, 500);
        }
    }


    checkForFourAndFive(sizeCheckRow, boardData) {
        boardData.forEach((row, rowIndex) => {
            row.forEach((cell, cellIndex) => {
                const indexBonus = sizeCheckRow === 4 ? 1 : 2;
                let arrayRowOfFourOrFive = row[cellIndex + sizeCheckRow - 1]
                    ? row.slice(cellIndex, cellIndex + sizeCheckRow)
                    : null;

                let arrayColumnOfFourOrFive = [];
                if (boardData[rowIndex + sizeCheckRow - 1]) {
                    for (let index = 0; index < sizeCheckRow; index += 1) {
                        arrayColumnOfFourOrFive[index] =
                            boardData[rowIndex + index][cellIndex];
                    }
                } else {
                    arrayColumnOfFourOrFive = null;
                }
                const urlImageTorpedaRow =
                    'url("../images/torpedo-row.png")';
                const urlImageTorpedaColumn =
                    'url("../images/torpedo-col.png")';

                function getCheckArray(checkArray, urlImage) {
                    if (checkArray) {
                        const isCheckOfFourAndFive = checkArray.every(
                            (cell, index, arr) => {
                                if (index !== arr.length - 1) {
                                    return (
                                        cell.type === checkArray[index + 1].type
                                    );
                                }
                                return true;
                            }
                        );

                        if (isCheckOfFourAndFive) {
                            checkArray.forEach((cell, index) => {
                                if (indexBonus !== index) {
                                    cell.url = '';
                                    cell.type = 'empty';
                                    cell.toDelete = false;
                                } else {
                                    cell.url = sizeCheckRow === 4
                                        ? urlImage
                                        : 'url("../images/torpedo-col.png")';
                                    cell.type =
                                        sizeCheckRow === 4
                                            ? 'torpedoOfColumn'
                                            : 'rainbow';
                                    cell.toDelete = false;
                                }
                            });
                        }
                    }
                    return checkArray;
                }

                if (arrayRowOfFourOrFive) {
                    arrayRowOfFourOrFive = getCheckArray(
                        arrayRowOfFourOrFive,
                        urlImageTorpedaRow
                    );

                    for (let index = 0; index < sizeCheckRow; index += 1) {
                        row[cellIndex + index] = arrayRowOfFourOrFive[index];
                    }
                }
                if (arrayColumnOfFourOrFive) {
                    arrayColumnOfFourOrFive = getCheckArray(
                        arrayColumnOfFourOrFive,
                        urlImageTorpedaColumn
                    );
                    for (let index = 0; index < sizeCheckRow; index += 1) {
                        boardData[rowIndex + index][cellIndex] =
                            arrayColumnOfFourOrFive[index];
                    }
                }
            });
        });
        return boardData;
    }

    checkGameField(redraw = true) {
        let boardData = JSON.parse(JSON.stringify(this.state.boardData));
        let someCellMarkedAsDeleted = false;

        boardData.forEach((rowArray, indexRow) => {
            rowArray.forEach((item, indexItem) => {
                const leftCellType = rowArray[indexItem - 1]
                    ? rowArray[indexItem - 1].type
                    : null;
                const rightCellType = rowArray[indexItem + 1]
                    ? rowArray[indexItem + 1].type
                    : null;
                const topCellType = boardData[indexRow + 1]
                    ? boardData[indexRow + 1][indexItem].type
                    : null;
                const bottomCellType = boardData[indexRow - 1]
                    ? boardData[indexRow - 1][indexItem].type
                    : null;
                if (item.type === leftCellType && item.type === rightCellType) {
                    someCellMarkedAsDeleted = true;
                    item.toDelete = true;
                    rowArray[indexItem - 1].toDelete = true;
                    rowArray[indexItem + 1].toDelete = true;
                }

                if (item.type === bottomCellType && item.type === topCellType) {
                    someCellMarkedAsDeleted = true;
                    item.toDelete = true;
                    boardData[indexRow + 1][indexItem].toDelete = true;
                    boardData[indexRow - 1][indexItem].toDelete = true;
                }
            });
        });

        boardData = this.checkForFourAndFive(5, boardData);
        boardData = this.checkForFourAndFive(4, boardData);

        const newBoardData = boardData.map((row) => {
            return row.map((cell) => {
                return cell.toDelete
                    ? {
                        url: '',
                        type: 'empty',
                        toDelete: false,
                    }
                    : cell;
            });
        });

        if (redraw) {
            this.setState({ boardData: newBoardData });
        }
        return someCellMarkedAsDeleted;
    }

    render() {
        const { score } = this.state;
        const { boardData } = this.state;

        return (
            <div
                className='app'
                onMouseMove={event => this.onMouseMove(event)}
                onMouseDown={event => this.onMouseDown(event)}
                onMouseUp={event => this.onMouseUp(event)}
            >
                <CreateScore score={score} />
                <div
                    className='grid'
                    onDragStart={e => e.preventDefault()}
                    // onDragEnd={this.dragEnd}
                    // onDragOver={this.dragOver}
                    // onDragEnter={this.dragEnter}
                    // onDragLeave={this.dragLeave}
                    // onDrop={this.dragDrop}
                >
                    <Board squares={boardData} />
                </div>
                <div
                    className="cell square fake cell-hidden"
                    style={{ backgroundImage: 'url("../images/yellow-candy.png")' }}

                />
            </div>
        );
    }
}

export default App;
