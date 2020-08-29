import { useState, useEffect} from 'react';
import {INITIAL_SEARCH_BASE_URL,GET_FULL_MOVIE_INFO} from '../components/config';
import {arrayToObject} from '../utils'

export const useFetch = (searchTerm) => {
    const [data, setData] = useState([])
    const [error, setError] = useState(null);

    const fetchData = async (url) => {
    try {
        //Let's get the first 20 movies and total amount of movies for our searchTerm
        let moviesIds = [];
        for (let i = 1; i <= 2; i++) {
            const res = await( await  fetch(`${url}${i}`)).json()
            res.Search.forEach(element => moviesIds.push(element.imdbID));
        }

        let movieDetailArr=[]
        for (let j = 0; j < moviesIds.length; j++) {
            const movieDetail = await ( await fetch(`${GET_FULL_MOVIE_INFO}${moviesIds[j]}`)).json();
            movieDetailArr.push(movieDetail);
        }
        setData(movieDetailArr);
    } catch (error) {
        console.log(error);
        setError(true)
    }
};

useEffect(() => {
        if (!searchTerm) {
            if(data.length>0) {
            console.log('writing to sessionStorage');
                sessionStorage.setItem('homeState', JSON.stringify(data));
            }
        }
    }, [searchTerm, data]);

useEffect(() => {
    if (sessionStorage.homeState) {
        if (typeof(sessionStorage.getItem('homeState') !== 'undefined')) {
            console.log(`get data from sessionStorage`);
            setData(JSON.parse(sessionStorage.getItem('homeState')));
        }
    } else {
        fetchData(INITIAL_SEARCH_BASE_URL);
    }
}, []);

return [{data,error}, fetchData];
}