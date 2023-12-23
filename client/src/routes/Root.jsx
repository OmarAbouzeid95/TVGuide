import '../App.css';
import {useState} from "react";
import Header from '../components/Header';
import Loader from '../components/Loader'
// import Footer from '../components/Footer';

import { modeContext, userContext, entertainmentContext } from '../contexts/contexts';
import { Outlet } from 'react-router-dom';

function Root() {

  // contexts
  const [ mode, setMode ] = useState('movie');
  const [ userData, setUserData ] = useState();
  const [ entertainmentData, setEntertainmentData ] = useState({});

  const [showLoader, setShowLoader] = useState(false)

    // function getMovieCast(id, movieList){

    //   setShowLoader(true)
    //   let videoPath = ''
    //   let reviews = []
    //   let dbRating = 0.0
    //   let dbRatingCount = 0
    //   let dbRatingTotal = 0
    //   // Get movie trailer
    //   fetch(`${baseUrl}/${mode}/${id}/videos?api_key=${apiKey}&language=en-US`)
    //   .then(res => res.json())
    //   .then(data => {
    //     for (let i = 0; i<data.results.length; i++){
    //       if (data.results[i].type === "Trailer"){
    //         videoPath = `https://www.youtube.com/embed/${data.results[i].key}`
    //         break
    //       }
    //     }
    //     /**
    //      * fetching movie reviews from the DB
    //      */
    //     fetch(`${process.env.REACT_APP_SERVER_URL}/movies/${id}`)
    //     .then(res => res.json())
    //     .then(data => {
    //       if(data !== null){
    //         reviews = data.reviews
    //         dbRating = data.rating
    //         dbRatingCount = data.ratingCount
    //         dbRatingTotal = data.ratingTotal
    //       }
    //       // setting array to search from and fetch movie details of the clicked movie
    //       let moviesArray = []
    //       switch (movieList){
    //         case "action":
    //           moviesArray = actionMovies
    //           break
    //         case "comedy":
    //           moviesArray = (mode === 'tv') ? comedyTv : comedyMovies
    //           break
    //         case "fantasy":
    //           moviesArray = fantasyMovies
    //           break
    //         case "crime":
    //           moviesArray = crimeMovies
    //           break
    //         case "drama":
    //           moviesArray = (mode === 'tv') ? dramaTv : dramaMovies 
    //           break
    //         case "documentary":
    //           moviesArray = documentaryTv
    //           break
    //         case "mystery":
    //           moviesArray = mysteryTv
    //           break
    //         case "animation":
    //           if(mode === 'tv')
    //             moviesArray = animationTv
    //           break
    //         default:
    //           moviesArray = movies
    //           break
    //       }
    //       for(let i = 0; i< moviesArray.length; i++){
    //         if (id === moviesArray[i].id){
    //           setMovieDetails({
    //                             active: true,
    //                             title: moviesArray[i].title !== undefined ? moviesArray[i].title : moviesArray[i].name,
    //                             poster: moviesArray[i].poster_path === null ? defaultPoster : posterPath + moviesArray[i].poster_path,
    //                             description: moviesArray[i].overview,
    //                             date: moviesArray[i].release_date,
    //                             rating: moviesArray[i].vote_average.toFixed(1),
    //                             genres: moviesArray[i].genre_ids,
    //                             video: videoPath,
    //                             dbRating: dbRating.toFixed(1),
    //                             dbRatingCount: dbRatingCount,
    //                             dbRatingTotal: dbRatingTotal,
    //                             reviews: reviews,
    //                             id: id
    //                           })
    //           setShowLoader(false)
    //           break
    //         }
    //       }
    //     })        
    //   })
    // }

    // function removeMovieDetails(){
    //   setMovieDetails({active: false, id: null, visible: false})
    // }

    // function updateCurrentPage(curr){
    //   setCurrentPage(curr)
    // }

  return (
    <div className= "app-container">
      <userContext.Provider value={{ userData, setUserData }}>
      <entertainmentContext.Provider value={{ entertainmentData, setEntertainmentData }}>
      <modeContext.Provider value={{ mode, setMode }}>
      <Header />
      <Outlet />
      {showLoader && <Loader message="Loading reviews and ratings from the database..."/>}
      {/* {movieDetails.visible && <MovieDetails
                                  hideDetails = {removeMovieDetails}
                                  movieDetails = {movieDetails}
                                  userData = {userData}
                                  updateCurrentPage = {updateCurrentPage}
                                  key = {movieDetails.id}
                              />
        }


        {(currentPage === 'display') && <div className="movies-container">
          {allMovies}
        </div>} */}
      {/* <Footer /> */}
    </modeContext.Provider>
    </entertainmentContext.Provider>
    </userContext.Provider>
    </div>
  );


}

export default Root;
