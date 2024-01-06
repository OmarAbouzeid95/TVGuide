import { baseUrl, apiKey, posterPath } from "../info";
import defaultPoster from "../media/defaultPoster.png"

// components
import Movie from "../components/Movie";


export const searchMovies = async (mode, keyword) => {
    const res = await fetch(`${baseUrl}/search/${mode}?api_key=${apiKey}&language=en-US&query=${keyword}`);
    const data = await res.json();
    const { results } = data;
    return { results, keyword };
};

export const fetchTrending = async () => {
    const res = await fetch(`${baseUrl}/trending/all/day?api_key=${apiKey}`);
    const data = await res.json();
    return data.results;
};

export const fetchPopular = async (mode) => {
    const res = await fetch(`${baseUrl}/${mode}/popular?api_key=${apiKey}&language=en-US`);
    const data = await res.json();
    return data.results;
};

export const fetchTopRated = async (mode) => {
    const res = await fetch(`${baseUrl}/${mode}/top_rated?api_key=${apiKey}&language=en-US`);
    const data = await res.json();
    return data.results;
};

export const fetchUpcoming = async (mode) => {
    const res = await fetch(`${baseUrl}/${mode}/upcoming?api_key=${apiKey}&language=en-US`);
    const data = await res.json();
    return data.results;
};

export const fetchCast = async (mode, id) => {
    const res = await fetch(`${baseUrl}/${mode}/${id}/credits?api_key=${apiKey}&language=en-US`);
    const data = await res.json();
    return data.cast;

};

export const fetchTrailer = async (mode, id) => {
    const res = await fetch(`${baseUrl}/${mode}/${id}/videos?api_key=${apiKey}&language=en-US`);
    const data = await res.json();

    for (let i = 0; i<data.results.length; i++){
        if (data.results[i].type === "Trailer"){
            return `https://www.youtube.com/embed/${data.results[i].key}`;
        }
    }

    return '';
};

export const mapMovies = (movies, movieList = 'all') => {
    return movies.map(movie => {
        return <Movie 
                    title = {movie?.title ?? movie?.name}
                    poster = {!movie?.poster_path ? defaultPoster : posterPath + movie?.poster_path}
                    id = {movie?.id}
                    rating = {movie?.vote_average.toFixed(1)}
                    date = {movie?.release_date}
                    key = {movie?.id}
                    genres = {movie?.genre_ids}
                    description = {movie?.overview}
                    movieList = {movieList}

                />
    });
};