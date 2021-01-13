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

        this.dragStart = this.dragStart.bind(this);
        this.dragOver = this.dragOver.bind(this);
        this.dragEnter = this.dragEnter.bind(this);
        this.dragLeave = this.dragLeave.bind(this);
        this.dragDrop = this.dragDrop.bind(this);
        this.dragEnd = this.dragEnd.bind(this);
    }

    componentDidMount() {
        // setInterval(() => {
        //     that.checkRow();
        //     that.checkRowForFour();
        //     that.checkColumnForFour();
        //     that.checkRowForThree();
        //     that.checkColumnForThree();
        //     that.moveIntoSquareBelow();
        // }, 200);
    }

    checkRowForFour() {
        const { boardData } = this.state;

        const notValid = [5, 6, 7];

        boardData.forEach((rowArray, indexRow) => {
            rowArray.forEach((item, indexItem) => {
                const rowOfFour = [
                    indexItem,
                    indexItem + 1,
                    indexItem + 2,
                    indexItem + 3,
                ];
                const isFirstCellRow = rowArray[indexItem - 1]
                    ? rowArray[indexItem - 1].toDelete
                    : null;
                const isLastCellRow = rowArray[indexItem + 4]
                    ? rowArray[indexItem + 4].toDelete
                    : null;

                if (!notValid.includes(indexItem)) {
                    if (
                        rowOfFour.every((index) => rowArray[index].toDelete) &&
                        !isLastCellRow &&
                        !isFirstCellRow
                    ) {
                        rowOfFour.forEach((index, id) => {
                            if (id === 1) {
                                rowArray[index] = {
                                    // FIXME пофиксить url и type
                                    url: "deleteRow.png",
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

    checkColumnForFour() {
        const { boardData } = this.state;

        const notValid = [5, 6, 7];

        boardData.forEach((rowArray, indexRow) => {
            rowArray.forEach((item, indexItem) => {
                const columnOfFour = [
                    indexItem,
                    indexItem + 1,
                    indexItem + 2,
                    indexItem + 3,
                ];
                const isFirstCellCol = boardData[indexRow - 1]
                    ? boardData[indexRow - 1][indexItem].toDelete
                    : null;
                const isLastCellCol = boardData[indexRow + 4]
                    ? boardData[indexRow + 4][indexItem].toDelete
                    : null;

                if (!notValid.includes(indexItem)) {
                    if (
                        columnOfFour.every(
                            (index) => boardData[index][indexItem].toDelete
                        ) &&
                        !isLastCellCol &&
                        !isFirstCellCol
                    ) {
                        columnOfFour.forEach((index) => {
                            boardData[index][indexItem] = {
                                // FIXME пофиксить url и type
                                url: "deleteRow.png",
                                type: "bangRow",
                                toDelete: false,
                            };
                        });
                    }
                }
            });
        });
        this.setState({ boardData });
    }

    checkGameField() {
        const { boardData } = this.state;

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
                    item.toDelete = true;
                    rowArray[indexItem - 1].toDelete = true;
                    rowArray[indexItem + 1].toDelete = true;
                }

                if (item.type === bottomCellType && item.type === topCellType) {
                    item.toDelete = true;
                    boardData[indexRow + 1][indexItem].toDelete = true;
                    boardData[indexRow - 1][indexItem].toDelete = true;
                }
            });
        });

        this.checkRowForFour();
        this.checkColumnForFour();

        const newBoardData = boardData.map((row) => {
            return row.map((cell) =>
                cell.toDelete
                    ? {
                          url: "",
                          type: "empty",
                          toDelete: false,
                      }
                    : cell
            );
        });

        this.setState({ boardData: newBoardData });
    }

    dragStart(e) {
        const id = parseInt(e.target.id, 10);
        this.idToDrag = id < 10 ? [0, id] : [Math.floor(id / 10), id % 10];
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

        const id = parseInt(e.target.id, 10);
        this.idToReplace = id < 10 ? [0, id] : [Math.floor(id / 10), id % 10];

        const changeSqr = boardData[this.idToReplace[0]][this.idToReplace[1]];

        boardData[this.idToReplace[0]][this.idToReplace[1]] =
            boardData[this.idToDrag[0]][this.idToDrag[1]];
        boardData[this.idToDrag[0]][this.idToDrag[1]] = changeSqr;

        this.checkGameField();
        this.setState({ boardData });
    }

    dragEnd() {
        const dragCheck = parseInt(this.idToDrag.join(""), 10);
        const removeCheck = this.idToReplace
            ? parseInt(this.idToReplace.join(""), 10)
            : -1;

        const validMoves = [
            dragCheck + 1,
            dragCheck - 1,
            dragCheck + 10,
            dragCheck - 10,
        ];

        let validMove = validMoves.includes(removeCheck);

        const { boardData } = this.state;

        if (this.idToReplace !== undefined && validMove) {
            this.idToReplace = undefined;
        } else if (this.idToReplace !== undefined && !validMove) {
            const changeSqr =
                boardData[this.idToReplace[0]][this.idToReplace[1]];
            boardData[this.idToReplace[0]][this.idToReplace[1]] =
                boardData[this.idToDrag[0]][this.idToDrag[1]];
            boardData[this.idToDrag[0]][this.idToDrag[1]] = changeSqr;
        } else {
            boardData[this.idToDrag[0]][this.idToDrag[1]] =
                boardData[this.idToDrag[0]][this.idToDrag[1]];
        }

        this.idToReplace = undefined;

        this.setState({ boardData });
    }

    moveIntoSquareBelow() {
        const { boardData } = this.state;
        boardData = boardData.map((row, rowId, arr) => {
            return row.map((sqr, sqrId) => {
                if (rowId === 0 && sqr.type === "empty") {
                    const randColor = this.candies[
                        Math.floor(Math.random() * 6)
                    ];
                    sqr.type = this.candies.indexOf(randColor);
                    sqr.url = this.candies[randColor];
                    return sqr;
                }
                if (arr[rowId + 1] && arr[rowId + 1][sqrId].type === "empty") {
                    const changeSqr = arr[rowId + 1][sqrId];
                    arr[rowId + 1][sqrId] = sqr;
                    return changeSqr;
                }
            });
        });
        this.setState({ boardData });
    }

    render() {
        const { score } = this.state;
        const { boardData } = this.state;

        // const doubledSquares = [];
        // let rowIndex = 0;
        // squares.forEach((item, index) => {
        //     if (index % 8 !== 0) {
        //         doubledSquares[rowIndex].push(item);
        //     } else {
        //         doubledSquares.push([item]);
        //         if (index !== 0) { rowIndex += 1; }
        //     }
        // });

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
