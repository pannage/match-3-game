import React from 'react';
import PropTypes from 'prop-types';
import '../styles/App.css';
import Board from './Board.jsx';


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
            squares: new Array(64).fill(0)
                .map(() => this.candies[Math.floor(Math.random() * this.candies.length)]),
            boardData: new Array(8)
                .fill(null)
                .map(() => new Array(8).fill({ type: 1 })
                    .map((cellData) => {
                        return {
                            ...cellData,
                            url: this.candies[Math.floor(Math.random() * 6)]
                        };
                    })),
        };
        this.checkRowForFour = this.checkRowForFour.bind(this);
        this.checkColumnForFour = this.checkColumnForFour.bind(this);
        this.checkRowForThree = this.checkRowForThree.bind(this);
        this.checkColumnForThree = this.checkColumnForThree.bind(this);
        this.dragStart = this.dragStart.bind(this);
        this.dragOver = this.dragOver.bind(this);
        this.dragEnter = this.dragEnter.bind(this);
        this.dragLeave = this.dragLeave.bind(this);
        this.dragDrop = this.dragDrop.bind(this);
        this.dragEnd = this.dragEnd.bind(this);
    }

    componentDidMount() {
        const that = this;
        // setInterval(() => {
        //     that.checkRowForFour();
        //     that.checkColumnForFour();
        //     that.checkRowForThree();
        //     that.checkColumnForThree();
        //     that.moveIntoSquareBelow();
        // }, 200);
    }

    dragStart(e) {
        this.colorBeingDragged = e.target.style.backgroundImage;
        this.squareIdBeingDragged = parseInt(e.target.id, 10);
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
        const { squares } = this.state;
        this.colorBeingReplaced = e.target.style.backgroundImage;
        this.squareIdBeingReplaced = parseInt(e.target.id, 10);
        squares[this.squareIdBeingReplaced] = this.colorBeingDragged;
        squares[this.squareIdBeingDragged] = this.colorBeingReplaced;
        this.setState({ squares });
    }

    dragEnd() {
        const validMoves = [
            this.squareIdBeingDragged - 1,
            this.squareIdBeingDragged - this.width,
            this.squareIdBeingDragged + 1,
            this.squareIdBeingDragged + this.width,
        ];
        let validMove = validMoves.indexOf(this.squareIdBeingReplaced);
        if (validMove === 0) {
            if (this.squareIdBeingReplaced % this.width === 7) validMove = -1;
        } else if (validMove === 2) {
            if (this.squareIdBeingReplaced % this.width === 0) validMove = -1;
        }

        const { squares } = this.state;
        if (this.squareIdBeingReplaced !== undefined && validMove !== -1) {
            this.squareIdBeingReplaced = null;
        } else if (this.squareIdBeingReplaced !== undefined && validMove === -1) {
            squares[this.squareIdBeingReplaced] = this.colorBeingReplaced;
            squares[this.squareIdBeingDragged] = this.colorBeingDragged;
        } else {
            squares[this.squareIdBeingDragged] = this.colorBeingDragged;
        }
        this.setState({ squares });
    }

    moveIntoSquareBelow() {
        const { squares } = this.state;
        for (let i = 0; i < 55; i += 1) {
            if (squares[i + this.width] === '') {
                squares[i + this.width] = squares[i];
                squares[i] = '';
            }
            const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
            const isFirstRow = firstRow.includes(i);
            if (isFirstRow && squares[i] === '') {
                const randomColor = Math.floor(Math.random() * this.candies.length);
                squares[i] = this.candies[randomColor];
            }
        }
        this.setState({ squares });
    }

    checkRowForFour() {
        const { squares } = this.state;
        for (let i = 0; i < 60; i += 1) {
            const rowOfFour = [i, i + 1, i + 2, i + 3];
            const decidedColor = squares[i];
            const isBlank = squares[i] === '';

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

            if (
                rowOfFour.every(
                    (index) => squares[index] === decidedColor && !isBlank,
                ) && !notValid.includes(i)
            ) {
                rowOfFour.forEach((index) => {
                    squares[index] = '';
                });
                this.setState((prevState) => ({ score: prevState.score + 4 }));
                this.setState({ squares });
            }
        }
    }

    checkColumnForFour() {
        const { squares } = this.state;
        for (let i = 0; i < 39; i += 1) {
            const columnOfFour = [i, i + this.width, i + this.width * 2, i + this.width * 3];
            const decidedColor = squares[i];
            const isBlank = squares[i] === '';

            if (
                columnOfFour.every(
                    (index) => squares[index] === decidedColor && !isBlank,
                )
            ) {
                columnOfFour.forEach((index) => {
                    squares[index] = '';
                });
                this.setState((prevState) => ({ score: prevState.score + 4 }));
                this.setState({ squares });
            }
        }
    }

    checkRowForThree() {
        const { squares } = this.state;
        for (let i = 0; i < 61; i += 1) {
            const rowOfThree = [i, i + 1, i + 2];
            const decidedColor = squares[i];
            const isBlank = squares[i] === '';

            const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55];

            if (
                rowOfThree.every(
                    (index) => squares[index] === decidedColor && !isBlank,
                ) && !notValid.includes(i)
            ) {
                rowOfThree.forEach((index) => {
                    squares[index] = '';
                });
                this.setState((prevState) => ({ score: prevState.score + 3 }));
                this.setState({ squares });
            }
        }
    }

    checkColumnForThree() {
        const { squares } = this.state;
        for (let i = 0; i < 47; i += 1) {
            const columnOfThree = [i, i + this.width, i + this.width * 2];
            const decidedColor = squares[i];
            const isBlank = squares[i] === '';

            if (
                columnOfThree.every(
                    (index) => squares[index] === decidedColor && !isBlank,
                )
            ) {
                columnOfThree.forEach((index) => {
                    squares[index] = '';
                });
                this.setState((prevState) => ({ score: prevState.score + 3 }));
                this.setState({ squares });
            }
        }
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
