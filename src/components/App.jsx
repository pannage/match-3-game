import React from 'react';
import PropTypes from 'prop-types';
import '../styles/App.css';
import Board from './Board.jsx';
import LevelRoad from './levels.jsx';
import TaskBox from './task-box.jsx';
import checkNumberLevel from './loadLevels';

// function CreateScore(props) {
//     const { score } = props;
//     return (
//         <div className="score-board">
//             <h3>score</h3>
//             <h1 id="score">{score}</h1>
//         </div>
//     );
// }
// CreateScore.propTypes = {
//     score: PropTypes.number.isRequired,
// };

// const candies = [
//     'url(../images/red-candy.png)',
//     'url(../images/yellow-candy.png)',
//     'url(../images/orange-candy.png)',
//     'url(../images/purple-candy.png)',
//     'url(../images/green-candy.png)',
//     'url(../images/blue-candy.png)',
// ];

// const boardArray = new Array(8).fill(null).map(() => new Array(8).fill({ type: 1 }).map(() => {
//     const randColor = candies[Math.floor(Math.random() * 6)];
//     return {
//         url: randColor,
//         type: candies.indexOf(randColor),
//         toDelete: false,
//         isFrozen: false,
//     };
// }));

// TODO здесь создаётся массив для замороженных ячеек
// boardArray = boardArray.map((row, rowId) => {
//     return row.map((cell, cellId) => {
//         if (rowId === 2 || rowId === 5) {
//             if (cellId === 3 || cellId === 4) {
//                 cell.isFrozen = true;
//                 cell.url = cell.url.replace(/candy.png/, 'candy-ice.png');
//             }
//         }
//         if (rowId === 3 || rowId === 4) {
//             if (cellId === 2 || cellId === 3 || cellId === 4 || cellId === 5) {
//                 cell.isFrozen = true;
//                 cell.url = cell.url.replace(/candy.png/, 'candy-ice.png');
//             }
//         }
//         return cell;
//     });
// });

