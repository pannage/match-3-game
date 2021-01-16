import React from "react";
import PropTypes from "prop-types";
import "../styles/App.css";
import Board from "./Board.jsx";

function CreateScore(props) {
    const { score } = props;
    return (
        <div className="score-board">
            <h3>score</h3>
            <h1 id="score">{score}</h1>
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
            boardData: new Array(8).fill(null).map(() =>
                new Array(8).fill({ type: 1 }).map(() => {
                    const randColor = this.candies[
                        Math.floor(Math.random() * 6)
                    ];
                    return {
                        url: randColor,
                        type: this.candies.indexOf(randColor),
                        toDelete: false,
                    };
                })
            ),
        };

        // this.checkBoardData = [...this.state];
        // console.log("this.checkBoardData", this.checkBoardData);
        this.moveIntoSquareBelow = this.moveIntoSquareBelow.bind(this);
        this.checkGameField = this.checkGameField.bind(this);
        this.checkForFourAndFive = this.checkForFourAndFive.bind(this);
        this.dragStart = this.dragStart.bind(this);
        this.dragOver = this.dragOver.bind(this);
        this.dragEnter = this.dragEnter.bind(this);
        this.dragLeave = this.dragLeave.bind(this);
        this.dragDrop = this.dragDrop.bind(this);
        this.dragEnd = this.dragEnd.bind(this);
    }

    componentDidMount() {
        this.checkGameField();
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            JSON.stringify(prevState.boardData) !==
            JSON.stringify(this.state.boardData)
        ) {
            setTimeout(this.moveIntoSquareBelow, 100);
        }
    }

    dragStart(e) {
        this.cellToDrag = {
            y: e.target.dataset.rowIndex,
            x: e.target.dataset.cellIndex,
        };
    }

    dragOver(e) {
        e.preventDefault();
    }

    dragEnter(e) {
        e.preventDefault();
    }

    dragLeave(e) {
        e.preventDefault();
    }

    dragDrop(e) {
        const { boardData } = this.state;

        this.cellToReplace = {
            y: e.target.dataset.rowIndex,
            x: e.target.dataset.cellIndex,
        };

        const changeSqr = boardData[this.cellToReplace.y][this.cellToReplace.x];

        boardData[this.cellToReplace.y][this.cellToReplace.x] =
            boardData[this.cellToDrag.y][this.cellToDrag.x];
        boardData[this.cellToDrag.y][this.cellToDrag.x] = changeSqr;

        this.dragBoard = boardData;
    }

    dragEnd() {
        const movementVector = {
            x: this.cellToReplace.x - this.cellToDrag.x,
            y: this.cellToReplace.y - this.cellToDrag.y,
        };

        const isMoveValid =
            Math.abs(movementVector.x) + Math.abs(movementVector.y) < 2;

        const boardData = this.dragBoard;

        if (this.idToReplace !== undefined && isMoveValid) {
            this.idToReplace = undefined;
        } else if (this.idToReplace !== undefined && !isMoveValid) {
            const changeSqr =
                boardData[this.idToReplace[0]][this.idToReplace[1]];
            boardData[this.cellToReplace.y][this.cellToReplace.x] =
                boardData[this.cellToDrag.y][this.cellToDrag.x];
            boardData[this.cellToDrag.y][this.cellToDrag.x] = changeSqr;
        }

        this.idToReplace = undefined;

        this.setState({ boardData });
        this.checkGameField();
    }

    moveIntoSquareBelow() {
        const { boardData } = this.state;
        const result = boardData.map((row, rowIndex) => {
            return row.map((cell, cellIndex) => {
                if (rowIndex === 0 && cell.type === "empty") {
                    const randColor = this.candies[
                        Math.floor(Math.random() * 6)
                    ];
                    return {
                        type: this.candies.indexOf(randColor),
                        url: randColor,
                        toDelete: false,
                    };
                }
                if (
                    boardData[rowIndex + 1] !== undefined &&
                    boardData[rowIndex + 1][cellIndex].type === "empty"
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
                    'url("https://www.flaticon.com/svg/vstatic/svg/30/30999.svg?token=exp=1610827343~hmac=b8ad65644121896d6a887e0af05d0d83")';
                const urlImageTorpedaColumn =
                    'url("../images/explosion-col.png")';

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
                                    cell.url = "";
                                    cell.type = "empty";
                                    cell.toDelete = false;
                                } else {
                                    cell.url =
                                        sizeCheckRow === 4
                                            ? urlImage
                                            : 'url( "https://www.flaticon.com/svg/vstatic/svg/112/112683.svg?token=exp=1610827293~hmac=ab51b4a6fd02c42e1f5d2ad373b28498")';
                                    cell.type =
                                        sizeCheckRow === 4
                                            ? "torpedoOfColumn"
                                            : "rainbow";
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

    checkGameField() {
        let boardData = JSON.parse(JSON.stringify(this.state.boardData));

        boardData.forEach((row, rowIndex) => {
            row.forEach((cell, cellIndex) => {
                const leftCellType = row[cellIndex - 1]
                    ? row[cellIndex - 1].type
                    : null;
                const rightCellType = row[cellIndex + 1]
                    ? row[cellIndex + 1].type
                    : null;
                const topCellType = boardData[rowIndex + 1]
                    ? boardData[rowIndex + 1][cellIndex].type
                    : null;
                const bottomCellType = boardData[rowIndex - 1]
                    ? boardData[rowIndex - 1][cellIndex].type
                    : null;
                if (cell.type === leftCellType && cell.type === rightCellType) {
                    cell.toDelete = true;
                    row[cellIndex - 1].toDelete = true;
                    row[cellIndex + 1].toDelete = true;
                }

                if (cell.type === bottomCellType && cell.type === topCellType) {
                    cell.toDelete = true;
                    boardData[rowIndex + 1][cellIndex].toDelete = true;
                    boardData[rowIndex - 1][cellIndex].toDelete = true;
                }
            });
        });

        boardData = this.checkForFourAndFive(5, boardData);
        boardData = this.checkForFourAndFive(4, boardData);

        const result = boardData.map((row) => {
            return row.map((cell) => {
                return cell.toDelete
                    ? {
                          url: "",
                          type: "empty",
                          toDelete: false,
                      }
                    : cell;
            });
        });

        this.setState({ boardData: result });
    }

    render() {
        const { score } = this.state;
        const { boardData } = this.state;

        return (
            <div className="app">
                <CreateScore score={score} />
                <div
                    className="grid"
                    onDragStart={this.dragStart}
                    onDragEnd={this.dragEnd}
                    onDragOver={this.dragOver}
                    onDragEnter={this.dragEnter}
                    onDragLeave={this.dragLeave}
                    onDrop={this.dragDrop}
                >
                    <Board squares={boardData} />
                </div>
            </div>
        );
    }
}

export default App;
