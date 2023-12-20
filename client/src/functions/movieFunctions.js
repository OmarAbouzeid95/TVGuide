import { baseUrl, apiKey, posterPath } from "../info";
import defaultPoster from "../media/defaultPoster.png"

// components
import Movie from "../components/Movie";


export const searchMovies = async (mode, keyword) => {
    const res = await fetch(`${baseUrl}/search/${mode}?api_key=${apiKey}&language=en-US&query=${keyword}`);
    const data = await res.json();
    const { results } = data;
    return { results, keyword };
}

export const fetchTrending = async () => {
    const res = await fetch(`${baseUrl}/trending/all/day?api_key=${apiKey}`);
    const data = await res.json();
    return data.results;
}

export const fetchPopular = async (mode) => {
    const res = await fetch(`${baseUrl}/${mode}/popular?api_key=${apiKey}&language=en-US`);
    const data = await res.json();
    return data.results;
}

export const fetchTopRated = async (mode) => {
    const res = await fetch(`${baseUrl}/${mode}/top_rated?api_key=${apiKey}&language=en-US`);
    const data = await res.json();
    return data.results;
}

export const fetchUpcoming = async (mode) => {
    const res = await fetch(`${baseUrl}/${mode}/upcoming?api_key=${apiKey}&language=en-US`);
    const data = await res.json();
    return data.results;
}


export const mapMovies = (movies, movieList = 'all') => {
    return movies.map(movie => {
        return <Movie 
                    title = {movie?.title ?? movie?.name}
                    poster = {!movie?.poster_path ? defaultPoster : posterPath + movie?.poster_path}
                    id = {movie?.id}
                    // getMovieCast = {getMovieCast}
                    key = {movie?.id}
                    genres = {movie?.genre_ids}
                    movieList = {movieList}
                />
    });
}