import {useState, useContext, useEffect} from "react"
import Cast from "./Cast"
import { posterPath } from "../info"
import unknownUser from "../media/unknownUser.jpeg"
import closeIcon from "../media/close-icon.png"
import ratingIcon from "../media//rating-icon.png"
import logo from "../media/logo.png"
import send from "../media/send.png"
import Review from './Review'
import filledStar from "../media/star-filled.png"
import unfilledStar from "../media/star-unfilled.png"
import deleteIcon from "../media/delete.png"
import defaultPoster from "../media/defaultPoster.png"
import plusIcon from "../media/plus.jpeg"

import { useLoaderData, useLocation, useNavigate } from "react-router-dom";
import { userContext } from "../contexts/contexts";
import { fetchRatingAndComments, addReview, deleteReview, updateReviews, updateWatchList } from "../functions/dbFunctions";
import { updateUser } from "../functions/userFunctions";
import { toast } from "react-toastify";


export default function MovieDetails(){

    const [rating, setRating] = useState(false);
    const [stars, setStars] = useState(0);
    const [review, setReview] = useState('');
    const [currentRating, setCurrentRating] = useState(0);
    const [currentReviews, setCurrentReviews] = useState([]);
    const [watchList, setWatchList] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const { userData, setUserData } = useContext(userContext);
    const { cast, trailer: video, id, title, overview, vote_average, release_date, genres, poster_path, name } = useLoaderData();
    const poster = !poster_path ? defaultPoster : posterPath + poster_path;

    const currentMovie = {
        id,
        title: title ?? name,
        poster_path
    };

    const allGenres = genres.map(genre => ', ' + genre.name).join('').slice(2);

    // comments and rating useEffect
    useEffect(() => {
        fetchRatingAndComments(id)
        .then(result => {
            setCurrentReviews(result?.reviews || []);
            setCurrentRating(result?.rating || 0.0);
        });
    }, [id]);

    // watchlist useEffect
    useEffect(() => {
        if(userData?.watchList) {
            setWatchList(userData.watchList);
        }
    }, [userData]);

    
    let allCast = cast.map(cast => {
        return <Cast
                    name = {cast.name}
                    character = {cast.character}
                    poster = {cast.profile_path === null ? unknownUser : posterPath + cast.profile_path}
                    key = {cast.id}
                />
    })
    

    let reviewId = 0
    let allReviews = currentReviews.map((review, index) => {
        return <div className="reviewContainer" key={index}><Review name = {review.name}
                       comment = {review.comment}
                       key = {reviewId++}/>
                       {(userData) && (review.email === userData.email) && <img className="deleteReview-btn" alt="delete icon" src={deleteIcon}
                                                                                                onClick={() => {
                                                                                                    removeReview(id, review.email, review.comment);
                                                                                                    removeUserReview(review.comment);
                                                                                                }}></img>}
                </div>       
    })

    async function removeReview(id, email, review) {
        const updatedReviews = await deleteReview(id, email, review);
        setCurrentReviews(updatedReviews || []);
    }

    async function updateList(action) {
        /**
         * Check if user is signed in before updating movie details
         */
        if(!userData){
            /**
             * Close the movie details page and redirect to the signIn page
             */
            navigate('/signin', {
                state: {
                    pathname: location.pathname
                }
            });
        }else {
            const updatedWatchList = await updateWatchList(userData.email, currentMovie, action);
            setUserData({...userData, watchList: updatedWatchList});
            sessionStorage.setItem('loggedUser', JSON.stringify({...userData, watchList: updatedWatchList}));
        }

    }


    async function updateMovieDetails(){
        /**
         * Check if user is signed in before updating movie details
         */
        if(!userData){
            /**
             * Close the movie details page and redirect to the signIn page
             */
            navigate('/signin', {
                state: {
                    pathname: location.pathname
                }
            });
        }else {
            /**
             * Check if Movie with this ID has details stored in the DB, if so then PATCH request, else it's a POST request 
             */
            
            const movieDetails = await fetchRatingAndComments(id);
            // check if movie exists in the DB
            if(movieDetails?.reviews) {
                // PATCH request
                let {rating, ratingCount, ratingTotal, reviews} = movieDetails;
                ratingCount = stars ? ++ratingCount : ratingCount;
                ratingTotal = stars ? (ratingTotal + stars) : ratingTotal;
                rating = ratingTotal / ratingCount;
                if(review.trim() !== '') {
                    reviews.push({
                        name: userData.firstName + ' ' + userData.lastName,
                        email: userData.email,
                        comment: review.trim()
                     });
                }
                const body = {
                    rating,
                    ratingCount,
                    ratingTotal,
                    reviews
                };
                const { rating: updatedRating, reviews: updatedReviews, error } = await updateReviews(id, body);
                if(error) {
                    toast.error('Something went wrong', {
                        autoClose: 3000,
                        theme: 'dark'
                    });
                } else {
                    setCurrentRating(updatedRating || 0.0);
                    setCurrentReviews(updatedReviews || []);
                    setStars(0);
                }
                
            }else {
                // POST request
                const body = {
                    movieId: id,
                    rating: stars,
                    ratingCount: stars > 0 ? 1 : 0,
                    ratingTotal: stars,
                    reviews: review.trim() === '' ? [] :
                     [{
                        name: userData.firstName + ' ' + userData.lastName,
                        email: userData.email,
                        comment: review.trim()
                     }],
                    ...currentMovie
                };
                const res = await addReview(body);
                const { rating, reviews, error } = res;
                if(error) {
                    toast.error('Something went wrong', {
                        autoClose: 3000,
                        theme: 'dark'
                    });
                } else {
                    setCurrentRating(rating || 0.0);
                    setCurrentReviews(reviews || []);
                    setStars(0);
                }
                
            }
        }
    };

    async function addUserReview() {

        if(review.trim() !== '') {
            const res = await updateUser(userData.email, {...currentMovie, comment: review.trim()}, 'add-review');
            if(res.error) {
                toast.error('Something went wrong', {
                    autoClose: 3000,
                    theme: 'dark'
                });
            } else {
                const updatedUser = res;
                setUserData(updatedUser);
                sessionStorage.setItem('loggedUser', JSON.stringify(updatedUser));
            }
            setReview('');  
        }

    };

    async function removeUserReview(comment) {

        const res = await updateUser(userData.email, {...currentMovie, comment}, 'delete-review');
        if(res.error) {
            toast.error('Something went wrong', {
                autoClose: 3000,
                theme: 'dark'
            });
        } else {
            const updatedUser = res;
            setUserData(updatedUser);
            sessionStorage.setItem('loggedUser', JSON.stringify(updatedUser));
        }
        setReview('');  

    };

    return (
        <div>
            <div className = "movieDetails-container">
                <div className="movieDetails-title-img">
                    <img className="movie-poster-dt" src={poster} alt="movie poster"></img>
                    <div>
                        <p><span className="movie-details-title">{title ?? name}</span><span className="movie-rating"><img className="rating-icon" src={ratingIcon} alt="rating-icon"></img>{vote_average.toFixed(1)}</span>
                        <span className="movie-rating"><img className="rating-icon logo-img" src={logo} alt="rating-icon"></img>{currentRating.toFixed(1)}</span></p>
                        <p>{allGenres}</p>
                        <p className="movie-description">{overview}</p>
                        <p className="movie-date">{release_date}</p>
                        {!rating && 
                        <div className="movieDetails-btns">
                        <button className="rating-btn" onClick={() => setRating(true)}><img src={unfilledStar} alt="star icon" className="rating-icon rating-btn-icon"></img>Rate</button>
                        {
                            watchList.some(movie => movie.id === id) ? 
                            (<button className="watchlist-btn" onClick={() => updateList('remove')}><span><img src={deleteIcon} alt="delete icon" className="remove-icon rating-btn-icon"/></span> Remove from watchlist</button>) :
                            (<button className="watchlist-btn" onClick={() => updateList('add')}><span><img src={plusIcon} alt="plus icon" className="add-icon rating-btn-icon"/></span> Add to watchlist</button>)
                        } 
                        </div>
                        }
                    </div>
                </div>
                {rating &&
                    <div className="rating-wrapper">
                        <div className="rating-header">
                        <h2>{title}</h2>
                        <img className="closeRating-icon" src={closeIcon} alt="close icon" onClick = {() => {
                            setRating(false)
                            setStars(0)
                            }}></img>
                        </div>
                        <div className="rating-stars">
                            <img src={(stars >= 1 ? filledStar : unfilledStar)} alt="star icon" className="rating-star" onClick={() => setStars(1)}/>
                            <img src={(stars >= 2 ? filledStar : unfilledStar)} alt="star icon" className="rating-star" onClick={() => setStars(2)}/>
                            <img src={(stars >= 3 ? filledStar : unfilledStar)} alt="star icon" className="rating-star" onClick={() => setStars(3)}/>
                            <img src={(stars >= 4 ? filledStar : unfilledStar)} alt="star icon" className="rating-star" onClick={() => setStars(4)}/>
                            <img src={(stars >= 5 ? filledStar : unfilledStar)} alt="star icon" className="rating-star" onClick={() => setStars(5)}/>
                            <img src={(stars >= 6 ? filledStar : unfilledStar)} alt="star icon" className="rating-star" onClick={() => setStars(6)}/>
                            <img src={(stars >= 7 ? filledStar : unfilledStar)} alt="star icon" className="rating-star" onClick={() => setStars(7)}/>
                            <img src={(stars >= 8 ? filledStar : unfilledStar)} alt="star icon" className="rating-star" onClick={() => setStars(8)}/>
                            <img src={(stars >= 9 ? filledStar : unfilledStar)} alt="star icon" className="rating-star" onClick={() => setStars(9)}/>
                            <img src={(stars >= 10 ? filledStar : unfilledStar)} alt="star icon" className="rating-star" onClick={() => setStars(10)}/>
                        </div>
                        <button className="submitRating-btn" onClick={() => {
                            updateMovieDetails()
                            setRating(false)
                            }}>Rate</button>                                   
                    </div>}
                
                {(video !== '') && <div className="movieDetails-video">
                    {/*eslint-disable-next-line jsx-a11y/iframe-has-title*/}
                    <iframe width="750" height="450" src={video} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"/>
                </div>}
                {(allCast.length > 0) && <h2 className="cast-header">Cast</h2>}
                <div className = "movieDetails-cast">
                    {allCast}
                </div>
                <div className="reviews">
                    <h2>Reviews</h2>
                    <div className="reviewInput-wrapper">
                        <textarea className="reviewInput-field" placeholder="Write a review..." value = {review} onChange={(e) => setReview(e.target.value)} onKeyDown={(e) => {
                                                                                                                                            if(e.key === 'Enter'){
                                                                                                                                                updateMovieDetails();
                                                                                                                                                addUserReview();
                                                                                                                                                if(e.repeat)
                                                                                                                                                 return;
                                                                                                                                            }}}></textarea>
                        <img src={send} alt="submit review icon" className="submitReview-btn" onClick={() => {
                            updateMovieDetails();
                            addUserReview();
                        }}/>
                    </div>
                    {allReviews}
                </div>
            </div>
        </div>
    )
}

