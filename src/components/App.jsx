import React from 'react';
import PropTypes from 'prop-types';
import '../styles/App.css';

const CreateBoard = React.memo((props) => {
    const squaresArray = [];

    let colorBeingDragged;
    let colorBeingReplaced;
    let squareIdBeingDragged;
    let squareIdBeingReplaced;

    function dragStart(e) {
        colorBeingDragged = e.target.style.backgroundImage;
        squareIdBeingDragged = parseInt(e.target.id, 10);
    }

    function dragOver(e) {
        e.preventDefault();
    }

    function dragEnter(e) {
        e.preventDefault();
    }

    function dragLeave(e) {
        e.preventDefault();
    }

    function dragDrop(e) {
        const squares = document.querySelectorAll('.square');
        colorBeingReplaced = e.target.style.backgroundImage;
        squareIdBeingReplaced = parseInt(e.target.id, 10);
        e.target.style.backgroundImage = colorBeingDragged;
        squares[squareIdBeingDragged].style.backgroundImage = colorBeingReplaced;
    }

    function dragEnd() {
        const validMoves = [
            squareIdBeingDragged - 1,
            squareIdBeingDragged - props.width,
            squareIdBeingDragged + 1,
            squareIdBeingDragged + props.width,
        ];
        let validMove = validMoves.indexOf(squareIdBeingReplaced);
        if (validMove === 0) {
            if (squareIdBeingReplaced % props.width === 7) validMove = -1;
        } else if (validMove === 2) {
            if (squareIdBeingReplaced % props.width === 0) validMove = -1;
        }
        const squares = document.querySelectorAll('.square');
        if (squareIdBeingReplaced !== undefined && validMove !== -1) {
            squareIdBeingReplaced = null;
        } else if (squareIdBeingReplaced !== undefined && validMove === -1) {
            squares[squareIdBeingReplaced].style.backgroundImage = colorBeingReplaced;
            squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged;
        } else {
            squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged;
        }
    }

    for (let i = 0; i < props.width ** 2; i += 1) {
        const randomColor = Math.floor(Math.random() * props.candyColors.length);
        const square = <div draggable id={i} className="square" onDragStart={dragStart} onDragEnd={dragEnd} onDragOver={dragOver} onDragEnter={dragEnter} onDragLeave={dragLeave} onDrop={dragDrop} key={i} style={{ backgroundImage: props.candyColors[randomColor] }} />;
        squaresArray.push(square);
    }

    return (<div className="grid">{squaresArray}</div>);
});

CreateBoard.propTypes = {
    width: PropTypes.number.isRequired,
    candyColors: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        value: PropTypes.string,
    })).isRequired,
};

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
        this.state = { score: 0 };
        this.width = 8;
        this.candyColors = [
            'url(../images/red-candy.png)',
            'url(../images/yellow-candy.png)',
            'url(../images/orange-candy.png)',
            'url(../images/purple-candy.png)',
            'url(../images/green-candy.png)',
            'url(../images/blue-candy.png)',
        ];
        this.squares = document.querySelectorAll('.square');
        this.checkRowForFour = this.checkRowForFour.bind(this);
        this.checkColumnForFour = this.checkColumnForFour.bind(this);
        this.checkRowForThree = this.checkRowForThree.bind(this);
        this.checkColumnForThree = this.checkColumnForThree.bind(this);
    }

    componentDidMount() {
        const that = this;
        window.setInterval(() => {
            that.checkRowForFour();
            that.checkColumnForFour();
            that.checkRowForThree();
            that.checkColumnForThree();
            that.moveIntoSquareBelow();
        }, 200);
    }

    moveIntoSquareBelow() {
        const squares = document.querySelectorAll('.square');
        for (let i = 0; i < 55; i += 1) {
            if (squares[i + this.width].style.backgroundImage === '') {
                squares[i + this.width].style.backgroundImage = squares[i].style.backgroundImage;
                squares[i].style.backgroundImage = '';
            }
            const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
            const isFirstRow = firstRow.includes(i);
            if (isFirstRow && squares[i].style.backgroundImage === '') {
                const randomColor = Math.floor(Math.random() * this.candyColors.length);
                squares[i].style.backgroundImage = this.candyColors[randomColor];
            }
        }
    }

    checkRowForFour() {
        const squares = document.querySelectorAll('.square');
        for (let i = 0; i < 60; i += 1) {
            const rowOfFour = [i, i + 1, i + 2, i + 3];
            const decidedColor = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === '';

            const notValid = [
                5,
                6,
                7,
                13,
                14,
                15,
                21,
                22,
                23,
                29,
                30,
                31,
                37,
                38,
                39,
                45,
                46,
                47,
                53,
                54,
                55,
            ];
            if (notValid.includes(i)) {
                continue;
            }

            if (
                rowOfFour.every(
                    (index) => squares[index].style.backgroundImage === decidedColor && !isBlank,
                )
            ) {
                this.setState((prevState) => ({ score: prevState.score + 4 }));
                rowOfFour.forEach((index) => {
                    squares[index].style.backgroundImage = '';
                });
            }
        }
    }

    checkColumnForFour() {
        const squares = document.querySelectorAll('.square');
        for (let i = 0; i < 39; i += 1) {
            const columnOfFour = [i, i + this.width, i + this.width * 2, i + this.width * 3];
            const decidedColor = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === '';

            if (
                columnOfFour.every(
                    (index) => squares[index].style.backgroundImage === decidedColor && !isBlank,
                )
            ) {
                this.setState((prevState) => ({ score: prevState.score + 4 }));
                columnOfFour.forEach((index) => {
                    squares[index].style.backgroundImage = '';
                });
            }
        }
    }

    checkRowForThree() {
        const squares = document.querySelectorAll('.square');
        for (let i = 0; i < 61; i += 1) {
            const rowOfThree = [i, i + 1, i + 2];
            const decidedColor = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === '';

            const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55];
            if (notValid.includes(i)) continue;

            if (
                rowOfThree.every(
                    (index) => squares[index].style.backgroundImage === decidedColor && !isBlank,
                )
            ) {
                this.setState((prevState) => ({ score: prevState.score + 3 }));
                rowOfThree.forEach((index) => {
                    squares[index].style.backgroundImage = '';
                });
            }
        }
    }

    checkColumnForThree() {
        const squares = document.querySelectorAll('.square');
        for (let i = 0; i < 47; i += 1) {
            const columnOfThree = [i, i + this.width, i + this.width * 2];
            const decidedColor = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === '';

            if (
                columnOfThree.every(
                    (index) => squares[index].style.backgroundImage === decidedColor && !isBlank,
                )
            ) {
                this.setState((prevState) => ({ score: prevState.score + 3 }));
                columnOfThree.forEach((index) => {
                    squares[index].style.backgroundImage = '';
                });
            }
        }
    }

    render() {
        const { gameScore } = this.state;
        return (
            <div className="app">
                <CreateScore score={gameScore} />
                <CreateBoard width={this.width} candyColors={this.candyColors} />
            </div>
        );
    }
}

export default App;
