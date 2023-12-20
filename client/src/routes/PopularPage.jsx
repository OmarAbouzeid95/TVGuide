import { mapMovies } from "../functions/movieFunctions";
import { useContext, useState, useEffect } from 'react';
import { entertainmentContext, modeContext } from "../contexts/contexts";
import { fetchPopular } from "../functions/movieFunctions";

const PopularPage = () => {

    const { mode } = useContext(modeContext);
    const { entertainmentData, setEntertainmentData } = useContext(entertainmentContext);
    const [ popularContent, setPopularContent ] = useState();

    useEffect(() => {
        if (!entertainmentData?.popular?.[mode]) {
            fetchPopular(mode)
                .then(data => {
                    setPopularContent(mapMovies(data));
                    setEntertainmentData({
                        ...entertainmentData,
                        popular: {
                            ...(entertainmentData.popular || {}),
                            [mode]: data
                        }   
                    });
                });
        } else {
            setPopularContent(mapMovies(entertainmentData.popular[mode]));
        }
    }, [entertainmentData, setEntertainmentData, mode]);


  return (
    <div className="movies-container-wrapper">
            <h2 style={{color: 'white', paddingLeft: '1em'}}>{`Popular ${mode === 'movie' ? 'Movies' : 'TV'}`}</h2>
        <div className="movies-container">
            {popularContent}
        </div>
    </div>
  );
}

export default PopularPage;