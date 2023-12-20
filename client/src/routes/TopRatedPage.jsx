import { mapMovies } from "../functions/movieFunctions";
import { useContext, useState, useEffect } from 'react';
import { entertainmentContext, modeContext } from "../contexts/contexts";
import { fetchTopRated } from "../functions/movieFunctions";

const TopRatedPage = () => {

    const { mode } = useContext(modeContext);
    const { entertainmentData, setEntertainmentData } = useContext(entertainmentContext);
    const [ topRatedContent, setTopRatedContent ] = useState();

    useEffect(() => {
        if (!entertainmentData?.topRated?.[mode]) {
            fetchTopRated(mode)
                .then(data => {
                    setTopRatedContent(mapMovies(data));
                    setEntertainmentData({
                        ...entertainmentData,
                        topRated: {
                            ...(entertainmentData.popular || {}),
                            [mode]: data
                        }   
                    });
                });
        } else {
            setTopRatedContent(mapMovies(entertainmentData.topRated[mode]));
        }
    }, [entertainmentData, setEntertainmentData, mode]);


  return (
    <div className="movies-container-wrapper">
            <h2 style={{color: 'white', paddingLeft: '1em'}}>{`Top Rated ${mode === 'movie' ? 'Movies' : 'TV'}`}</h2>
        <div className="movies-container">
            {topRatedContent}
        </div>
    </div>
  );
}

export default TopRatedPage;