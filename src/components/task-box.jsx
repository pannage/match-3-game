import React from 'react';
import PropTypes from 'prop-types';
import '../styles/App.css';

export default class TaskBox extends React.Component {
  render() {
    return (
      <div className="task-box">
        <div className="moves-wrap">
          <div className="moves">{this.props.moves}</div>
          <div className="moves-txt">moves</div>
        </div>
        <div className="task">{this.props.message}</div>
      </div>
    );
  }
}
