import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Link } from 'react-router-dom';
import '../styles/App.css';
import Board from './Board.jsx';
import LevelRoad from './levels.jsx';
import TaskBox from './task-box.jsx';
import LoseScreen from './lose-screen.jsx';
import { checkNumberLevel, checkToDeleteCell } from './loadLevels';
import WinScreen from './win-screen.jsx';
import Menu from './menu.jsx'

class App extends React.Component {
    constructor(props) {
        super(props);
        this.width = 8;
        this.candies = [
            'url(../images/red-candy.png)',
            'url(../images/yellow-candy.png)',
            'url(../images/orange-candy.png)',
            'url(../images/purple-candy.png)',
            'url(../images/green-candy.png)',
            'url(../images/blue-candy.png)',
        ];
        this.toMove = true;
        this.levelIsWon = false;
        this.levelIsFinished = false;
        this.state = {
            boardData: [],
        };
        this.checkForEmptyUnderIce = this.checkForEmptyUnderIce.bind(this);
        this.moveIntoSquareBelow = this.moveIntoSquareBelow.bind(this);
        this.handleDoubleClick = this.handleDoubleClick.bind(this);
        this.checkGameField = this.checkGameField.bind(this);
        this.checkThreeRow = this.checkThreeRow.bind(this);
        this.checkXMine = this.checkXMine.bind(this);
        this.checkFirstMine = this.checkFirstMine.bind(this);
        this.checkSecondMine = this.checkSecondMine.bind(this);
        this.checkForFourAndFive = this.checkForFourAndFive.bind(this);
        this.getGameField = this.getGameField.bind(this);
        this.checkForWinLose = this.checkForWinLose.bind(this);
        this.setLocalStorage = this.setLocalStorage.bind(this);
        this.clearLocalStorage = this.clearLocalStorage.bind(this);
        this.setResult = this.setResult.bind(this);
        this.checkBonusTask = this.checkBonusTask.bind(this);
        this.checkTask = this.checkTask.bind(this);
        this.checkObstaclesTask = this.checkObstaclesTask.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        if (JSON.stringify(prevState.boardData) !== JSON.stringify(this.state.boardData)) {
            this.toMove = false;
            setTimeout(this.moveIntoSquareBelow, 100);
        } else if (!this.levelIsFinished) {
            this.setLocalStorage();
            this.checkForWinLose();
        }
    }

    checkColumn(cell, boardData) {
        for (let i = cell.y; i < 8; i += 1) {
            if (boardData[i][cell.x].type === 'ground') {
                i = 8;
            } else {
                boardData[i][cell.x].toDelete = true;
            }
        }

        for (let i = cell.y; i >= 0; i -= 1) {
            if (boardData[i][cell.x].type === 'ground') {
                i = -1;
            } else {
                boardData[i][cell.x].toDelete = true;
            }
        }

        return boardData;
    }

    checkRow(cell, boardData) {
        for (let i = cell.x; i < 8; i += 1) {
            if (boardData[cell.y][i].type === 'ground') {
                i = 8;
            } else {
                boardData[cell.y][i].toDelete = true;
            }
        }

        for (let i = cell.x; i >= 0; i -= 1) {
            if (boardData[cell.y][i].type === 'ground') {
                i = -1;
            } else {
                boardData[cell.y][i].toDelete = true;
            }
        }

        return boardData;
    }

