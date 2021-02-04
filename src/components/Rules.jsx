import React from 'react';
import PropTypes from 'prop-types';
import '../styles/App.css';

export default class Rules extends React.Component {
    constructor(props) {
        super(props);
        this.closeRules = this.closeRules.bind(this);
    }

    closeRules() {
        const { that } = this.props;

        that.isClickRulesOfGame = false;
        that.forceUpdate();
    }

    render() {
        return (
            <div className="description-container win-screen-container">
                <div className="close__btn" onClick={() => this.closeRules()}>
                </div>
                <div className="rules-description">
                    <h2 className="rules__title">Правила игры!</h2>
                    <ol className="rules-list">
                        <li>
                            Над игровым полем перечислены задания, которые нужно выполнить за
                            ограниченное число ходов
                        </li>
                        <li>
                            Чтобы выполнять задания, составляйте 3 и больше фишки в ряд или колонку
                        </li>
                        <li>
                            Если составить более трех фишек, появится бонус, который поможет в
                            прохождении
                        </li>
                        <li>
                            Чтобы убрать с поля закрашенные клетки, составляйте на них комбинации, бонус
                            убирает все закрашенные клетки, через которые проходит
                        </li>
                        <li>
                            Чтобы убрать замороженные фишки, составляйте с ними комбинации, бонус
                            разрушает весь лед, через который проходит
                        </li>
                        <li>
                            Чтобы убрать землю, составляйте рядом с ней комбинацию, бонус убирает только
                            первую клетку, на которую действует.
                        </li>
                    </ol>
                </div>
                <div className="hot-keys-description">
                    <h2 className="hot-keys__title">Горячие клавиши</h2>
                    <ol className="hot-keys-list">
                        <li>
                            <span>1-7</span> запускают уровень игры взависимости от нажатой клавиши
                        </li>
                        <li>
                            <span>q</span> открывает главную страницу игры
                        </li>
                        <li>
                            <span>w</span> начинает уровень с самого начала (перезагрузка уровня)
                        </li>
                        <li>
                            <span>e</span> открывает правила игры и информацию о горячих клавишах
                        </li>
                        <li>
                            <span>r</span> открывает статистику с лучшими результатами
                        </li>
                    </ol>
                </div>
            </div>
        );
    }
}

Rules.propTypes = {
    that: PropTypes.object.isRequired,
};
