import { useContext } from 'react';
import { userContext } from '../contexts/contexts';
import { mapMovies } from '../functions/movieFunctions';
import { Link } from 'react-router-dom';

const WatchlistPage = () => {

    const { userData } = useContext(userContext);
    const watchList = userData?.watchList;
    const allResults = mapMovies(watchList);

    return (
    <div className="movies-container-wrapper">
        {
            (allResults.length > 0) ? 
            (<>
                <h2 style={{color: 'white', paddingLeft: '1em'}}>My Watchlist</h2>
                <div className="movies-container">
                    {allResults}
                </div>
            </>) :
            (
            <div style={{display:'flex', justifyContent: 'center', height: '50vh'}}>
                <div className="empty-watchlist-container">
                    <h1>Your watchlist looks empty</h1>
                    <h2>Head to the <Link to={'/'}>Explore</Link> page to add movies or shows to your watchlist.</h2>
                </div>
            </div>    
            )
        }
    </div>
    );
}

export default WatchlistPage;