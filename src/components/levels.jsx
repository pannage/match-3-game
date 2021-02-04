import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import '../styles/App.css';

export default class LevelRoad extends React.Component {
    constructor(props) {
        super(props);
        this.level = new Array(7).fill(1).map((item, id) => id + 1).reverse();
    }

    render() {
        return (
            <div className="level-road" >
                <div className="level-wrapper">
                    {this.level.map((item, id) => {
                        const check = id + 1 > 7 - this.props.level;

                        if (check) {
                            return <Link to="/level" key={id + 7}
                            >
                                <div
                                    className= {`level-${item} level-btn`}
                                    data-level={`${item}`}
                                    data-type-btn="level"

                                />
                            </Link>;
                        }

                        return <div

                            className= {`level-${item} level-inactive`}
                            data-level={`${item}`}
                            data-type-btn="level-inactive"
                            key={`level-${id + 7}`}
                        />;
                    })}
                </div>
            </div>
        );
    }
}