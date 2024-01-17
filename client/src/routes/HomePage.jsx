import { useEffect, useContext, useState } from 'react';
import { entertainmentContext, modeContext } from '../contexts/contexts';
import { baseUrl, apiKey } from '../info';
import { mapMovies } from '../functions/movieFunctions';
import Loader from '../components/Loader';

import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const HomePage = () => {

    const { entertainmentData, setEntertainmentData } = useContext(entertainmentContext);
    const { mode } = useContext(modeContext);
    const [ allResults, setAllResults ] = useState();
    const [ windowSize, setWindowSize ] = useState(window.innerWidth);


    const fetchEntertainmentContent = async () => {

        let entertainmentContent = entertainmentData;
        //Action movies
        let res = await fetch(`${baseUrl}/discover/movie?api_key=${apiKey}&with_genres=28`);
        let data = await res.json();
        entertainmentContent = {
            ...entertainmentContent,
            movie: {
                ...(entertainmentContent?.movie || {}),
                action: data.results
            }
        }
        // Comedy movies
        res = await fetch(`${baseUrl}/discover/movie?api_key=${apiKey}&with_genres=35`);
        data = await res.json();
        entertainmentContent = {
            ...entertainmentContent,
            movie: {
                ...(entertainmentContent?.movie || {}),
                comedy: data.results
            }
        }

        // Comedy Tv
        res = await fetch(`${baseUrl}/discover/tv?api_key=${apiKey}&with_genres=35`);
        data = await res.json();
        entertainmentContent = {
            ...entertainmentContent,
            tv: {
                ...(entertainmentContent?.tv || {}),
                comedy: data.results
            }
        }
        // Mystery Tv
        res = await fetch(`${baseUrl}/discover/tv?api_key=${apiKey}&with_genres=9648`);
        data = await res.json();
        entertainmentContent = {
            ...entertainmentContent,
            tv: {
                ...(entertainmentContent?.tv || {}),
                mystery: data.results
            }
        }
        // Fantasy movies
        res = await fetch(`${baseUrl}/discover/movie?api_key=${apiKey}&with_genres=14`);
        data = await res.json();
        entertainmentContent = {
            ...entertainmentContent,
            movie: {
                ...(entertainmentContent?.movie || {}),
                fantasy: data.results
            }
        }
        // Crime movies
        res = await fetch(`${baseUrl}/discover/movie?api_key=${apiKey}&with_genres=80`);
        data = await res.json();
        entertainmentContent = {
            ...entertainmentContent,
            movie: {
                ...(entertainmentContent?.movie || {}),
                crime: data.results
            }
        }
        // Drama movies
        res = await fetch(`${baseUrl}/discover/movie?api_key=${apiKey}&with_genres=18`);
        data = await res.json();
        entertainmentContent = {
            ...entertainmentContent,
            movie: {
                ...(entertainmentContent?.movie || {}),
                drama: data.results
            }
        }
        // Drama Tv
        res = await fetch(`${baseUrl}/discover/tv?api_key=${apiKey}&with_genres=18`);
        data = await res.json();
        entertainmentContent = {
            ...entertainmentContent,
            tv: {
                ...(entertainmentContent?.tv || {}),
                drama: data.results
            }
        }
        // Animation TV
        res = await fetch(`${baseUrl}/discover/tv?api_key=${apiKey}&with_genres=16`);
        data = await res.json();
        entertainmentContent = {
            ...entertainmentContent,
            tv: {
                ...(entertainmentContent?.tv || {}),
                animation: data.results
            }
        }
        // Documentary TV
        res = await fetch(`${baseUrl}/discover/tv?api_key=${apiKey}&with_genres=99`);
        data = await res.json();

        entertainmentContent = {
            ...entertainmentContent,
            tv: {
                ...(entertainmentContent?.tv || {}),
                documentary: data.results
            }
        }

        return entertainmentContent;
    };

    // screen resize listener
    useEffect(() => {
        const adjustWindowSize = () => setWindowSize(window.innerWidth);
        window.addEventListener('resize', adjustWindowSize);
        return () => window.removeEventListener('resize', adjustWindowSize);
    }, []);

    useEffect(() => {
        /*
        res = await fetching movies and tv by genre to display on the homepage
        */
       if(!entertainmentData.loaded) { 
            fetchEntertainmentContent()
            .then(data => {
                setEntertainmentData({...data, loaded: true});
            });            
       }

      }, [ entertainmentData, setEntertainmentData ]);

    useEffect(() => {

        const entertainmentList = (mode === 'movie') ? [ 'action', 'comedy', 'drama', 'fantasy', 'crime' ] : 
            [ 'comedy', 'drama', 'animation', 'documentary', 'mystery' ];

        if(Object.keys(entertainmentData).length > 0) {
            const mappedResult = entertainmentList.map(genre => {
                const mappedList = mapMovies(entertainmentData?.[mode]?.[genre]);
                return carousselContent(genre, mappedList);
            });
            setAllResults(mappedResult);
        }
    }, [mode, entertainmentData]);

    const carousselContent = (title, list) => {

        const responsive = {
            superLargeDesktop: {
              breakpoint: { max: 4000, min: 1360 },
              items: 7,
              slidesToSlide: 7
            },
            largeDesktop: {
                breakpoint: { max: 1359, min: 1120 },
                items: 6,
                slidesToSlide: 6
            },
            desktop: {
              breakpoint: { max: 1119, min: 1024 },
              items: 5,
              slidesToSlide: 5
            },
            tablet: {
              breakpoint: { max: 1023, min: 769 },
              items: 4,
              slidesToSlide: 4
            },
            largeMobile: {
              breakpoint: { max: 768, min: 426 },
              items: 3,
            },
            mobile: {
              breakpoint: { max: 425, min: 0 },
              items: 2,
            }
          };

        return (
            <div key={title}>
                <h2 className="genre-header">{title.charAt(0).toUpperCase() + title.slice(1)}</h2>
                <Carousel 
                responsive={responsive}
                infinite={true}
                swipeable={true}
                draggable={false}
                arrows={(windowSize > 426)}
                >
                    {list}
                </Carousel> 
            </div>
        );
    };

  return (
    <div className="movies-container-wrapper">
        { allResults ?? <Loader style={{height: '70vh'}}/> }
    </div>
  );

}

export default HomePage;