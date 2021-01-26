const candies = [
  'url(../images/red-candy.png)',
  'url(../images/yellow-candy.png)',
  'url(../images/orange-candy.png)',
  'url(../images/purple-candy.png)',
  'url(../images/green-candy.png)',
  'url(../images/blue-candy.png)',
];

function getNewBoarDataOfGame() {
  return new Array(8).fill(null).map(() =>
    new Array(8).fill({ type: 1 }).map(() => {
      const randColor = candies[Math.floor(Math.random() * 6)];

      return {
        url: randColor,
        type: candies.indexOf(randColor),
        toDelete: false,
        isFrozen: false,
      };
    }),
  );
}

function getBoardDataOfLevel1() {
  return getNewBoarDataOfGame().map((row, rowId) => {
    return row.map((cell, cellId) => {
      if (rowId >= 1 && rowId <= 6 && cellId >= 1 && cellId <= 6) {
        cell.isDesk = true;
      }

      return cell;
    });
  });
}

function getBoardDataOfLevel2() {
  return getNewBoarDataOfGame().map((row, rowId) => {
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

function getBoardDataOfLevel3() {
  return getNewBoarDataOfGame().map((row, rowId) => {
    return row.map((cell, cellId) => {
      if (
        cellId === 0 ||
        (cellId === 1 && rowId > 1) ||
        (cellId === 2 && rowId > 3) ||
        (cellId === 3 && rowId > 5)
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

function getBoardDataOfLevel4() {
  return getNewBoarDataOfGame().map((row, rowId) => {
    return row.map((cell, cellId) => {
      if (
        cellId === 0 ||
        (cellId === 1 && rowId > 3) ||
        (cellId === 6 && rowId > 3) ||
        cellId === 7
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

function getBoardDataOfLevel5() {
  return getNewBoarDataOfGame().map((row, rowId) => {
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

function getBoardDataOfLevel6() {
  return getNewBoarDataOfGame().map((row, rowId) => {
    return row.map((cell, cellId) => {
      if (rowId > 3 && (cellId === 0 || cellId === 1 || cellId === 6 || cellId === 7)) {
        cell.isFrozen = true;
        cell.url = cell.url.replace(/candy.png/, 'candy-ice.png');
      }

      if (
        (rowId > 1 && rowId < 6 && (cellId === 2 || cellId === 5)) ||
        ((rowId === 2 || rowId === 3) && (cellId === 3 || cellId === 4))
      ) {
        cell.isDesk = true;
      }
      if (
        ((rowId === 6 || rowId === 7) && cellId > 1 && cellId < 6) ||
        ((rowId === 4 || rowId === 5) && (cellId === 3 || cellId === 4))
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

function getBoardDataOfLevel7() {
  return getNewBoarDataOfGame().map((row, rowId) => {
    return row.map((cell, cellId) => {
      if (rowId > 1) {
        cell.isDesk = true;
      }
      if (
        (rowId > 4 && (cellId === 2 || cellId === 5)) ||
        (rowId > 3 && (cellId === 3 || cellId === 4)) ||
        rowId === 7
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

function checkNumberLevel(target) {
  let result = {};

  const { level } = target.dataset;

  switch (level) {
    case '1':
      result = {
        boardData: getBoardDataOfLevel1(),
        taskText: 'delete 10 red',
        moves: 30,
      };

      break;
    case '2':
      result = {
        boardData: getBoardDataOfLevel2(),
        taskText: '30 turns',
        moves: 30,
      };

      break;
    case '3':
      result = {
        boardData: getBoardDataOfLevel3(),
        taskText: 'delete 10 red',
        moves: 30,
      };

      break;
    case '4':
      result = {
        boardData: getBoardDataOfLevel4(),
        taskText: 'delete 10 red',
        moves: 30,
      };
      break;
    case '5':
      result = {
        boardData: getBoardDataOfLevel5(),
        taskText: 'delete 10 red',
        moves: 30,
      };
      break;
    case '6':
      result = {
        boardData: getBoardDataOfLevel6(),
        taskText: 'delete 10 red',
        moves: 30,
      };
      break;
    case '7':
      result = {
        boardData: getBoardDataOfLevel7(),
        taskText: 'delete 10 red',
        moves: 30,
      };
      break;
    default:
      break;
  }

  return result;
}

export default checkNumberLevel;
