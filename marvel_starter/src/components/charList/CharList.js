import { Component } from 'react';
import PropTypes from 'prop-types';


import './charList.scss';
import MarvelService from '../../services/MarvelServices';
class CharList extends Component {
    state = {
        charList: [],
        loading: true, 
        error: false,
        newItemLoading: false,
        offset: 210, 
        charEnded: false
    }   

    marvelService = new MarvelService();

    componentDidMount() {
        this.onRequest();
    } 

    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService.getAllCharacters(offset)
        .then(this.onCharListLoaded)
        .catch(this.onError)
    }

    onCharListLoaded = (newCharlist) => {
        let ended = false;
        if (newCharlist.length < 9) {
            ended = true;
        }

        this.setState(({charList, offset }) => ({
            charList: [...charList, ...newCharlist], 
            newItemLoading: false, 
            offset: offset + 9,
            charEnded: ended
        }))
    }

    onCharListLoading = () => {
        this.setState({
            newItemLoading: true 
        })
    }

    itemRefs = [];

    setRef = (ref) => {
        this.itemRefs.push(ref);
    }

    focusOnItem = (id) => {
        // Я реализовал вариант чуть сложнее, и с классом и с фокусом
        // Но в теории можно оставить только фокус, и его в стилях использовать вместо класса
        // На самом деле, решение с css-классом можно сделать, вынеся персонажа
        // в отдельный компонент. Но кода будет больше, появится новое состояние
        // и не факт, что мы выиграем по оптимизации за счет бОльшего кол-ва элементов

        // По возможности, не злоупотребляйте рефами, только в крайних случаях
        this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
        this.itemRefs[id].classList.add('char__item_selected');
        this.itemRefs[id].focus();
    }

    renderChars = (charList) => {
        return charList.map((el, i) => {
            let imgStyle = {'objectFit': 'cover'}
            if (el.thumbnail ==='http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit': 'unset'}
            }
            return (
                <li className={el.picked ? 'char__item char__item_selected':'char__item'} 
                    tabIndex={0}
                    key={el.id}
                    ref={this.setRef}
                    onClick={() => {
                        this.props.onCharSelected(el.id);
                        this.focusOnItem(i);
                    }}
                    onKeyPress={(el) => {
                        if (el.key === '' || el.key === 'Enter')
                            this.props.onCharSelected(el.id);
                            this.focusOnItem(i);    
                    }}
                >
                    <img src={el.thumbnail} alt={el.name} style={imgStyle}/>
                    <div className="char__name ">{el.name}</div>
                </li> 
            )
        })
    }

    render() {
        return (
            <div className="char__list">
                <ul className="char__grid">
                    {this.renderChars(this.state.charList)}
                </ul>
                <button 
                    className="button button__main button__long"
                    disabled={this.state.newItemLoading}
                    style={{'display': this.state.charEnded ? 'none': 'block'}}
                    onClick={() => this.onRequest(this.state.offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

CharList.propTypes = {
    // charId: PropTypes.string,
    onCharSelected: PropTypes.func.isRequired
};


export default CharList;