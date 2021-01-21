// import App from "./App";
const candies = [
    'url(../images/red-candy.png)',
    'url(../images/yellow-candy.png)',
    'url(../images/orange-candy.png)',
    'url(../images/purple-candy.png)',
    'url(../images/green-candy.png)',
    'url(../images/blue-candy.png)',
];

const boardData = new Array(8).fill(null).map(() => new Array(8).fill({ type: 1 }).map(() => {
    const randColor = candies[Math.floor(Math.random() * 6)];

    return {
        url: randColor,
        type: candies.indexOf(randColor),
        toDelete: false,
        isFrozen: false,
    };
}));

function getBoardDataOfLevel1() {
    return boardData.map((row, rowId) => {
        return row.map((cell, cellId) => {
            if (rowId === 2 || rowId === 5) {
                if (cellId === 3 || cellId === 4) {
                    cell.isFrozen = true;
                    cell.url = cell.url.replace(/candy.png/, 'candy-ice.png');
                }
            }
            if (rowId === 3 || rowId === 4) {
                if (
                    cellId === 2
                    || cellId === 3
                    || cellId === 4
                    || cellId === 5
                ) {
                    cell.isFrozen = true;
                    cell.url = cell.url.replace(/candy.png/, 'candy-ice.png');
                }
            }
            return cell;
        });
    });
}

function checkNumberLevel(target) {
    // const { target } = event;
    // if (target.dataset.typeBtn !== "level") return;
    let boardData = [];
    const { level } = target.dataset;
    switch (level) {
    case '1':
        boardData = getBoardDataOfLevel1();
        break;
    case '2':
        boardData = getBoardDataOfLevel2();

        break;
    case '3':
        boardData = getBoardDataOfLevel3();

        break;
    case '4':
        boardData = getBoardDataOfLevel4();

        break;
    case '5':
        boardData = getBoardDataOfLevel5();

        break;
    case '6':
        boardData = getBoardDataOfLevel6();

        break;
    case '7':
        boardData = getBoardDataOfLevel7();

        break;

    default:
        break;
    }
    // console.log("event.target:>> ", event.target);
    // console.log("object :>> ", isClickButtonLevel);
    return boardData;
}

export default checkNumberLevel;
