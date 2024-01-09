import {useState, useContext, useEffect} from "react"
import Cast from "./Cast"
import { posterPath, movieGenres } from "../info"
import unknownUser from "../media/unknownUser.jpeg"
import closeIcon from "../media/close-icon.png"
import ratingIcon from "../media//rating-icon.png"
import logo from "../media/logo.png"
import send from "../media/send.png"
import Review from './Review'
import filledStar from "../media/star-filled.png"
import unfilledStar from "../media/star-unfilled.png"
import deleteIcon from "../media/delete.png"

import { useLoaderData, useLocation } from "react-router-dom";
import { userContext } from "../contexts/contexts";
import { fetchRatingAndComments, addReview, deleteReview, updateReviews } from "../functions/dbFunctions"


export default function MovieDetails(){

    const [rating, setRating] = useState(false);
    const [stars, setStars] = useState(0);
    const [review, setReview] = useState('');
    const [currentRating, setCurrentRating] = useState();
    const [currentReviews, setCurrentReviews] = useState([]);
    const location = useLocation();
    const { userData } = useContext(userContext);

    const { cast, trailer: video } = useLoaderData();
    const { id, title, description, rating: propRating, date, genres, poster } = location.state;


    useEffect(() => {
        fetchRatingAndComments(id)
        .then(result => {
            setCurrentReviews(result?.reviews || []);
            setCurrentRating(result?.rating || 0.0);
        });
    }, [id]);

    
    let allCast = cast.map(cast => {
        return <Cast
                    name = {cast.name}
                    character = {cast.character}
                    poster = {cast.profile_path === null ? unknownUser : posterPath + cast.profile_path}
                    key = {cast.id}
                />
    })
    let allGenres = ''

    for (let i=0; i<genres.length; i++){
        for (let j=0; j<movieGenres.length; j++){
            if (genres[i] === movieGenres[j].id){
                allGenres += `${movieGenres[j].name}, `
                break
            }
        }
    }
    allGenres = allGenres.substr(0, allGenres.length - 2)

    let reviewId = 0
    let allReviews = currentReviews.map((review, index) => {
        return <div className="reviewContainer" key={index}><Review name = {review.name}
                       comment = {review.comment}
                       key = {reviewId++}/>
                       {(userData) && (review.email === userData.email) && <img className="deleteReview-btn" alt="delete icon" src={deleteIcon}
                                                                                                onClick={() => removeReview(id, review.email, review.comment)}></img>}
                </div>       
    })

    async function removeReview(id, email, review) {
        const updatedReviews = await deleteReview(id, email, review);
        setCurrentReviews(updatedReviews || []);
    }


    async function updateMovieDetails(){
        /**
         * Check if user is signed in before updating movie details
         */
        if(!userData){
            /**
             * Close the movie details page and redirect to the signIn page
             */
            console.log('no logged in user');
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
                const { rating: updatedRating, reviews: updatedReviews } = await updateReviews(id, body);
                setCurrentRating(updatedRating || 0.0);
                setCurrentReviews(updatedReviews || []);
                setReview('');
                setStars(0);
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
                     }]
                };
                const res = await addReview(body);
                const { rating, reviews } = res;
                setCurrentRating(rating || 0.0);
                setCurrentReviews(reviews || []);
                setReview('');
                setStars(0);
            }
        }
    };

    return (
        <div>
            <div className = "movieDetails-container">
                <div className="movieDetails-title-img">
                    <img className="movie-poster-dt" src={poster} alt="movie poster"></img>
                    <div>
                        <p><span className="movie-details-title">{title}</span><span className="movie-rating"><img className="rating-icon" src={ratingIcon} alt="rating-icon"></img>{propRating}</span>
                        <span className="movie-rating"><img className="rating-icon logo-img" src={logo} alt="rating-icon"></img>{currentRating}</span></p>
                        <p>{allGenres}</p>
                        <p className="movie-description">{description}</p>
                        <p className="movie-date">{date}</p>
                        {!rating && <button className="rating-btn" onClick={() => setRating(true)}><img src={unfilledStar} alt="star icon" className="rating-icon rating-btn-icon"></img>Rate</button>}
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
                <h2 className="cast-header">Cast</h2>
                <div className = "movieDetails-cast">
                    {allCast}
                </div>
                <div className="reviews">
                    <h2>Reviews</h2>
                    <div className="reviewInput-wrapper">
                        <textarea className="reviewInput-field" placeholder="Write a review..." value = {review} onChange={(e) => setReview(e.target.value)} onKeyDown={(e) => {
                                                                                                                                            if(e.key === 'Enter'){
                                                                                                                                            updateMovieDetails()
                                                                                                                                            if(e.repeat)
                                                                                                                                                return
                                                                                                                                            }}}></textarea>
                        <img src={send} alt="submit review icon" className="submitReview-btn" onClick={() => updateMovieDetails()}/>
                    </div>
                    {allReviews}
                </div>
            </div>
        </div>
    )
}

