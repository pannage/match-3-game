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
        this.moveIntoSquareBelow = this.moveIntoSquareBelow.bind(this);
        this.checkGameField = this.checkGameField.bind(this);
        this.checkForFour = this.checkForFour.bind(this);
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
        console.log(prevState.boardData, "prev");
        console.log(this.state.boardData, "curr");
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

    checkForFour() {
        const { boardData } = this.state;

        const notValid = [5, 6, 7];

        boardData.forEach((row, rowIndex) => {
            row.forEach((cell, cellIndex) => {
                const rowOfFour = [
                    cellIndex,
                    cellIndex + 1,
                    cellIndex + 2,
                    cellIndex + 3,
                ];
                const isFirstCellRow = row[cellIndex - 1]
                    ? row[cellIndex - 1].toDelete
                    : null;
                const isLastCellRow = row[cellIndex + 4]
                    ? row[cellIndex + 4].toDelete
                    : null;
                const isFirstCellCol = boardData[rowIndex - 1]
                    ? boardData[rowIndex - 1][cellIndex].toDelete
                    : null;
                const isLastCellCol = boardData[rowIndex + 4]
                    ? boardData[rowIndex + 4][cellIndex].toDelete
                    : null;

                if (!notValid.includes(cellIndex)) {
                    if (
                        rowOfFour.every((index) => row[index].toDelete) &&
                        !isLastCellRow &&
                        !isFirstCellRow
                    ) {
                        rowOfFour.forEach((index, id) => {
                            if (id === 1) {
                                row[index] = {
                                    // FIXME пофиксить url и type
                                    url:
                                        'url("https://e7.pngegg.com/pngimages/78/335/png-clipart-%E7%BA%A2%E8%89%B2bang%E7%88%86%E7%82%B8-gules-bang.png")',
                                    type: "bangRow",
                                    toDelete: false,
                                };
                            }
                        });
                    }

                    if (
                        rowOfFour.every(
                            (index) => boardData[index][cellIndex].toDelete
                        ) &&
                        !isLastCellCol &&
                        !isFirstCellCol
                    ) {
                        rowOfFour.forEach((index, id) => {
                            if (id === 1) {
                                boardData[index][cellIndex] = {
                                    // FIXME пофиксить url и type
                                    url:
                                        'url("https://e7.pngegg.com/pngimages/78/335/png-clipart-%E7%BA%A2%E8%89%B2bang%E7%88%86%E7%82%B8-gules-bang.png")',
                                    type: "bangRow",
                                    toDelete: false,
                                };
                            }
                        });
                    }
                }
            });
        });

        this.setState({ boardData });
    }

    checkGameField() {
        const { boardData } = this.state;

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

        this.checkForFour();

        const newBoardData = boardData.map((row) => {
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

        this.setState({ boardData: newBoardData });
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
