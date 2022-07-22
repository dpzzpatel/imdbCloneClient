import React from 'react';
import { useSelector } from 'react-redux';
import { BsFillStarFill } from "react-icons/bs";



function Movie() {
    const movie = useSelector(state => state.movie.movie);
  return (
    Object.keys(movie).length >1?
    <div className='d-flex flex-column flex-sm-row gap-3'>
        <img src={movie.Poster} alt=""/>
        <div className='d-flex flex-column'>
            <h4>Title : {movie.Title}</h4>
            <p>{movie.Runtime} | {movie.Genre}</p>
            <p><BsFillStarFill /> {movie.imdbRating}</p>
            <p>{movie.Plot}</p>
            <p>Votes:{movie.imdbVotes}</p>
        </div>
    </div>
    :'No Movie Selected'
    )
}

export default Movie