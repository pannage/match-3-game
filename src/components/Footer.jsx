import React from 'react';
import PropTypes from 'prop-types';
import '../styles/App.css';

export default class Footer extends React.Component {
    render() {
        return (<footer className="footer">
            <div className="wrap">
                <div className="footer__inner">
                    <span>2021 © Match-3 Game</span>
                </div>
                <div className="social-list">
                    <a href="https://github.com/ekoniuh" className="social-list__item" alt="github" target="_blank">
                        <img src="https://www.flaticon.com/svg/static/icons/svg/1688/1688400.svg" className="social-list__item-img" alt="github-logo" title="github account ekoniuh"/>
                    </a>
                    <a href="https://github.com/pannage" className="social-list__item" alt="github" target="_blank">
                        <img src="https://www.flaticon.com/svg/static/icons/svg/2317/2317981.svg" className="social-list__item-img" alt="github-logo" title="github account pannage"/>
                    </a>
                    <a href="https://github.com/zrudikkk" className="social-list__item" alt="github" target="_blank">
                        <img src="https://www.flaticon.com/svg/static/icons/svg/2463/2463510.svg" className="social-list__item-img" alt="rsschool-logo" title="github account zrudikkk"/>
                    </a>
                    <a href="https://rs.school/js/" className="social-list__item" alt="rsschool">
                        <img src="../images/rs_school.svg" className="social-list__item-img rsschool-logo" alt="rsschool-logo"/>
                    </a>
                </div>
            </div>
        </footer>);
    }
}
