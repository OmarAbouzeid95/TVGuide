import { mapMovies } from "../functions/movieFunctions";
import { useContext, useState, useEffect } from 'react';
import { entertainmentContext, modeContext } from "../contexts/contexts";
import { fetchUpcoming } from "../functions/movieFunctions";

const UpcomingPage = () => {

    const { mode } = useContext(modeContext);
    const { entertainmentData, setEntertainmentData } = useContext(entertainmentContext);
    const [ upcomingContent, setUpcomingContent ] = useState();

    useEffect(() => {
        if (!entertainmentData?.upcoming?.[mode]) {
            fetchUpcoming(mode)
                .then(data => {
                    setUpcomingContent(mapMovies(data));
                    setEntertainmentData({
                        ...entertainmentData,
                        upcoming: {
                            ...(entertainmentData.popular || {}),
                            [mode]: data
                        }   
                    });
                });
        } else {
            setUpcomingContent(mapMovies(entertainmentData.upcoming[mode]));
        }
    }, [entertainmentData, setEntertainmentData, mode]);


  return (
    <div className="movies-container-wrapper">
            <h2 style={{color: 'white', paddingLeft: '1em'}}>{`Upcoming ${mode === 'movie' ? 'Movies' : 'TV'}`}</h2>
        <div className="movies-container">
            {upcomingContent}
        </div>
    </div>
  );
}

export default UpcomingPage;