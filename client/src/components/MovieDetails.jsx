import { useState, useContext, useEffect } from "react";
import Cast from "./Cast";
import { posterPath } from "../info";
import unknownUser from "../media/unknownUser.jpeg";
import closeIcon from "../media/close-icon.png";
import ratingIcon from "../media//rating-icon.png";
import logo from "../media/logo.png";
import send from "../media/send.png";
import Review from "./Review";
import filledStar from "../media/star-filled.png";
import unfilledStar from "../media/star-unfilled.png";
import deleteIcon from "../media/delete.png";
import defaultPoster from "../media/defaultPoster.png";
import plusIcon from "../media/plus.jpeg";

import Button from "@mui/material/Button";
import Typography from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import StarIcon from "@mui/icons-material/Star";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faStar,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";

import { useLoaderData, useLocation, useNavigate } from "react-router-dom";
import { userContext } from "../contexts/contexts";
import {
  fetchRatingAndComments,
  addReview,
  deleteReview,
  updateReviews,
  updateWatchList,
} from "../functions/dbFunctions";
import { updateUser } from "../functions/userFunctions";
import { toast } from "react-toastify";

export default function MovieDetails() {
  const [stars, setStars] = useState(0);
  const [review, setReview] = useState("");
  const [currentRating, setCurrentRating] = useState(0);
  const [currentReviews, setCurrentReviews] = useState([]);
  const [watchList, setWatchList] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { userData, setUserData } = useContext(userContext);
  const {
    cast,
    trailer: video,
    id,
    title,
    overview,
    vote_average,
    release_date,
    genres,
    poster_path,
    name,
  } = useLoaderData();
  const poster = !poster_path ? defaultPoster : posterPath + poster_path;

  const currentMovie = {
    id,
    title: title ?? name,
    poster_path,
  };

  const allGenres = genres
    .map((genre) => ", " + genre.name)
    .join("")
    .slice(2);

  // comments and rating useEffect
  useEffect(() => {
    fetchRatingAndComments(id).then((result) => {
      setCurrentReviews(result?.reviews || []);
      setCurrentRating(result?.rating || 0.0);
    });
  }, [id]);

  // watchlist useEffect
  useEffect(() => {
    if (userData?.watchList) {
      setWatchList(userData.watchList);
    }
  }, [userData]);

  // updating the rating
  useEffect(() => {
    if (stars !== 0) {
      if (!userData) {
        navigate("/signin", {
          state: {
            pathname: location.pathname,
          },
        });
      } else {
        updateMovieDetails();
      }
    }
  }, [stars]);

  let allCast = cast.map((cast) => {
    return (
      <Cast
        name={cast.name}
        character={cast.character}
        poster={
          cast.profile_path === null
            ? unknownUser
            : posterPath + cast.profile_path
        }
        key={cast.id}
      />
    );
  });

  let reviewId = 0;
  let allReviews = currentReviews.map((review, index) => {
    return (
      <div className="reviewContainer" key={index}>
        <Review name={review.name} comment={review.comment} key={reviewId++} />
        {userData && review.email === userData.email && (
          <img
            className="deleteReview-btn"
            alt="delete icon"
            src={deleteIcon}
            onClick={() => {
              removeReview(id, review.email, review.comment);
              removeUserReview(review.comment);
            }}></img>
        )}
      </div>
    );
  });

  async function removeReview(id, email, review) {
    const updatedReviews = await deleteReview(id, email, review);
    setCurrentReviews(updatedReviews || []);
  }

  async function updateList(action) {
    /**
     * Check if user is signed in before updating movie details
     */
    if (!userData) {
      /**
       * Close the movie details page and redirect to the signIn page
       */
      navigate("/signin", {
        state: {
          pathname: location.pathname,
        },
      });
    } else {
      const updatedWatchList = await updateWatchList(
        userData.email,
        currentMovie,
        action
      );
      setUserData({ ...userData, watchList: updatedWatchList });
      sessionStorage.setItem(
        "loggedUser",
        JSON.stringify({ ...userData, watchList: updatedWatchList })
      );
    }
  }

  async function updateMovieDetails() {
    /**
     * Check if user is signed in before updating movie details
     */
    if (!userData) {
      /**
       * Close the movie details page and redirect to the signIn page
       */
      navigate("/signin", {
        state: {
          pathname: location.pathname,
        },
      });
    } else {
      /**
       * Check if Movie with this ID has details stored in the DB, if so then PATCH request, else it's a POST request
       */

      const movieDetails = await fetchRatingAndComments(id);
      // check if movie exists in the DB
      if (movieDetails?.reviews) {
        // PATCH request
        let { rating, ratingCount, ratingTotal, reviews } = movieDetails;
        ratingCount = stars ? ++ratingCount : ratingCount;
        ratingTotal = stars ? ratingTotal + stars : ratingTotal;
        rating = ratingTotal / ratingCount;
        if (review.trim() !== "") {
          reviews.push({
            name: userData.firstName + " " + userData.lastName,
            email: userData.email,
            comment: review.trim(),
          });
        }
        const body = {
          rating,
          ratingCount,
          ratingTotal,
          reviews,
        };
        const {
          rating: updatedRating,
          reviews: updatedReviews,
          error,
        } = await updateReviews(id, body);
        if (error) {
          toast.error("Something went wrong", {
            autoClose: 3000,
            theme: "dark",
          });
        } else {
          setCurrentRating(updatedRating || 0.0);
          setCurrentReviews(updatedReviews || []);
        }
      } else {
        // POST request
        const body = {
          movieId: id,
          rating: stars,
          ratingCount: stars > 0 ? 1 : 0,
          ratingTotal: stars,
          reviews:
            review.trim() === ""
              ? []
              : [
                  {
                    name: userData.firstName + " " + userData.lastName,
                    email: userData.email,
                    comment: review.trim(),
                  },
                ],
          ...currentMovie,
        };
        const res = await addReview(body);
        const { rating, reviews, error } = res;
        if (error) {
          toast.error("Something went wrong", {
            autoClose: 3000,
            theme: "dark",
          });
        } else {
          setCurrentRating(rating || 0.0);
          setCurrentReviews(reviews || []);
        }
      }
    }
  }

  async function addUserReview() {
    if (review.trim() !== "") {
      const res = await updateUser(
        userData.email,
        { ...currentMovie, comment: review.trim() },
        "add-review"
      );
      if (res.error) {
        toast.error("Something went wrong", {
          autoClose: 3000,
          theme: "dark",
        });
      } else {
        const updatedUser = res;
        setUserData(updatedUser);
        sessionStorage.setItem("loggedUser", JSON.stringify(updatedUser));
      }
      setReview("");
    }
  }

  async function removeUserReview(comment) {
    const res = await updateUser(
      userData.email,
      { ...currentMovie, comment },
      "delete-review"
    );
    if (res.error) {
      toast.error("Something went wrong", {
        autoClose: 3000,
        theme: "dark",
      });
    } else {
      const updatedUser = res;
      setUserData(updatedUser);
      sessionStorage.setItem("loggedUser", JSON.stringify(updatedUser));
    }
    setReview("");
  }

  return (
    <div>
      <div className="movieDetails-container">
        <div className="movieDetails-title-img">
          <img
            className="movie-poster-dt"
            src={poster}
            alt="movie poster"></img>
          <div>
            <p>
              <span className="movie-details-title">{title ?? name}</span>
              <span className="movie-rating">
                <img
                  className="rating-icon"
                  src={ratingIcon}
                  alt="rating-icon"></img>
                {vote_average.toFixed(1)}
              </span>
              <span className="movie-rating">
                <img
                  className="rating-icon logo-img"
                  src={logo}
                  alt="rating-icon"></img>
                {currentRating.toFixed(1)}
              </span>
            </p>
            <p>{allGenres}</p>
            <p className="movie-description">{overview}</p>
            <p className="movie-date">{release_date}</p>
            <div className="movieDetails-btns">
              <div className="watchlist-btn">
                <Typography component="legend" style={{ color: "white" }}>
                  Rate
                </Typography>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}>
                  <Rating
                    name="simple-controlled"
                    value={stars}
                    size="medium"
                    max={10}
                    emptyIcon={
                      <StarIcon style={{ opacity: 0.5, color: "white" }} />
                    }
                    onChange={(event, newValue) => {
                      setStars(newValue);
                    }}
                  />
                </div>
              </div>
              {watchList.some((movie) => movie.id === id) ? (
                <Button
                  variant="outlined"
                  onClick={() => updateList("remove")}
                  style={{ color: "white" }}>
                  <FontAwesomeIcon
                    icon={faTrash}
                    style={{ marginRight: "0.5em" }}
                  />
                  Remove from watchlist
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  onClick={() => updateList("add")}
                  style={{ color: "white" }}>
                  <FontAwesomeIcon
                    icon={faPlus}
                    style={{ marginRight: "0.5em" }}
                  />
                  Add to watchlist
                </Button>
              )}
            </div>
          </div>
        </div>

        {video !== "" && (
          <div className="movieDetails-video">
            {/*eslint-disable-next-line jsx-a11y/iframe-has-title*/}
            <iframe
              width="100%"
              height="450"
              src={video}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        )}
        {allCast.length > 0 && <h2 className="cast-header">Cast</h2>}
        <div className="movieDetails-cast">{allCast}</div>
        <div className="reviews">
          <h2>Reviews</h2>
          <div className="reviewInput-wrapper">
            <textarea
              className="reviewInput-field"
              placeholder="Write a review..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  updateMovieDetails();
                  addUserReview();
                  if (e.repeat) return;
                }
              }}></textarea>
            {/* <img
              src={send}
              alt="submit review icon"
              className="submitReview-btn"
              onClick={() => {
                updateMovieDetails();
                addUserReview();
              }}
            /> */}
            <FontAwesomeIcon
              icon={faPaperPlane}
              className="submitReview-btn"
              onClick={() => {
                updateMovieDetails();
                addUserReview();
              }}
              color="white"
              size="xl"
            />
          </div>
          {allReviews}
        </div>
      </div>
    </div>
  );
}
