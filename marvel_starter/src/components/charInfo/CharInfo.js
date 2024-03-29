/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useState } from 'react';


import Spinner from '../spinner/Spinner';
import ErrorMessege from '../errorMessege/ErrorMessege';
import Skeleton from '../skeleton/Skeleton'
import MarvelService from '../../services/MarvelServices';

import './charInfo.scss';
import thor from '../../resources/img/thor.jpeg';

const CharInfo = (props) => {

    const [char, setChar] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const marvelService = new MarvelService();

    useEffect(() => {
        updateChar();
    }, [props.charId])


    const updateChar = () => {
        const {charId} = props;
        if (!charId) {
            return;
        }

        onCharLoading();

        marvelService
            .getCharacter(charId)
            .then(onCharLoaded)
            .catch(onError)
    }


    const onCharLoaded = (char) => {
        setChar(char);
        setLoading(false)
    }

    const onCharLoading = () => {
        setLoading(true);
    }

    const onError = () => {
        setLoading(false);
        setError(true);
    }

        const skeleton = char || loading || error ? null: <Skeleton/>
        const errorMessege = error ? <ErrorMessege/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error || !char) ? <View char={char}/> : null
        return (
            <div className="char__info">
              {skeleton}
              {errorMessege}
              {spinner}
              {content}
            </div>
        )
    
   
}

const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = char;
    const imgStyle = thumbnail ==='http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg' ? {"objectFit": 'contain'}: null 
    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={imgStyle}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
            {description ?  description : 'Description not found'}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
            {
                comics.length === 0 ? 
                <li>Comics not found</li>
                :
                comics.map((item, i) => {
                    if (i > 9) return;
                        return (
                            <li key={i} className="char__comics-item">
                                {item.name}
                            </li>
                        )
                        
                    })
            }
                
            </ul>
        </>
    )
}


export default CharInfo;