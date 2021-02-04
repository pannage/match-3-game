const candies = [
    'url(../images/red-candy.png)',
    'url(../images/yellow-candy.png)',
    'url(../images/orange-candy.png)',
    'url(../images/purple-candy.png)',
    'url(../images/green-candy.png)',
    'url(../images/blue-candy.png)',
];

function getNewBoarDataOfGame() {
    return new Array(8).fill(null).map(() => new Array(8).fill({ type: 1 }).map(() => {
        const randColor = candies[Math.floor(Math.random() * 6)];

        return {
            url: randColor,
            type: candies.indexOf(randColor),
            toDelete: false,
            isFrozen: false,
        };
    }),);
}

function getBoardDataOfLevel1(boardData) {
    return boardData.map((row, rowId) => {
        return row.map((cell, cellId) => {
            if (rowId >= 1 && rowId <= 1 && cellId >= 1 && cellId <= 1) {
                cell.isDesk = true;
            }

            return cell;
        });
    });
}

function getBoardDataOfLevel2(boardData) {
    return boardData.map((row, rowId) => {
        return row.map((cell, cellId) => {
            if ((cellId === 0 && rowId !== 0) || (cellId === 7 && rowId !== 0) || rowId === 7) {
                cell.isFrozen = true;
                cell.url = cell.url.replace(/candy.png/, 'candy-ice.png');
            }

            if (cellId > 1 && cellId < 6 && rowId > 3 && rowId !== 7) {
                cell.isDesk = true;
            }

            return cell;
        });
    });
}

function getBoardDataOfLevel3(boardData) {
    return boardData.map((row, rowId) => {
        return row.map((cell, cellId) => {
            if (
                cellId === 0
            || (cellId === 1 && rowId > 1)
            || (cellId === 2 && rowId > 3)
            || (cellId === 3 && rowId > 5)
            ) {
                return {
                    url: 'url(../images/ground.png)',
                    type: 'ground',
                    toDelete: false,
                    isFrozen: false,
                };
            }

            if (cellId === 6 || cellId === 7) {
                cell.isDesk = true;
            }

            return cell;
        });
    });
}

function getBoardDataOfLevel4(boardData) {
    return boardData.map((row, rowId) => {
        return row.map((cell, cellId) => {
            if (
                cellId === 0
        || (cellId === 1 && rowId > 3)
        || (cellId === 6 && rowId > 3)
        || cellId === 7
            ) {
                return {
                    url: 'url(../images/ground.png)',
                    type: 'ground',
                    toDelete: false,
                    isFrozen: false,
                };
            }

            if (cellId > 1 && cellId < 6 && rowId > 3) {
                cell.isDesk = true;
            }

            return cell;
        });
    });
}

function getBoardDataOfLevel5(boardData) {
    return boardData.map((row, rowId) => {
        return row.map((cell, cellId) => {
            if (cellId === 0 || cellId === 7 || rowId === 7) {
                return {
                    url: 'url(../images/ground.png)',
                    type: 'ground',
                    toDelete: false,
                    isFrozen: false,
                };
            }

            if ((rowId === 2 || rowId === 3) && (cellId === 3 || cellId === 4)) {
                cell.isFrozen = true;
                cell.url = cell.url.replace(/candy.png/, 'candy-ice.png');
            }

            if (cellId >= 1 && cellId <= 6 && rowId > 3 && rowId !== 7) {
                cell.isDesk = true;
            }

            return cell;
        });
    });
}

function getBoardDataOfLevel6(boardData) {
    return boardData.map((row, rowId) => {
        return row.map((cell, cellId) => {
            if (rowId > 3 && (cellId === 0 || cellId === 1 || cellId === 6 || cellId === 7)) {
                cell.isFrozen = true;
                cell.url = cell.url.replace(/candy.png/, 'candy-ice.png');
            }

            if (
                (rowId > 1 && rowId < 6 && (cellId === 2 || cellId === 5))
                || ((rowId === 2 || rowId === 3) && (cellId === 3 || cellId === 4))
            ) {
                cell.isDesk = true;
            }

            if (
                ((rowId === 6 || rowId === 7) && cellId > 1 && cellId < 6)
                || ((rowId === 4 || rowId === 5) && (cellId === 3 || cellId === 4))
            ) {
                return {
                    url: 'url(../images/ground.png)',
                    type: 'ground',
                    toDelete: false,
                    isFrozen: false,
                };
            }

            return cell;
        });
    });
}