// TODO здесь создаётся массив для земли
// boardArray = boardArray.map((row, rowId) => {
//     return row.map((cell, cellId) => {
//         if (rowId === 2 || rowId === 5) {
//             if (cellId === 3 || cellId === 4)
//                 return {
//                     url: "url(../images/ground.png)",
//                     type: "ground",
//                     toDelete: false,
//                     isFrozen: false,
//                 };
//         }
//         if (rowId === 3 || rowId === 4) {
//             if (cellId === 2 || cellId === 3 || cellId === 4 || cellId === 5)
//                 return {
//                     url: "url(../images/ground.png)",
//                     type: "ground",
//                     toDelete: false,
//                     isFrozen: false,
//                 };
//         }
//         return cell;
//     });
// });

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

    this.state = {
      score: 0,
      boardData: [],
      isClickButtonLevel: false,
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
    this.startBonusRainbow = this.startBonusRainbow.bind(this);
    this.openLevelRoad = this.openLevelRoad.bind(this);
    this.getGameField = this.getGameField.bind(this);
  }

  componentDidMount() {
    // this.checkGameField();
  }

  componentDidUpdate(prevProps, prevState) {
    if (JSON.stringify(prevState.boardData) !== JSON.stringify(this.state.boardData)) {
      setTimeout(this.moveIntoSquareBelow, 100);
    }
  }

  checkColumn(cell, boardData) {
    for (let i = cell.y; i < 8; i += 1) {
      if (boardData[i][cell.x].type === 'ground') {
        boardData[i][cell.x].toDelete = true;
        i = 8;
      } else {
        boardData[i][cell.x].toDelete = true;
      }
    }

    for (let i = cell.y; i >= 0; i -= 1) {
      if (boardData[i][cell.x].type === 'ground') {
        boardData[i][cell.x].toDelete = true;
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
        boardData[cell.y][i].toDelete = true;
        i = 8;
      } else {
        boardData[cell.y][i].toDelete = true;
      }
    }

    for (let i = cell.x; i >= 0; i -= 1) {
      if (boardData[cell.y][i].type === 'ground') {
        boardData[cell.y][i].toDelete = true;
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
            } else e.preventDefault();

            break;
      case 'mine':
        boardData[cell.y][cell.x].toDelete = true;

        if (boardData[cell.y][cell.x + 1]) {
          boardData[cell.y][cell.x + 1].toDelete = true;
        }

        if (boardData[cell.y + 1] && boardData[cell.y + 1][cell.x + 1]) {
          boardData[cell.y + 1][cell.x + 1].toDelete = true;
        }

        if (boardData[cell.y + 1]) {
          boardData[cell.y + 1][cell.x].toDelete = true;
        }

        if (boardData[cell.y + 1] && boardData[cell.y + 1][cell.x - 1]) {
          boardData[cell.y + 1][cell.x - 1].toDelete = true;
        }

        if (boardData[cell.y][cell.x - 1]) {
          boardData[cell.y][cell.x - 1].toDelete = true;
        }

        if (boardData[cell.y - 1] && boardData[cell.y - 1][cell.x - 1]) {
          boardData[cell.y - 1][cell.x - 1].toDelete = true;
        }

        if (boardData[cell.y - 1]) {
          boardData[cell.y - 1][cell.x].toDelete = true;
        }

        if (boardData[cell.y - 1] && boardData[cell.y - 1][cell.x + 1]) {
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
        if (!e.target.redraw) {e.preventDefault();}

        break;
    }

    if (e.target.redraw) {
      return boardData;
    }

    this.setState({ boardData });
  }

  onMouseDown(e) {
    if (e.target.classList.contains('cell')) {
      this.cellToDrag = {
        y: e.target.dataset.rowIndex,
        x: e.target.dataset.cellIndex,
      };

      if (
        this.state.boardData[this.cellToDrag.y][this.cellToDrag.x].type === 'ground' ||
        this.state.boardData[this.cellToDrag.y][this.cellToDrag.x].isFrozen
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
        ].isFrozen
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

  // dragEnd() {
  //     if (!this.cellToDrag) return;

  //     let { boardData } = this.state;

  //     if (this.cellToReplace !== undefined) {
  //         if (

  //             boardData[this.cellToDrag.y][this.cellToDrag.x].type
  //             === 'rainbow'
  //         ) {
  //             boardData = this.startBonusRainbow(boardData);
  //         } else {
  //             const changeSqr = boardData[this.cellToReplace.y][this.cellToReplace.x];
  //             boardData[this.cellToReplace.y][this.cellToReplace.x] = boardData[this.cellToDrag.y][this.cellToDrag.x];
  //             boardData[this.cellToDrag.y][this.cellToDrag.x] = changeSqr;
  //         }
  //     }
  //     this.setState({ boardData }, () => this.checkGameField());
  //     this.cellToReplace = undefined;
  // }

  // dragEnd() {
  //     if (!this.cellToDrag) return;
  //     const movementVector = {
  //         x: this.cellToReplace.x - this.cellToDrag.x,
  //         y: this.cellToReplace.y - this.cellToDrag.y,
  //     };

  //     let bonusUsed = false;

  //     const isMoveValid = Math.abs(movementVector.x) + Math.abs(movementVector.y) < 2;

  //     let boardData = JSON.parse(JSON.stringify(this.state.boardData));

  //     if ((boardData[this.cellToDrag.y][this.cellToDrag.x].type
  //         === 'rainbow'
  //         && this.cellToDrag.y !== this.cellToReplace.y)
  //         || this.cellToDrag.y.isFrozen !== this.cellToReplace.y.isFrozen) {
  //         boardData = this.startBonusRainbow(boardData);
  //     } else if (this.cellToReplace !== undefined && isMoveValid) {
  //         const changeSqr = boardData[this.cellToReplace.y][this.cellToReplace.x];
  //         boardData[this.cellToReplace.y][this.cellToReplace.x] = boardData[this.cellToDrag.y][this.cellToDrag.x];
  //         boardData[this.cellToDrag.y][this.cellToDrag.x] = changeSqr;

  //         if (typeof boardData[this.cellToDrag.y][this.cellToDrag.x].type
  //             !== 'number') {
  //             bonusUsed = true;
  //             const dragBonusEvent = {
  //                 target: {
  //                     dataset: {
  //                         rowIndex: this.cellToDrag.y,
  //                         cellIndex: this.cellToDrag.x,
  //                     },
  //                     rainbowSet: {
  //                         rowIndex: this.cellToReplace.y,
  //                         cellIndex: this.cellToReplace.x,
  //                     },
  //                     redraw: true,
  //                 },
  //             };
  //             boardData = this.handleDoubleClick(dragBonusEvent, boardData);
  //         } else if (typeof boardData[this.cellToReplace.y][this.cellToReplace.x].type
  //             !== 'number') {
  //             bonusUsed = true;
  //             const dragBonusEvent = {
  //                 target: {
  //                     dataset: {
  //                         rowIndex: this.cellToReplace.y,
  //                         cellIndex: this.cellToReplace.x,
  //                     },
  //                     rainbowSet: {
  //                         rowIndex: this.cellToDrag.y,
  //                         cellIndex: this.cellToDrag.x,
  //                     },
  //                     redraw: true,
  //                 },
  //             };
  //             boardData = this.handleDoubleClick(dragBonusEvent, boardData);
  //         }
  //     }

  //     const isMatch3 = this.checkGameField(false, boardData);
  //     if (!isMatch3 && !bonusUsed) {
  //         if (this.cellToReplace !== undefined && isMoveValid) {
  //             const changeSqr = boardData[this.cellToReplace.y][this.cellToReplace.x];
  //             boardData[this.cellToReplace.y][this.cellToReplace.x] = boardData[this.cellToDrag.y][this.cellToDrag.x];
  //             boardData[this.cellToDrag.y][this.cellToDrag.x] = changeSqr;
  //         }
  //     } else {
  //         this.checkGameField();
  //     }

  //     this.setState({ boardData }, () => this.checkGameField());
  //     this.cellToReplace = undefined;
  // }

  dragEnd() {
    if (!this.cellToDrag) {return;}
    if (this.cellToDrag.x === this.cellToReplace.x && this.cellToDrag.y === this.cellToReplace.y) return;

    const movementVector = {
      x: this.cellToReplace.x - this.cellToDrag.x,
      y: this.cellToReplace.y - this.cellToDrag.y,
    };

    let bonusUsed = false;

    const isMoveValid = Math.abs(movementVector.x) + Math.abs(movementVector.y) < 2;

    let boardData = JSON.parse(JSON.stringify(this.state.boardData));

    if (this.cellToReplace !== undefined && isMoveValid) {
      const changeSqr = boardData[this.cellToReplace.y][this.cellToReplace.x];

      boardData[this.cellToReplace.y][this.cellToReplace.x] =
        boardData[this.cellToDrag.y][this.cellToDrag.x];
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

        boardData[this.cellToReplace.y][this.cellToReplace.x] =
          boardData[this.cellToDrag.y][this.cellToDrag.x];
        boardData[this.cellToDrag.y][this.cellToDrag.x] = changeSqr;
      }
    } else {
      this.cellToReplace = undefined;
      this.setState({ boardData });
    }
  }

  startBonusRainbow(boardData) {
    const colorCell = boardData[this.cellToDrag.y][this.cellToDrag.x].type;

    const newBoardData = boardData.map((row) => {
      return row.map((item) => {
        if (colorCell === item.type) {
          item.toDelete = true;
        }

        return item;
      });
    });

    newBoardData[this.cellToReplace.y][this.cellToReplace.x].toDelete = true;

    return newBoardData;
  }

  checkForEmptyUnderIce(rowIndex, cellIndex, boardData) {
    let checkData = {
        result: false,
    };
    for (let i = rowIndex + 2; i < 8; i++){
        if (boardData[i][cellIndex].type === 'empty' &&
        boardData[i-1][cellIndex].isFrozen){
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
                };
            }
            if (
                boardData[rowIndex + 1]
                && boardData[rowIndex + 1][cellIndex].type === 'empty'
                && cell.type !== 'ground' && !cell.isFrozen
            ) {     const changeCell = boardData[rowIndex + 1][cellIndex];
                    boardData[rowIndex + 1][cellIndex] = cell;
                return changeCell;
            } else if (boardData[rowIndex + 1] && boardData[rowIndex + 1][cellIndex - 1]
                && boardData[rowIndex + 1][cellIndex - 1].type === 'empty'
                && boardData[rowIndex][cellIndex - 1].type === 'ground'
                && cell.type !== 'ground') {
                const changeCell = boardData[rowIndex + 1][cellIndex - 1];
                boardData[rowIndex + 1][cellIndex - 1] = cell;
                return changeCell;
            } else if (boardData[rowIndex + 1] && boardData[rowIndex + 1][cellIndex + 1]
                && boardData[rowIndex + 1][cellIndex + 1].type === 'empty'
                && boardData[rowIndex][cellIndex + 1].type === 'ground'
                && cell.type !== 'ground') {
                const changeCell = boardData[rowIndex + 1][cellIndex + 1];
                boardData[rowIndex + 1][cellIndex + 1] = cell;
                return changeCell;
            } else if (boardData[rowIndex + 1] && boardData[rowIndex + 1][cellIndex - 1]
                && boardData[rowIndex + 1][cellIndex - 1].type === 'empty' && cell.type !== 'ground'
                && boardData[rowIndex][cellIndex - 1].type === 'empty' && boardData[rowIndex - 1]
                && boardData[rowIndex - 1][cellIndex - 1].type === 'ground'
            ) {
                const changeCell = boardData[rowIndex + 1][cellIndex - 1];
                boardData[rowIndex + 1][cellIndex - 1] = cell;
                return changeCell;
            } else if (boardData[rowIndex + 1] && boardData[rowIndex + 1][cellIndex + 1]
                    && boardData[rowIndex + 1][cellIndex + 1].type === 'empty' && cell.type !== 'ground'
                    && boardData[rowIndex][cellIndex + 1].type === 'empty' && boardData[rowIndex - 1]
                    && boardData[rowIndex - 1][cellIndex + 1].type === 'ground'
            ) {
                const changeCell = boardData[rowIndex + 1][cellIndex + 1];
                boardData[rowIndex + 1][cellIndex + 1] = cell;
                return changeCell;
            } else if (boardData[rowIndex + 1] && boardData[rowIndex + 1][cellIndex].isFrozen
                && !cell.isFrozen){
                const checkData = this.checkForEmptyUnderIce(rowIndex, cellIndex, boardData);
                if (checkData.result) {
                    const changeCell = boardData[checkData.emptyRow][cellIndex];
                    boardData[checkData.emptyRow][cellIndex] = cell;
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

        const checkVertical =
          bd[rowId + 1] &&
          bd[rowId - 1] &&
          bd[rowId + 1][cellIndex].type === bd[rowId][cellIndex].type &&
          bd[rowId - 1][cellIndex].type === bd[rowId][cellIndex].type;

        const checkHorizontal =
          bd[rowId][cellIndex + 1] &&
          bd[rowId][cellIndex - 1] &&
          bd[rowId][cellIndex + 1].type === bd[rowId][cellIndex].type &&
          bd[rowId][cellIndex - 1].type === bd[rowId][cellIndex].type;

        if (checkVertical) {
          const checkRight =
            bd[rowId][cellIndex + 1] &&
            bd[rowId][cellIndex + 2] &&
            bd[rowId][cellIndex + 1].type === bd[rowId][cellIndex].type &&
            bd[rowId][cellIndex + 2].type === bd[rowId][cellIndex].type;

          const checkLeft =
            bd[rowId][cellIndex - 1] &&
            bd[rowId][cellIndex - 2] &&
            bd[rowId][cellIndex - 1].type === bd[rowId][cellIndex].type &&
            bd[rowId][cellIndex - 2].type === bd[rowId][cellIndex].type;

          if (checkRight || checkLeft) {
            accumBoard[rowId][cellIndex] = {
              url: 'url(../images/mine.png)',
              type: 'mine',
              toDelete: false,
              isFrozen: false,
            };
          } else {accumBoard[rowId][cellIndex] = { ...cell };}
        } else if (checkHorizontal) {
          const checkBot =
            bd[rowId + 1] &&
            bd[rowId + 2] &&
            bd[rowId + 1][cellIndex].type === bd[rowId][cellIndex].type &&
            bd[rowId + 2][cellIndex].type === bd[rowId][cellIndex].type;

          const checkTop =
            bd[rowId - 1] &&
            bd[rowId - 2] &&
            bd[rowId - 1][cellIndex].type === bd[rowId][cellIndex].type &&
            bd[rowId - 2][cellIndex].type === bd[rowId][cellIndex].type;

          if (checkBot || checkTop) {
            accumBoard[rowId][cellIndex] = {
              url: 'url(../images/mine.png)',
              type: 'mine',
              toDelete: false,
              isFrozen: false,
            };
          } else {accumBoard[rowId][cellIndex] = { ...cell };}
        } else {accumBoard[rowId][cellIndex] = { ...cell };}
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

        const checkBot =
          bd[rowId + 1] &&
          bd[rowId + 2] &&
          bd[rowId + 1][cellIndex].type === bd[rowId][cellIndex].type &&
          bd[rowId + 2][cellIndex].type === bd[rowId][cellIndex].type;

        const checkTop =
          bd[rowId - 1] &&
          bd[rowId - 2] &&
          bd[rowId - 1][cellIndex].type === bd[rowId][cellIndex].type &&
          bd[rowId - 2][cellIndex].type === bd[rowId][cellIndex].type;

        if (checkBot || checkTop) {
          const checkRight =
            bd[rowId][cellIndex + 1] &&
            bd[rowId][cellIndex + 2] &&
            bd[rowId][cellIndex + 1].type === bd[rowId][cellIndex].type &&
            bd[rowId][cellIndex + 2].type === bd[rowId][cellIndex].type;

          const checkLeft =
            bd[rowId][cellIndex - 1] &&
            bd[rowId][cellIndex - 2] &&
            bd[rowId][cellIndex - 1].type === bd[rowId][cellIndex].type &&
            bd[rowId][cellIndex - 2].type === bd[rowId][cellIndex].type;

          if (checkRight || checkLeft) {
            accumBoard[rowId][cellIndex] = {
              url: 'url(../images/mine.png)',
              type: 'mine',
              toDelete: false,
              isFrozen: false,
            };
          } else {accumBoard[rowId][cellIndex] = { ...cell };}
        } else {accumBoard[rowId][cellIndex] = { ...cell };}
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

        const checkVerticalBot =
          bd[rowId + 1] &&
          bd[rowId + 2] &&
          bd[rowId - 1] &&
          bd[rowId + 1][cellIndex].type === bd[rowId][cellIndex].type &&
          bd[rowId + 2][cellIndex].type === bd[rowId][cellIndex].type &&
          bd[rowId - 1][cellIndex].type === bd[rowId][cellIndex].type;

        const checkVerticalTop =
          bd[rowId - 1] &&
          bd[rowId - 2] &&
          bd[rowId + 1] &&
          bd[rowId - 1][cellIndex].type === bd[rowId][cellIndex].type &&
          bd[rowId - 2][cellIndex].type === bd[rowId][cellIndex].type &&
          bd[rowId + 1][cellIndex].type === bd[rowId][cellIndex].type;

        const checkHorizontalLeft =
          bd[rowId][cellIndex + 1] &&
          bd[rowId][cellIndex + 2] &&
          bd[rowId][cellIndex - 1] &&
          bd[rowId][cellIndex + 1].type === bd[rowId][cellIndex].type &&
          bd[rowId][cellIndex + 2].type === bd[rowId][cellIndex].type &&
          bd[rowId][cellIndex - 1].type === bd[rowId][cellIndex].type;

        const checkHorizontalRight =
          bd[rowId][cellIndex - 1] &&
          bd[rowId][cellIndex - 2] &&
          bd[rowId][cellIndex + 1] &&
          bd[rowId][cellIndex - 1].type === bd[rowId][cellIndex].type &&
          bd[rowId][cellIndex - 2].type === bd[rowId][cellIndex].type &&
          bd[rowId][cellIndex + 1].type === bd[rowId][cellIndex].type;

        if (checkVerticalBot || checkVerticalTop) {
          const checkPositionLeft =
            bd[rowId][cellIndex + 1] &&
            bd[rowId][cellIndex + 2] &&
            bd[rowId][cellIndex + 1].type === bd[rowId][cellIndex].type &&
            bd[rowId][cellIndex + 2].type === bd[rowId][cellIndex].type;

          const checkPositionMiddle =
            bd[rowId][cellIndex - 1] &&
            bd[rowId][cellIndex + 1] &&
            bd[rowId][cellIndex - 1].type === bd[rowId][cellIndex].type &&
            bd[rowId][cellIndex + 1].type === bd[rowId][cellIndex].type;

          const checkPositionRight =
            bd[rowId][cellIndex - 1] &&
            bd[rowId][cellIndex - 2] &&
            bd[rowId][cellIndex - 1].type === bd[rowId][cellIndex].type &&
            bd[rowId][cellIndex - 2].type === bd[rowId][cellIndex].type;

          if (checkPositionLeft || checkPositionMiddle || checkPositionRight) {
            accumBoard[rowId][cellIndex] = {
              url: 'url(../images/x-bomb.png)',
              type: 'x-mine',
              toDelete: false,
              isFrozen: false,
            };
          } else {accumBoard[rowId][cellIndex] = { ...cell };}
        } else if (checkHorizontalLeft || checkHorizontalRight) {
          const checkPositionTop =
            bd[rowId - 1] &&
            bd[rowId - 2] &&
            bd[rowId - 1][cellIndex].type === bd[rowId][cellIndex].type &&
            bd[rowId - 2][cellIndex].type === bd[rowId][cellIndex].type;

          const checkPositionMiddle =
            bd[rowId + 1] &&
            bd[rowId - 1] &&
            bd[rowId + 1][cellIndex].type === bd[rowId][cellIndex].type &&
            bd[rowId - 1][cellIndex].type === bd[rowId][cellIndex].type;

          const checkPositionBot =
            bd[rowId + 1] &&
            bd[rowId + 2] &&
            bd[rowId + 1][cellIndex].type === bd[rowId][cellIndex].type &&
            bd[rowId + 2][cellIndex].type === bd[rowId][cellIndex].type;

          if (checkPositionTop || checkPositionMiddle || checkPositionBot) {
            accumBoard[rowId][cellIndex] = {
              url: 'url(../images/x-bomb.png)',
              type: 'x-mine',
              toDelete: false,
              isFrozen: false,
            };
          } else {accumBoard[rowId][cellIndex] = { ...cell };}
        } else {accumBoard[rowId][cellIndex] = { ...cell };}
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

        const checkVertical =
          bd[rowId + 1] &&
          bd[rowId + 2] && // top
          bd[rowId + 1][cellIndex].type === bd[rowId][cellIndex].type &&
          bd[rowId + 2][cellIndex].type === bd[rowId][cellIndex].type &&
          bd[rowId - 1] &&
          bd[rowId - 2] && // bottom
          bd[rowId - 1][cellIndex].type === bd[rowId][cellIndex].type &&
          bd[rowId - 2][cellIndex].type === bd[rowId][cellIndex].type;

        const checkHorizontal =
          bd[rowId][cellIndex + 1] &&
          bd[rowId][cellIndex + 2] && // right
          bd[rowId][cellIndex + 1].type === bd[rowId][cellIndex].type &&
          bd[rowId][cellIndex + 2].type === bd[rowId][cellIndex].type &&
          bd[rowId][cellIndex - 1] &&
          bd[rowId][cellIndex - 2] && // left
          bd[rowId][cellIndex - 1].type === bd[rowId][cellIndex].type &&
          bd[rowId][cellIndex - 2].type === bd[rowId][cellIndex].type;

        if (checkVertical) {
          const checkPositionLeft =
            bd[rowId][cellIndex + 1] &&
            bd[rowId][cellIndex + 2] &&
            bd[rowId][cellIndex + 1].type === bd[rowId][cellIndex].type &&
            bd[rowId][cellIndex + 2].type === bd[rowId][cellIndex].type;

          const checkPositionMiddle =
            bd[rowId][cellIndex - 1] &&
            bd[rowId][cellIndex + 1] &&
            bd[rowId][cellIndex - 1].type === bd[rowId][cellIndex].type &&
            bd[rowId][cellIndex + 1].type === bd[rowId][cellIndex].type;

          const checkPositionRight =
            bd[rowId][cellIndex - 1] &&
            bd[rowId][cellIndex - 2] &&
            bd[rowId][cellIndex - 1].type === bd[rowId][cellIndex].type &&
            bd[rowId][cellIndex - 2].type === bd[rowId][cellIndex].type;

          if (checkPositionLeft || checkPositionMiddle || checkPositionRight) {
            accumBoard[rowId][cellIndex] = {
              url: 'url(../images/xx-bomb.png)',
              type: 'three-row',
              toDelete: false,
              isFrozen: false,
            };
          } else {accumBoard[rowId][cellIndex] = { ...cell };}
        } else if (checkHorizontal) {
          const checkPositionTop =
            bd[rowId - 1] &&
            bd[rowId - 2] &&
            bd[rowId - 1][cellIndex].type === bd[rowId][cellIndex].type &&
            bd[rowId - 2][cellIndex].type === bd[rowId][cellIndex].type;

          const checkPositionMiddle =
            bd[rowId + 1] &&
            bd[rowId - 1] &&
            bd[rowId + 1][cellIndex].type === bd[rowId][cellIndex].type &&
            bd[rowId - 1][cellIndex].type === bd[rowId][cellIndex].type;

          const checkPositionBot =
            bd[rowId + 1] &&
            bd[rowId + 2] &&
            bd[rowId + 1][cellIndex].type === bd[rowId][cellIndex].type &&
            bd[rowId + 2][cellIndex].type === bd[rowId][cellIndex].type;

          if (checkPositionTop || checkPositionMiddle || checkPositionBot) {
            accumBoard[rowId][cellIndex] = {
              url: 'url(../images/xx-bomb.png)',
              type: 'three-row',
              toDelete: false,
              isFrozen: false,
            };
          } else {accumBoard[rowId][cellIndex] = { ...cell };}
        } else {accumBoard[rowId][cellIndex] = { ...cell };}
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
              if (cell.type === 'ground') {return false;}

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
            urlImageTorpedaRow,
            typeBonusOfRow,
          );

          for (let index = 0; index < sizeCheckRow; index += 1) {
            row[cellIndex + index] = arrayRowOfFourOrFive[index];
          }
        }

        if (arrayColumnOfFourOrFive) {
          arrayColumnOfFourOrFive = getCheckArray(
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
    const newBoardData = boardData.map((row, rowId) => {
      return row.map((cell, cellId) => {
        const condition =
          cell.type === 'ground' &&
          ((boardData[rowId - 1] &&
            boardData[rowId - 1][cellId].toDelete &&
            boardData[rowId - 1][cellId].type !== 'ground') ||
            (boardData[rowId + 1] &&
              boardData[rowId + 1][cellId].toDelete &&
              boardData[rowId + 1][cellId].type !== 'ground') ||
            (boardData[rowId][cellId + 1] &&
              boardData[rowId][cellId + 1].toDelete &&
              boardData[rowId][cellId + 1].type !== 'ground') ||
            (boardData[rowId][cellId - 1] &&
              boardData[rowId][cellId - 1].toDelete &&
              boardData[rowId][cellId - 1].type !== 'ground'));

        if (condition) {
          cell.toDelete = true;
        }

        return cell;
      });
    });

    boardData = newBoardData.map((row) => {
      return row.map((cell) => {
        if (cell.toDelete) {
          if (cell.isFrozen) {
            return {
              url: cell.url.replace(/candy-ice.png/, 'candy.png'),
              type: cell.type,
              toDelete: false,
              isFrozen: false,
            };
          }

          return {
            url: '',
            type: 'empty',
            toDelete: false,
            isFrozen: false,
          };
        }

        return cell;
      });
    });

    return boardData;
  }

  checkGameField(redraw = true, data) {
    let boardData = redraw ? JSON.parse(JSON.stringify(this.state.boardData)) : data;
    let someCellMarkedAsDeleted = false;

    boardData.forEach((rowArray, indexRow) => {
      rowArray.forEach((item, indexItem) => {
        if (item.type === 'ground') {return;}

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

    this.checkBoardData = boardData;
    this.checkThreeRow();
    this.checkXMine();
    this.checkFirstMine();
    this.checkSecondMine();
    this.checkForFourAndFive(5);
    this.checkForFourAndFive(4);

    boardData = this.handleDelete(this.checkBoardData);

    if (redraw) {
      this.setState({ boardData });
    }

    return someCellMarkedAsDeleted;
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

  getBoardDataOfStartLevel(target, isClickButtonLevel) {
    if (target.dataset.typeBtn !== 'level') {return;}

    const isActiveLevel = !isClickButtonLevel;
    const { boardData, taskText, moves } = checkNumberLevel(target);

    this.setState({ boardData, isClickButtonLevel: isActiveLevel, task: { moves, message: taskText } });
  }

  openLevelRoad() {
    this.setState({ isClickButtonLevel: false });
  }

  render() {
    const { score } = this.state;
    const { boardData, isClickButtonLevel } = this.state;

    return (
        <>
        <div className="menu">
          <button className="menu-btn" onClick={() => this.openLevelRoad()} />
        </div>
        <div className="app">
          <div
            onClick={({ target }) =>
              this.getBoardDataOfStartLevel(target, isClickButtonLevel)
            }
          >
              {isClickButtonLevel && <TaskBox moves={this.state.task?.moves} message={this.state.task?.message}/>}
            {!isClickButtonLevel ? <LevelRoad /> : this.getGameField(boardData)}
          </div>

          {/* <CreateScore score={score} /> */}
        </div>
        </>
    );
  }
}

export default App;