    handleDoubleClick(e, data) {
        const cell = {
            y: parseInt(e.target.dataset.rowIndex, 10),
            x: parseInt(e.target.dataset.cellIndex, 10),
        };

        let boardData = e.target.redraw
            ? data
            : JSON.parse(JSON.stringify(this.state.boardData));

        switch (boardData[cell.y][cell.x].type) {
        case 'torpedoOfColumn':
            boardData = this.checkColumn(cell, boardData);
            break;
        case 'torpedoOfRow':
            boardData = this.checkRow(cell, boardData);
            break;
        case 'rainbow':
            if (e.target.redraw) {
                const colorCell = boardData[e.target.rainbowSet.rowIndex][e.target.rainbowSet.cellIndex].type;

                const newBoardData = boardData.map((row) => {
                    return row.map((item) => {
                        if (colorCell === item.type) {
                            item.toDelete = true;
                        }

                        return item;
                    });
                });

                boardData = newBoardData;
                boardData[cell.y][cell.x].toDelete = true;
            } else { e.preventDefault(); }

            break;
        case 'mine':
            boardData[cell.y][cell.x].toDelete = true;

            if (boardData[cell.y][cell.x + 1] && boardData[cell.y][cell.x + 1].type !== 'ground') {
                boardData[cell.y][cell.x + 1].toDelete = true;
            }

            if (boardData[cell.y + 1] && boardData[cell.y + 1][cell.x + 1] && boardData[cell.y + 1][cell.x + 1].type !== 'ground') {
                boardData[cell.y + 1][cell.x + 1].toDelete = true;
            }

            if (boardData[cell.y + 1] && boardData[cell.y + 1][cell.x].type !== 'ground') {
                boardData[cell.y + 1][cell.x].toDelete = true;
            }

            if (boardData[cell.y + 1] && boardData[cell.y + 1][cell.x - 1] && boardData[cell.y + 1][cell.x - 1].type !== 'ground') {
                boardData[cell.y + 1][cell.x - 1].toDelete = true;
            }

            if (boardData[cell.y][cell.x - 1] && boardData[cell.y][cell.x - 1].type !== 'ground') {
                boardData[cell.y][cell.x - 1].toDelete = true;
            }

            if (boardData[cell.y - 1] && boardData[cell.y - 1][cell.x - 1] && boardData[cell.y - 1][cell.x - 1].type !== 'ground') {
                boardData[cell.y - 1][cell.x - 1].toDelete = true;
            }

            if (boardData[cell.y - 1] && boardData[cell.y - 1][cell.x].type !== 'ground') {
                boardData[cell.y - 1][cell.x].toDelete = true;
            }

            if (boardData[cell.y - 1] && boardData[cell.y - 1][cell.x + 1] && boardData[cell.y - 1][cell.x + 1].type !== 'ground') {
                boardData[cell.y - 1][cell.x + 1].toDelete = true;
            }

            break;
        case 'x-mine':
            boardData = this.checkRow(cell, boardData);
            boardData = this.checkColumn(cell, boardData);
            break;
        case 'three-row':
            boardData = this.checkColumn(cell, boardData);
            boardData = this.checkRow(cell, boardData);

            if (boardData[cell.y + 1]) {
                cell.y += 1;
                boardData = this.checkRow(cell, boardData);
                cell.y -= 1;
            }

            if (boardData[cell.y - 1]) {
                cell.y -= 1;
                boardData = this.checkRow(cell, boardData);
                cell.y += 1;
            }

            if (boardData[cell.y][cell.x + 1]) {
                cell.x += 1;
                boardData = this.checkRow(cell, boardData);
                cell.x -= 1;
            }

            if (boardData[cell.y][cell.x - 1]) {
                cell.x -= 1;
                boardData = this.checkRow(cell, boardData);
                cell.x += 1;
            }

            break;
        default:
            if (!e.target.redraw) { e.preventDefault(); }

            break;
        }

        if (e.target.redraw) {
            return boardData;
        }

        if (typeof boardData[cell.y][cell.x].type !== 'number' && boardData[cell.y][cell.x].type !== 'ground' && !this.levelIsFinished) {
            this.setState((prevState) => {
                return {
                    boardData,
                    task: {
                        moves: prevState.task.moves - 1,
                        message: prevState.task.message,
                    }
                }
            });
        }
    }

    onMouseDown(e) {
        if (e.target.classList.contains('cell')) {
            this.cellToDrag = {
                y: e.target.dataset.rowIndex,
                x: e.target.dataset.cellIndex,
            };

            if (
                this.state.boardData[this.cellToDrag.y][this.cellToDrag.x].type === 'ground'
        || this.state.boardData[this.cellToDrag.y][this.cellToDrag.x].isFrozen
        || this.state.boardData[this.cellToDrag.y][this.cellToDrag.x].type === 'empty'
        || !this.toMove
            ) {
                this.cellToDrag = false;
            } else {
                const fakeCell = document.querySelector('.cell.square.fake');

                fakeCell.classList.remove('cell-hidden');
                e.target.classList.add('cell-hidden');
                fakeCell.style.left = `${e.pageX - fakeCell.offsetWidth / 2}px`;
                fakeCell.style.top = `${e.pageY - fakeCell.offsetHeight / 2}px`;
                fakeCell.style.backgroundImage = e.target.style.backgroundImage;
            }
        }
    }

    onMouseMove(e) {
        if (this.cellToDrag) {
            const fakeCell = document.querySelector('.cell.square.fake');

            fakeCell.style.left = `${e.pageX - fakeCell.offsetWidth / 2}px`;
            fakeCell.style.top = `${e.pageY - fakeCell.offsetHeight / 2}px`;
        }
    }

    onMouseUp(e) {
        const fakeCell = document.querySelector('.cell.square.fake');

        fakeCell.style.left = 0;
        fakeCell.style.top = 0;

        fakeCell.style.top = 0;

        if (
            e.target.classList.contains('cell')
        && this.state.boardData[e.target.dataset.rowIndex][
            e.target.dataset.cellIndex
        ].type !== 'ground' && !this.state.boardData[e.target.dataset.rowIndex][
                e.target.dataset.cellIndex
            ].isFrozen && this.state.boardData[e.target.dataset.rowIndex][
                e.target.dataset.cellIndex
            ].type !== 'empty'
        ) {
            this.cellToReplace = {
                y: e.target.dataset.rowIndex,
                x: e.target.dataset.cellIndex,
            };
            fakeCell.style.backgroundImage = e.target.style.backgroundImage;
            this.dragEnd();
            this.cellToDrag = null;
        }

        document.querySelector('.cell-hidden').classList.remove('cell-hidden');
        fakeCell.classList.add('cell-hidden');
    }