function getBoardDataOfLevel7(boardData) {
    return boardData.map((row, rowId) => {
        return row.map((cell, cellId) => {
            if (rowId > 1) {
                cell.isDesk = true;
            }

            if (
                (rowId > 4 && (cellId === 2 || cellId === 5))
        || (rowId > 3 && (cellId === 3 || cellId === 4))
        || rowId === 7
            ) {
                return {
                    url: 'url(../images/ground.png)',
                    type: 'ground',
                    toDelete: false,
                    isFrozen: false,
                };
            }

            if ((rowId === 2 || rowId === 3) && (cellId === 3 || cellId === 4)) {
                cell.isFrozen = true;
                cell.url = cell.url.replace(/candy.png/, 'candy-ice.png');
            }

            return cell;
        });
    });
}

function checkToDeleteCell(boardData, someCellMarkedAsDeleted) {
    boardData.forEach((rowArray, indexRow) => {
        rowArray.forEach((item, indexItem) => {
            if (item.type === 'ground') {
                return;
            }

            const leftCellType = rowArray[indexItem - 1] ? rowArray[indexItem - 1].type : null;
            const rightCellType = rowArray[indexItem + 1] ? rowArray[indexItem + 1].type : null;
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

    return { boardData, someCellMarkedAsDeleted };
}

function checkNumberLevel(numberLevel) {
    let result = {};

    let isCheckBoardData = false;
    let boardData = [];

    while (!isCheckBoardData) {
        boardData = getNewBoarDataOfGame();
        const resultCheckObj = checkToDeleteCell(boardData, isCheckBoardData);

        isCheckBoardData = !resultCheckObj.someCellMarkedAsDeleted;
        boardData = resultCheckObj.boardData;
    }

    switch (numberLevel) {
    case '1':
        result = {
            boardData: getBoardDataOfLevel1(boardData),
            taskText: [[0, 0], [3, 0], [5, 0], ['desk', 1]],
            moves: 30,
        };

        break;
    case '2':
        result = {
            boardData: getBoardDataOfLevel2(boardData),
            taskText: [[1, 20], [2, 20], [4, 20], ['desk', 12], ['ice', 20]],
            moves: 30,
        };

        break;
    case '3':
        result = {
            boardData: getBoardDataOfLevel3(boardData),
            taskText: [[6, 4, 'torpedo'], [7, 1, 'rainbow'], [8, 1, 'mine'], ['desk', 16], ['ground', 20]],
            moves: 30,
        };

        break;
    case '4':
        result = {
            boardData: getBoardDataOfLevel4(boardData),
            taskText: [[0, 20], [2, 20], [4, 20], ['desk', 16], ['ground', 24]],
            moves: 30,
        };
        break;
    case '5':
        result = {
            boardData: getBoardDataOfLevel5(boardData),
            taskText: [[1, 20], [3, 20], [5, 20], ['desk', 18], ['ground', 22], ['ice', 4]],
            moves: 30,
        };
        break;
    case '6':
        result = {
            boardData: getBoardDataOfLevel6(boardData),
            taskText: [[7, 2, 'rainbow'], ['ice', 16], ['ground', 12], ['desk', 12]],
            moves: 30,
        };
        break;
    case '7':
        result = {
            boardData: getBoardDataOfLevel7(boardData),
            taskText: [[0, 15], [5, 15], [7, 1, 'rainbow'], [8, 1, 'mine'], ['ice', 4], ['ground', 18], ['desk', 26]],
            moves: 30,
        };
        break;
    default:
        break;
    }

    return result;
}

export { checkNumberLevel, getNewBoarDataOfGame, checkToDeleteCell };
