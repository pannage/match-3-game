import React from 'react';
import PropTypes from 'prop-types';
import '../styles/App.css';
const candies = [
    'url(../images/red-candy.png)',
    'url(../images/yellow-candy.png)',
    'url(../images/orange-candy.png)',
    'url(../images/purple-candy.png)',
    'url(../images/green-candy.png)',
    'url(../images/blue-candy.png)',
    'url(../images/torpedo-row.png)',
    'url(../images/rainbow.png)',
    'url(../images/mine.png)',
    'url(../images/x-bomb.png)',
    'url(../images/xx-bomb.png)',
  ];
export default class TaskBox extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div className="task-box">
                <div className="moves-wrap">
                    <div className="moves">{this.props.moves}</div>
                    <div className="moves-txt">moves</div>
                </div>
                {this.props.message.map((item) => {
                    if (item[0] === 'desk') {
                        return <div className="task" key={item[0]}>
                        <div style={{ backgroundColor: '#fad69f' }}></div>
                        <div>{item[1]}</div>
                    </div>
                    } else if (item[0] === 'ice') {
                        return <div className="task" key={item[0]}>
                        <div style={{ backgroundImage: 'url(../images/blue-candy-ice.png)' }}></div>
                        <div>{item[1]}</div>
                    </div>
                    } else if (item[0] === 'ground') {
                        return <div className="task" key={item[0]}>
                        <div style={{ backgroundImage: 'url(../images/ground.png)' }}></div>
                        <div>{item[1]}</div>
                    </div>
                    }
                    return <div className="task" key={item[0]}>
                        <div style={{ backgroundImage: candies[item[0]] }}></div>
                        <div>{item[1]}</div>
                    </div>
                })}
            </div>

        );
    }
}
