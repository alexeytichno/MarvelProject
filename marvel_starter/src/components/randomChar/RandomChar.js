import { useState, useEffect } from 'react';

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';
import MarvelService from '../../services/MarvelServices'
import Spinner from '../../components/spinner/Spinner'
import ErrorMessege from '../errorMessege/ErrorMessege'

const RandomChar = () => {
    // constructor(props) {
    //     super(props);
    //     // console.log('constructor')
    // }
    const [char, setChar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    
    const marvelService = new MarvelService();

    useEffect(() => {
        updateChar();
        // const timerId = setInterval(updateChar, 6000)

        // return () => {
        //     clearInterval(timerId);
        // }
    }, [])

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

    const updateChar = () => {
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
        onCharLoading();
        marvelService.getCharacter(id)
            .then(onCharLoaded)
            .catch(onError)
        }
    
        const errorMessege = error ? <ErrorMessege/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? <View char={char}/> : null

        return (
            <div className="randomchar">
                {errorMessege} 
                {spinner} 
                {content}
                <div className="randomchar__static">
                    <p className="randomchar__title">
                        Random character for today!<br/>
                        Do you want to get to know him better?
                    </p>
                    <p className="randomchar__title">
                        Or choose another one
                    </p>
                    <button className="button button__main">
                        <div className="inner" onClick ={updateChar}>try it</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
                </div>
            </div>
        )
    }

const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki} = char;
   
    return (
            <div className="randomchar__block">
                    {
                        thumbnail ==='http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg' ? 
                        <img src={thumbnail} alt="Random character" className="randomchar__img" style={{objectFit: 'contain'}}/>
                        :<img src={thumbnail} alt="Random character" className="randomchar__img"/>
                    }
                    <div className="randomchar__info">
                        <p className="randomchar__name">{name}</p>
                        <p className="randomchar__descr">
                            {description ?  `${description.slice(0, 210)}...` : 'Description not found'}
                        </p>
                        <div className="randomchar__btns">
                            <a href={homepage} className="button button__main">
                                <div className="inner">homepage</div>
                            </a>
                            <a href={wiki} className="button button__secondary">
                                <div className="inner">Wiki</div>
                            </a>
                        </div>
                    </div>
                </div>
    )
}

export default RandomChar;