    dragEnd() {
        if (!this.cellToDrag) { return; }

        if (this.cellToDrag.x === this.cellToReplace.x && this.cellToDrag.y === this.cellToReplace.y) { return; }

        const movementVector = {
            x: this.cellToReplace.x - this.cellToDrag.x,
            y: this.cellToReplace.y - this.cellToDrag.y,
        };

        let bonusUsed = false;

        const isMoveValid = Math.abs(movementVector.x) + Math.abs(movementVector.y) < 2;

        let boardData = JSON.parse(JSON.stringify(this.state.boardData));

        if (this.cellToReplace !== undefined && isMoveValid) {
            const changeSqr = boardData[this.cellToReplace.y][this.cellToReplace.x];
            const desk = changeSqr.isDesk;

            changeSqr.isDesk = boardData[this.cellToDrag.y][this.cellToDrag.x].isDesk;

            boardData[this.cellToReplace.y][this.cellToReplace.x] = boardData[this.cellToDrag.y][this.cellToDrag.x];
            boardData[this.cellToReplace.y][this.cellToReplace.x].isDesk = desk;
            boardData[this.cellToDrag.y][this.cellToDrag.x] = changeSqr;

            if (typeof boardData[this.cellToDrag.y][this.cellToDrag.x].type !== 'number') {
                bonusUsed = true;
                const dragBonusEvent = {
                    target: {
                        dataset: {
                            rowIndex: this.cellToDrag.y,
                            cellIndex: this.cellToDrag.x,
                        },
                        rainbowSet: {
                            rowIndex: this.cellToReplace.y,
                            cellIndex: this.cellToReplace.x,
                        },
                        redraw: true,
                    },
                };

                boardData = this.handleDoubleClick(dragBonusEvent, boardData);
            }

            if (
                typeof boardData[this.cellToReplace.y][this.cellToReplace.x].type !== 'number'
            ) {
                bonusUsed = true;
                const dragBonusEvent = {
                    target: {
                        dataset: {
                            rowIndex: this.cellToReplace.y,
                            cellIndex: this.cellToReplace.x,
                        },
                        rainbowSet: {
                            rowIndex: this.cellToDrag.y,
                            cellIndex: this.cellToDrag.x,
                        },
                        redraw: true,
                    },
                };

                boardData = this.handleDoubleClick(dragBonusEvent, boardData);
            }
        }

        const isMatch3 = this.checkGameField(false, boardData);

        if (!isMatch3 && !bonusUsed) {
            if (this.cellToReplace !== undefined && isMoveValid) {
                const changeSqr = boardData[this.cellToReplace.y][this.cellToReplace.x];

                boardData[this.cellToReplace.y][this.cellToReplace.x] = boardData[this.cellToDrag.y][this.cellToDrag.x];
                boardData[this.cellToDrag.y][this.cellToDrag.x] = changeSqr;
            }
        } else {
            this.cellToReplace = undefined;
            this.setState((prevState) => {
                return {
                    boardData,
                    task: {
                        moves: prevState.task.moves - 1,
                        message: prevState.task.message,
                    }
                }
            });
        }
    }

