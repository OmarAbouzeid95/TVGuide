import { mapMovies } from "../functions/movieFunctions";
import { useContext, useState, useEffect } from 'react';
import { entertainmentContext, modeContext } from "../contexts/contexts";
import { fetchTrending } from "../functions/movieFunctions";

const TrendingPage = () => {

    const { mode } = useContext(modeContext);
    const { entertainmentData, setEntertainmentData } = useContext(entertainmentContext);
    const [ trendingContent, setTrendingContent ] = useState();
    const [ allResults, setAllResults ] = useState();

    useEffect(() => {
        if (!entertainmentData?.trending) {
            fetchTrending()
                .then(data => {
                    setTrendingContent(data);
                    setEntertainmentData({ ...entertainmentData, trending: data });
                });
        } else {
            setTrendingContent(entertainmentData.trending);
        }
    }, [entertainmentData, setEntertainmentData]);

    useEffect(() => {
        if (trendingContent) {
            const filteredContent = trendingContent.filter(media => media.media_type === mode);
            setAllResults(mapMovies(filteredContent));
        }
    }, [trendingContent, mode]);

    
  return (
    <div className="movies-container-wrapper">
            <h2 style={{color: 'white', paddingLeft: '1em'}}>{`Trending ${mode === 'movie' ? 'Movies' : 'TV'}`}</h2>
        <div className="movies-container">
            {allResults}
        </div>
    </div>
  );
}

export default TrendingPage;