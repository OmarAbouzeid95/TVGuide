import { useLoaderData } from "react-router-dom";
import { mapMovies } from "../functions/movieFunctions";

const SearchPage = () => {

    const { results, keyword } = useLoaderData();
    const allResults = mapMovies(results);

  return (
    <div className="movies-container-wrapper">
            <h2 style={{color: 'white', paddingLeft: '1em'}}>{results.length > 0 ? `Results for "${keyword}"` : `No results found for "${keyword}"`}</h2>
        <div className="movies-container">
            {allResults}
        </div>
    </div>
  );
}

export default SearchPage;