    checkForEmptyUnderIce(rowIndex, cellIndex, boardData) {
        let checkData = {
            result: false,
        };

        for (let i = rowIndex + 2; i < 8; i += 1) {
            if (boardData[i][cellIndex].type === 'empty'
        && boardData[i - 1][cellIndex].isFrozen) {
                checkData = {
                    result: true,
                    emptyRow: i,
                };
            }
        }

        return checkData;
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
                        url: randColor,
                        type: this.candies.indexOf(randColor),
                        toDelete: false,
                        isFrozen: false,
                        isDesk: cell.isDesk,
                    };
                }

                if (
                    boardData[rowIndex + 1]
                && boardData[rowIndex + 1][cellIndex].type === 'empty'
                && cell.type !== 'ground' && !cell.isFrozen
                ) {
                    const changeCell = boardData[rowIndex + 1][cellIndex];
                    const desk = changeCell.isDesk;

                    changeCell.isDesk = cell.isDesk;
                    boardData[rowIndex + 1][cellIndex] = cell;
                    boardData[rowIndex + 1][cellIndex].isDesk = desk;

                    return changeCell;
                }

                if (boardData[rowIndex + 1] && boardData[rowIndex + 1][cellIndex - 1]
                && boardData[rowIndex + 1][cellIndex - 1].type === 'empty'
                && boardData[rowIndex][cellIndex - 1].type === 'ground'
                && cell.type !== 'ground') {
                    const changeCell = boardData[rowIndex + 1][cellIndex - 1];
                    const desk = changeCell.isDesk;

                    changeCell.isDesk = cell.isDesk;
                    boardData[rowIndex + 1][cellIndex - 1] = cell;
                    boardData[rowIndex + 1][cellIndex - 1].isDesk = desk;

                    return changeCell;
                }

                if (boardData[rowIndex + 1] && boardData[rowIndex + 1][cellIndex + 1]
                && boardData[rowIndex + 1][cellIndex + 1].type === 'empty'
                && boardData[rowIndex][cellIndex + 1].type === 'ground'
                && cell.type !== 'ground') {
                    const changeCell = boardData[rowIndex + 1][cellIndex + 1];
                    const desk = changeCell.isDesk;

                    changeCell.isDesk = cell.isDesk;
                    boardData[rowIndex + 1][cellIndex + 1] = cell;
                    boardData[rowIndex + 1][cellIndex + 1].isDesk = desk;

                    return changeCell;
                }

                if (boardData[rowIndex + 1] && boardData[rowIndex + 1][cellIndex - 1]
                && boardData[rowIndex + 1][cellIndex - 1].type === 'empty' && cell.type !== 'ground'
                && boardData[rowIndex][cellIndex - 1].type === 'empty' && boardData[rowIndex - 1]
                && boardData[rowIndex - 1][cellIndex - 1].type === 'ground'
                ) {
                    const changeCell = boardData[rowIndex + 1][cellIndex - 1];
                    const desk = changeCell.isDesk;

                    changeCell.isDesk = cell.isDesk;
                    boardData[rowIndex + 1][cellIndex - 1] = cell;
                    boardData[rowIndex + 1][cellIndex - 1].isDesk = desk;

                    return changeCell;
                }

                if (boardData[rowIndex + 1] && boardData[rowIndex + 1][cellIndex + 1]
                    && boardData[rowIndex + 1][cellIndex + 1].type === 'empty' && cell.type !== 'ground'
                    && boardData[rowIndex][cellIndex + 1].type === 'empty' && boardData[rowIndex - 1]
                    && boardData[rowIndex - 1][cellIndex + 1].type === 'ground'
                ) {
                    const changeCell = boardData[rowIndex + 1][cellIndex + 1];
                    const desk = changeCell.isDesk;

                    changeCell.isDesk = cell.isDesk;
                    boardData[rowIndex + 1][cellIndex + 1] = cell;
                    boardData[rowIndex + 1][cellIndex].isDesk = desk;

                    return changeCell;
                }

                if (boardData[rowIndex + 1] && boardData[rowIndex + 1][cellIndex].isFrozen
                && !cell.isFrozen) {
                    const checkData = this.checkForEmptyUnderIce(rowIndex, cellIndex, boardData);

                    if (checkData.result) {
                        const changeCell = boardData[checkData.emptyRow][cellIndex];
                        const desk = changeCell.isDesk;

                        changeCell.isDesk = cell.isDesk;
                        boardData[checkData.emptyRow][cellIndex] = cell;
                        boardData[checkData.emptyRow][cellIndex].isDesk = desk;

                        return changeCell;
                    }
                }

                return cell;
            });
        });

        if (JSON.stringify(boardData) !== JSON.stringify(result)) {
            this.setState({ boardData: result });
        } else {
            setTimeout(this.checkGameField, 100);
        }
    }

    checkFirstMine() {
        const accumBoard = new Array(8).fill(null).map(() => new Array(8).fill(null));
        const bd = this.checkBoardData;

        bd.forEach((row, rowId) => {
            row.forEach((cell, cellIndex) => {
                if (!bd[rowId][cellIndex].toDelete || bd[rowId][cellIndex].type === 'ground') {
                    accumBoard[rowId][cellIndex] = { ...cell };

                    return;
                }

                const checkVertical = bd[rowId + 1]
          && bd[rowId - 1]
          && bd[rowId + 1][cellIndex].type === bd[rowId][cellIndex].type
          && bd[rowId - 1][cellIndex].type === bd[rowId][cellIndex].type;

                const checkHorizontal = bd[rowId][cellIndex + 1]
          && bd[rowId][cellIndex - 1]
          && bd[rowId][cellIndex + 1].type === bd[rowId][cellIndex].type
          && bd[rowId][cellIndex - 1].type === bd[rowId][cellIndex].type;

                if (checkVertical) {
                    const checkRight = bd[rowId][cellIndex + 1]
            && bd[rowId][cellIndex + 2]
            && bd[rowId][cellIndex + 1].type === bd[rowId][cellIndex].type
            && bd[rowId][cellIndex + 2].type === bd[rowId][cellIndex].type;

                    const checkLeft = bd[rowId][cellIndex - 1]
            && bd[rowId][cellIndex - 2]
            && bd[rowId][cellIndex - 1].type === bd[rowId][cellIndex].type
            && bd[rowId][cellIndex - 2].type === bd[rowId][cellIndex].type;

                    if (checkRight || checkLeft) {
                        this.checkObstaclesTask(cell);
                        accumBoard[rowId][cellIndex] = {
                            url: 'url(../images/mine.png)',
                            type: 'mine',
                            toDelete: false,
                            isFrozen: false,
                            isDesk: false,
                        };
                        this.checkBonusTask('mine');
                    } else { accumBoard[rowId][cellIndex] = { ...cell }; }
                } else if (checkHorizontal) {
                    const checkBot = bd[rowId + 1]
            && bd[rowId + 2]
            && bd[rowId + 1][cellIndex].type === bd[rowId][cellIndex].type
            && bd[rowId + 2][cellIndex].type === bd[rowId][cellIndex].type;

                    const checkTop = bd[rowId - 1]
            && bd[rowId - 2]
            && bd[rowId - 1][cellIndex].type === bd[rowId][cellIndex].type
            && bd[rowId - 2][cellIndex].type === bd[rowId][cellIndex].type;

                    if (checkBot || checkTop) {
                        this.checkObstaclesTask(cell);
                        accumBoard[rowId][cellIndex] = {
                            url: 'url(../images/mine.png)',
                            type: 'mine',
                            toDelete: false,
                            isFrozen: false,
                            isDesk: false,
                        };
                        this.checkBonusTask('mine');
                    } else { accumBoard[rowId][cellIndex] = { ...cell }; }
                } else { accumBoard[rowId][cellIndex] = { ...cell }; }
            });
        });

        this.checkBoardData = accumBoard;
    }

    checkSecondMine() {
        const accumBoard = new Array(8).fill(null).map(() => new Array(8).fill(null));
        const bd = this.checkBoardData;

        bd.forEach((row, rowId) => {
            row.forEach((cell, cellIndex) => {
                if (!bd[rowId][cellIndex].toDelete || bd[rowId][cellIndex].type === 'ground') {
                    accumBoard[rowId][cellIndex] = { ...cell };

                    return;
                }

                const checkBot = bd[rowId + 1]
          && bd[rowId + 2]
          && bd[rowId + 1][cellIndex].type === bd[rowId][cellIndex].type
          && bd[rowId + 2][cellIndex].type === bd[rowId][cellIndex].type;

                const checkTop = bd[rowId - 1]
          && bd[rowId - 2]
          && bd[rowId - 1][cellIndex].type === bd[rowId][cellIndex].type
          && bd[rowId - 2][cellIndex].type === bd[rowId][cellIndex].type;

                if (checkBot || checkTop) {
                    const checkRight = bd[rowId][cellIndex + 1]
            && bd[rowId][cellIndex + 2]
            && bd[rowId][cellIndex + 1].type === bd[rowId][cellIndex].type
            && bd[rowId][cellIndex + 2].type === bd[rowId][cellIndex].type;

                    const checkLeft = bd[rowId][cellIndex - 1]
            && bd[rowId][cellIndex - 2]
            && bd[rowId][cellIndex - 1].type === bd[rowId][cellIndex].type
            && bd[rowId][cellIndex - 2].type === bd[rowId][cellIndex].type;

                    if (checkRight || checkLeft) {
                        this.checkObstaclesTask(cell);
                        accumBoard[rowId][cellIndex] = {
                            url: 'url(../images/mine.png)',
                            type: 'mine',
                            toDelete: false,
                            isFrozen: false,
                            isDesk: false,
                        };
                        this.checkBonusTask('mine');
                    } else { accumBoard[rowId][cellIndex] = { ...cell }; }
                } else { accumBoard[rowId][cellIndex] = { ...cell }; }
            });
        });

        this.checkBoardData = accumBoard;
    }

    checkXMine() {
        const accumBoard = new Array(8).fill(null).map(() => new Array(8).fill(null));
        const bd = this.checkBoardData;

        bd.forEach((row, rowId) => {
            row.forEach((cell, cellIndex) => {
                if (!bd[rowId][cellIndex].toDelete || bd[rowId][cellIndex].type === 'ground') {
                    accumBoard[rowId][cellIndex] = { ...cell };

                    return;
                }

                const checkVerticalBot = bd[rowId + 1]
          && bd[rowId + 2]
          && bd[rowId - 1]
          && bd[rowId + 1][cellIndex].type === bd[rowId][cellIndex].type
          && bd[rowId + 2][cellIndex].type === bd[rowId][cellIndex].type
          && bd[rowId - 1][cellIndex].type === bd[rowId][cellIndex].type;

                const checkVerticalTop = bd[rowId - 1]
          && bd[rowId - 2]
          && bd[rowId + 1]
          && bd[rowId - 1][cellIndex].type === bd[rowId][cellIndex].type
          && bd[rowId - 2][cellIndex].type === bd[rowId][cellIndex].type
          && bd[rowId + 1][cellIndex].type === bd[rowId][cellIndex].type;

                const checkHorizontalLeft = bd[rowId][cellIndex + 1]
          && bd[rowId][cellIndex + 2]
          && bd[rowId][cellIndex - 1]
          && bd[rowId][cellIndex + 1].type === bd[rowId][cellIndex].type
          && bd[rowId][cellIndex + 2].type === bd[rowId][cellIndex].type
          && bd[rowId][cellIndex - 1].type === bd[rowId][cellIndex].type;

                const checkHorizontalRight = bd[rowId][cellIndex - 1]
          && bd[rowId][cellIndex - 2]
          && bd[rowId][cellIndex + 1]
          && bd[rowId][cellIndex - 1].type === bd[rowId][cellIndex].type
          && bd[rowId][cellIndex - 2].type === bd[rowId][cellIndex].type
          && bd[rowId][cellIndex + 1].type === bd[rowId][cellIndex].type;

                if (checkVerticalBot || checkVerticalTop) {
                    const checkPositionLeft = bd[rowId][cellIndex + 1]
            && bd[rowId][cellIndex + 2]
            && bd[rowId][cellIndex + 1].type === bd[rowId][cellIndex].type
            && bd[rowId][cellIndex + 2].type === bd[rowId][cellIndex].type;

                    const checkPositionMiddle = bd[rowId][cellIndex - 1]
            && bd[rowId][cellIndex + 1]
            && bd[rowId][cellIndex - 1].type === bd[rowId][cellIndex].type
            && bd[rowId][cellIndex + 1].type === bd[rowId][cellIndex].type;

                    const checkPositionRight = bd[rowId][cellIndex - 1]
            && bd[rowId][cellIndex - 2]
            && bd[rowId][cellIndex - 1].type === bd[rowId][cellIndex].type
            && bd[rowId][cellIndex - 2].type === bd[rowId][cellIndex].type;

                    if (checkPositionLeft || checkPositionMiddle || checkPositionRight) {
                        this.checkObstaclesTask(cell);
                        accumBoard[rowId][cellIndex] = {
                            url: 'url(../images/x-bomb.png)',
                            type: 'x-mine',
                            toDelete: false,
                            isFrozen: false,
                            isDesk: false,
                        };
                        this.checkBonusTask('x-mine');
                    } else { accumBoard[rowId][cellIndex] = { ...cell }; }
                } else if (checkHorizontalLeft || checkHorizontalRight) {
                    const checkPositionTop = bd[rowId - 1]
            && bd[rowId - 2]
            && bd[rowId - 1][cellIndex].type === bd[rowId][cellIndex].type
            && bd[rowId - 2][cellIndex].type === bd[rowId][cellIndex].type;

                    const checkPositionMiddle = bd[rowId + 1]
            && bd[rowId - 1]
            && bd[rowId + 1][cellIndex].type === bd[rowId][cellIndex].type
            && bd[rowId - 1][cellIndex].type === bd[rowId][cellIndex].type;

                    const checkPositionBot = bd[rowId + 1]
            && bd[rowId + 2]
            && bd[rowId + 1][cellIndex].type === bd[rowId][cellIndex].type
            && bd[rowId + 2][cellIndex].type === bd[rowId][cellIndex].type;

                    if (checkPositionTop || checkPositionMiddle || checkPositionBot) {
                        this.checkObstaclesTask(cell);
                        accumBoard[rowId][cellIndex] = {
                            url: 'url(../images/x-bomb.png)',
                            type: 'x-mine',
                            toDelete: false,
                            isFrozen: false,
                            isDesk: false,
                        };
                        this.checkBonusTask('x-mine');
                    } else { accumBoard[rowId][cellIndex] = { ...cell }; }
                } else { accumBoard[rowId][cellIndex] = { ...cell }; }
            });
        });

        this.checkBoardData = accumBoard;
    }

    checkThreeRow() {
        const accumBoard = new Array(8).fill(null).map(() => new Array(8).fill(null));
        const bd = this.checkBoardData;

        bd.forEach((row, rowId) => {
            row.forEach((cell, cellIndex) => {
                if (!bd[rowId][cellIndex].toDelete || bd[rowId][cellIndex].type === 'ground') {
                    accumBoard[rowId][cellIndex] = { ...cell };

                    return;
                }

                const checkVertical = bd[rowId + 1]
          && bd[rowId + 2] // top
          && bd[rowId + 1][cellIndex].type === bd[rowId][cellIndex].type
          && bd[rowId + 2][cellIndex].type === bd[rowId][cellIndex].type
          && bd[rowId - 1]
          && bd[rowId - 2] // bottom
          && bd[rowId - 1][cellIndex].type === bd[rowId][cellIndex].type
          && bd[rowId - 2][cellIndex].type === bd[rowId][cellIndex].type;

                const checkHorizontal = bd[rowId][cellIndex + 1]
          && bd[rowId][cellIndex + 2] // right
          && bd[rowId][cellIndex + 1].type === bd[rowId][cellIndex].type
          && bd[rowId][cellIndex + 2].type === bd[rowId][cellIndex].type
          && bd[rowId][cellIndex - 1]
          && bd[rowId][cellIndex - 2] // left
          && bd[rowId][cellIndex - 1].type === bd[rowId][cellIndex].type
          && bd[rowId][cellIndex - 2].type === bd[rowId][cellIndex].type;

                if (checkVertical) {
                    const checkPositionLeft = bd[rowId][cellIndex + 1]
            && bd[rowId][cellIndex + 2]
            && bd[rowId][cellIndex + 1].type === bd[rowId][cellIndex].type
            && bd[rowId][cellIndex + 2].type === bd[rowId][cellIndex].type;

                    const checkPositionMiddle = bd[rowId][cellIndex - 1]
            && bd[rowId][cellIndex + 1]
            && bd[rowId][cellIndex - 1].type === bd[rowId][cellIndex].type
            && bd[rowId][cellIndex + 1].type === bd[rowId][cellIndex].type;

                    const checkPositionRight = bd[rowId][cellIndex - 1]
            && bd[rowId][cellIndex - 2]
            && bd[rowId][cellIndex - 1].type === bd[rowId][cellIndex].type
            && bd[rowId][cellIndex - 2].type === bd[rowId][cellIndex].type;

                    if (checkPositionLeft || checkPositionMiddle || checkPositionRight) {
                        this.checkObstaclesTask(cell);
                        accumBoard[rowId][cellIndex] = {
                            url: 'url(../images/xx-bomb.png)',
                            type: 'three-row',
                            toDelete: false,
                            isFrozen: false,
                            isDesk: false,
                        };
                        this.checkBonusTask('three-row');
                    } else { accumBoard[rowId][cellIndex] = { ...cell }; }
                } else if (checkHorizontal) {
                    const checkPositionTop = bd[rowId - 1]
            && bd[rowId - 2]
            && bd[rowId - 1][cellIndex].type === bd[rowId][cellIndex].type
            && bd[rowId - 2][cellIndex].type === bd[rowId][cellIndex].type;

                    const checkPositionMiddle = bd[rowId + 1]
            && bd[rowId - 1]
            && bd[rowId + 1][cellIndex].type === bd[rowId][cellIndex].type
            && bd[rowId - 1][cellIndex].type === bd[rowId][cellIndex].type;

                    const checkPositionBot = bd[rowId + 1]
            && bd[rowId + 2]
            && bd[rowId + 1][cellIndex].type === bd[rowId][cellIndex].type
            && bd[rowId + 2][cellIndex].type === bd[rowId][cellIndex].type;

                    if (checkPositionTop || checkPositionMiddle || checkPositionBot) {
                        this.checkObstaclesTask(cell);
                        accumBoard[rowId][cellIndex] = {
                            url: 'url(../images/xx-bomb.png)',
                            type: 'three-row',
                            toDelete: false,
                            isFrozen: false,
                            isDesk: false,
                        };
                        this.checkBonusTask('three-row');
                    } else { accumBoard[rowId][cellIndex] = { ...cell }; }
                } else { accumBoard[rowId][cellIndex] = { ...cell }; }
            });
        });
        this.checkBoardData = accumBoard;
    }

    checkForFourAndFive(sizeCheckRow) {
        const boardData = this.checkBoardData;

        boardData.forEach((row, rowIndex) => {
            row.forEach((cell, cellIndex) => {
                const indexBonus = sizeCheckRow === 4 ? 1 : 2;

                let arrayRowOfFourOrFive = row[cellIndex + sizeCheckRow - 1]
                    ? row.slice(cellIndex, cellIndex + sizeCheckRow)
                    : null;

                let arrayColumnOfFourOrFive = [];

                if (boardData[rowIndex + sizeCheckRow - 1]) {
                    for (let index = 0; index < sizeCheckRow; index += 1) {
                        arrayColumnOfFourOrFive[index] = boardData[rowIndex + index][cellIndex];
                    }
                } else {
                    arrayColumnOfFourOrFive = null;
                }

                const urlImageTorpedaRow = 'url(../images/torpedo-row.png)';
                const urlImageTorpedaColumn = 'url(../images/torpedo-col.png)';
                const typeBonusOfColumn = 'torpedoOfColumn';
                const typeBonusOfRow = 'torpedoOfRow';

                function getCheckArray(checkArray, urlImage, typeBonus) {
                    if (checkArray) {
                        const isCheckOfFourAndFive = checkArray.every((cell, index, arr) => {
                            if (cell.type === 'ground') { return false; }

                            if (index !== arr.length - 1) {
                                return cell.type === checkArray[index + 1].type;
                            }

                            return true;
                        });

                        if (isCheckOfFourAndFive) {
                            checkArray.forEach((cell, index) => {
                                if (indexBonus !== index) {
                                    cell.toDelete = true;
                                } else {
                                    if (sizeCheckRow === 5) {
                                        cell.colorDelete = cell.type;
                                    }

                                    cell.url = sizeCheckRow === 4 ? urlImage : 'url(../images/rainbow.png)';
                                    cell.type = sizeCheckRow === 4 ? typeBonus : 'rainbow';
                                    this.checkObstaclesTask(cell);
                                    cell.toDelete = false;
                                    cell.isDesk = false;
                                    cell.isFrozen = false;
                                    this.checkBonusTask(cell.type);
                                }
                            });
                        }
                    }

                    return checkArray;
                }

                if (arrayRowOfFourOrFive) {
                    arrayRowOfFourOrFive = getCheckArray.call(
                        this,
                        arrayRowOfFourOrFive,
                        urlImageTorpedaRow,
                        typeBonusOfRow,
                    );

                    for (let index = 0; index < sizeCheckRow; index += 1) {
                        row[cellIndex + index] = arrayRowOfFourOrFive[index];
                    }
                }

                if (arrayColumnOfFourOrFive) {
                    arrayColumnOfFourOrFive = getCheckArray.call(
                        this,
                        arrayColumnOfFourOrFive,
                        urlImageTorpedaColumn,
                        typeBonusOfColumn,
                    );

                    for (let index = 0; index < sizeCheckRow; index += 1) {
                        boardData[rowIndex + index][cellIndex] = arrayColumnOfFourOrFive[index];
                    }
                }
            });
        });
        this.checkBoardData = boardData;
    }

    handleDelete(boardData) {
        let dataBeforeDelete;
        let newBoardData;

        while (JSON.stringify(dataBeforeDelete)
    !== JSON.stringify(boardData)) {
            dataBeforeDelete = JSON.parse(JSON.stringify(boardData));
            newBoardData = boardData.map((row, rowIndex) => {
                return row.map((cell, cellIndex) => {
                    if (cell.toDelete && typeof cell.type !== 'number') {
                        const dragBonusEvent = {
                            target: {
                                dataset: {
                                    rowIndex,
                                    cellIndex,
                                },
                                redraw: true,
                                rainbowSet: {
                                    rowIndex: rowIndex + 1,
                                    cellIndex,
                                },
                            },
                        };

                        boardData = this.handleDoubleClick(dragBonusEvent, boardData);
                    }

                    return cell;
                });
            });
            boardData = JSON.parse(JSON.stringify(newBoardData));
        }

        newBoardData = boardData.map((row, rowId) => {
            return row.map((cell, cellId) => {
                const condition = cell.type === 'ground'
              && ((boardData[rowId - 1]
                  && boardData[rowId - 1][cellId].toDelete
                  && boardData[rowId - 1][cellId].type !== 'ground')
                  || (boardData[rowId + 1]
                      && boardData[rowId + 1][cellId].toDelete
                      && boardData[rowId + 1][cellId].type !== 'ground')
                  || (boardData[rowId][cellId + 1]
                      && boardData[rowId][cellId + 1].toDelete
                      && boardData[rowId][cellId + 1].type !== 'ground')
                  || (boardData[rowId][cellId - 1]
                      && boardData[rowId][cellId - 1].toDelete
                      && boardData[rowId][cellId - 1].type !== 'ground'));

                if (condition) {
                    cell.toDelete = true;
                }

                return cell;
            });
        });

        boardData = newBoardData.map((row) => {
            return row.map((cell) => {
                if (cell.toDelete) {
                    this.checkObstaclesTask(cell);
                    if (cell.isFrozen) {
                        return {
                            url: cell.url.replace(/candy-ice.png/, 'candy.png'),
                            type: cell.type,
                            toDelete: false,
                            isFrozen: false,
                            isDesk: false,
                        };
                    }

                    return {
                        url: '',
                        type: 'empty',
                        toDelete: false,
                        isFrozen: false,
                        isDesk: false,
                    };
                }

                return cell;
            });
        });

        return boardData;
    }

    checkForWinLose() {
        const { boardData } = this.state;
        const { moves, message } = this.state.task;
        const isFinishedBoard = boardData.every((row) => {
            return row.every((cell) => {
                return cell.type !== 'ground'
                && !cell.isFrozen && !cell.isDesk;
            });
        });

        const isFinishedTask = message.every((item) => item[1] === 0);

        if (isFinishedBoard && isFinishedTask) {
            this.clearLocalStorage();
            this.setResult();
            this.toMove = false;
            this.levelIsWon = true;
            this.levelIsFinished = true;
            this.forceUpdate();
        } else if (moves <= 0) {
            this.clearLocalStorage();
            this.toMove = false;
            this.levelIsFinished = true;
            this.forceUpdate();
        }
    }

    setResult() {
        const { level } = this.state;
        const { moves } = this.state.task;

        let result;

        if (localStorage.getItem('result')) {
            result = JSON.parse(localStorage.getItem('result'));
        } else {
            result = {};
        }

        if (result[level] && result[level] > 30 - moves) {
            result[level] = 30 - moves;
        } else if (!result[level]) { result[level] = 30 - moves; }

        localStorage.setItem('result', JSON.stringify(result));
    }

    setLocalStorage() {
        const { level, boardData, task } = this.state;

        localStorage.setItem(level, [JSON.stringify(boardData), JSON.stringify(task)]);
    }

    clearLocalStorage() {
        const { level } = this.state;

        localStorage.removeItem(level);
    }


    checkGameField(redraw = true, data) {
        let boardData = redraw ? JSON.parse(JSON.stringify(this.state.boardData)) : data;
        let someCellMarkedAsDeleted = false;
        let task = JSON.parse(JSON.stringify(this.state.task));

        const resultCheckObj = checkToDeleteCell(boardData, someCellMarkedAsDeleted);

        someCellMarkedAsDeleted = resultCheckObj.someCellMarkedAsDeleted;
        boardData = resultCheckObj.boardData;
        this.taskCheck = task;

        this.checkTask(boardData);

        this.checkBoardData = boardData;


        this.checkThreeRow();
        this.checkXMine();
        this.checkFirstMine();
        this.checkSecondMine();
        this.checkForFourAndFive(5);
        this.checkForFourAndFive(4);
        boardData = this.handleDelete(this.checkBoardData);


        if (redraw && !this.levelIsFinished) {
            this.toMove = true;
            this.setState({ boardData, task: this.taskCheck });
        }

        return someCellMarkedAsDeleted;
    }

    checkTask(boardData) {

        boardData.forEach((row) => {
            row.forEach((cell) => {
                 const index = this.taskCheck.message.findIndex((item) => item[0] === cell.type);
                 if (index !== -1 && cell.toDelete){
                     if (this.taskCheck.message[index][1] > 0) {
                        this.taskCheck.message[index][1] -= 1;
                     }
                 }
             });
         });
     }

    checkBonusTask(type) {
                 const index = this.taskCheck.message.findIndex((item) => type.includes(item[2]));
                 if (index !== -1 ){
                     if (this.taskCheck.message[index][1] > 0) {
                        this.taskCheck.message[index][1] -= 1;
                     }
                 }
    };

    checkObstaclesTask(cell){
        if (cell.isFrozen){
            const index = this.taskCheck.message.findIndex((item) => item[0] === 'ice');
                this.taskCheck.message[index][1] -= 1;
        } else if (cell.isDesk){
            const index = this.taskCheck.message.findIndex((item) => item[0] === 'desk');
                this.taskCheck.message[index][1] -= 1;
        } else if (cell.type === 'ground'){
            const index = this.taskCheck.message.findIndex((item) => item[0] === 'ground');
                this.taskCheck.message[index][1] -= 1;
                console.log(1);
    }
}

    getGameField(boardData) {
        return (
            <div
                onMouseMove={(event) => this.onMouseMove(event)}
                onMouseDown={(event) => this.onMouseDown(event)}
                onMouseUp={(event) => this.onMouseUp(event)}
            >
                <div
                    className="grid"
                    onDragStart={(e) => e.preventDefault()}
                    onDoubleClick={this.handleDoubleClick}
                >
                    <Board squares={boardData} background={true} />
                    <Board squares={boardData} />
                </div>
                <div
                    className="cell square fake cell-hidden"
                    style={{
                        backgroundImage: 'url(../images/yellow-candy.png)',
                    }}
                />
            </div>
        );
    }

    getBoardDataOfStartLevel(numberLevel) {
        const { boardData, taskText, moves } = checkNumberLevel(numberLevel);

        this.setState({ boardData, task: { moves, message: taskText }, level: numberLevel });
    }

    render() {
        const { score } = this.state;
        const { boardData } = this.state;

        return (
             <>
                <div className="menu">
                    <Link to="/" className="link">
                        <button className="menu-btn">pause_circle_outline</button>

                    </Link>
                </div>
                <div className="app">
                    <Menu/>
                    <Switch>
                        <Route path="/level">
                            <div>
                            <TaskBox
                                moves={this.state.task?.moves}
                                message={this.state.task?.message}
                            />
                            {this.getGameField(boardData)}
                            { (!this.levelIsWon && this.levelIsFinished) && <LoseScreen that={this} /> }
                            { (this.levelIsWon && this.levelIsFinished) && <WinScreen that={this} /> }
                            </div>
                        </Route>

                        <Route exact path="/">
                            <div onClick={({ target }) => this.getBoardDataOfStartLevel(target.dataset.level)}>
                                <LevelRoad />
                            </div>
                        </Route>
                    </Switch>
                </div>
            </>
        );
    }
}

export default App;
