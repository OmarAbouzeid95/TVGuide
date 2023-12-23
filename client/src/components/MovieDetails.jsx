import {useState, useContext} from "react"
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
import { userContext } from "../contexts/contexts"


export default function MovieDetails(){

    const [rating, setRating] = useState(false);
    const [stars, setStars] = useState(0);
    const [review, setReview] = useState('');
    const [currentRating, setCurrentRating] = useState(0.0);
    const [currentReviews, setCurrentReviews] = useState([]);
    const location = useLocation();
    const { userData } = useContext(userContext);

    const { cast, trailer: video } = useLoaderData();
    const { id, title, description, rating: propRating, date, genres, poster } = location.state;

    
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
    let allReviews = currentReviews.map(review => {
        return <div className="reviewContainer"><Review name = {review.name}
                       comment = {review.comment}
                       key = {reviewId++}/>
                       {(userData !== null) &&(review.email === userData.email) && <img className="deleteReview-btn" alt="delete icon" src={deleteIcon}
                                                                                                onClick={() => deleteReview(review.email, review.comment, review.name, id)}></img>}
                </div>       
    })

    function deleteReview(email, comment, name, movieId){
        /**
         * find corresponding movie
         */
        fetch(`${process.env.REACT_APP_SERVER_URL}/movies/${movieId}`)
        .then(res => res.json())
        .then(data => {

            // finding the index of the review and removing it from the reviews array
            console.log(data)
            let reviews = data.reviews
            const reviewIndex = reviews.findIndex(obj => (obj.email === email && obj.comment === comment))
            reviews.splice(reviewIndex, 1)
            console.log(reviews)
            // patching the corresponding movie details
            fetch(`${process.env.REACT_APP_SERVER_URL}/movies`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({id:movieId ,updates: {reviews: reviews}})
            })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                setCurrentReviews(reviews)    
            })
        })
    }


    function updateMovieDetails(){
        /**
         * Check if user is signed in before updating movie details
         */
        if(userData === null){
            /**
             * Close the movie details page and redirect to the signIn page
             */
        }else {
            /**
             * Check if Movie with this ID has details stored in the DB, if so then PATCH request, else it's a POST request 
             */
            fetch(`${process.env.REACT_APP_SERVER_URL}/movies/${id}`)
            .then(res => res.json())
            .then(getRequestData => {
                if(getRequestData === null){
                    /**
                     * POST request
                     */
                    const body = {
                        movie_id: id,
                        ratingCount: stars > 0 ? 1 : 0,
                        ratingTotal: stars,
                        reviews: review.trim(' ') === '' ? [] :
                         [{
                            name: userData.firstName + ' ' + userData.lastName,
                            email: userData.email,
                            comment: review.trim(' ')
                         }]
                    }
                    fetch(`${process.env.REACT_APP_SERVER_URL}/movies`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(body)
                    })
                    .then(res => res.json())
                    .then(postRequestData => {
                        console.log(postRequestData)
                        setCurrentRating(body.ratingCount > 0 ? (body.ratingTotal/body.ratingCount).toFixed(1) : 0.0)
                        setCurrentReviews(body.reviews)
                        setStars(0)
                        setReview('')
                    })
                }else {
                    /**
                     * PATCH request
                     */
                    const dbReviews = getRequestData.reviews
                    let dbRatingCount = getRequestData.ratingCount
                    let dbRatingTotal = getRequestData.ratingTotal
                    let dbRating = dbRatingTotal/dbRatingCount
                    if(review.trim(' ') !== ''){
                        const thisReview = {
                            name: userData.firstName + ' ' + userData.lastName,
                            email: userData.email,
                            comment: review.trim(' ')
                        }
                        dbReviews.push(thisReview)
                    }
                    if(stars !== 0){
                        dbRatingCount++
                        dbRatingTotal += stars
                        dbRating = dbRatingTotal/dbRatingCount
                    }
                    const body = {
                        updates: {
                            reviews: dbReviews,
                            ratingCount: dbRatingCount,
                            ratingTotal: dbRatingTotal,
                            rating: dbRating
                        },
                        id: getRequestData.movie_id
                    }
                    fetch(`${process.env.REACT_APP_SERVER_URL}/movies`, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(body)
                    })
                    .then(res => res.json())
                    .then(data => {
                        console.log(data)
                        setCurrentRating((body.updates.rating).toFixed(1))
                        setCurrentReviews(body.updates.reviews)
                        setStars(0)
                        setReview('')
                    })
                }
            })
        }
    }

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
                        {!rating && <button className="rating-btn" onClick={() => setRating(true)}><img src={unfilledStar} alt="star icon" className="rating-icon rating-btn-icon"></img>Rate movie</button>}
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
                    <iframe width="650" height="350" src={video} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"/>
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

