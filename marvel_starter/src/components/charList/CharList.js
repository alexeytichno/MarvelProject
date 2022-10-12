import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';


import './charList.scss';
import MarvelService from '../../services/MarvelServices';

const CharList = (props) =>  {

    const [charList, setCharList] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [newItemLoading, setNewItemLoading] = useState(false)
    const [offset, setOffset] = useState(210)
    const [charEnded, setCharEnded] = useState(false)

    const marvelService = new MarvelService();

    useEffect(() => {
        onRequest();
    }, [])

    const onRequest = (offset) => {
        onCharListLoading();
        marvelService.getAllCharacters(offset)
        .then(onCharListLoaded)
        .catch(onError)
    }

    const onCharListLoaded = (newCharlist) => {
        let ended = false;
        if (newCharlist.length < 9) {
            ended = true;
        }

        setCharList(charList => [...charList, ...newCharlist]);
        setLoading(false);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 9);
        setCharEnded(charEnded => ended)
    }

    const onCharListLoading = () => {
        setNewItemLoading(true);
    }

    const onError = () => {
        setError(true);
        setLoading(false)
    }

    const itemRefs = useRef([]);

    const focusOnItem = (id) => {
        // Я реализовал вариант чуть сложнее, и с классом и с фокусом
        // Но в теории можно оставить только фокус, и его в стилях использовать вместо класса
        // На самом деле, решение с css-классом можно сделать, вынеся персонажа
        // в отдельный компонент. Но кода будет больше, появится новое состояние
        // и не факт, что мы выиграем по оптимизации за счет бОльшего кол-ва элементов

        // По возможности, не злоупотребляйте рефами, только в крайних случаях
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }

    const renderChars = (charList) => {
        return charList.map((el, i) => {
            let imgStyle = {'objectFit': 'cover'}
            if (el.thumbnail ==='http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit': 'unset'}
            }
            return (
                <li className={el.picked ? 'char__item char__item_selected':'char__item'} 
                    tabIndex={0}
                    key={el.id}
                    ref={el => itemRefs.current[i] = el}
                    onClick={() => {
                        props.onCharSelected(el.id);
                        focusOnItem(i);
                    }}
                    onKeyPress={(el) => {
                        if (el.key === '' || el.key === 'Enter')
                            props.onCharSelected(el.id);
                            focusOnItem(i);    
                    }}
                >
                    <img src={el.thumbnail} alt={el.name} style={imgStyle}/>
                    <div className="char__name ">{el.name}</div>
                </li> 
            )
        })
    }

  
        return (
            <div className="char__list">
                <ul className="char__grid">
                    {renderChars(charList)}
                </ul>
                <button 
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{'display': charEnded ? 'none': 'block'}}
                    onClick={() => onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
}

CharList.propTypes = {
    // charId: PropTypes.string,
    onCharSelected: PropTypes.func.isRequired
};


export default CharList;